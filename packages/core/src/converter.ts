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
  detectTable,
  isCodeBlock,
  metadataToYaml,
  tableToMarkdown,
  detectColumnLayout,
  reorderColumnarItems,
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

function isItalic(fontName: string): boolean {
  const lower = fontName.toLowerCase();
  return /italic|oblique|\bit\b/.test(lower);
}

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
      str: item.str,
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
    .filter((s) => s > bodySize * 1.15) // at least 15% larger than body
    .sort((a, b) => b - a);

  const headingSizes = new Map<number, number>();
  for (let i = 0; i < largerSizes.length && i < 6; i++) {
    headingSizes.set(largerSizes[i], i + 1); // H1, H2, ... H6
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
      blocks.push(classifyBlock(currentItems, profile));
      currentItems = [curr];
    } else {
      currentItems.push(curr);
    }
  }

  if (currentItems.length > 0) {
    blocks.push(classifyBlock(currentItems, profile));
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Block classification
// ---------------------------------------------------------------------------

const BULLET_PATTERN = /^[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25AB\u25CF\u25CB\u2013\u2014\u2010•·–—-]\s*/;
const NUMBERED_PATTERN = /^(\d{1,3})[.)]\s+/;
const LETTER_LIST_PATTERN = /^[a-zA-Z][.)]\s+/;

function classifyBlock(
  items: ExtractedItem[],
  profile: FontProfile,
): Block {
  const firstItem = items[0];

  // Check for heading
  const headingLevel = getHeadingLevel(firstItem.fontSize, profile);
  if (headingLevel !== undefined) {
    return { items, type: "heading", headingLevel };
  }

  // Check for list item
  const text = firstItem.str.trimStart();
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
// Table & code block post-processing
// ---------------------------------------------------------------------------

/**
 * Post-process blocks: detect tables and code blocks in paragraph blocks.
 */
function detectTablesAndCode(blocks: Block[]): Block[] {
  return blocks.map((block) => {
    if (block.type !== "paragraph") return block;

    // Check for table first (tables take priority over code blocks)
    const tableRows = detectTable(block.items);
    if (tableRows) {
      return { ...block, type: "table" as const, tableRows };
    }

    // Check for code block
    if (isCodeBlock(block.items)) {
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
          case "paragraph":
            parts.push(text);
            break;
        }
        break;
      }
    }
  }

  // Normalize whitespace: collapse 3+ newlines to 2
  return parts.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
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

  // Group into blocks (paragraphs, headings, list items)
  const blocks = groupIntoBlocks(reordered, profile);

  // Post-process: detect tables and code blocks
  const enrichedBlocks = detectTablesAndCode(blocks);

  // Match links to text items
  const linkMap = matchLinksToText(reordered, allLinks);

  options?.onProgress?.({
    stage: "assembling",
    currentPage: maxPages,
    totalPages: maxPages,
  });

  // Assemble markdown
  let markdown = blocksToMarkdown(enrichedBlocks, linkMap);

  // Extract metadata if requested (yamlFrontMatter implies includeMetadata)
  let metadata: ConversionMetadata | undefined;
  if (options?.includeMetadata || options?.yamlFrontMatter) {
    metadata = await extractMetadata(doc);
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
