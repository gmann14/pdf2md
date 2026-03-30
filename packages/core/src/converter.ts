import { getDocument } from "pdfjs-dist";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import type { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import { initPdfWorker } from "./pdf-worker";
import type {
  ConversionResult,
  ConversionMessage,
  ConversionMetadata,
  ConvertOptions,
} from "./types";
import { MAX_FILE_SIZE } from "./types";
import {
  cleanText,
  detectTable,
  isCodeBlock,
  detectCodeFont,
  metadataToYaml,
  tableToMarkdown,
  detectColumnLayout,
  reorderColumnarItems,
  rejoinHyphenatedWords,
} from "./detection";

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface ExtractedItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  hasEOL: boolean;
  page: number;
  /** Set by column reordering; used as sort key in groupIntoBlocks. */
  columnOrder?: number;
}

interface AnnotationLink {
  url: string;
  rect: [number, number, number, number]; // [x1, y1, x2, y2]
}

interface Block {
  items: ExtractedItem[];
  type: "paragraph" | "heading" | "list-item" | "table" | "code-block";
  headingLevel?: number;
  listMarker?: string;
  tableRows?: string[][];
}

// ---------------------------------------------------------------------------
// Font analysis helpers
// ---------------------------------------------------------------------------

function isBold(fontName: string): boolean {
  const lower = fontName.toLowerCase();
  return /bold|heavy|\bbd\b/.test(lower);
}

/**
 * Font-pair based bold detection.
 *
 * When subset fonts are used (e.g., g_d0_f2, g_d0_f3), we can't tell from the
 * name which is bold. Instead, we detect "emphasis fonts" by usage pattern:
 * non-dominant fonts that appear exclusively on short standalone lines at body
 * font size are likely bold/emphasis variants.
 *
 * Returns a Set of font names that are used as emphasis/bold fonts.
 */
function detectEmphasisFonts(
  items: ExtractedItem[],
  bodySize: number,
): Set<string> {
  const emphasisFonts = new Set<string>();

  // Find dominant font by character count
  const fontCharCount = new Map<string, number>();
  for (const item of items) {
    fontCharCount.set(item.fontName, (fontCharCount.get(item.fontName) ?? 0) + item.str.length);
  }

  let dominantFont = "";
  let dominantCount = 0;
  for (const [font, count] of fontCharCount) {
    if (count > dominantCount) {
      dominantCount = count;
      dominantFont = font;
    }
  }

  // For each non-dominant font at body size, check if it's used primarily on
  // short standalone lines (heading-like usage pattern)
  for (const [fontName, charCount] of fontCharCount) {
    if (fontName === dominantFont) continue;
    if (charCount < 10) continue;

    // Skip if the font name already contains bold/italic markers
    if (isBold(fontName) || isItalic(fontName)) continue;

    // Collect items for this font
    const fontItems = items.filter((i) => i.fontName === fontName);

    // Check: is this font used at approximately body size?
    const avgSize = fontItems.reduce((s, i) => s + i.fontSize, 0) / fontItems.length;
    if (Math.abs(avgSize - bodySize) > bodySize * 0.15) continue;

    // Check usage pattern: group into blocks by proximity
    // If most blocks are short (<100 chars) standalone lines, it's emphasis
    let shortBlockCount = 0;
    let totalBlockCount = 0;
    let currentBlock: string[] = [];
    let prevY = -Infinity;
    let prevPage = -1;

    for (const item of fontItems) {
      if (item.page !== prevPage || Math.abs(item.y - prevY) > item.height * 1.5) {
        if (currentBlock.length > 0) {
          totalBlockCount++;
          const blockText = currentBlock.join(" ");
          if (blockText.length < 100) shortBlockCount++;
        }
        currentBlock = [item.str];
      } else {
        currentBlock.push(item.str);
      }
      prevY = item.y;
      prevPage = item.page;
    }
    if (currentBlock.length > 0) {
      totalBlockCount++;
      const blockText = currentBlock.join(" ");
      if (blockText.length < 100) shortBlockCount++;
    }

    // If ≥60% of occurrences are short standalone lines → emphasis font
    if (totalBlockCount >= 3 && shortBlockCount / totalBlockCount >= 0.6) {
      emphasisFonts.add(fontName);
    }
  }

  return emphasisFonts;
}

function isItalic(fontName: string): boolean {
  const lower = fontName.toLowerCase();
  return /italic|oblique|\bit\b/.test(lower);
}

// ---------------------------------------------------------------------------
// Text cleanup (ligatures, special spaces, encoding artifacts)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Text extraction
// ---------------------------------------------------------------------------

function isTextItem(item: TextItem | TextMarkedContent): item is TextItem {
  return "str" in item;
}

async function extractPageItems(
  page: PDFPageProxy,
  pageNum: number,
): Promise<{ items: ExtractedItem[]; links: AnnotationLink[] }> {
  const [textContent, annotations] = await Promise.all([
    page.getTextContent(),
    page.getAnnotations(),
  ]);

  const viewport = page.getViewport({ scale: 1 });

  const items: ExtractedItem[] = [];
  for (const item of textContent.items) {
    if (!isTextItem(item) || item.str.trim() === "") continue;

    // transform: [scaleX, skewX, skewY, scaleY, translateX, translateY]
    const fontSize = Math.abs(item.transform[3]);
    const x = item.transform[4];
    // PDF coordinates are bottom-up; invert to top-down
    const y = viewport.height - item.transform[5];

    items.push({
      str: cleanText(item.str),
      x,
      y,
      width: item.width,
      height: item.height || fontSize,
      fontSize,
      fontName: item.fontName,
      hasEOL: item.hasEOL,
      page: pageNum,
    });
  }

  const links: AnnotationLink[] = [];
  for (const ann of annotations) {
    if (ann.subtype === "Link" && ann.url && ann.rect) {
      // Convert annotation rect to same coordinate system
      const [x1, y1raw, x2, y2raw] = ann.rect;
      const y1 = viewport.height - y2raw;
      const y2 = viewport.height - y1raw;
      links.push({ url: ann.url, rect: [x1, y1, x2, y2] });
    }
  }

  return { items, links };
}

// ---------------------------------------------------------------------------
// Font histogram → heading detection
// ---------------------------------------------------------------------------

interface FontProfile {
  bodySize: number;
  headingSizes: Map<number, number>; // fontSize → heading level (1-6)
}

function buildFontProfile(items: ExtractedItem[]): FontProfile {
  // Count characters at each font size (rounded to 1 decimal)
  const sizeCharCount = new Map<number, number>();
  for (const item of items) {
    const size = Math.round(item.fontSize * 10) / 10;
    sizeCharCount.set(size, (sizeCharCount.get(size) ?? 0) + item.str.length);
  }

  // Body text = most common font size by character count
  let bodySize = 12;
  let maxCount = 0;
  for (const [size, count] of sizeCharCount) {
    if (count > maxCount) {
      maxCount = count;
      bodySize = size;
    }
  }

  // Sizes larger than body text become headings, ranked largest→smallest
  const largerSizes = [...sizeCharCount.keys()]
    .filter((s) => s > bodySize * 1.08) // at least 8% larger than body
    .sort((a, b) => b - a);

  // Cap at 4 heading levels — H5/H6 from font-size alone are rarely meaningful
  // and cause overly-deep heading hierarchies
  const headingSizes = new Map<number, number>();
  for (let i = 0; i < largerSizes.length && i < 4; i++) {
    headingSizes.set(largerSizes[i], i + 1); // H1, H2, H3, H4
  }

  return { bodySize, headingSizes };
}

function getHeadingLevel(
  fontSize: number,
  profile: FontProfile,
): number | undefined {
  const rounded = Math.round(fontSize * 10) / 10;
  return profile.headingSizes.get(rounded);
}

// ---------------------------------------------------------------------------
// Multi-column reordering
// ---------------------------------------------------------------------------

/**
 * Detect and fix multi-column reading order per page.
 *
 * For two-column pages (academic papers, IEEE format, etc.) PDF.js returns
 * items in left-to-right, top-to-bottom order across the full page width,
 * interleaving left and right column text at the same Y coordinates.
 *
 * This function:
 * 1. Groups items by page.
 * 2. For each page, runs detectColumnLayout() to find the column gutter.
 * 3. If two-column, reorders items: [pre-column header] → [left col] → [right col].
 * 4. Assigns sequential `columnOrder` indices so groupIntoBlocks() preserves
 *    the corrected reading order instead of re-sorting by Y.
 */
function applyColumnReordering(items: ExtractedItem[]): ExtractedItem[] {
  // Group items by page number (preserving insertion order is fine)
  const pageMap = new Map<number, ExtractedItem[]>();
  for (const item of items) {
    const arr = pageMap.get(item.page);
    if (arr) arr.push(item);
    else pageMap.set(item.page, [item]);
  }

  // Phase 1: Detect layout for each page independently
  const pageLayouts = new Map<number, ReturnType<typeof detectColumnLayout>>();
  for (const [pageNum, pageItems] of pageMap) {
    pageLayouts.set(pageNum, detectColumnLayout(pageItems));
  }

  // Phase 2: Cross-page consistency check
  // If fewer than 30% of pages are two-column in a long document, likely false positives
  const totalPages = pageMap.size;
  if (totalPages >= 5) {
    let twoColPages = 0;
    for (const layout of pageLayouts.values()) {
      if (layout.type === "two-column") twoColPages++;
    }
    if (twoColPages / totalPages < 0.3) {
      for (const pageNum of pageLayouts.keys()) {
        pageLayouts.set(pageNum, { type: "single" });
      }
    }
  }

  // Phase 3: Apply reordering using final layouts
  const result: ExtractedItem[] = [];

  for (const [pageNum, pageItems] of [...pageMap.entries()].sort(
    (a, b) => a[0] - b[0],
  )) {
    const layout = pageLayouts.get(pageNum)!;

    if (layout.type === "two-column") {
      const reordered = reorderColumnarItems(pageItems, layout);
      // Stamp sequential columnOrder so groupIntoBlocks respects this ordering
      reordered.forEach((item, idx) => {
        item.columnOrder = idx;
      });
      result.push(...reordered);
    } else {
      // Single-column page: no reordering, no columnOrder stamp
      result.push(...pageItems);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Paragraph grouping by vertical proximity
// ---------------------------------------------------------------------------

function groupIntoBlocks(
  items: ExtractedItem[],
  profile: FontProfile,
  emphasisFonts?: Set<string>,
): Block[] {
  if (items.length === 0) return [];

  // Sort by page first; within a page use columnOrder (set for multi-column
  // pages by applyColumnReordering) or fall back to Y then X.
  const sorted = [...items].sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
    if (a.columnOrder !== undefined && b.columnOrder !== undefined) {
      return a.columnOrder - b.columnOrder;
    }
    if (Math.abs(a.y - b.y) > a.height * 0.5) return a.y - b.y;
    return a.x - b.x;
  });

  const blocks: Block[] = [];
  let currentItems: ExtractedItem[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    // Start a new block when:
    // 1. Different page
    // 2. Large vertical gap (> 1.5x font height)
    // 3. Font size change suggesting heading transition
    const verticalGap = Math.abs(curr.y - prev.y);
    const lineHeight = Math.max(prev.height, prev.fontSize) * 1.5;
    const sizeChange =
      Math.abs(curr.fontSize - prev.fontSize) > prev.fontSize * 0.15;
    const pageDiff = curr.page !== prev.page;

    if (pageDiff || verticalGap > lineHeight || (sizeChange && verticalGap > prev.height * 0.3)) {
      blocks.push(classifyBlock(currentItems, profile, emphasisFonts));
      currentItems = [curr];
    } else {
      currentItems.push(curr);
    }
  }

  if (currentItems.length > 0) {
    blocks.push(classifyBlock(currentItems, profile, emphasisFonts));
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Block classification
// ---------------------------------------------------------------------------

const BULLET_PATTERN = /^[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25AB\u25CF\u25CB\u25B6\u25B8\u25BA\u25C6\u25C7\u25A0\u25A1\u2013\u2014\u2010•·–—►▸▶◆◇■□-]\s*/;
const NUMBERED_PATTERN = /^(\d{1,3})[.)]\s+/;
const LETTER_LIST_PATTERN = /^[a-zA-Z][.)]\s+/;

function classifyBlock(
  items: ExtractedItem[],
  profile: FontProfile,
  emphasisFonts?: Set<string>,
): Block {
  const firstItem = items[0];
  const allText = items.map((i) => i.str).join(" ").trim();
  const isShortLine = allText.length < 120;
  const hasNoTrailingPunctuation = !/[.,:;]$/.test(allText);

  // Check 1: Section numbering pattern (e.g., "1.1 Background", "II. REWARD-DRIVEN") → heading
  // Takes priority over font-size heading because numbering reliably indicates level.
  // Must come before list detection so "1. Introduction" isn't classified as a list item.
  const romanMatch = allText.match(/^(I{1,3}|IV|VI{0,3}|IX|X{0,3})\.\s+[A-Z]/);
  if (romanMatch && isShortLine && hasNoTrailingPunctuation) {
    return { items, type: "heading", headingLevel: 2 };
  }

  const sectionDotMatch = allText.match(/^(\d+\.(?:\d+\.?)*)\s+[A-Z]/);
  if (sectionDotMatch && isShortLine && hasNoTrailingPunctuation) {
    const dots = (sectionDotMatch[1].match(/\./g) ?? []).length;
    const level = Math.min(dots + 1, 6); // "1." → H2, "1.1" → H3, etc.
    return { items, type: "heading", headingLevel: level };
  }
  // Also match bare "1 Introduction" style (no dot) — require bold or very short
  const sectionBareMatch = allText.match(/^(\d+)\s+[A-Z]/);
  if (sectionBareMatch && isShortLine && hasNoTrailingPunctuation && allText.length < 60) {
    return { items, type: "heading", headingLevel: 2 };
  }

  // Check 2: Font size heading (largest font sizes are headings)
  // Guard: don't classify long blocks as headings — real headings are short
  const headingLevel = getHeadingLevel(firstItem.fontSize, profile);
  if (headingLevel !== undefined && allText.length <= 150) {
    return { items, type: "heading", headingLevel };
  }

  // Check 3: Bold text on a short standalone line → heading
  const allBold = items.every((i) => isBold(i.fontName));
  const text = firstItem.str.trimStart();
  const looksLikeListItem = BULLET_PATTERN.test(text) || NUMBERED_PATTERN.test(text);

  if (
    allBold && isShortLine && hasNoTrailingPunctuation &&
    !looksLikeListItem && allText.length >= 2 && items.length <= 5
  ) {
    const isAllCaps = allText === allText.toUpperCase() && allText !== allText.toLowerCase();
    return { items, type: "heading", headingLevel: isAllCaps ? 2 : 3 };
  }

  // Check 3b: Emphasis font (font-pair detection) on a short standalone line → heading
  // Catches bold headings in PDFs where font name doesn't contain "Bold" (subset fonts)
  if (
    emphasisFonts && emphasisFonts.size > 0 &&
    items.every((i) => emphasisFonts.has(i.fontName)) &&
    isShortLine && hasNoTrailingPunctuation &&
    !looksLikeListItem && allText.length >= 2 && items.length <= 8
  ) {
    const isAllCapsEmph = allText === allText.toUpperCase() && allText !== allText.toLowerCase();
    return { items, type: "heading", headingLevel: isAllCapsEmph ? 2 : 3 };
  }

  // Check 4: ALL_CAPS short line → heading (independent of bold detection)
  // Catches headings in PDFs where font name doesn't contain "Bold" (subset fonts)
  const isAllCaps = allText === allText.toUpperCase() && allText !== allText.toLowerCase();
  if (
    isAllCaps && allText.length >= 3 && allText.length <= 80 &&
    hasNoTrailingPunctuation && !looksLikeListItem && items.length <= 8
  ) {
    return { items, type: "heading", headingLevel: 2 };
  }

  // Check for list item
  const bulletMatch = text.match(BULLET_PATTERN);
  if (bulletMatch) {
    return { items, type: "list-item", listMarker: "-" };
  }
  const numberedMatch = text.match(NUMBERED_PATTERN);
  if (numberedMatch) {
    return {
      items,
      type: "list-item",
      listMarker: `${numberedMatch[1]}.`,
    };
  }
  const letterMatch = text.match(LETTER_LIST_PATTERN);
  if (letterMatch) {
    return { items, type: "list-item", listMarker: "-" };
  }

  return { items, type: "paragraph" };
}

// ---------------------------------------------------------------------------
// Header/footer stripping (repeated text detection)
// ---------------------------------------------------------------------------

function detectRepeatedText(
  items: ExtractedItem[],
  totalPages: number,
): Set<string> {
  if (totalPages < 3) return new Set();

  // Collect text from top and bottom regions of each page
  const topTexts = new Map<string, number>(); // text → page count
  const bottomTexts = new Map<string, number>();

  // Group items by page
  const byPage = new Map<number, ExtractedItem[]>();
  for (const item of items) {
    const pageItems = byPage.get(item.page) ?? [];
    pageItems.push(item);
    byPage.set(item.page, pageItems);
  }

  for (const [, pageItems] of byPage) {
    if (pageItems.length === 0) continue;

    // Sort by Y position
    const sorted = [...pageItems].sort((a, b) => a.y - b.y);
    const pageHeight = sorted[sorted.length - 1].y - sorted[0].y;
    if (pageHeight <= 0) continue;

    const topThreshold = sorted[0].y + pageHeight * 0.08;
    const bottomThreshold = sorted[sorted.length - 1].y - pageHeight * 0.08;

    const topStrings = new Set<string>();
    const bottomStrings = new Set<string>();

    for (const item of sorted) {
      const trimmed = item.str.trim();
      if (trimmed.length === 0) continue;
      // Strip page numbers for comparison
      const normalized = trimmed.replace(/\d+/g, "#");

      if (item.y <= topThreshold) topStrings.add(normalized);
      if (item.y >= bottomThreshold) bottomStrings.add(normalized);
    }

    for (const s of topStrings) {
      topTexts.set(s, (topTexts.get(s) ?? 0) + 1);
    }
    for (const s of bottomStrings) {
      bottomTexts.set(s, (bottomTexts.get(s) ?? 0) + 1);
    }
  }

  // Text appearing on >50% of pages is likely a header/footer
  const threshold = totalPages * 0.5;
  const repeated = new Set<string>();

  for (const [text, count] of topTexts) {
    if (count >= threshold) repeated.add(text);
  }
  for (const [text, count] of bottomTexts) {
    if (count >= threshold) repeated.add(text);
  }

  return repeated;
}

function filterHeadersFooters(
  items: ExtractedItem[],
  repeated: Set<string>,
): ExtractedItem[] {
  if (repeated.size === 0) return items;

  return items.filter((item) => {
    const normalized = item.str.trim().replace(/\d+/g, "#");
    return !repeated.has(normalized);
  });
}

// ---------------------------------------------------------------------------
// Heading level normalization
// ---------------------------------------------------------------------------

/**
 * If no H1 heading exists, promote the first heading (on page 1) to H1.
 * Only promotes a single heading — the document title — without shifting
 * other headings, to preserve the existing heading hierarchy.
 */
function promoteFirstHeading(blocks: Block[]): void {
  const hasH1 = blocks.some((b) => b.type === "heading" && b.headingLevel === 1);
  if (hasH1) return;

  const firstHeading = blocks.find(
    (b) => b.type === "heading" && b.items[0]?.page === 1,
  );
  if (!firstHeading || firstHeading.headingLevel === undefined) return;
  if (firstHeading.headingLevel <= 1) return;

  // Only promote if this heading has a larger font size than most other headings
  // (i.e., it's genuinely the document title, not just the first section heading)
  const firstFontSize = firstHeading.items[0]?.fontSize ?? 0;
  const otherHeadings = blocks.filter(
    (b) => b !== firstHeading && b.type === "heading",
  );
  if (otherHeadings.length === 0) return;

  const otherMaxFontSize = Math.max(
    ...otherHeadings.map((b) => b.items[0]?.fontSize ?? 0),
  );

  // Only promote if the first heading's font is larger than other headings
  if (firstFontSize > otherMaxFontSize) {
    firstHeading.headingLevel = 1;
  }
}

// ---------------------------------------------------------------------------
// Table & code block post-processing
// ---------------------------------------------------------------------------

/**
 * Post-process blocks: detect tables and code blocks in paragraph blocks.
 */
function detectTablesAndCode(blocks: Block[], codeFonts: Set<string>): Block[] {
  return blocks.map((block) => {
    if (block.type !== "paragraph") return block;

    // Check for table first (tables take priority over code blocks)
    const tableRows = detectTable(block.items);
    if (tableRows) {
      return { ...block, type: "table" as const, tableRows };
    }

    // Check for code block
    if (isCodeBlock(block.items, codeFonts)) {
      return { ...block, type: "code-block" as const };
    }

    return block;
  });
}

// ---------------------------------------------------------------------------
// Link matching
// ---------------------------------------------------------------------------

function matchLinksToText(
  items: ExtractedItem[],
  links: AnnotationLink[],
): Map<ExtractedItem, string> {
  const linkMap = new Map<ExtractedItem, string>();
  if (links.length === 0) return linkMap;

  for (const item of items) {
    for (const link of links) {
      const [lx1, ly1, lx2, ly2] = link.rect;

      // Method 1: Center-point containment — item center must be inside link rect
      const itemCenterX = item.x + item.width / 2;
      const itemCenterY = item.y + item.height / 2;

      if (
        itemCenterX >= lx1 && itemCenterX <= lx2 &&
        itemCenterY >= ly1 && itemCenterY <= ly2
      ) {
        linkMap.set(item, link.url);
        break;
      }

      // Method 2: High overlap (>50% in both dimensions)
      if (item.width > 0 && item.height > 0) {
        const overlapLeft = Math.max(item.x, lx1);
        const overlapRight = Math.min(item.x + item.width, lx2);
        const overlapWidth = Math.max(0, overlapRight - overlapLeft);

        const overlapTop = Math.max(item.y, ly1);
        const overlapBottom = Math.min(item.y + item.height, ly2);
        const overlapHeight = Math.max(0, overlapBottom - overlapTop);

        if (
          overlapWidth / item.width > 0.5 &&
          overlapHeight / item.height > 0.5
        ) {
          linkMap.set(item, link.url);
          break;
        }
      }
    }
  }

  return linkMap;
}

// ---------------------------------------------------------------------------
// Inline formatting (bold/italic)
// ---------------------------------------------------------------------------

function applyInlineFormatting(text: string, fontName: string): string {
  const bold = isBold(fontName);
  const italic = isItalic(fontName);

  if (bold && italic) return `***${text}***`;
  if (bold) return `**${text}**`;
  if (italic) return `*${text}*`;
  return text;
}

// ---------------------------------------------------------------------------
// Markdown assembly
// ---------------------------------------------------------------------------

function assembleBlockText(
  block: Block,
  linkMap: Map<ExtractedItem, string>,
): string {
  // Collect text from items, joining same-line items with space
  const lines: string[] = [];
  let currentLine: string[] = [];
  let prevItem: ExtractedItem | null = null;

  for (const item of block.items) {
    let text = item.str;

    // Apply inline formatting
    text = applyInlineFormatting(text, item.fontName);

    // Wrap linked text
    const linkUrl = linkMap.get(item);
    if (linkUrl) {
      text = `[${text}](${linkUrl})`;
    }

    // Detect line break: large Y gap or hasEOL on previous
    if (prevItem) {
      const yGap = Math.abs(item.y - prevItem.y);
      const isNewLine = yGap > prevItem.height * 0.5 || prevItem.hasEOL;

      if (isNewLine) {
        lines.push(currentLine.join(" "));
        currentLine = [text];
      } else {
        currentLine.push(text);
      }
    } else {
      currentLine.push(text);
    }

    prevItem = item;
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.join(" "));
  }

  return lines.join(" ").trim();
}

function codeBlockToMarkdown(
  block: Block,
  linkMap: Map<ExtractedItem, string>,
): string {
  // Assemble raw text preserving line breaks, without inline formatting
  const lines: string[] = [];
  let currentLine: string[] = [];
  let prevItem: ExtractedItem | null = null;

  for (const item of block.items) {
    if (prevItem) {
      const yGap = Math.abs(item.y - prevItem.y);
      const isNewLine = yGap > prevItem.height * 0.5 || prevItem.hasEOL;
      if (isNewLine) {
        lines.push(currentLine.join(" "));
        currentLine = [item.str];
      } else {
        currentLine.push(item.str);
      }
    } else {
      currentLine.push(item.str);
    }
    prevItem = item;
  }
  if (currentLine.length > 0) {
    lines.push(currentLine.join(" "));
  }

  return "```\n" + lines.join("\n") + "\n```";
}

function blocksToMarkdown(
  blocks: Block[],
  linkMap: Map<ExtractedItem, string>,
): string {
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "table": {
        if (block.tableRows && block.tableRows.length > 0) {
          parts.push(tableToMarkdown(block.tableRows));
        }
        break;
      }
      case "code-block": {
        parts.push(codeBlockToMarkdown(block, linkMap));
        break;
      }
      default: {
        const text = assembleBlockText(block, linkMap);
        if (text.length === 0) continue;

        switch (block.type) {
          case "heading": {
            const prefix = "#".repeat(block.headingLevel ?? 1);
            const cleanText = text.replace(/\*\*/g, "");
            parts.push(`${prefix} ${cleanText}`);
            break;
          }
          case "list-item": {
            let cleaned = text;
            cleaned = cleaned.replace(BULLET_PATTERN, "");
            cleaned = cleaned.replace(NUMBERED_PATTERN, "");
            cleaned = cleaned.replace(LETTER_LIST_PATTERN, "");
            parts.push(`${block.listMarker} ${cleaned.trim()}`);
            break;
          }
          case "paragraph": {
            // Split paragraphs with inline bullet characters into list items
            const inlineBulletItems = splitInlineBullets(text);
            if (inlineBulletItems) {
              parts.push(inlineBulletItems);
            } else {
              parts.push(text);
            }
            break;
          }
        }
        break;
      }
    }
  }

  // Normalize whitespace: collapse 3+ newlines to 2
  return parts.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Detect and split paragraphs that contain inline bullet characters (•, ►, etc.)
 * into markdown list items. Returns formatted list string, or null if no split.
 *
 * Only splits when there are 2+ bullet-separated segments to avoid false positives.
 */
const INLINE_BULLET_RE =
  /[•\u2022\u2023\u25E6\u2043\u2219\u25CF\u25CB\u25B6\u25B8\u25BA►▸▶]/g;

function splitInlineBullets(text: string): string | null {
  // Count inline bullet characters (not at the very start of the text)
  const bullets = text.match(INLINE_BULLET_RE);
  if (!bullets || bullets.length < 2) return null;

  // Split on bullet characters
  const parts = text.split(INLINE_BULLET_RE).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  // Guard: if the segments are very short on average (< 10 chars), they're likely
  // not real list items (e.g., scattered symbols)
  const avgLen = parts.reduce((sum, p) => sum + p.length, 0) / parts.length;
  if (avgLen < 10) return null;

  // Format as markdown bullet list
  // If there's a preamble before the first bullet, include it as a paragraph
  const firstBulletIdx = text.search(INLINE_BULLET_RE);
  const preamble = text.slice(0, firstBulletIdx).trim();

  const listItems = parts.map((p) => `- ${p}`).join("\n");
  if (preamble.length > 0 && firstBulletIdx > 0) {
    // First segment is preamble text, rest are list items
    const bulletParts = parts.slice(1).map((p) => `- ${p}`).join("\n");
    return `${preamble}\n\n${bulletParts}`;
  }
  return listItems;
}

// ---------------------------------------------------------------------------
// Bare URL auto-linking
// ---------------------------------------------------------------------------

/**
 * Convert bare URLs in text to markdown links, but only if they're not
 * already inside a markdown link `[text](url)` or code block.
 */
function autoLinkUrls(markdown: string): string {
  // Process line by line, skip code blocks
  const lines = markdown.split("\n");
  let inCodeBlock = false;
  return lines
    .map((line) => {
      if (line.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return line;
      }
      if (inCodeBlock) return line;

      // Match URLs not already inside markdown links
      // Negative lookbehind: not preceded by ]( or by [
      return line.replace(
        /(?<!\]\()(?<!\[)(https?:\/\/[^\s\])<>]+)/g,
        (match) => `[${match}](${match})`,
      );
    })
    .join("\n");
}

// ---------------------------------------------------------------------------
// Fix split ligatures (kerned characters appearing as "di ff" instead of "diff")
// ---------------------------------------------------------------------------

/**
 * Some PDFs use heavy kerning or custom fonts that cause PDF.js to insert
 * spaces inside common ligature groups (tt, ff, fi, fl, ffi, ffl).
 * This function rejoins them when they appear within known English words.
 */
function fixSplitLigatures(markdown: string): string {
  return markdown
    // "h tt p" → "http", "h tt ps" → "https"
    .replace(/\bh tt ps?\b/g, (m) => m.replace(/ /g, ""))
    // "di ff" → "diff" (and variants)
    .replace(/\bdi ff\b/gi, "diff")
    .replace(/\bdi ff er/gi, "differ")
    .replace(/\bdi ffi /gi, "diffi")
    // "e ff ect" → "effect", "o ff " → "off"
    .replace(/\bo ff\b/gi, "off")
    .replace(/\be ff ect/gi, "effect")
    .replace(/\be ffi ci/gi, "effici")
    // "o ffi cial" → "official"
    .replace(/o ffi c/gi, "offic")
    // Common "tt" splits: "commi tt ed" → "committed", "pa tt ern" → "pattern"
    .replace(/commi tt ed/gi, "committed")
    .replace(/commi tt/gi, "committ")
    .replace(/pa tt ern/gi, "pattern")
    .replace(/be tt er/gi, "better")
    .replace(/le tt er/gi, "letter")
    .replace(/a tt ach/gi, "attach")
    .replace(/se tt ing/gi, "setting")
    .replace(/ge tt ing/gi, "getting")
    .replace(/pu tt ing/gi, "putting")
    .replace(/si tt ing/gi, "sitting")
    .replace(/wri tt en/gi, "written")
    .replace(/bi tt en/gi, "bitten")
    .replace(/ki tt en/gi, "kitten")
    .replace(/bu tt on/gi, "button")
    .replace(/bo tt om/gi, "bottom")
    .replace(/ma tt er/gi, "matter")
    .replace(/ba tt le/gi, "battle")
    .replace(/li tt le/gi, "little");
}

// ---------------------------------------------------------------------------
// Metadata extraction
// ---------------------------------------------------------------------------

async function extractMetadata(
  doc: PDFDocumentProxy,
): Promise<ConversionMetadata | undefined> {
  try {
    const meta = await doc.getMetadata();
    const info = meta?.info as Record<string, unknown> | undefined;
    if (!info) return undefined;

    return {
      title: typeof info["Title"] === "string" ? info["Title"] : undefined,
      author: typeof info["Author"] === "string" ? info["Author"] : undefined,
      subject: typeof info["Subject"] === "string" ? info["Subject"] : undefined,
      keywords:
        typeof info["Keywords"] === "string"
          ? info["Keywords"].split(/[,;]\s*/).filter(Boolean)
          : undefined,
      creationDate:
        typeof info["CreationDate"] === "string"
          ? info["CreationDate"]
          : undefined,
    };
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Main conversion function
// ---------------------------------------------------------------------------

export async function convert(
  pdfBuffer: ArrayBuffer,
  options?: ConvertOptions,
): Promise<ConversionResult> {
  const startTime = performance.now();
  const messages: ConversionMessage[] = [];

  // Check file size
  if (pdfBuffer.byteLength > MAX_FILE_SIZE) {
    return {
      status: "failed",
      markdown: "",
      messages: [
        {
          code: "oversized",
          severity: "error",
          message: `File size (${Math.round(pdfBuffer.byteLength / 1024 / 1024)}MB) exceeds the ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
        },
      ],
      stats: { pageCount: 0, wordCount: 0, processingMs: 0 },
    };
  }

  // Initialize PDF.js worker
  initPdfWorker();

  // Load document
  let doc: PDFDocumentProxy;
  try {
    const loadingTask = getDocument({
      data: pdfBuffer,
      useSystemFonts: true,
    });

    if (options?.signal) {
      options.signal.addEventListener("abort", () => {
        loadingTask.destroy();
      });
    }

    doc = await loadingTask.promise;
  } catch (err: unknown) {
    // Check for password-protected PDFs
    if (
      err instanceof Error &&
      (err.message.includes("password") ||
        err.message.includes("encrypted"))
    ) {
      return {
        status: "failed",
        markdown: "",
        messages: [
          {
            code: "password_protected",
            severity: "error",
            message: "This PDF is password-protected. Please unlock it first.",
          },
        ],
        stats: { pageCount: 0, wordCount: 0, processingMs: 0 },
      };
    }

    return {
      status: "failed",
      markdown: "",
      messages: [
        {
          code: "parse_failed",
          severity: "error",
          message: `Failed to parse PDF: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
      ],
      stats: {
        pageCount: 0,
        wordCount: 0,
        processingMs: performance.now() - startTime,
      },
    };
  }

  const totalPages = doc.numPages;
  const maxPages = options?.maxPages
    ? Math.min(options.maxPages, totalPages)
    : totalPages;

  options?.onProgress?.({
    stage: "loading",
    currentPage: 0,
    totalPages: maxPages,
  });

  // Extract text and links from all pages
  const allItems: ExtractedItem[] = [];
  const allLinks: AnnotationLink[] = [];

  for (let i = 1; i <= maxPages; i++) {
    if (options?.signal?.aborted) {
      doc.destroy();
      return {
        status: "failed",
        markdown: "",
        messages: [
          {
            code: "cancelled",
            severity: "error",
            message: "Conversion was cancelled.",
          },
        ],
        stats: {
          pageCount: 0,
          wordCount: 0,
          processingMs: performance.now() - startTime,
        },
      };
    }

    options?.onProgress?.({
      stage: "parsing",
      currentPage: i,
      totalPages: maxPages,
    });

    try {
      const page = await doc.getPage(i);
      const { items, links } = await extractPageItems(page, i);
      allItems.push(...items);
      allLinks.push(...links);
    } catch (err) {
      messages.push({
        code: "parse_failed",
        severity: "warning",
        message: `Failed to extract page ${i}: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    }
  }

  // Check if there's any extractable text
  if (allItems.length === 0) {
    doc.destroy();
    return {
      status: "failed",
      markdown: "",
      messages: [
        {
          code: "no_extractable_text",
          severity: "error",
          message:
            "No extractable text found. This PDF may be scanned or image-based. OCR is not yet supported.",
        },
      ],
      stats: {
        pageCount: totalPages,
        wordCount: 0,
        processingMs: performance.now() - startTime,
      },
    };
  }

  options?.onProgress?.({
    stage: "structuring",
    currentPage: maxPages,
    totalPages: maxPages,
  });

  // Detect and strip headers/footers
  const repeated = detectRepeatedText(allItems, maxPages);
  const filtered = filterHeadersFooters(allItems, repeated);

  // Fix multi-column reading order (academic papers, IEEE, etc.)
  // Must happen BEFORE groupIntoBlocks so items are pre-sorted in reading order.
  const reordered = applyColumnReordering(filtered);

  // Build font profile for heading detection
  const profile = buildFontProfile(reordered);

  // Detect code fonts (subset fonts used in indented blocks)
  const codeFonts = detectCodeFont(reordered, profile.bodySize);

  // Detect emphasis fonts (subset fonts used for bold/emphasis on short lines)
  const emphasisFonts = detectEmphasisFonts(reordered, profile.bodySize);

  // Group into blocks (paragraphs, headings, list items)
  const blocks = groupIntoBlocks(reordered, profile, emphasisFonts);

  // Promote first heading to H1 if no H1 exists (common for document titles
  // that get ranked deep by font-size analysis)
  promoteFirstHeading(blocks);

  // Post-process: detect tables and code blocks
  const enrichedBlocks = detectTablesAndCode(blocks, codeFonts);

  // Match links to text items
  const linkMap = matchLinksToText(reordered, allLinks);

  options?.onProgress?.({
    stage: "assembling",
    currentPage: maxPages,
    totalPages: maxPages,
  });

  // Assemble markdown
  let markdown = blocksToMarkdown(enrichedBlocks, linkMap);

  // Auto-link bare URLs that aren't already inside markdown links
  markdown = autoLinkUrls(markdown);

  // Fix split ligatures from kerned/custom fonts
  markdown = fixSplitLigatures(markdown);

  // Rejoin hyphenated line breaks (e.g., "repre-\nsentation" → "representation")
  markdown = rejoinHyphenatedWords(markdown);

  // Extract metadata if requested (yamlFrontMatter implies includeMetadata)
  let metadata: ConversionMetadata | undefined;
  if (options?.includeMetadata || options?.yamlFrontMatter) {
    metadata = await extractMetadata(doc);

    // Fallback: infer title from first heading if PDF metadata is empty
    if (!metadata?.title || metadata.title.trim().length === 0) {
      const firstHeading = enrichedBlocks.find((b) => b.type === "heading");
      if (firstHeading) {
        const titleText = firstHeading.items.map((i) => i.str).join(" ").trim();
        if (titleText.length > 0 && titleText.length <= 200) {
          if (!metadata) {
            metadata = { title: titleText };
          } else {
            metadata.title = titleText;
          }
        }
      }
    }
  }

  // Prepend YAML front matter if requested and metadata exists
  if (options?.yamlFrontMatter && metadata) {
    const yaml = metadataToYaml(metadata);
    if (yaml) {
      markdown = yaml + "\n\n" + markdown;
    }
  }

  doc.destroy();

  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  const processingMs = performance.now() - startTime;

  return {
    status: messages.length > 0 ? "partial" : "success",
    markdown,
    messages,
    stats: { pageCount: totalPages, wordCount, processingMs },
    metadata,
  };
}
