import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import type {
  StructTreeContent,
  StructTreeNode,
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import { isNode } from "./env.js";
import { getPdfjs } from "./pdf-compat.js";
import { initPdfWorker } from "./pdf-worker.js";
import type {
  ConversionResult,
  ConversionMessage,
  ConversionMetadata,
  ConversionChunk,
  ConvertOptions,
  PageMarkdown,
  StructuredOutput,
  StructuredSection,
} from "./types.js";
import { MAX_FILE_SIZE } from "./types.js";
import { resolvePageSelection, withContextPages } from "./pages.js";
import {
  cleanText,
  detectTable,
  isCodeBlock,
  isMonospace,
  detectCodeFont,
  metadataToYaml,
  tableToMarkdown,
  detectColumnLayout,
  reorderColumnarItems,
  rejoinHyphenatedWords,
  parseTocEntries,
  parseTrailingPageEntry,
  tocToMarkdown,
  collapseLeaders,
} from "./detection.js";

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
  /** PDF.js marked-content ids used to map tagged PDF structure nodes to text. */
  structIds?: string[];
  /** The PDF drew a whitespace-only run right after this item: a word break. */
  spaceAfter?: boolean;
  /** Bold or italic, from the real font name. Unset when emphasis is off. */
  bold?: boolean;
  italic?: boolean;
  /** Monospace, from the real font name or its fixed-pitch flag. Unset when the font was not resolved. */
  monospace?: boolean;
}

/** Bold/italic style of a PDF font. */
export interface FontStyle {
  bold: boolean;
  italic: boolean;
}

/** Style of a resolved PDF font, monospace included. */
interface ResolvedFont extends FontStyle {
  monospace: boolean;
}

interface AnnotationLink {
  url: string;
  rect: [number, number, number, number]; // [x1, y1, x2, y2], top-down
  /** 1-based page the annotation belongs to. Links only match text on this page. */
  page: number;
}

interface Block {
  items: ExtractedItem[];
  type: "paragraph" | "heading" | "list-item" | "table" | "code-block";
  headingLevel?: number;
  /**
   * What made a heading: section numbering (its level is absolute), a font
   * size above body text, or a body-size style (bold, emphasis font, capitals).
   * `rankHeadingLevels` re-ranks the last two by the styles in use.
   */
  headingSource?: "number" | "size" | "style";
  listMarker?: string;
  tableRows?: string[][];
  /** A table-of-contents block: rendered as list items, leaders removed. */
  toc?: boolean;
}

interface ExtractedPage {
  items: ExtractedItem[];
  links: AnnotationLink[];
  structTree?: StructTreeNode | null;
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

  // Find dominant font by character count. Items are grouped by font in one
  // pass (document order kept): filtering per font was O(fonts × items).
  const fontCharCount = new Map<string, number>();
  const itemsByFont = new Map<string, ExtractedItem[]>();
  for (const item of items) {
    fontCharCount.set(item.fontName, (fontCharCount.get(item.fontName) ?? 0) + item.str.length);
    const group = itemsByFont.get(item.fontName);
    if (group) group.push(item);
    else itemsByFont.set(item.fontName, [item]);
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
    const fontItems = itemsByFont.get(fontName) ?? [];

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

const BOLD_FONT_NAME =
  /bold|black|heavy|demi|-medi(?:ital)?$|^(?:cm|sf)(?:bx|b\d)/i;
const ITALIC_FONT_NAME =
  /italic|oblique|kursiv|(?:^|[-,_ ]|regu|medi|bold|light|book)ital$|(?:-|,|bold|semibold|light|medium|regular|book|black|demi|heavy|cn|cond)it$|^(?:cm|sf)(?:ti|sl|bxti|bxsl)\d/i;

/**
 * Bold/italic from a real PDF font name such as "ABCDEF+Helvetica-BoldOblique",
 * "Arial,Italic", "NimbusRomNo9L-Medi" or TeX's "CMTI10". The six-letter subset
 * prefix is ignored.
 */
export function fontStyleFromName(name: string): FontStyle {
  const base = name.replace(/^[A-Z]{6}\+/, "");
  return { bold: BOLD_FONT_NAME.test(base), italic: ITALIC_FONT_NAME.test(base) };
}

/**
 * Resolve a PDF.js font id (e.g. "g_d0_f3") to its style. The font object is
 * only on `commonObjs` once the page's operator list has been built.
 */
function resolveFontStyle(page: PDFPageProxy, fontId: string): ResolvedFont | undefined {
  if (!page.commonObjs.has(fontId)) return undefined;
  const font: unknown = page.commonObjs.get(fontId);
  if (typeof font !== "object" || font === null) return undefined;
  const { name, bold, italic, isMonospace: fixedPitch } = font as {
    name?: unknown;
    bold?: unknown;
    italic?: unknown;
    isMonospace?: unknown;
  };
  const realName = typeof name === "string" ? name.replace(/^[A-Z]{6}\+/, "") : "";
  const fromName = realName ? fontStyleFromName(realName) : { bold: false, italic: false };
  return {
    bold: fromName.bold || bold === true,
    italic: fromName.italic || italic === true,
    monospace: (realName !== "" && isMonospace(realName)) || fixedPitch === true,
  };
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

/**
 * How far most of a page's text is turned, in quarter turns counterclockwise
 * (0 upright, 1 reading upward as on a landscape table printed sideways, 2
 * upside down, 3 reading downward), by character count. A page counts as
 * turned only when more than half its characters are; rotated margin text on
 * an upright page (an arXiv stamp) leaves it at 0.
 */
export function pageTextTurn(items: { str: string; transform: number[] }[]): 0 | 1 | 2 | 3 {
  const chars = [0, 0, 0, 0];
  let total = 0;
  for (const item of items) {
    const n = item.str.trim().length;
    if (n === 0) continue;
    total += n;
    const [a, b] = item.transform;
    if (Math.abs(a) >= Math.abs(b)) chars[a >= 0 ? 0 : 2] += n;
    else chars[b > 0 ? 1 : 3] += n;
  }
  for (const turn of [1, 2, 3] as const) if (chars[turn] * 2 > total) return turn;
  return 0;
}

/**
 * Maps a top-down page point to the reading frame of a page whose text is
 * turned `turn` quarter turns: x along the lines, y down the lines.
 */
function readingFrame(turn: 0 | 1 | 2 | 3, width: number, height: number): (x: number, y: number) => [number, number] {
  switch (turn) {
    case 1:
      return (x, y) => [height - y, x];
    case 2:
      return (x, y) => [width - x, height - y];
    case 3:
      return (x, y) => [y, width - x];
    default:
      return (x, y) => [x, y];
  }
}

async function extractPageItems(
  page: PDFPageProxy,
  pageNum: number,
): Promise<ExtractedPage> {
  const [textContent, annotations, structTree] = await Promise.all([
    page.getTextContent(),
    page.getAnnotations(),
    page.getStructTree().catch(() => null),
  ]);

  const viewport = page.getViewport({ scale: 1 });
  const turn = pageTextTurn(textContent.items.filter(isTextItem));
  const frame = readingFrame(turn, viewport.width, viewport.height);

  const items: ExtractedItem[] = [];
  const markedContentStack: string[] = [];
  for (const item of textContent.items) {
    if (!isTextItem(item)) {
      if (item.type === "beginMarkedContentProps" && item.id) {
        markedContentStack.push(item.id);
      } else if (item.type === "beginMarkedContent") {
        markedContentStack.push("");
      } else if (item.type === "endMarkedContent") {
        markedContentStack.pop();
      }
      continue;
    }

    if (item.str.trim() === "") {
      // Whitespace-only runs are dropped, but they mark a word break.
      const prev = items[items.length - 1];
      if (prev && item.str.length > 0) prev.spaceAfter = true;
      continue;
    }

    // transform: [scaleX, skewX, skewY, scaleY, translateX, translateY]
    // On a page turned a quarter or half turn (a landscape table), the size is
    // the length of the vertical axis whichever way it points.
    const fontSize =
      turn === 0 ? Math.abs(item.transform[3]) : Math.hypot(item.transform[2], item.transform[3]);
    // PDF coordinates are bottom-up; invert to top-down, then into the
    // page's reading frame.
    const [x, y] = frame(item.transform[4], viewport.height - item.transform[5]);

    items.push({
      str: cleanText(item.str),
      x,
      y,
      width: item.width,
      height: turn === 0 ? item.height || fontSize : fontSize,
      fontSize,
      fontName: item.fontName,
      hasEOL: item.hasEOL,
      page: pageNum,
      structIds: markedContentStack.filter(Boolean),
    });
  }

  const links: AnnotationLink[] = [];
  for (const ann of annotations) {
    if (ann.subtype === "Link" && ann.url && ann.rect) {
      // Convert annotation rect to same coordinate system
      const [x1, y1raw, x2, y2raw] = ann.rect;
      const [ax, ay] = frame(x1, viewport.height - y1raw);
      const [bx, by] = frame(x2, viewport.height - y2raw);
      links.push({
        url: ann.url,
        rect: [Math.min(ax, bx), Math.min(ay, by), Math.max(ax, bx), Math.max(ay, by)],
        page: pageNum,
      });
    }
  }

  return { items, links, structTree };
}

/**
 * Resolve real font styles (bold, italic, monospace) and set `monospace` on
 * the items of resolved fonts; code detection uses it. Bold and italic are
 * applied later by `applyEmphasis`.
 *
 * Font names are only on `commonObjs` after a page's operator list is built,
 * which costs about as much as the text extraction itself. So only the fonts
 * of lettered items are resolved, except the dominant body font, which is
 * taken as regular, using as few pages as possible (greedy cover). It runs
 * before blocks are formed, because heading detection needs real bold.
 * Returns one message per page whose operator list failed.
 */
async function resolveFonts(
  doc: PDFDocumentProxy,
  items: ExtractedItem[],
  signal?: AbortSignal,
): Promise<{ styles: Map<string, ResolvedFont>; errors: string[] }> {
  const styles = new Map<string, ResolvedFont>();
  const candidates = items.filter(hasLetter);
  const chars = new Map<string, number>();
  for (const item of candidates) {
    chars.set(item.fontName, (chars.get(item.fontName) ?? 0) + item.str.length);
  }
  const bodyFont = [...chars].sort((a, b) => b[1] - a[1])[0]?.[0];
  const needed = new Set([...chars.keys()].filter((id) => id !== bodyFont));
  if (needed.size === 0) return { styles, errors: [] };

  const fontsByPage = new Map<number, Set<string>>();
  for (const item of items) {
    if (!needed.has(item.fontName)) continue;
    const fonts = fontsByPage.get(item.page) ?? new Set<string>();
    fonts.add(item.fontName);
    fontsByPage.set(item.page, fonts);
  }

  const errors: string[] = [];
  while (needed.size > 0) {
    // The page that uses the most still-unresolved fonts (earliest on a tie).
    let bestPage = -1;
    let bestCount = 0;
    for (const [pageNum, fonts] of fontsByPage) {
      let count = 0;
      for (const id of fonts) if (needed.has(id)) count++;
      if (count > bestCount || (count === bestCount && count > 0 && pageNum < bestPage)) {
        bestPage = pageNum;
        bestCount = count;
      }
    }
    if (bestPage < 0) break;

    const fonts = [...(fontsByPage.get(bestPage) ?? [])].filter((id) => needed.has(id));
    // A cancel destroys the document, after which PDF.js calls may never settle.
    throwIfCancelled(signal);
    try {
      const page = await abortable(doc.getPage(bestPage), signal);
      await abortable(page.getOperatorList(), signal);
      for (const id of fonts) {
        const style = resolveFontStyle(page, id);
        if (style) styles.set(id, style);
      }
    } catch (err) {
      throwIfCancelled(signal);
      errors.push(
        `Could not read fonts on page ${bestPage}; some bold, italic and code formatting omitted: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
    for (const id of fonts) needed.delete(id);
  }

  for (const item of items) {
    const style = styles.get(item.fontName);
    if (style) item.monospace = style.monospace;
  }
  return { styles, errors };
}

/**
 * Share of a document's text, in characters, set in resolved monospace fonts
 * above which it is taken to contain real code.
 */
const MONOSPACE_CODE_SHARE = 0.1;

/**
 * The detected code fonts (by layout) that code detection may trust. A code
 * font that resolves to a proportional font (a math or caption font) is
 * dropped, unless the document has real monospace code, where proportional
 * fonts also set code (grammar productions in italics, for example).
 */
function trustedCodeFonts(
  codeFonts: Set<string>,
  blocks: Block[],
  styles: Map<string, ResolvedFont>,
): Set<string> {
  let mono = 0;
  let total = 0;
  for (const block of blocks) {
    for (const item of block.items) {
      total += item.str.length;
      if (item.monospace === true) mono += item.str.length;
    }
  }
  if (total > 0 && mono / total >= MONOSPACE_CODE_SHARE) return codeFonts;
  return new Set([...codeFonts].filter((id) => styles.get(id)?.monospace !== false));
}

/** Set `bold`/`italic` on items from the resolved font styles. */
function applyEmphasis(blocks: Block[], styles: Map<string, ResolvedFont>): void {
  for (const block of blocks) {
    for (const item of block.items) {
      const style = styles.get(item.fontName);
      item.bold = style?.bold ?? false;
      item.italic = style?.italic ?? false;
    }
  }
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
      for (const [pageNum, layout] of pageLayouts) {
        // A sidebar page (a summary box beside the main text) is kept.
        if (!layout.sidebar) pageLayouts.set(pageNum, { type: "single" });
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

/** A footnote or note label: one to three digits, set small and raised. */
const LINE_LABEL_PATTERN = /^\d{1,3}$/;

/**
 * True when `block` so far is only a small raised label ("12" before a
 * footnote) that opens its line, and `next` is the text it labels, starting
 * right after it on the same line. The font-size change would otherwise
 * split the label into a paragraph of its own. `before` holds the few items
 * sorted just before the label: one on the same line to its left makes the
 * label an exponent or a reference mark inside the line, not a line label.
 */
function opensLabelledLine(block: ExtractedItem[], next: ExtractedItem, before: ExtractedItem[]): boolean {
  if (block.length !== 1) return false;
  const label = block[0];
  if (!isLineLabel(label, next)) return false;
  return !before.some(
    (item) =>
      item.page === label.page && item.x < label.x && Math.abs(item.y - next.y) <= next.fontSize * 0.5,
  );
}

/** `label` is a small raised number set right before `next` on its line. */
function isLineLabel(label: ExtractedItem, next: ExtractedItem): boolean {
  if (!LINE_LABEL_PATTERN.test(label.str.trim()) || label.page !== next.page) return false;
  // Smaller than 0.85× the text, but not an invisible tagging mark.
  if (label.fontSize > next.fontSize * 0.85 || label.fontSize < next.fontSize * 0.4) return false;
  const rise = next.y - label.y;
  const gap = next.x - (label.x + label.width);
  return rise >= 0 && rise <= next.fontSize * 0.5 && gap >= -1 && gap <= next.fontSize * 0.5;
}

/** The font with the most characters: the body text font. */
function dominantFont(items: ExtractedItem[]): string | undefined {
  const chars = new Map<string, number>();
  for (const item of items) chars.set(item.fontName, (chars.get(item.fontName) ?? 0) + item.str.length);
  let best: string | undefined;
  let bestCount = 0;
  for (const [font, count] of chars) {
    if (count > bestCount) {
      best = font;
      bestCount = count;
    }
  }
  return best;
}

/**
 * True when `block` is one or two lines set in a single font other than the
 * body font, and `next` opens the following line in the body font: a heading
 * on a line of its own (`Data Source` in a semibold sans over serif body
 * text). Size alone does not separate them when the heading is about body
 * size, and the line gap is a normal one.
 */
function endsStyledLine(block: ExtractedItem[], next: ExtractedItem, bodyFont: string | undefined): boolean {
  if (bodyFont === undefined || next.fontName !== bodyFont) return false;
  const first = block[0];
  const last = block[block.length - 1];
  if (!first || first.fontName === bodyFont || first.page !== next.page) return false;
  if (!block.every((item) => item.fontName === first.fontName && item.page === first.page)) return false;
  // At most two lines: every item on the first line or on the last one.
  const onLine = (item: ExtractedItem, line: ExtractedItem) => Math.abs(item.y - line.y) <= line.fontSize * 0.5;
  if (!block.every((item) => onLine(item, first) || onLine(item, last))) return false;
  if (next.y - last.y <= Math.max(last.fontSize, next.fontSize) * 0.5) return false;
  const text = block.map((item) => item.str).join(" ").trim();
  return text.length < 120 && /\p{L}{2}/u.test(text) && !/[.,;:]$/.test(text);
}

function groupIntoBlocks(
  items: ExtractedItem[],
  profile: FontProfile,
  emphasisFonts?: Set<string>,
  boldFonts: Set<string> = new Set(),
): Block[] {
  if (items.length === 0) return [];
  const bodyFont = dominantFont(items);

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

    if (
      (pageDiff ||
        verticalGap > lineHeight ||
        (sizeChange && verticalGap > prev.height * 0.3) ||
        endsStyledLine(currentItems, curr, bodyFont)) &&
      !opensLabelledLine(currentItems, curr, sorted.slice(Math.max(0, i - 4), i - 1))
    ) {
      blocks.push(classifyBlock(currentItems, profile, emphasisFonts, boldFonts));
      currentItems = [curr];
    } else {
      currentItems.push(curr);
    }
  }

  if (currentItems.length > 0) {
    blocks.push(classifyBlock(currentItems, profile, emphasisFonts, boldFonts));
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Tagged PDF semantic block building
// ---------------------------------------------------------------------------

function isStructTreeContent(
  node: StructTreeNode | StructTreeContent,
): node is StructTreeContent {
  return "type" in node;
}

function normalizeStructRole(role: string): string {
  return role.replace(/^\/+/, "").toUpperCase();
}

function headingLevelFromRole(role: string): number | undefined {
  const normalized = normalizeStructRole(role);
  const match = normalized.match(/^H([1-6])$/);
  if (match) return Number(match[1]);
  if (normalized === "TITLE") return 1;
  if (normalized === "H") return 2;
  return undefined;
}

function collectStructContentIds(node: StructTreeNode | StructTreeContent): string[] {
  if (isStructTreeContent(node)) {
    return node.type === "content" && node.id ? [node.id] : [];
  }

  const ids: string[] = [];
  for (const child of node.children ?? []) {
    ids.push(...collectStructContentIds(child));
  }
  return ids;
}

function itemsForStructIds(
  ids: string[],
  itemsByStructId: Map<string, ExtractedItem[]>,
): ExtractedItem[] {
  const result: ExtractedItem[] = [];
  const seen = new Set<ExtractedItem>();

  for (const id of ids) {
    const items = itemsByStructId.get(id);
    if (!items) continue;
    for (const item of items) {
      if (seen.has(item)) continue;
      seen.add(item);
      result.push(item);
    }
  }

  return result;
}

function blocksFromStructNode(
  node: StructTreeNode | StructTreeContent,
  itemsByStructId: Map<string, ExtractedItem[]>,
  profile: FontProfile,
): Block[] {
  if (isStructTreeContent(node)) return [];

  const role = normalizeStructRole(node.role);
  const headingLevel = headingLevelFromRole(role);

  if (headingLevel !== undefined) {
    const items = itemsForStructIds(collectStructContentIds(node), itemsByStructId);
    return items.length > 0 ? [{ items, type: "heading", headingLevel }] : [];
  }

  if (role === "P" || role === "PARA" || role === "PARAGRAPH") {
    const items = itemsForStructIds(collectStructContentIds(node), itemsByStructId);
    return items.length > 0 ? [{ items, type: "paragraph" }] : [];
  }

  if (role === "LI") {
    const items = itemsForStructIds(collectStructContentIds(node), itemsByStructId);
    if (items.length === 0) return [];

    const text = items.map((item) => item.str).join(" ").trimStart();
    const numberedMatch = text.match(NUMBERED_PATTERN);
    return [{
      items,
      type: "list-item",
      listMarker: numberedMatch ? `${numberedMatch[1]}.` : "-",
    }];
  }

  if (role === "TABLE" || role === "TR" || role === "TH" || role === "TD") {
    const items = itemsForStructIds(collectStructContentIds(node), itemsByStructId);
    return items.length > 0
      ? detectTablesAndCode([{ items, type: "paragraph" }], new Set())
      : [];
  }

  const blocks: Block[] = [];
  for (const child of node.children ?? []) {
    blocks.push(...blocksFromStructNode(child, itemsByStructId, profile));
  }

  // Some producers use generic StructElem/H tags while the content itself still
  // carries enough font information to classify; this keeps tagged output useful
  // without accepting an empty or all-container tree as semantic structure.
  if (blocks.length === 0 && role === "STRUCTELEM") {
    const items = itemsForStructIds(collectStructContentIds(node), itemsByStructId);
    if (items.length > 0) blocks.push(classifyBlock(items, profile));
  }

  return blocks;
}

function buildTaggedBlocks(
  items: ExtractedItem[],
  structTrees: Array<StructTreeNode | null | undefined>,
  profile: FontProfile,
): Block[] | null {
  const usableTrees = structTrees.filter((tree): tree is StructTreeNode => Boolean(tree));
  if (usableTrees.length === 0) return null;

  const itemsByStructId = new Map<string, ExtractedItem[]>();
  let totalChars = 0;
  for (const item of items) {
    totalChars += item.str.trim().length;
    for (const id of item.structIds ?? []) {
      const existing = itemsByStructId.get(id);
      if (existing) existing.push(item);
      else itemsByStructId.set(id, [item]);
    }
  }
  if (itemsByStructId.size === 0 || totalChars === 0) return null;

  const blocks = usableTrees.flatMap((tree) =>
    blocksFromStructNode(tree, itemsByStructId, profile),
  );
  if (blocks.length === 0) return null;

  const taggedItems = new Set<ExtractedItem>();
  for (const block of blocks) {
    for (const item of block.items) taggedItems.add(item);
  }

  const taggedChars = [...taggedItems].reduce(
    (sum, item) => sum + item.str.trim().length,
    0,
  );
  if (taggedChars / totalChars < 0.25) return null;

  return blocks;
}

// ---------------------------------------------------------------------------
// Block classification
// ---------------------------------------------------------------------------

const BULLET_PATTERN = /^[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25AB\u25CF\u25CB\u25B6\u25B8\u25BA\u25C6\u25C7\u25A0\u25A1\u2013\u2014\u2010•·–—►▸▶◆◇■□-]\s*/;
const NUMBERED_PATTERN = /^(\d{1,3})[.)]\s+/;
const LETTER_LIST_PATTERN = /^[a-zA-Z][.)]\s+/;
const BRACKET_NUM_PATTERN = /^\[(\d{1,3})\]\s+/;

/**
 * The font size of most of a block's characters (the first item's on a tie),
 * so a large initial or logo glyph does not make a footer a heading.
 */
function dominantSize(items: ExtractedItem[]): number {
  const chars = new Map<number, number>();
  for (const item of items) {
    const size = Math.round(item.fontSize * 10) / 10;
    chars.set(size, (chars.get(size) ?? 0) + item.str.trim().length);
  }
  let best = Math.round((items[0]?.fontSize ?? 0) * 10) / 10;
  let bestCount = chars.get(best) ?? 0;
  for (const [size, count] of chars) {
    if (count > bestCount) {
      best = size;
      bestCount = count;
    }
  }
  return best;
}

/**
 * One or two lines of text whose characters are mostly at least 0.85× the
 * body size, with no gap between words wider than two font sizes (so not a
 * row of table cells, a small label or a footer).
 */
function isBoldHeadingLine(items: ExtractedItem[], bodySize: number): boolean {
  const first = items[0];
  if (!first || dominantSize(items) < bodySize * 0.85) return false;
  const lines: ExtractedItem[][] = [];
  for (const item of items) {
    if (item.page !== first.page) return false;
    const line = lines.find((l) => Math.abs(l[0].y - item.y) <= item.fontSize * 0.5);
    if (line) line.push(item);
    else lines.push([item]);
  }
  if (lines.length > 2) return false;
  for (const line of lines) {
    const byX = [...line].sort((a, b) => a.x - b.x);
    for (let i = 1; i < byX.length; i++) {
      if (byX[i].x - (byX[i - 1].x + byX[i - 1].width) > byX[i].fontSize * 2) return false;
    }
  }
  return true;
}

function classifyBlock(
  items: ExtractedItem[],
  profile: FontProfile,
  emphasisFonts?: Set<string>,
  boldFonts: Set<string> = new Set(),
): Block {
  const firstItem = items[0];
  // A footnote that opens with its raised label is body text, not a
  // numbered heading.
  if (items.length > 1 && isLineLabel(items[0], items[1])) return { items, type: "paragraph" };
  const allText = items.map((i) => i.str).join(" ").trim();
  const isShortLine = allText.length < 120;
  const hasNoTrailingPunctuation = !/[.,:;]$/.test(allText);
  // A numbered line ending in a connecting word ("1. When the work is created
  // … regular duties, or") is a list item, not a section heading.
  const endsInConnector = /\s(?:and|or|nor|of|the|a|an|to|in|for|by|with|as|that|which)$/.test(allText);

  // Check 1: Section numbering pattern (e.g., "1.1 Background", "II. REWARD-DRIVEN") → heading
  // Takes priority over font-size heading because numbering reliably indicates level.
  // Must come before list detection so "1. Introduction" isn't classified as a list item.
  const romanMatch = allText.match(/^(I{1,3}|IV|VI{0,3}|IX|X{0,3})\.\s+[A-Z]/);
  if (romanMatch && isShortLine && hasNoTrailingPunctuation && !endsInConnector) {
    return { items, type: "heading", headingLevel: 2, headingSource: "number" };
  }

  const sectionDotMatch = allText.match(/^(\d+\.(?:\d+\.?)*)\s+[A-Z]/);
  if (sectionDotMatch && isShortLine && hasNoTrailingPunctuation && !endsInConnector) {
    const dots = (sectionDotMatch[1].match(/\./g) ?? []).length;
    const level = Math.min(dots + 1, 6); // "1." → H2, "1.1" → H3, etc.
    return { items, type: "heading", headingLevel: level, headingSource: "number" };
  }
  // Also match bare "1 Introduction" style (no dot) — require bold or very short
  const sectionBareMatch = allText.match(/^(\d+)\s+[A-Z]/);
  if (sectionBareMatch && isShortLine && hasNoTrailingPunctuation && !endsInConnector && allText.length < 60) {
    return { items, type: "heading", headingLevel: 2, headingSource: "number" };
  }

  // Letter-dot pattern: "A. Value Functions", "B. Sampling" — common subsection style
  const letterDotMatch = allText.match(/^[A-Z]\.\s+[A-Z]/);
  if (letterDotMatch && isShortLine && hasNoTrailingPunctuation && !endsInConnector) {
    return { items, type: "heading", headingLevel: 3, headingSource: "number" };
  }

  // Check 2: Font size heading (largest font sizes are headings)
  // Guard: don't classify long blocks as headings — real headings are short
  // Guard: require at least one real word (3+ letters) or CJK char to filter diagram labels
  const headingLevel = getHeadingLevel(dominantSize(items), profile);
  const hasRealWord = /[a-zA-Z]{3,}/.test(allText) || /[\u3000-\u9FFF\uF900-\uFAFF]/.test(allText);
  if (headingLevel !== undefined && allText.length <= 150 && hasRealWord) {
    return { items, type: "heading", headingLevel, headingSource: "size" };
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
    return { items, type: "heading", headingLevel: isAllCaps ? 2 : 3, headingSource: "style" };
  }

  // Check 3a: one line in a real bold font (resolved from the PDF's font
  // name) at about body size. Smaller bold text is table headers and labels;
  // a wide gap between words is a table row, not a heading. Bold monospace
  // with code punctuation is code (a function signature), not a heading; a
  // bare command name ("git status") in a cheat sheet still is.
  const inCodeFont = items.some((i) => i.monospace === true) && /::|->|=>|<-|[=()]/.test(allText);
  if (
    boldFonts.size > 0 && !inCodeFont && items.every((i) => boldFonts.has(i.fontName)) &&
    isBoldHeadingLine(items, profile.bodySize) &&
    isShortLine && hasNoTrailingPunctuation && !looksLikeListItem && hasRealWord
  ) {
    const isAllCaps = allText === allText.toUpperCase() && allText !== allText.toLowerCase();
    return { items, type: "heading", headingLevel: isAllCaps ? 2 : 3, headingSource: "style" };
  }

  // Check 3b: Emphasis font (font-pair detection) on a short standalone line → heading
  // Catches bold headings in PDFs where font name doesn't contain "Bold" (subset fonts)
  if (
    emphasisFonts && emphasisFonts.size > 0 && !inCodeFont &&
    items.every((i) => emphasisFonts.has(i.fontName)) &&
    isBoldHeadingLine(items, profile.bodySize) &&
    isShortLine && hasNoTrailingPunctuation &&
    !looksLikeListItem && allText.length >= 2 && items.length <= 8
  ) {
    const isAllCapsEmph = allText === allText.toUpperCase() && allText !== allText.toLowerCase();
    return { items, type: "heading", headingLevel: isAllCapsEmph ? 2 : 3, headingSource: "style" };
  }

  // Check 4: ALL_CAPS short line → heading (independent of bold detection)
  // Catches headings in PDFs where font name doesn't contain "Bold" (subset fonts)
  // Guard: require at least one real word (3+ letters) to filter diagram labels like "C T"
  const isAllCaps = allText === allText.toUpperCase() && allText !== allText.toLowerCase();
  if (
    isAllCaps && allText.length >= 3 && allText.length <= 80 &&
    hasNoTrailingPunctuation && !looksLikeListItem && items.length <= 8 &&
    hasRealWord
  ) {
    return { items, type: "heading", headingLevel: 2, headingSource: "style" };
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

  // Bracketed-number reference: "[1] Author..." — common in bibliographies
  // Check both first item text and full block text (bracket may be separate item)
  const bracketNumMatch = text.match(BRACKET_NUM_PATTERN) ?? allText.match(BRACKET_NUM_PATTERN);
  if (bracketNumMatch) {
    return { items, type: "list-item", listMarker: `-` };
  }

  return { items, type: "paragraph" };
}

// ---------------------------------------------------------------------------
// Header/footer stripping (repeated text detection)
// ---------------------------------------------------------------------------

/** One copy of a repeated string in a band: its page and position. */
interface RepeatedPoint {
  page: number;
  x: number;
  y: number;
}

/**
 * Where a repeated header/footer string was seen: x positions per band, and
 * every copy's position (used for strings with no letters, see
 * `filterHeadersFooters`).
 */
interface RepeatedPlacement {
  top: number[];
  bottom: number[];
  topPoints: RepeatedPoint[];
  bottomPoints: RepeatedPoint[];
  /** Pages that must share a copy's position before a letterless copy is stripped. */
  minPagesAtPosition: number;
}

/** Share of a page's text extent treated as its header band and its footer band. */
const HEADER_FOOTER_BAND = 0.08;
/** Max x distance (pt) between a candidate and a recorded header/footer position. */
const HEADER_FOOTER_X_TOLERANCE = 36;
/**
 * Max y distance (pt) between two pages' copies of a repeat for them to sit
 * at the same height.
 */
const HEADER_FOOTER_Y_TOLERANCE = 2;
/**
 * A running header sits at one of a few fixed heights (odd and even pages,
 * landscape pages), each shared by several pages. A clause reference or
 * table cell that happens to open several pages sits at a different height
 * on most of them.
 */
const HEADER_FOOTER_MIN_SAME_HEIGHT = 3;
/**
 * A repeat whose copies nearly all sit at shared heights is a running header
 * even when it is on just under half the pages (a header on odd pages only,
 * plus the chapter title on the first page).
 */
const HEADER_FOOTER_SAME_HEIGHT_SHARE = 0.75;
/**
 * A string with no letters (a page number folds to "#") also matches the
 * footnote labels and table-of-contents page numbers that sit in the bands.
 * A copy of it is stripped where at least this share of the pages (and at
 * least HEADER_FOOTER_MIN_SAME_HEIGHT pages) have a copy at the same
 * position: a running page number recurs at one or two spots on most pages,
 * a TOC entry at a given spot on only a few. A copy on the page's first or
 * last line, or with no text beside it but running headers, is stripped
 * wherever it is: a running header whose title changes by chapter, a page
 * number set off its usual spot.
 */
const HEADER_FOOTER_LETTERLESS_PAGE_SHARE = 0.1;
/**
 * A letterless copy within this many font sizes of text on its line is a
 * label of that text (a footnote label, a contents entry's chapter number)
 * and is kept even where such labels recur: footnotes sit on a fixed grid.
 */
const HEADER_FOOTER_LABEL_GAP = 2;
/**
 * A letterless copy on a page's outermost line is kept as a contents entry's
 * page number when at least CONTENTS_COLUMN_MIN numbers within
 * CONTENTS_COLUMN_REACH font sizes inside the band end at its right edge.
 */
const CONTENTS_COLUMN_MIN = 2;
const CONTENTS_COLUMN_REACH = 5;
/** Text items whose baselines are this close (pt) form one line when looking for a label's text. */
const ANCHOR_LINE_Y_TOLERANCE = 1;
/** Lines checked on each side of a letterless copy's height when looking for its text. */
const ANCHOR_LINES_PER_SIDE = 4;
/** Text items read around a letterless copy before falling back to the line index. */
const ANCHOR_SCAN_BUDGET = 512;
/** Copies read around a letterless copy before falling back to per-cell page counts. */
const POSITION_SCAN_BUDGET = 512;

/**
 * How many of `ys` (one per page) have at least `minPages - 1` others within
 * `tolerance` of them.
 */
function pagesAtRecurringHeight(ys: number[], tolerance: number, minPages: number): number {
  const sorted = [...ys].sort((a, b) => a - b);
  let count = 0;
  let lo = 0;
  let hi = 0;
  for (let i = 0; i < sorted.length; i++) {
    while (sorted[i] - sorted[lo] > tolerance) lo++;
    if (hi < i) hi = i;
    while (hi + 1 < sorted.length && sorted[hi + 1] - sorted[i] <= tolerance) hi++;
    if (hi - lo + 1 >= minPages) count++;
  }
  return count;
}

function normalizeRepeatedText(text: string): string {
  // Page numbers and dates vary per page, so compare with digits folded.
  return text.trim().replace(/\d+/g, "#");
}

function groupByPage(items: ExtractedItem[]): Map<number, ExtractedItem[]> {
  const byPage = new Map<number, ExtractedItem[]>();
  for (const item of items) {
    const pageItems = byPage.get(item.page);
    if (pageItems) pageItems.push(item);
    else byPage.set(item.page, [item]);
  }
  return byPage;
}

/** Header and footer band limits for one page, from the extent of its text. */
function pageBands(pageItems: ExtractedItem[]): { top: number; bottom: number } | null {
  if (pageItems.length === 0) return null;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const item of pageItems) {
    minY = Math.min(minY, item.y);
    maxY = Math.max(maxY, item.y);
  }
  const extent = maxY - minY;
  if (extent <= 0) return null;
  return {
    top: minY + extent * HEADER_FOOTER_BAND,
    bottom: maxY - extent * HEADER_FOOTER_BAND,
  };
}

/**
 * Find text that repeats in the header band or footer band, at about the same
 * height, on at least half the pages. Returns, per digit-normalised string, the x positions where it
 * was seen in each band where it repeats, so stripping can stay inside that band.
 */
function detectRepeatedText(
  items: ExtractedItem[],
  totalPages: number,
): Map<string, RepeatedPlacement> {
  const repeated = new Map<string, RepeatedPlacement>();
  if (totalPages < 3) return repeated;

  // Per text: the x positions seen, one y per page it was seen on, and every copy.
  type Seen = { ys: number[]; xs: number[]; points: RepeatedPoint[] };
  const topSeen = new Map<string, Seen>();
  const bottomSeen = new Map<string, Seen>();

  for (const [page, pageItems] of groupByPage(items)) {
    const bands = pageBands(pageItems);
    if (!bands) continue;

    // Per text on this page: x positions, the y of the first occurrence, and every copy.
    type OnPage = { y: number; xs: number[]; points: RepeatedPoint[] };
    const topOnPage = new Map<string, OnPage>();
    const bottomOnPage = new Map<string, OnPage>();
    for (const item of pageItems) {
      const normalized = normalizeRepeatedText(item.str);
      if (normalized.length === 0) continue;
      for (const [inBand, onPage] of [
        [item.y <= bands.top, topOnPage],
        [item.y >= bands.bottom, bottomOnPage],
      ] as const) {
        if (!inBand) continue;
        const found = onPage.get(normalized) ?? { y: item.y, xs: [], points: [] };
        found.xs.push(item.x);
        found.points.push({ page, x: item.x, y: item.y });
        onPage.set(normalized, found);
      }
    }

    for (const [onPage, seen] of [[topOnPage, topSeen], [bottomOnPage, bottomSeen]] as const) {
      for (const [text, found] of onPage) {
        const entry = seen.get(text) ?? { ys: [], xs: [], points: [] };
        entry.ys.push(found.y);
        // Loops, not push(...spread): a page can hold more copies than the
        // engine accepts as call arguments.
        for (const x of found.xs) entry.xs.push(x);
        for (const point of found.points) entry.points.push(point);
        seen.set(text, entry);
      }
    }
  }

  // Text in the same band on >= 50% of pages is a running header/footer when
  // it sits at a height it shares with other pages on >= 50% of pages, or on
  // nearly every page where it appears.
  const threshold = totalPages * 0.5;
  const minSameHeight = Math.min(HEADER_FOOTER_MIN_SAME_HEIGHT, Math.ceil(threshold));
  const minPagesAtPosition = Math.max(
    minSameHeight,
    Math.ceil(totalPages * HEADER_FOOTER_LETTERLESS_PAGE_SHARE),
  );
  for (const [band, seen] of [["top", topSeen], ["bottom", bottomSeen]] as const) {
    for (const [text, entry] of seen) {
      if (entry.ys.length < threshold) continue;
      const sameHeight = pagesAtRecurringHeight(entry.ys, HEADER_FOOTER_Y_TOLERANCE, minSameHeight);
      if (sameHeight < threshold && sameHeight < entry.ys.length * HEADER_FOOTER_SAME_HEIGHT_SHARE) continue;
      const placement = repeated.get(text) ?? {
        top: [],
        bottom: [],
        topPoints: [],
        bottomPoints: [],
        minPagesAtPosition,
      };
      placement[band] = [...new Set(entry.xs.map((x) => Math.round(x)))];
      placement[band === "top" ? "topPoints" : "bottomPoints"] = entry.points;
      repeated.set(text, placement);
    }
  }

  return repeated;
}

/**
 * Remove running headers and footers: an item goes only if its digit-normalised
 * text repeats in that band, it lies inside the band on its own page, and its x
 * is near a position where the repeated text was seen. A standalone number in
 * the body (a year in a table, a TOC page number) therefore survives even
 * though page numbers normalise to the same "#".
 */
/** Number items on one line from which the line is a table row, not a page number. */
const TABLE_ROW_NUMBERS = 4;

function filterHeadersFooters(
  items: ExtractedItem[],
  repeated: Map<string, RepeatedPlacement>,
): ExtractedItem[] {
  if (repeated.size === 0) return items;

  const bandsByPage = new Map<number, { top: number; bottom: number } | null>();
  const extentByPage = new Map<number, { minY: number; maxY: number }>();
  const itemsByPage = groupByPage(items);
  for (const [page, pageItems] of itemsByPage) {
    bandsByPage.set(page, pageBands(pageItems));
    let minY = Infinity;
    let maxY = -Infinity;
    for (const it of pageItems) {
      minY = Math.min(minY, it.y);
      maxY = Math.max(maxY, it.y);
    }
    extentByPage.set(page, { minY, maxY });
  }

  /** First index in sorted `values` whose value is >= `target`. */
  const lowerBound = (values: number[], target: number) => {
    let lo = 0;
    let hi = values.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (values[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };
  // Recorded x positions per string and band, sorted once: a binary search
  // finds the nearest one.
  const sortedXs = new Map<number[], number[]>();
  const near = (xs: number[], x: number) => {
    let sorted = sortedXs.get(xs);
    if (!sorted) {
      sorted = [...xs].sort((a, b) => a - b);
      sortedXs.set(xs, sorted);
    }
    const i = lowerBound(sorted, x - HEADER_FOOTER_X_TOLERANCE);
    return i < sorted.length && sorted[i] <= x + HEADER_FOOTER_X_TOLERANCE;
  };

  // Pages with a copy within the x and y tolerances of this item's position
  // (its own page included). Copies are indexed once per string and band in
  // a grid of tolerance-sized cells, so only the 3 x 3 cells around the item
  // are read, and the scan stops once the answer is known (minPages pages).
  // A neighbourhood packed with more copies than POSITION_SCAN_BUDGET (only a
  // crafted PDF) is answered from per-cell page counts instead, so the cost
  // per item stays bounded.
  interface PositionIndex {
    cells: Map<string, RepeatedPoint[]>;
    cellPages: Map<string, Set<number>>;
  }
  const positionIndex = new Map<RepeatedPoint[], PositionIndex>();
  const cellKey = (cx: number, cy: number) => `${cx},${cy}`;
  const cellOf = (x: number, y: number) =>
    [Math.floor(x / HEADER_FOOTER_X_TOLERANCE), Math.floor(y / HEADER_FOOTER_Y_TOLERANCE)] as const;
  const pagesAtPosition = (points: RepeatedPoint[], item: ExtractedItem, minPages: number) => {
    let index = positionIndex.get(points);
    if (!index) {
      index = { cells: new Map(), cellPages: new Map() };
      for (const p of points) {
        const key = cellKey(...cellOf(p.x, p.y));
        const list = index.cells.get(key);
        if (list) list.push(p);
        else index.cells.set(key, [p]);
        const pages = index.cellPages.get(key) ?? new Set<number>();
        pages.add(p.page);
        index.cellPages.set(key, pages);
      }
      positionIndex.set(points, index);
    }
    const [cx, cy] = cellOf(item.x, item.y);
    const pages = new Set<number>();
    let scanned = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const p of index.cells.get(cellKey(cx + dx, cy + dy)) ?? []) {
          if (++scanned > POSITION_SCAN_BUDGET) {
            const approx = new Set<number>();
            for (let ax = -1; ax <= 1; ax++) {
              for (let ay = -1; ay <= 1; ay++) {
                for (const page of index.cellPages.get(cellKey(cx + ax, cy + ay)) ?? []) {
                  approx.add(page);
                  if (approx.size >= minPages) return approx.size;
                }
              }
            }
            return approx.size;
          }
          if (
            Math.abs(p.x - item.x) <= HEADER_FOOTER_X_TOLERANCE &&
            Math.abs(p.y - item.y) <= HEADER_FOOTER_Y_TOLERANCE
          ) {
            pages.add(p.page);
            if (pages.size >= minPages) return pages.size;
          }
        }
      }
    }
    return pages.size;
  };

  // Per page, the text with letters that is not itself a running header (the
  // title of a contents entry, the text of a footnote), normalised once and
  // sorted by y, plus the same items grouped into lines with their left and
  // right edges sorted.
  interface AnchorLine {
    minY: number;
    maxY: number;
    maxFontSize: number;
    lefts: number[];
    rights: number[];
  }
  interface PageAnchors {
    byY: ExtractedItem[];
    ys: number[];
    lines: AnchorLine[];
    maxFontSize: number;
  }
  const anchorsByPage = new Map<number, PageAnchors>();
  for (const [page, pageItems] of itemsByPage) {
    const byY = pageItems
      .filter((it) => /\p{L}/u.test(it.str) && !repeated.has(normalizeRepeatedText(it.str)))
      .sort((a, b) => a.y - b.y);
    const lines: AnchorLine[] = [];
    let maxFontSize = 0;
    for (const a of byY) {
      maxFontSize = Math.max(maxFontSize, a.fontSize);
      const last = lines[lines.length - 1];
      if (last && a.y - last.maxY <= ANCHOR_LINE_Y_TOLERANCE) {
        last.maxY = a.y;
        last.maxFontSize = Math.max(last.maxFontSize, a.fontSize);
        last.lefts.push(a.x);
        last.rights.push(a.x + a.width);
      } else {
        lines.push({ minY: a.y, maxY: a.y, maxFontSize: a.fontSize, lefts: [a.x], rights: [a.x + a.width] });
      }
    }
    for (const line of lines) {
      line.lefts.sort((a, b) => a - b);
      line.rights.sort((a, b) => a - b);
    }
    anchorsByPage.set(page, { byY, ys: byY.map((a) => a.y), lines, maxFontSize });
  }
  // Line-based answer for a crowded neighbourhood: the nearest edge on each
  // side by binary search in the few lines within reach of the item.
  const gapFromLines = (item: ExtractedItem, entry: PageAnchors, reach: number): number | undefined => {
    const right = item.x + item.width;
    let best: number | undefined;
    const consider = (line: AnchorLine) => {
      const dy = item.y < line.minY ? line.minY - item.y : item.y > line.maxY ? item.y - line.maxY : 0;
      if (dy > Math.max(line.maxFontSize, item.fontSize) * 0.6) return;
      const after = lowerBound(line.lefts, right);
      if (after < line.lefts.length) {
        const gap = line.lefts[after] - right;
        if (best === undefined || gap < best) best = gap;
      }
      const before = lowerBound(line.rights, item.x);
      const edge = before < line.rights.length && line.rights[before] === item.x ? item.x : line.rights[before - 1];
      if (edge !== undefined) {
        const gap = item.x - edge;
        if (best === undefined || gap < best) best = gap;
      }
    };
    const { lines } = entry;
    let lo = 0;
    let hi = lines.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (lines[mid].maxY < item.y) lo = mid + 1;
      else hi = mid;
    }
    for (let i = lo, n = 0; i < lines.length && n < ANCHOR_LINES_PER_SIDE && lines[i].minY - item.y <= reach; i++, n++) {
      consider(lines[i]);
    }
    for (let i = lo - 1, n = 0; i >= 0 && n < ANCHOR_LINES_PER_SIDE && item.y - lines[i].maxY <= reach; i--, n++) {
      consider(lines[i]);
    }
    return best;
  };
  // The smallest horizontal gap from the item to anchor text on its line
  // (beside it, not across it: a page number printed over a line does not
  // count), or undefined when there is none. A running page number has none
  // beside it, or only the running title. Reads only the anchors within
  // reach of the item's height; past ANCHOR_SCAN_BUDGET of them (a crafted
  // page) it answers from the lines instead.
  const gapToLineText = (item: ExtractedItem): number | undefined => {
    const entry = anchorsByPage.get(item.page);
    if (!entry || entry.byY.length === 0) return undefined;
    const reach = Math.max(entry.maxFontSize, item.fontSize) * 0.6;
    let best: number | undefined;
    let scanned = 0;
    for (let i = lowerBound(entry.ys, item.y - reach); i < entry.byY.length && entry.ys[i] <= item.y + reach; i++) {
      if (++scanned > ANCHOR_SCAN_BUDGET) return gapFromLines(item, entry, reach);
      const other = entry.byY[i];
      if (Math.abs(other.y - item.y) > Math.max(other.fontSize, item.fontSize) * 0.6) continue;
      const gap = Math.max(other.x - (item.x + item.width), item.x - (other.x + other.width));
      if (gap < 0) continue;
      if (best === undefined || gap < best) best = gap;
    }
    return best;
  };
  // On the page's first line (top band) or last line (bottom band).
  const onOutermostLine = (item: ExtractedItem, band: "top" | "bottom") => {
    const extent = extentByPage.get(item.page);
    if (!extent) return false;
    const edge = band === "top" ? extent.minY : extent.maxY;
    return Math.abs(item.y - edge) <= item.fontSize * 0.6;
  };
  // Per page, the y of every number item, sorted: a line with several of them
  // is a table row (the last row of a table printed sideways lands in the
  // footer band), not a page number.
  const numberYsByPage = new Map<number, number[]>();
  // Per page, the items that end in a number (a page number, or a contents
  // entry with its page number in the same run), sorted by y.
  const numberEndsByPage = new Map<number, { ys: number[]; items: ExtractedItem[] }>();
  for (const [page, pageItems] of itemsByPage) {
    numberYsByPage.set(
      page,
      pageItems.filter((it) => /\d/.test(it.str) && !/\p{L}/u.test(it.str)).map((it) => it.y).sort((a, b) => a - b),
    );
    const ends = pageItems.filter((it) => /\d\s*$/.test(it.str)).sort((a, b) => a.y - b.y);
    numberEndsByPage.set(page, { ys: ends.map((it) => it.y), items: ends });
  }
  const numbersOnLine = (item: ExtractedItem) => {
    const ys = numberYsByPage.get(item.page) ?? [];
    const reach = item.fontSize * 0.5;
    return lowerBound(ys, item.y + reach + 1e-9) - lowerBound(ys, item.y - reach);
  };
  // Text ending in a number on the lines just inside the band (above a
  // footer, below a header) whose right edge lines up with this one: the
  // page-number column of a contents page that runs to the page's edge.
  const alignedNumbersInward = (item: ExtractedItem, band: "top" | "bottom") => {
    const entry = numberEndsByPage.get(item.page);
    if (!entry) return 0;
    const reach = item.fontSize * CONTENTS_COLUMN_REACH;
    const [from, to] = band === "bottom"
      ? [item.y - reach, item.y - item.fontSize * 0.5]
      : [item.y + item.fontSize * 0.5, item.y + reach];
    const right = item.x + item.width;
    const tolerance = Math.max(1.5, item.fontSize * 0.2);
    let aligned = 0;
    const end = Math.min(entry.items.length, lowerBound(entry.ys, from) + POSITION_SCAN_BUDGET);
    for (let i = lowerBound(entry.ys, from); i < end && entry.ys[i] <= to; i++) {
      const other = entry.items[i];
      if (Math.abs(other.x + other.width - right) <= tolerance) aligned++;
    }
    return aligned;
  };
  const strip = (placement: RepeatedPlacement, letterless: boolean, band: "top" | "bottom", item: ExtractedItem) => {
    if (!near(placement[band], item.x)) return false;
    if (letterless && numbersOnLine(item) >= TABLE_ROW_NUMBERS) return false;
    if (!letterless) return true;
    if (onOutermostLine(item, band)) {
      // A contents entry on the page's last (or first) line: text beside it
      // and page numbers right-aligned with it on the lines inside.
      return !(gapToLineText(item) !== undefined && alignedNumbersInward(item, band) >= CONTENTS_COLUMN_MIN);
    }
    const gap = gapToLineText(item);
    // Set right against its text: a footnote label, a chapter number.
    if (gap !== undefined && gap <= item.fontSize * HEADER_FOOTER_LABEL_GAP) return false;
    const points = band === "top" ? placement.topPoints : placement.bottomPoints;
    return (
      pagesAtPosition(points, item, placement.minPagesAtPosition) >= placement.minPagesAtPosition ||
      gap === undefined
    );
  };

  return items.filter((item) => {
    const normalized = normalizeRepeatedText(item.str);
    const placement = repeated.get(normalized);
    if (!placement) return true;
    const bands = bandsByPage.get(item.page);
    if (!bands) return true;
    const letterless = !/\p{L}/u.test(normalized);
    if (item.y <= bands.top && strip(placement, letterless, "top", item)) return false;
    if (item.y >= bands.bottom && strip(placement, letterless, "bottom", item)) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Heading level normalization
// ---------------------------------------------------------------------------

/**
 * Join headings stacked on consecutive lines in the same font and size: a
 * heading wrapped onto a second line, or the lines of a loosely spaced
 * paragraph that were each taken for a heading (a sidebar set at 18 pt
 * leading). Three or more lines, or text that is long or ends a clause, is a
 * paragraph; otherwise it stays one heading.
 */
function joinStackedHeadings(blocks: Block[]): Block[] {
  const out: Block[] = [];
  const lines = new Map<Block, number>();
  for (const block of blocks) {
    const prev = out[out.length - 1];
    const last = prev?.items[prev.items.length - 1];
    const first = block.items[0];
    if (
      prev && last && first &&
      prev.type === "heading" && block.type === "heading" &&
      prev.headingSource !== "number" && block.headingSource === prev.headingSource &&
      first.page === last.page && first.fontName === last.fontName &&
      Math.abs(first.fontSize - last.fontSize) < 0.1 &&
      first.y - last.y > first.fontSize * 0.5 && first.y - last.y <= first.fontSize * 2 &&
      (Math.abs(first.x - prev.items[0].x) <= first.fontSize ||
        Math.abs(first.x + blockWidth(block) / 2 - (prev.items[0].x + blockWidth(prev) / 2)) <= first.fontSize)
    ) {
      const merged: Block = { ...prev, items: [...prev.items, ...block.items] };
      lines.set(merged, (lines.get(prev) ?? 1) + 1);
      out[out.length - 1] = merged;
      continue;
    }
    out.push(block);
  }
  for (const [block, count] of lines) {
    const text = blockRawText(block);
    if (count >= 3 || text.length > 120 || /[.,;:]$/.test(text)) {
      block.type = "paragraph";
      delete block.headingLevel;
      delete block.headingSource;
    }
  }
  return out;
}

/** Width of a block's first line, from its first item to the last item on that line. */
function blockWidth(block: Block): number {
  const first = block.items[0];
  if (!first) return 0;
  let right = first.x + first.width;
  for (const item of block.items) {
    if (Math.abs(item.y - first.y) <= first.fontSize * 0.5) right = Math.max(right, item.x + item.width);
  }
  return right - first.x;
}

/**
 * Re-rank the levels of headings found by font size or body-size style, after
 * the title is known:
 *
 * - Headings above the title on its page (a masthead such as "Weekly / Vol.
 *   73", a "CIRCULAR" label) become paragraphs: they are not part of the
 *   outline, and their size must not push the real sections a level down.
 * - Font-size headings take levels from the sizes actually used by headings
 *   (largest = H1, at most 4 levels), so a size used only by a masthead or by
 *   text that is not a heading takes no level. A size used by one heading
 *   only (other than the title) shares the level of the next smaller size.
 * - Body-size bold, emphasis-font and capitals headings go one level below
 *   the last font-size or numbered heading before them (the title at first),
 *   and one more under a heading of a larger style since then (larger size
 *   first, capitals over mixed case at one size) that at least two headings
 *   use: two tiers at most.
 *
 * Numbered headings ("1.2 Scope") keep their levels, and so does the title.
 */
function rankHeadingLevels(blocks: Block[]): void {
  const headings = blocks.filter((b) => b.type === "heading");
  const title = headings.find((b) => b.headingLevel === 1);
  const titlePage = title?.items[0]?.page;
  if (title && titlePage !== undefined && headings[0]?.items[0]?.page === titlePage) {
    for (const block of headings) {
      if (block === title) break;
      if (block.headingSource === "size" || block.headingSource === "style") {
        block.type = "paragraph";
        delete block.headingLevel;
        delete block.headingSource;
      }
    }
  }

  const ranked = blocks.filter((b) => b.type === "heading" && b !== title);
  const sizeOf = (b: Block) => Math.round((b.items[0]?.fontSize ?? 0) * 10) / 10;
  // A size takes a level of its own when two or more headings use it (or the
  // title does); a size used once shares the level of the next smaller one.
  const sizeCounts = new Map<number, number>();
  for (const b of ranked) {
    if (b.headingSource === "size") sizeCounts.set(sizeOf(b), (sizeCounts.get(sizeOf(b)) ?? 0) + 1);
  }
  const sizes = [...sizeCounts]
    .filter(([size, n]) => n >= 2 || (title?.headingSource === "size" && size === sizeOf(title)))
    .map(([size]) => size);
  if (title?.headingSource === "size" && !sizes.includes(sizeOf(title))) sizes.push(sizeOf(title));
  sizes.sort((a, b) => b - a);
  const sizeLevel = (size: number) => Math.min(4, sizes.filter((s) => s > size).length + 1);
  const isCaps = (b: Block) => {
    const text = blockRawText(b);
    return text === text.toUpperCase() && text !== text.toLowerCase();
  };
  // Body-size headings rank by size (to the half point), then capitals over
  // mixed case. A style used by one heading only is not a tier of its own.
  const styleKey = (b: Block) => Math.round((b.items[0]?.fontSize ?? 0) * 2) * 2 + (isCaps(b) ? 1 : 0);
  const keyCounts = new Map<number, number>();
  for (const b of ranked) {
    if (b.headingSource === "style") keyCounts.set(styleKey(b), (keyCounts.get(styleKey(b)) ?? 0) + 1);
  }
  const tiers = [...keyCounts].filter(([, n]) => n >= 2).map(([key]) => key);
  // The level of the last font-size or numbered heading (the title's at first).
  // Style tiers seen since that heading: a smaller style goes one level below
  // a larger one only when the larger one is there to nest under.
  let parent = 1;
  let seen: number[] = [];
  for (const block of blocks) {
    if (block.type !== "heading") continue;
    if (block === title) {
      parent = 1;
      seen = [];
    } else if (block.headingSource === "size") {
      block.headingLevel = sizeLevel(sizeOf(block));
      parent = block.headingLevel;
      seen = [];
    } else if (block.headingSource === "style") {
      const key = styleKey(block);
      block.headingLevel = Math.min(6, parent + 1 + (seen.some((t) => t > key) ? 1 : 0));
      if (tiers.includes(key)) seen.push(key);
    } else {
      parent = block.headingLevel ?? parent;
      seen = [];
    }
  }
}

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

const RUNNING_HEAD_MIN_PAGES = 3;
/** Running heads are set at body size or a little above; larger text is a title. */
const RUNNING_HEAD_MAX_SIZE = 1.2;
const ROMAN_PAGE_NUMBER = /^(?=[ivxlcdm])m{0,3}(?:cm|cd|d?c{0,3})(?:xc|xl|l?x{0,3})(?:ix|iv|v?i{0,3})$/;

/** Value of an arabic or lower-case roman page number, or undefined. */
function pageNumberValue(token: string): number | undefined {
  if (/^\d+$/.test(token)) return Number(token);
  if (!ROMAN_PAGE_NUMBER.test(token)) return undefined;
  const values: Record<string, number> = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 };
  let total = 0;
  for (let i = 0; i < token.length; i++) {
    const value = values[token[i] ?? ""] ?? 0;
    const next = values[token[i + 1] ?? ""] ?? 0;
    total += value < next ? -value : value;
  }
  return total;
}

/** A running head's text without a page number at either end, and that number. */
function splitPageNumber(text: string): { key: string; number?: number } {
  const lead = text.match(/^(\S+)\s+(.*\S)$/);
  const leadNumber = lead ? pageNumberValue(lead[1] ?? "") : undefined;
  if (lead && leadNumber !== undefined) return { key: lead[2] ?? "", number: leadNumber };
  const trail = text.match(/^(.*\S)\s+(\S+)$/);
  const trailNumber = trail ? pageNumberValue(trail[2] ?? "") : undefined;
  if (trail && trailNumber !== undefined) return { key: trail[1] ?? "", number: trailNumber };
  return { key: text };
}

type Candidate = { block: Block; text: string; number?: number };

/**
 * Demote running heads that were taken for headings. A chapter's running head
 * ("Chapter 3. Functions", "vi Chapter 0. Preface") repeats on that chapter's
 * pages only, too few for header stripping, and is often bold. A heading is
 * one when it is the outermost text of its page, inside the header or footer
 * band, at about body size, its text recurs at the same height on 3+ pages,
 * and most copies share their line with a page number (`allItems` still has
 * the page numbers that header stripping removed). A number at either end is
 * set aside only when it runs with the page: "Article 4" and "Article 12"
 * atop their pages are headings, not one running head.
 */
function demoteRunningHeads(blocks: Block[], profile: FontProfile, allItems: ExtractedItem[]): void {
  const pageNumbers = new Map<number, ExtractedItem[]>();
  for (const item of allItems) {
    if (pageNumberValue(item.str.trim()) === undefined) continue;
    const list = pageNumbers.get(item.page);
    if (list) list.push(item);
    else pageNumbers.set(item.page, [item]);
  }
  const numberedLine = ({ block, number }: Candidate): boolean => {
    const first = block.items[0];
    if (number !== undefined) return true;
    if (!first) return false;
    const reach = Math.max(first.height, first.fontSize) * 0.5;
    return (pageNumbers.get(first.page) ?? []).some((item) => Math.abs(item.y - first.y) <= reach);
  };
  const pageItems = new Map<number, ExtractedItem[]>();
  for (const block of blocks) {
    for (const item of block.items) {
      const list = pageItems.get(item.page);
      if (list) list.push(item);
      else pageItems.set(item.page, [item]);
    }
  }
  const bands = new Map<number, { top: number; bottom: number } | null>();
  for (const [page, items] of pageItems) bands.set(page, pageBands(items));

  /** In the header or footer band, with no other worded text on its line or beyond it. */
  const outermost = (block: Block): boolean => {
    const first = block.items[0];
    const band = first ? bands.get(first.page) : undefined;
    if (!first || !band) return false;
    const atTop = first.y <= band.top;
    if (!atTop && first.y < band.bottom) return false;
    const reach = Math.max(first.height, first.fontSize) * 0.5;
    const own = new Set(block.items);
    return !(pageItems.get(first.page) ?? []).some(
      (item) =>
        !own.has(item) &&
        hasLetter(item) &&
        (atTop ? item.y < first.y + reach : item.y > first.y - reach),
    );
  };

  const pageEnds = new Set<Block>();
  for (let i = 0; i < blocks.length; i++) {
    const page = blocks[i]?.items[0]?.page;
    if (page === undefined) continue;
    if (blocks[i - 1]?.items[0]?.page !== page) pageEnds.add(blocks[i] as Block);
    if (blocks[i + 1]?.items[0]?.page !== page) pageEnds.add(blocks[i] as Block);
  }
  const byKey = new Map<string, Candidate[]>();
  for (const block of pageEnds) {
    const first = block.items[0];
    if (block.type !== "heading" || block.toc || !first) continue;
    if (first.fontSize > profile.bodySize * RUNNING_HEAD_MAX_SIZE || !outermost(block)) continue;
    const text = block.items.map((i) => i.str).join(" ").replace(/\s+/g, " ").trim();
    const { key, number } = splitPageNumber(text);
    if (!/\p{L}/u.test(key)) continue;
    const group = byKey.get(key) ?? [];
    group.push({ block, text, number });
    byKey.set(key, group);
  }

  const demote = (group: Candidate[]): void => {
    const pages = new Set(group.map((c) => c.block.items[0]?.page));
    if (pages.size < RUNNING_HEAD_MIN_PAGES) return;
    if (group.filter(numberedLine).length * 2 < group.length) return;
    const ys = group.map((c) => c.block.items[0]?.y ?? 0);
    if (pagesAtRecurringHeight(ys, HEADER_FOOTER_Y_TOLERANCE, RUNNING_HEAD_MIN_PAGES) < RUNNING_HEAD_MIN_PAGES) return;
    for (const { block } of group) {
      block.type = "paragraph";
      block.headingLevel = undefined;
    }
  };
  for (const group of byKey.values()) {
    // Page numbers keep one offset from the page index; other numbers
    // ("Article 4", "Article 12") are part of the text.
    const offsets = new Set(
      group.filter((c) => c.number !== undefined).map((c) => (c.number ?? 0) - (c.block.items[0]?.page ?? 0)),
    );
    if (offsets.size <= 1) {
      demote(group);
      continue;
    }
    const byText = new Map<string, Candidate[]>();
    for (const candidate of group) {
      const same = byText.get(candidate.text);
      if (same) same.push(candidate);
      else byText.set(candidate.text, [candidate]);
    }
    for (const same of byText.values()) demote(same);
  }
}

// ---------------------------------------------------------------------------
// Merge consecutive very short blocks (diagram labels, formula fragments)
// ---------------------------------------------------------------------------

/**
 * Merge consecutive very short blocks on the same page into a single paragraph.
 * Diagram labels, formula fragments, and figure annotations often produce many
 * tiny blocks (1-3 chars each) that clutter the output as separate paragraphs or
 * false headings.
 *
 * Merges runs of 3+ consecutive blocks where ALL are ≤5 chars into one paragraph.
 */
function mergeShortBlocks(blocks: Block[]): Block[] {
  const result: Block[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const blockText = block.items.map((it) => it.str).join(" ").trim();

    // Check if this starts a run of very short blocks on the same page
    if (blockText.length <= 5) {
      let runEnd = i + 1;
      while (runEnd < blocks.length) {
        const nextText = blocks[runEnd].items.map((it) => it.str).join(" ").trim();
        const samePage = blocks[runEnd].items[0]?.page === block.items[0]?.page;
        if (nextText.length <= 5 && samePage) {
          runEnd++;
        } else {
          break;
        }
      }

      // If 3+ consecutive short blocks, merge them into one paragraph
      if (runEnd - i >= 3) {
        const mergedItems: ExtractedItem[] = [];
        for (let j = i; j < runEnd; j++) {
          mergedItems.push(...blocks[j].items);
        }
        result.push({ items: mergedItems, type: "paragraph" });
        i = runEnd;
        continue;
      }
    }

    result.push(block);
    i++;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Broken headings and table-of-contents blocks
// ---------------------------------------------------------------------------

function blockRawText(block: Block): string {
  return block.items.map((item) => item.str).join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Join a heading that ends in a hyphenated line break (`… Sentence Em-`) with
 * the block that continues it (`beddings and Dense Retrieval`). Two heading
 * fragments stay one heading; a heading fragment joined to body text was a
 * wrapped body line, so the result is a paragraph. A heading that still ends
 * in a hyphen afterwards is not a heading (a wrapped line or a table row).
 */
function joinBrokenHeadings(blocks: Block[]): Block[] {
  const out: Block[] = [];
  for (const block of blocks) {
    const prev = out[out.length - 1];
    if (
      prev &&
      (prev.type === "heading" || block.type === "heading") &&
      prev.items[0]?.page === block.items[0]?.page &&
      /\p{L}-$/u.test(blockRawText(prev)) &&
      /^\p{Ll}/u.test(blockRawText(block))
    ) {
      const items = [...prev.items, ...block.items];
      if (prev.type === "heading" && block.type === "heading") {
        out[out.length - 1] = { ...prev, items };
      } else if (prev.type === "heading") {
        out[out.length - 1] = { items, type: "paragraph" };
      } else {
        out[out.length - 1] = { ...prev, items };
      }
      continue;
    }
    out.push(block);
  }
  for (const block of out) {
    if (block.type === "heading" && /-$/.test(blockRawText(block))) {
      block.type = "paragraph";
      delete block.headingLevel;
    }
  }
  return out;
}

/** Section-number start of a TOC title: `3 `, `2.5.4 `, `A.1 `, `IV. `. */
const TOC_NUMBERED_TITLE = /^(?:\d+|[A-Z]|[IVX]+)(?:\.\d+)*\.?\s/;

/**
 * Mark table-of-contents blocks: text made of `title . . . . page` entries.
 * They become list items (`- 1.1 Dense Retrieval — 17`) instead of headings
 * or paragraphs full of dots.
 *
 * Next to a leader entry on the same page, a short `title page` line with no
 * leader (a chapter entry such as `1 Introduction 17`) counts too. A short
 * block between two TOC blocks is the first line of a wrapped entry, or an
 * entry whose page number is missing; it is joined to the entry after it
 * when it plainly starts that entry, and otherwise kept as its own item.
 */
function markTocBlocks(blocks: Block[]): Block[] {
  const textual = (b: Block) =>
    b.type === "paragraph" || b.type === "heading" || b.type === "list-item";
  const samePage = (a: Block | undefined, b: Block | undefined) =>
    a !== undefined && b !== undefined && a.items[0]?.page === b.items[0]?.page;
  const isToc = blocks.map((b) => textual(b) && parseTocEntries(blockRawText(b)) !== null);
  const leaderToc = [...isToc];
  blocks.forEach((block, i) => {
    if (isToc[i] || !textual(block) || !parseTrailingPageEntry(blockRawText(block))) return;
    isToc[i] = [i - 1, i + 1].some((j) => leaderToc[j] === true && samePage(blocks[j], block));
  });

  const out: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const next = blocks[i + 1];
    const between =
      !isToc[i] && textual(block) && isToc[i - 1] === true && isToc[i + 1] === true &&
      samePage(blocks[i - 1], block) && samePage(block, next) &&
      blockRawText(block).length <= 200;
    if (between && next) {
      const text = blockRawText(block);
      const startsEntry =
        /(?:[.\u00B7\u2026][ \t]?){8,}$/.test(text) ||
        (TOC_NUMBERED_TITLE.test(text) && !TOC_NUMBERED_TITLE.test(blockRawText(next)));
      if (startsEntry) {
        blocks[i + 1] = { ...next, items: [...block.items, ...next.items] };
        continue;
      }
      isToc[i] = true;
    }
    if (isToc[i]) {
      block.type = "list-item";
      block.listMarker = "-";
      block.toc = true;
      delete block.headingLevel;
    }
    out.push(block);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Table & code block post-processing
// ---------------------------------------------------------------------------

/** Smallest gap between two runs of a line, as a share of the font size, that separates table cells. */
const ROW_CELL_GAP = 1.5;
/** Largest baseline distance between table rows set apart, as a share of the font size. */
const ROW_MAX_PITCH = 3;
/** Fewest rows set apart that are tried as one table. */
const ROW_RUN_MIN = 3;
/**
 * Most lines in a run tried as one table. A failed run is tried again from
 * its next line, so a longer run (more lines than any real page holds) would
 * cost a table detection per line over the whole run: it stays as text.
 */
const ROW_RUN_MAX = 150;

/** A cell ending in a word broken at the line end (`secre-`): prose, not a table cell. */
const BROKEN_WORD_END = /\p{Ll}-$/u;

/** A line of a text column is at least this share of the column's longest line. */
const PROSE_LINE_SHARE = 0.7;
/** Share of a text column's lines (the last aside) that run near its full width. */
const PROSE_FULL_LINES = 0.75;
/** Fewest characters in the longest line of a text column. */
const PROSE_LINE_MIN = 25;

/**
 * True when a column's cells read as the lines of a text column: 3 or more
 * lines, the longest of them long, and most lines but the last close to it
 * in length (ragged right, so not all).
 */
function isTextColumn(cells: string[]): boolean {
  const filled = cells.filter((cell) => cell !== "");
  if (filled.length < 3) return false;
  const longest = Math.max(...filled.map((cell) => cell.length));
  if (longest < PROSE_LINE_MIN) return false;
  const lines = filled.slice(0, -1);
  const full = lines.filter((cell) => cell.length >= longest * PROSE_LINE_SHARE).length;
  return full >= lines.length * PROSE_FULL_LINES;
}

/** The number of cells (runs set apart by a wide gap) when `block` is one line, else 0. */
function lineCellCount(block: Block): number {
  if (block.type !== "paragraph" || block.toc) return 0;
  const items = block.items.filter((item) => item.str.trim() !== "");
  const first = items[0];
  if (!first) return 0;
  if (items.some((item) => Math.abs(item.y - first.y) > first.fontSize * 0.5)) return 0;
  const byX = [...items].sort((a, b) => a.x - b.x);
  let cells = 1;
  for (let i = 1; i < byX.length; i++) {
    const prev = byX[i - 1] as ExtractedItem;
    if ((byX[i] as ExtractedItem).x - (prev.x + prev.width) > first.fontSize * ROW_CELL_GAP) cells++;
  }
  return cells;
}

/**
 * Join table rows that arrive one block each. Rows set further apart than
 * lines of text (NIST's Table 1, with padded cells) are grouped as separate
 * one-line paragraphs, and a table needs at least two rows. A run of 3+
 * one-line blocks on a page, each with 2+ cells, close together, becomes one
 * block when its items form a table that keeps every row. Lines with a link
 * stay apart: table cells are plain text and would drop it.
 */
export function joinTableRowBlocks(blocks: Block[], linkMap: ReadonlyMap<ExtractedItem, string> = new Map()): Block[] {
  const out: Block[] = [];
  let i = 0;
  while (i < blocks.length) {
    const start = blocks[i] as Block;
    let end = i + 1;
    const rowLine = (block: Block): boolean =>
      lineCellCount(block) >= 2 && !block.items.some((item) => linkMap.has(item));
    if (rowLine(start)) {
      while (end < blocks.length) {
        const prev = blocks[end - 1]?.items[0];
        const next = blocks[end] as Block;
        const first = next.items[0];
        if (!prev || !first || first.page !== prev.page || !rowLine(next)) break;
        const pitch = first.y - prev.y;
        if (pitch <= 0 || pitch > prev.fontSize * ROW_MAX_PITCH) break;
        end++;
      }
    }
    if (end - i > ROW_RUN_MAX) {
      out.push(...blocks.slice(i, end));
      i = end;
      continue;
    }
    const run = blocks.slice(i, end);
    if (run.length >= ROW_RUN_MIN) {
      const items = run.flatMap((b) => b.items);
      const rows = detectTable(items, { joinScripts: true });
      // Each row must fill one cell per part of its line, and each column
      // must show as a wide gap on some line: otherwise the table split words
      // (subscripts, spaced letters, code) or ran lines of prose together.
      const widest = Math.max(...run.map(lineCellCount));
      const rowsFit = rows?.every((cells, r) => cells.filter((c) => c !== "").length === lineCellCount(run[r] as Block));
      const prose =
        rows?.some((cells) => cells.some((cell) => BROKEN_WORD_END.test(cell))) ||
        // Columns of text (every column long lines of even length) are prose;
        // a table has a column of short cells: ids, numbers, names.
        rows?.[0]?.every((_, col) => isTextColumn(rows.map((cells) => cells[col] ?? "")));
      if (rows && rows.length === run.length && rowsFit && !prose && (rows[0]?.length ?? 0) <= widest) {
        out.push({ items, type: "table", tableRows: rows });
        i = end;
        continue;
      }
    }
    out.push(start);
    i++;
  }
  return out;
}

/**
 * Post-process blocks: detect tables and code blocks in paragraph blocks.
 */
function detectTablesAndCode(
  blocks: Block[],
  codeFonts: Set<string>,
  linkMap: ReadonlyMap<ExtractedItem, string> = new Map(),
): Block[] {
  const detected = joinTableRowBlocks(blocks, linkMap).map((block) => {
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
  return joinSplitTables(detected);
}

/**
 * Join back-to-back tables on one page that the block grouper split at a
 * larger vertical gap. They are joined only when their columns line up: the
 * combined items must form one table that keeps every row of both.
 */
function joinSplitTables(blocks: Block[]): Block[] {
  const out: Block[] = [];
  for (const block of blocks) {
    const prev = out[out.length - 1];
    const prevRows = prev?.tableRows;
    const rows = block.tableRows;
    if (
      prev?.type === "table" &&
      block.type === "table" &&
      prevRows && rows &&
      prevRows[0]?.length === rows[0]?.length &&
      prev.items[0]?.page === block.items[0]?.page
    ) {
      const items = [...prev.items, ...block.items];
      const joined = detectTable(items);
      if (joined && joined.length === prevRows.length + rows.length && joined[0]?.length === rows[0]?.length) {
        out[out.length - 1] = { ...prev, items, tableRows: joined };
        continue;
      }
    }
    out.push(block);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Link matching
// ---------------------------------------------------------------------------

/** True when the text has no letters or digits (punctuation, math symbols). */
function isSymbolOnly(text: string): boolean {
  return !/[\p{L}\p{N}]/u.test(text);
}

/**
 * Match link annotations to the text items they cover, on the same page only.
 *
 * `item.y` is the baseline in top-down coordinates, so the glyph box runs from
 * `y - height` to `y`. An item matches a link when its centre lies in the link
 * rectangle or when it overlaps the rectangle by more than 50% in both
 * dimensions. Items that are only punctuation or symbols match only when they
 * fill most of the rectangle, so a link never wraps a stray `(` or `=`.
 */
function matchLinksToText(
  items: ExtractedItem[],
  links: AnnotationLink[],
): Map<ExtractedItem, string> {
  const linkMap = new Map<ExtractedItem, string>();
  if (links.length === 0) return linkMap;

  const linksByPage = new Map<number, AnnotationLink[]>();
  for (const link of links) {
    const pageLinks = linksByPage.get(link.page);
    if (pageLinks) pageLinks.push(link);
    else linksByPage.set(link.page, [link]);
  }

  for (const item of items) {
    const pageLinks = linksByPage.get(item.page);
    if (!pageLinks) continue;

    const top = item.y - item.height;
    const bottom = item.y;
    const centerX = item.x + item.width / 2;
    const centerY = item.y - item.height / 2;
    const symbolOnly = isSymbolOnly(item.str);

    for (const link of pageLinks) {
      const [lx1, ly1, lx2, ly2] = link.rect;

      if (symbolOnly) {
        const linkWidth = lx2 - lx1;
        if (linkWidth <= 0 || item.width < linkWidth * 0.8) continue;
      }

      // Method 1: centre-point containment
      if (centerX >= lx1 && centerX <= lx2 && centerY >= ly1 && centerY <= ly2) {
        linkMap.set(item, link.url);
        break;
      }

      // Method 2: high overlap (>50% in both dimensions)
      if (item.width > 0 && item.height > 0) {
        const overlapWidth = Math.max(0, Math.min(item.x + item.width, lx2) - Math.max(item.x, lx1));
        const overlapHeight = Math.max(0, Math.min(bottom, ly2) - Math.max(top, ly1));
        if (overlapWidth / item.width > 0.5 && overlapHeight / item.height > 0.5) {
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

/**
 * Leading text kept outside emphasis markers: list markers, punctuation and
 * dashes left over from the previous text, opening brackets and quotes. A
 * marker next to punctuation can fail to open (`2*-group*`), so it goes after.
 */
const EMPHASIS_LEAD =
  /^\s*(?:(?:[-\u2013\u2014\u2022\u00B7\u25AA\u25A0\u25E6\u25BA\u25B8\u25B6\u25C6\u25C7\u25A1\u25CF\u25CB]|\d{1,3}[.)]|\[\d{1,3}\]|[a-zA-Z][.)])\s+)?[.,;:!?)\]\u2013\u2014-]*\s*[(\[\u201C\u2018"']*/;
/**
 * Trailing text kept outside emphasis markers: punctuation, dashes, brackets
 * and quotes (an opening bracket at the end of a run belongs to what follows).
 */
const EMPHASIS_TRAIL_CHAR = /[\s.,;:!?()[\]\u201C\u201D\u2018\u2019"'\u2013\u2014-]/;

/**
 * Length of the trailing run of EMPHASIS_TRAIL_CHAR characters. A backward
 * scan, because an unanchored `[...]*$` regex is quadratic on long runs of
 * punctuation followed by a letter (a crafted PDF could stall conversion).
 */
function trailLength(text: string): number {
  let i = text.length;
  while (i > 0 && EMPHASIS_TRAIL_CHAR.test(text[i - 1] ?? "")) i--;
  return text.length - i;
}
const INLINE_BULLET_CHAR = /[•\u2022\u2023\u25E6\u2043\u2219\u25CF\u25CB\u25B6\u25B8\u25BA►▸▶]/;

// CommonMark's delimiter-run rules decide whether a `*` run can open or close
// emphasis from the characters on either side of it. "Punctuation" there is
// ASCII punctuation plus Unicode P (spec <= 0.30) or P and S (0.31+, e.g.
// markdown-it 14). To render under either reading, a neighbour counts as
// punctuation when it would block a marker under some version (`LOOSE`), and
// as punctuation when it would rescue a marker only under every version (`STRICT`).
const STRICT_PUNCT = /[\p{P}!-/:-@[-`{-~]/u;
const LOOSE_PUNCT = /[\p{P}\p{S}]/u;
const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

/** Whitespace for flanking purposes; "" stands for the start or end of the line. */
function isFlankSpace(ch: string): boolean {
  return ch === "" || /\s/u.test(ch);
}

/** A `*` run with `prev` before it and `next` after it can open emphasis (is left-flanking). */
function canOpen(prev: string, next: string): boolean {
  return !isFlankSpace(next) && (!LOOSE_PUNCT.test(next) || isFlankSpace(prev) || STRICT_PUNCT.test(prev));
}

/** A `*` run with `prev` before it and `next` after it can close emphasis (is right-flanking). */
function canClose(prev: string, next: string): boolean {
  return !isFlankSpace(prev) && (!LOOSE_PUNCT.test(prev) || isFlankSpace(next) || STRICT_PUNCT.test(next));
}

/**
 * The character before `end` in `text`, skipping `*`: adjacent markers merge
 * into one delimiter run, whose flanking depends on what lies outside it.
 */
function charBefore(text: string, end = text.length): string {
  let i = end;
  while (i > 0 && text[i - 1] === "*") i--;
  return i > 0 ? (text[i - 1] ?? "") : "";
}

/**
 * Whether a marker placed at `end` in `text` follows a `\`, which can escape
 * it. (Only an odd run of `\` escapes, but checking one character keeps the
 * scans in `emphasize` linear.)
 */
function afterBackslash(text: string, end = text.length): boolean {
  return end > 0 && text[end - 1] === "\\";
}

/** The character at or after `start` in `text`, skipping `*`. */
function charAfter(text: string, start = 0): string {
  let i = start;
  while (i < text.length && text[i] === "*") i++;
  return text[i] ?? "";
}

/**
 * Wrap a run of same-style text in `marker`, keeping surrounding whitespace,
 * list markers, opening brackets and trailing punctuation outside, so the
 * result is `(**primitive services**).`, never `**primitive services.**`.
 *
 * `before` and `after` are the text just outside the run on its line ("" at
 * the line's start or end). Each marker must be able to open or close
 * emphasis under CommonMark's flanking rules given its neighbours, or a
 * renderer shows it as a literal `*` (`z**’s are**`, `*let {*a`). A marker
 * that cannot is moved inward past punctuation and spaces (`z’**s are**`,
 * `*let* {a`); if the run then has fewer than two letters, it is left plain.
 * A marker right after a literal `\` would be escaped, so it moves the same way.
 * Runs that contain an inline bullet are also left plain.
 */
export function emphasize(text: string, marker: string, before = "", after = ""): string {
  let lead = text.match(EMPHASIS_LEAD)?.[0] ?? "";
  const rest = text.slice(lead.length);
  let trail = rest.slice(rest.length - trailLength(rest));
  let core = rest.slice(0, rest.length - trail.length);

  // Move the opener right past non-alphanumerics until it is left-flanking.
  let start = 0;
  while (
    start < core.length &&
    core[start] !== "*" &&
    !LETTER_OR_DIGIT.test(core[start] ?? "") &&
    !(
      canOpen(start > 0 ? (core[start - 1] ?? "") : charBefore(before + lead), charAfter(core, start)) &&
      !(start > 0 ? afterBackslash(core, start) : afterBackslash(before + lead))
    )
  ) {
    start++;
  }
  // Move the closer left past non-alphanumerics until it is right-flanking.
  let end = core.length;
  while (
    end > start &&
    core[end - 1] !== "*" &&
    !LETTER_OR_DIGIT.test(core[end - 1] ?? "") &&
    !(
      canClose(charBefore(core, end), end < core.length ? (core[end] ?? "") : charAfter(trail + after)) &&
      !afterBackslash(core, end)
    )
  ) {
    end--;
  }
  lead += core.slice(0, start);
  trail = core.slice(end) + trail;
  core = core.slice(start, end);

  if (!/\p{L}[\s\S]*\p{L}/u.test(core) || INLINE_BULLET_CHAR.test(core)) {
    return text;
  }
  if (
    !canOpen(charBefore(before + lead), charAfter(core)) ||
    !canClose(charBefore(core), charAfter(trail + after)) ||
    afterBackslash(before + lead) ||
    afterBackslash(core)
  ) {
    return text;
  }
  return `${lead}${marker}${core}${marker}${trail}`;
}

/** Items count toward a block's style only if they contain a letter. */
function hasLetter(item: ExtractedItem): boolean {
  return /\p{L}/u.test(item.str);
}

interface StyledRun {
  text: string;
  bold: boolean;
  italic: boolean;
  url?: string;
  /** Separator before this run. */
  sep: string;
}

/**
 * Render consecutive runs (one link or none) with nested emphasis. A stretch
 * of bold runs is one `**…**` and a stretch of italic runs one `*…*`; where
 * they overlap, the longer stretch is the outer span, so the output is
 * `**Key *term* here**` or `*Rules (**ICC Rules**)*`, never a span closed and
 * reopened (`***term*** **here**`). Partly overlapping stretches split where
 * the inner style continues: `*Amount* ***E-file* options**`. Stretches
 * containing a literal `*` are left plain.
 */
function renderRuns(runs: StyledRun[], before = "", after = ""): string {
  let out = "";
  for (let i = 0; i < runs.length; ) {
    const run = runs[i];
    if (!run.bold && !run.italic) {
      out += run.sep + run.text;
      i++;
      continue;
    }
    let boldEnd = i;
    while (boldEnd < runs.length && runs[boldEnd].bold) boldEnd++;
    let italicEnd = i;
    while (italicEnd < runs.length && runs[italicEnd].italic) italicEnd++;
    const outerBold = boldEnd - i >= italicEnd - i;
    let end = outerBold ? boldEnd : italicEnd;
    // If the inner style runs on past the outer stretch, end the outer span
    // before it, so the inner style can be one span of its own.
    const isInner = (r: StyledRun) => (outerBold ? r.italic : r.bold);
    if (end < runs.length && isInner(runs[end])) {
      while (end - 1 > i && isInner(runs[end - 1])) end--;
    }
    const stretch = runs.slice(i, end);
    // The text on either side of the stretch, which decides whether its
    // markers can open and close (see `emphasize`).
    const stretchBefore = (before + out + run.sep).slice(-8);
    const stretchAfter = textAfter(runs, end, after);
    const inner = renderRuns(
      stretch.map((r, k) => ({
        ...r,
        sep: k === 0 ? "" : r.sep,
        bold: outerBold ? false : r.bold,
        italic: outerBold ? r.italic : false,
      })),
      stretchBefore,
      stretchAfter,
    );
    const literalStar = stretch.some((r) => r.text.includes("*"));
    out +=
      run.sep +
      (literalStar ? inner : emphasize(inner, outerBold ? "**" : "*", stretchBefore, stretchAfter));
    i = end;
  }
  return out;
}

/** The first few characters of raw text from `runs[from]` on, then `after`. */
function textAfter(runs: StyledRun[], from: number, after: string): string {
  let text = "";
  for (let k = from; k < runs.length && text.replace(/\*/g, "").length < 8; k++) {
    text += runs[k].sep + runs[k].text;
  }
  return (text + after).slice(0, 64);
}

// ---------------------------------------------------------------------------
// Markdown assembly
// ---------------------------------------------------------------------------

/** Horizontal gap, as a share of font size, below which two runs on a line touch. */
const TOUCHING_GAP = 0.15;
/** Overlap, as a share of font size, still treated as touching (kerning, overprint). */
const TOUCHING_OVERLAP = 0.25;

/**
 * The separator to put between two consecutive items of a block. Runs on the
 * same line that touch (e.g. "services" and "." drawn separately, or a word
 * split by a font change) are joined with nothing; everything else gets a space.
 */
function separatorBetween(prev: ExtractedItem, next: ExtractedItem): string {
  if (/\s$/.test(prev.str) || /^\s/.test(next.str)) return "";
  if (prev.hasEOL || prev.spaceAfter || prev.width <= 0) return " ";
  const sameLine = Math.abs(next.y - prev.y) < Math.max(prev.height, 1) * 0.5;
  if (!sameLine) return " ";
  const size = Math.max(Math.min(prev.fontSize, next.fontSize), 1);
  const gap = next.x - (prev.x + prev.width);
  return gap > -size * TOUCHING_OVERLAP && gap < size * TOUCHING_GAP ? "" : " ";
}

function assembleBlockText(
  block: Block,
  linkMap: Map<ExtractedItem, string>,
): string {
  // Items are joined with a space unless they touch on the same line.
  // Consecutive items with the same style form one emphasis run, and
  // consecutive runs that share a link URL form one `[text](url)`, so the
  // output is `**primitive services**`, never `**primitive** **services**`.
  // Headings get no emphasis, and a block that is bold throughout (a bold
  // line that is not a heading) gets no bold.
  const allowEmphasis = block.type !== "heading" && !block.toc;
  const lettered = block.items.filter(hasLetter);
  const allowBold = allowEmphasis && !lettered.every((item) => item.bold === true);

  const runs: StyledRun[] = [];
  let prevItem: ExtractedItem | null = null;
  for (const item of block.items) {
    const bold = allowBold && item.bold === true;
    const italic = allowEmphasis && item.italic === true;
    const url = linkMap.get(item);
    const sep = prevItem ? separatorBetween(prevItem, item) : "";
    prevItem = item;
    const last = runs[runs.length - 1];
    // Punctuation and symbols join the current run rather than splitting it.
    const sameRun =
      last &&
      last.url === url &&
      ((last.bold === bold && last.italic === italic) || !/[\p{L}\p{N}]/u.test(item.str));
    if (sameRun) {
      last.text += sep + item.str;
    } else {
      runs.push({ text: item.str, bold, italic, url, sep });
    }
  }

  // Group runs by link, then render each group with nested emphasis.
  let out = "";
  for (let i = 0; i < runs.length; ) {
    let j = i + 1;
    while (j < runs.length && runs[j].url === runs[i].url) j++;
    const group = runs.slice(i, j);
    const url = runs[i].url;
    if (url) {
      // Inside a link, the markers' outer neighbours are its brackets.
      const text = renderRuns([{ ...group[0], sep: "" }, ...group.slice(1)], "[", "]");
      out += runs[i].sep + `[${text.trim()}](${url})`;
    } else {
      // A following link starts with "[" (its separator comes first).
      const next = runs[j];
      const after = next ? (next.url ? next.sep + "[" : textAfter(runs, j, "")) : "";
      out += renderRuns(group, out.slice(-8), after);
    }
    i = j;
  }
  return out.trim();
}

function codeBlockToMarkdown(
  block: Block,
  linkMap: Map<ExtractedItem, string>,
): string {
  // Assemble raw text preserving line breaks, without inline formatting
  const lines: string[] = [];
  let currentLine = "";
  let prevItem: ExtractedItem | null = null;

  for (const item of block.items) {
    if (prevItem) {
      const yGap = Math.abs(item.y - prevItem.y);
      const isNewLine = yGap > prevItem.height * 0.5 || prevItem.hasEOL;
      if (isNewLine) {
        lines.push(currentLine);
        currentLine = item.str;
      } else {
        currentLine += separatorBetween(prevItem, item) + item.str;
      }
    } else {
      currentLine = item.str;
    }
    prevItem = item;
  }
  if (prevItem) {
    lines.push(currentLine);
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
            parts.push(listItemToMarkdown(block, text));
            break;
          }
          case "paragraph": {
            // Split paragraphs with inline bullet characters into list items
            const plain = collapseLeaders(text);
            parts.push(splitInlineBullets(plain) ?? plain);
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

/** Markdown for each selected page; a block belongs to the page of its first item. */
function pagesToMarkdown(
  blocks: Block[],
  linkMap: Map<ExtractedItem, string>,
  pageNumbers: number[],
): PageMarkdown[] {
  const byPage = new Map<number, Block[]>();
  for (const block of blocks) {
    const page = block.items[0]?.page;
    if (page === undefined) continue;
    const pageBlocks = byPage.get(page) ?? [];
    pageBlocks.push(block);
    byPage.set(page, pageBlocks);
  }
  return pageNumbers.map((pageNumber) => ({
    pageNumber,
    markdown: normalizeMarkdownFragment(blocksToMarkdown(byPage.get(pageNumber) ?? [], linkMap)),
  }));
}

/** Join page Markdown with a blank line; `"comment"` adds a `<!-- page N -->` marker per page. */
function joinPages(pages: PageMarkdown[], markers: "none" | "comment"): string {
  if (markers === "none") {
    return pages.map((p) => p.markdown).filter(Boolean).join("\n\n");
  }
  return pages
    .map((p) => (p.markdown ? `<!-- page ${p.pageNumber} -->\n\n${p.markdown}` : `<!-- page ${p.pageNumber} -->`))
    .join("\n\n");
}

function blockToMarkdown(
  block: Block,
  linkMap: Map<ExtractedItem, string>,
): string {
  if (block.type === "table") {
    return block.tableRows && block.tableRows.length > 0
      ? normalizeMarkdownFragment(tableToMarkdown(block.tableRows))
      : "";
  }

  if (block.type === "code-block") {
    return normalizeMarkdownFragment(codeBlockToMarkdown(block, linkMap));
  }

  const text = assembleBlockText(block, linkMap);
  if (text.length === 0) return "";

  if (block.type === "heading") {
    const prefix = "#".repeat(block.headingLevel ?? 1);
    return normalizeMarkdownFragment(`${prefix} ${text.replace(/\*\*/g, "")}`);
  }

  if (block.type === "list-item") {
    return normalizeMarkdownFragment(listItemToMarkdown(block, text));
  }

  const plain = collapseLeaders(text);
  return normalizeMarkdownFragment(splitInlineBullets(plain) ?? plain);
}

/** A list item's Markdown; a TOC block becomes one item per entry. */
function listItemToMarkdown(block: Block, text: string): string {
  if (block.toc) return tocToMarkdown(text);
  // A bracketed label ("[12] Author…") stays in the text: in-text citations
  // point at it, and a Markdown list cannot carry it as a marker.
  const cleaned = collapseLeaders(text)
    .replace(BULLET_PATTERN, "")
    .replace(NUMBERED_PATTERN, "")
    .replace(LETTER_LIST_PATTERN, "")
    .trim();
  return `${block.listMarker} ${cleaned}`;
}

function pageRangeForBlocks(blocks: Block[]): { pageStart: number; pageEnd: number } {
  let pageStart = Infinity;
  let pageEnd = -Infinity;

  for (const block of blocks) {
    for (const item of block.items) {
      pageStart = Math.min(pageStart, item.page);
      pageEnd = Math.max(pageEnd, item.page);
    }
  }

  return {
    pageStart: pageStart === Infinity ? 1 : pageStart,
    pageEnd: pageEnd === -Infinity ? 1 : pageEnd,
  };
}

function estimateTokens(markdown: string): number {
  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount * 1.33);
}

function slugifyId(text: string, fallback: string): string {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function createSection(
  title: string,
  level: number,
  blocks: Block[],
  linkMap: Map<ExtractedItem, string>,
  index: number,
): StructuredSection {
  const { pageStart, pageEnd } = pageRangeForBlocks(blocks);
  return {
    id: slugifyId(title, `section-${index}`),
    title,
    level,
    markdown: blocks
      .map((block) => blockToMarkdown(block, linkMap))
      .filter(Boolean)
      .join("\n\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
    pageStart,
    pageEnd,
    children: [],
  };
}

function buildStructuredOutput(
  blocks: Block[],
  linkMap: Map<ExtractedItem, string>,
): StructuredOutput {
  const rootSections: StructuredSection[] = [];
  const stack: StructuredSection[] = [];
  let pendingBlocks: Block[] = [];
  let sectionIndex = 1;

  const flushPending = () => {
    if (pendingBlocks.length === 0) return;
    const section = createSection(
      sectionIndex === 1 ? "Document" : `Section ${sectionIndex}`,
      0,
      pendingBlocks,
      linkMap,
      sectionIndex,
    );
    rootSections.push(section);
    sectionIndex++;
    pendingBlocks = [];
  };

  for (const block of blocks) {
    if (block.type === "heading") {
      if (stack.length === 0) flushPending();

      const headingText = assembleBlockText(block, linkMap).replace(/\*\*/g, "").trim();
      const level = block.headingLevel ?? 1;
      const section = createSection(
        headingText || `Section ${sectionIndex}`,
        level,
        [block],
        linkMap,
        sectionIndex,
      );
      sectionIndex++;

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) rootSections.push(section);
      else stack[stack.length - 1].children.push(section);

      stack.push(section);
      continue;
    }

    if (stack.length === 0) {
      pendingBlocks.push(block);
      continue;
    }

    const current = stack[stack.length - 1];
    const blockMarkdown = blockToMarkdown(block, linkMap);
    if (blockMarkdown.length === 0) continue;
    current.markdown = [current.markdown, blockMarkdown].filter(Boolean).join("\n\n");
    const { pageStart, pageEnd } = pageRangeForBlocks([block]);
    current.pageStart = Math.min(current.pageStart, pageStart);
    current.pageEnd = Math.max(current.pageEnd, pageEnd);
  }

  flushPending();
  return { sections: rootSections };
}

function flattenSections(
  sections: StructuredSection[],
  parents: string[] = [],
): Array<{ section: StructuredSection; path: string[] }> {
  return sections.flatMap((section) => {
    const path = [...parents, section.title];
    return [
      { section, path },
      ...flattenSections(section.children, path),
    ];
  });
}

function makeChunk(
  id: string,
  markdown: string,
  pageStart: number,
  pageEnd: number,
  sectionPath: string[],
): ConversionChunk {
  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  return {
    id,
    markdown,
    pageStart,
    pageEnd,
    sectionPath,
    wordCount,
    tokenEstimate: estimateTokens(markdown),
  };
}

function buildChunks(
  blocks: Block[],
  linkMap: Map<ExtractedItem, string>,
  structured: StructuredOutput,
  options?: ConvertOptions,
): ConversionChunk[] | undefined {
  if (!options?.chunkBy) return undefined;

  if (options.chunkBy === "heading") {
    return flattenSections(structured.sections).map(({ section, path }, index) =>
      makeChunk(`heading-${index + 1}`, section.markdown, section.pageStart, section.pageEnd, path),
    );
  }

  if (options.chunkBy === "page") {
    const pages = new Map<number, string[]>();
    for (const block of blocks) {
      const page = block.items[0]?.page ?? 1;
      const markdown = blockToMarkdown(block, linkMap);
      if (markdown.length === 0) continue;
      const pageBlocks = pages.get(page) ?? [];
      pageBlocks.push(markdown);
      pages.set(page, pageBlocks);
    }

    return [...pages.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([page, parts]) =>
        makeChunk(`page-${page}`, parts.join("\n\n"), page, page, [`Page ${page}`]),
      );
  }

  const maxTokens = Math.max(1, options.maxTokensPerChunk ?? 800);
  const chunks: ConversionChunk[] = [];
  let currentParts: string[] = [];
  let currentStart = 1;
  let currentEnd = 1;
  let currentPath: string[] = [];

  const flush = () => {
    const markdown = currentParts.join("\n\n").trim();
    if (markdown.length === 0) return;
    chunks.push(makeChunk(`token-${chunks.length + 1}`, markdown, currentStart, currentEnd, currentPath));
    currentParts = [];
  };

  for (const { section, path } of flattenSections(structured.sections)) {
    const parts = section.markdown.split(/\n{2,}/).filter(Boolean);
    for (const part of parts) {
      const nextMarkdown = [...currentParts, part].join("\n\n");
      if (currentParts.length > 0 && estimateTokens(nextMarkdown) > maxTokens) {
        flush();
      }
      if (currentParts.length === 0) {
        currentStart = section.pageStart;
        currentPath = path;
      }
      currentEnd = section.pageEnd;
      currentParts.push(part);
    }
  }

  flush();
  return chunks;
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
 * An existing Markdown link `[text](url)`. Neither part may contain `[`, so
 * each match attempt stops at the next `[`: with an unbounded `[^\]]*` a line
 * of many `[` and no `]` (or many `[a](b`) took quadratic time.
 */
const MARKDOWN_LINK_SPLIT = /(\[[^[\]]*\]\([^)\s[]*\))/;

/**
 * Convert bare URLs in text to markdown links, but only if they're not
 * already inside a markdown link `[text](url)` or code block.
 */
export function autoLinkUrls(markdown: string): string {
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

      // Link bare URLs only outside existing Markdown links, so a URL inside
      // link text (`[see https://x](https://x)`) is not wrapped a second time.
      return line
        .split(MARKDOWN_LINK_SPLIT)
        .map((segment, index) =>
          index % 2 === 1
            ? segment
            : segment.replace(
                /(?<!\]\()(?<!\[)(https?:\/\/[^\s\])<>*]+)/g,
                (match) => `[${match}](${match})`,
              ),
        )
        .join("");
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

function normalizeMarkdownFragment(markdown: string): string {
  return rejoinHyphenatedWords(fixSplitLigatures(autoLinkUrls(markdown)));
}

// ---------------------------------------------------------------------------
// Metadata extraction
// ---------------------------------------------------------------------------

function infoString(info: Record<string, unknown>, key: string): string | undefined {
  const value = info[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export async function extractMetadata(
  doc: PDFDocumentProxy,
  signal: AbortSignal | undefined,
  hasTextLayer: boolean | undefined,
): Promise<ConversionMetadata | undefined> {
  let info: Record<string, unknown> | undefined;
  try {
    const meta = await abortable(doc.getMetadata(), signal);
    info = meta?.info as Record<string, unknown> | undefined;
  } catch {
    throwIfCancelled(signal);
    info = undefined;
  }

  let isTagged = false;
  try {
    const markInfo = await abortable(doc.getMarkInfo(), signal);
    isTagged = markInfo?.Marked === true;
  } catch {
    throwIfCancelled(signal);
  }

  if (!info) return { isTagged, hasTextLayer };

  const keywords = infoString(info, "Keywords");
  return {
    title: typeof info["Title"] === "string" ? info["Title"] : undefined,
    author: typeof info["Author"] === "string" ? info["Author"] : undefined,
    subject: typeof info["Subject"] === "string" ? info["Subject"] : undefined,
    keywords: keywords ? keywords.split(/[,;]\s*/).filter(Boolean) : undefined,
    creationDate:
      typeof info["CreationDate"] === "string"
        ? info["CreationDate"]
        : undefined,
    creator: infoString(info, "Creator"),
    producer: infoString(info, "Producer"),
    pdfVersion: infoString(info, "PDFFormatVersion"),
    modificationDate: infoString(info, "ModDate"),
    isEncrypted: info["EncryptFilterName"] !== null && info["EncryptFilterName"] !== undefined,
    isTagged,
    hasTextLayer,
  };
}

// ---------------------------------------------------------------------------
// Cancellation
// ---------------------------------------------------------------------------

/** Thrown inside a conversion once its AbortSignal fires; `convert` turns it into the cancelled result. */
class ConversionCancelled extends Error {
  constructor() {
    super("Conversion was cancelled.");
    this.name = "ConversionCancelled";
  }
}

function throwIfCancelled(signal: AbortSignal | undefined): void {
  if (signal?.aborted) throw new ConversionCancelled();
}

/**
 * Settle with `promise`, or reject with `ConversionCancelled` as soon as
 * `signal` fires. Aborting destroys the PDF.js document, and calls on a
 * destroyed document can stay pending forever, so every PDF.js call made
 * while a signal is live goes through this.
 */
function abortable<T>(promise: Promise<T>, signal: AbortSignal | undefined): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) {
    promise.catch(() => {}); // the abandoned call may still reject later
    return Promise.reject(new ConversionCancelled());
  }
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(new ConversionCancelled());
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (err: unknown) => {
        signal.removeEventListener("abort", onAbort);
        reject(err);
      },
    );
  });
}

function cancelledResult(startTime: number, timeoutMs?: number): ConversionResult {
  return {
    status: "failed",
    markdown: "",
    messages: [
      timeoutMs === undefined
        ? { code: "cancelled", severity: "error", message: "Conversion was cancelled." }
        : { code: "timeout", severity: "error", message: `Conversion timed out after ${timeoutMs} ms.` },
    ],
    stats: {
      pageCount: 0,
      wordCount: 0,
      processingMs: performance.now() - startTime,
    },
  };
}

// ---------------------------------------------------------------------------
// Main conversion function
// ---------------------------------------------------------------------------

/**
 * Convert a PDF to Markdown.
 *
 * @param pdfBuffer The PDF bytes: an `ArrayBuffer` or any `Uint8Array`,
 *   including a Node `Buffer` (e.g. from `fs.readFile`). The bytes are copied
 *   before PDF.js sees them, so the caller's buffer is never detached.
 */
export async function convert(
  pdfBuffer: ArrayBuffer | Uint8Array,
  options?: ConvertOptions,
): Promise<ConversionResult> {
  return convertWithHooks(pdfBuffer, options);
}

/** Internal hooks for the compat entry point; not part of the public API. */
export interface ConvertHooks {
  /** Called once the document has loaded, before pages are read. Errors fail the conversion. */
  onDocument?: (doc: PDFDocumentProxy) => void | Promise<void>;
}

/** `convert` with internal hooks (used by `compat.ts`). */
export async function convertWithHooks(
  pdfBuffer: ArrayBuffer | Uint8Array,
  options?: ConvertOptions,
  hooks?: ConvertHooks,
): Promise<ConversionResult> {
  const startTime = performance.now();

  // Check file size
  const maxFileSize = options?.maxFileSizeBytes ?? (isNode ? Infinity : MAX_FILE_SIZE);
  if (pdfBuffer.byteLength > maxFileSize) {
    return oversizedResult(pdfBuffer.byteLength, maxFileSize, startTime);
  }

  // One signal for both the caller's cancel and the timeout.
  const timeoutMs =
    options?.timeoutMs !== undefined && Number.isFinite(options.timeoutMs) && options.timeoutMs >= 0
      ? options.timeoutMs
      : undefined;
  if (timeoutMs === undefined && !options?.signal) {
    return convertWithSignal(pdfBuffer, options, startTime, () => false, hooks);
  }
  const controller = new AbortController();
  let timedOut = false;
  const onCallerAbort = () => controller.abort();
  if (options?.signal?.aborted) controller.abort();
  else options?.signal?.addEventListener("abort", onCallerAbort, { once: true });
  const expire = () => {
    timedOut = true;
    controller.abort();
  };
  const timer = timeoutMs === undefined ? undefined : setTimeout(expire, timeoutMs);
  // PDF.js may not yield to the timer queue on small files, so the deadline
  // is also checked at every progress step (each stage and each page).
  const onProgress: ConvertOptions["onProgress"] = (progress) => {
    if (timeoutMs !== undefined && !timedOut && performance.now() - startTime >= timeoutMs) expire();
    options?.onProgress?.(progress);
  };
  try {
    const result = await convertWithSignal(
      pdfBuffer,
      { ...options, signal: controller.signal, onProgress },
      startTime,
      () => timedOut,
      hooks,
    );
    if (timedOut && result.messages[0]?.code === "cancelled") return cancelledResult(startTime, timeoutMs);
    return result;
  } finally {
    clearTimeout(timer);
    options?.signal?.removeEventListener("abort", onCallerAbort);
  }
}

/**
 * The `oversized` result for a file of `byteLength` bytes over `maxFileSize`.
 * Exported (not from the package index) so the CLI can refuse a file or
 * stdin stream before reading it all, with the same message.
 */
export function oversizedResult(
  byteLength: number,
  maxFileSize: number,
  startTime = performance.now(),
  atLeast = false,
): ConversionResult {
  return failedResult(
    "oversized",
    `File size (${atLeast ? "more than " : ""}${formatMegabytes(byteLength)}) exceeds the ${formatMegabytes(maxFileSize)} limit.`,
    startTime,
  );
}

function formatMegabytes(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return `${mb >= 10 || Number.isInteger(mb) ? Math.round(mb) : mb.toFixed(1)}MB`;
}

function failedResult(
  code: ConversionMessage["code"],
  message: string,
  startTime: number,
  pageCount = 0,
): ConversionResult {
  return {
    status: "failed",
    markdown: "",
    messages: [{ code, severity: "error", message }],
    stats: { pageCount, wordCount: 0, processingMs: performance.now() - startTime },
  };
}

/**
 * Load PDF.js and open the document, or return the failed result (worker,
 * password, parse or cancel). Exported for `info.ts`; not part of the public API.
 */
export async function openDocument(
  pdfBuffer: ArrayBuffer | Uint8Array,
  options: Pick<ConvertOptions, "emphasis" | "signal"> | undefined,
  startTime: number,
): Promise<{ doc: PDFDocumentProxy } | { failed: ConversionResult }> {
  const emphasis = options?.emphasis !== false;

  // Initialize PDF.js (and its worker in browsers)
  let pdfjs: Awaited<ReturnType<typeof getPdfjs>>;
  try {
    await initPdfWorker();
    pdfjs = await getPdfjs();
  } catch (err: unknown) {
    return {
      failed: failedResult(
        "worker_failed",
        `Failed to load PDF.js: ${err instanceof Error ? err.message : "Unknown error"}`,
        startTime,
      ),
    };
  }

  const { getDocument, VerbosityLevel } = pdfjs;
  try {
    // PDF.js rejects Node Buffers and may transfer (detach) the buffer it is
    // given, so always hand it a fresh plain Uint8Array copy.
    const data =
      pdfBuffer instanceof Uint8Array
        ? new Uint8Array(pdfBuffer)
        : new Uint8Array(pdfBuffer.slice(0));
    const loadingTask = getDocument({
      data,
      useSystemFonts: true,
      // Keeps font names on the font objects in PDF.js >= 6.4 (needed for
      // emphasis and monospace code detection).
      fontExtraProperties: true,
      // pdf2md never renders, so building an operator list (for font names)
      // must not decode images: skip every image larger than one pixel.
      maxImageSize: 1,
      // Skipped images and font quirks are logged as warnings on stdout, which
      // would corrupt the CLI's Markdown output; log errors only.
      verbosity: VerbosityLevel.ERRORS,
    });

    const signal = options?.signal;
    if (signal) {
      if (signal.aborted) void loadingTask.destroy();
      else signal.addEventListener("abort", () => void loadingTask.destroy(), { once: true });
    }

    return { doc: await loadingTask.promise };
  } catch (err: unknown) {
    if (options?.signal?.aborted) return { failed: cancelledResult(startTime) };

    // Check for password-protected PDFs
    if (
      err instanceof Error &&
      (err.message.includes("password") ||
        err.message.includes("encrypted"))
    ) {
      return {
        failed: {
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
        },
      };
    }

    return {
      failed: failedResult(
        "parse_failed",
        `Failed to parse PDF: ${err instanceof Error ? err.message : "Unknown error"}`,
        startTime,
      ),
    };
  }
}

async function convertWithSignal(
  pdfBuffer: ArrayBuffer | Uint8Array,
  options: ConvertOptions | undefined,
  startTime: number,
  isTimedOut: () => boolean,
  hooks?: ConvertHooks,
): Promise<ConversionResult> {
  const messages: ConversionMessage[] = [];
  const emphasis = options?.emphasis !== false;

  const opened = await openDocument(pdfBuffer, options, startTime);
  if ("failed" in opened) return opened.failed;
  const { doc } = opened;

  // Every path below settles: a cancel at any stage (even after the last page
  // is read) becomes the cancelled result, an unexpected error becomes a
  // failed result, and the document is always destroyed.
  try {
    if (hooks?.onDocument) await abortable(Promise.resolve(hooks.onDocument(doc)), options?.signal);
    return await convertDocument(doc, startTime, messages, emphasis, options);
  } catch (err: unknown) {
    if (err instanceof ConversionCancelled || options?.signal?.aborted || isTimedOut()) {
      return cancelledResult(startTime);
    }
    return failedResult(
      "parse_failed",
      `Failed to convert PDF: ${err instanceof Error ? err.message : "Unknown error"}`,
      startTime,
      doc.numPages,
    );
  } finally {
    try {
      await doc.destroy();
    } catch {
      // The document may already be torn down by an abort; nothing to free.
    }
  }
}

/** The pipeline after the document has loaded; `convert` handles cleanup and cancellation. */
async function convertDocument(
  doc: PDFDocumentProxy,
  startTime: number,
  messages: ConversionMessage[],
  emphasis: boolean,
  options: ConvertOptions | undefined,
): Promise<ConversionResult> {
  const signal = options?.signal;
  const totalPages = doc.numPages;
  // Pages to output, and pages to read: a `pages` selection also reads up to
  // 10 neighbouring pages so headers/footers and the font profile come from
  // more than the selected page(s). Without `pages`, nothing extra is read.
  let selected: number[];
  try {
    selected = resolvePageSelection(options?.pages, totalPages, options?.maxPages);
  } catch (err) {
    return {
      status: "failed",
      markdown: "",
      messages: [
        {
          code: "parse_failed",
          severity: "error",
          message: err instanceof Error ? err.message : "Invalid page selection.",
        },
      ],
      stats: { pageCount: totalPages, wordCount: 0, processingMs: performance.now() - startTime },
    };
  }
  const selectedSet = new Set(selected);
  const parsePages = options?.pages ? withContextPages(selected, totalPages) : selected;
  const wantsPages = options?.perPage === true || options?.pageMarkers === "comment";

  if (selected.length === 0) {
    // Nothing in range: an empty result, not an error.
    const metadata =
      options?.includeMetadata || options?.yamlFrontMatter
        ? await extractMetadata(doc, signal, undefined)
        : undefined;
    throwIfCancelled(signal);
    return {
      status: "success",
      markdown: "",
      messages,
      stats: { pageCount: totalPages, wordCount: 0, processingMs: performance.now() - startTime },
      metadata,
      pages: options?.perPage ? [] : undefined,
    };
  }

  options?.onProgress?.({
    stage: "loading",
    currentPage: 0,
    totalPages: parsePages.length,
  });

  // Extract text and links from all pages
  const allItems: ExtractedItem[] = [];
  const allLinks: AnnotationLink[] = [];
  const structTrees: Array<StructTreeNode | null | undefined> = [];

  for (const [index, i] of parsePages.entries()) {
    throwIfCancelled(signal);

    options?.onProgress?.({
      stage: "parsing",
      currentPage: index + 1,
      totalPages: parsePages.length,
    });

    try {
      const page = await abortable(doc.getPage(i), signal);
      const { items, links, structTree } = await abortable(extractPageItems(page, i), signal);
      allItems.push(...items);
      // Context pages only feed document statistics; their links and
      // structure are never output.
      if (selectedSet.has(i)) {
        allLinks.push(...links);
        structTrees.push(structTree);
      }
    } catch (err) {
      // A page that failed because of a cancel is not a parse warning.
      throwIfCancelled(signal);
      if (!selectedSet.has(i)) continue;
      messages.push({
        code: "parse_failed",
        severity: "warning",
        message: `Failed to extract page ${i}: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    }
  }

  throwIfCancelled(signal);

  // Check if there's any extractable text on the selected pages
  if (!allItems.some((item) => selectedSet.has(item.page))) {
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
    currentPage: parsePages.length,
    totalPages: parsePages.length,
  });

  // Detect and strip headers/footers
  const repeated = detectRepeatedText(allItems, parsePages.length);
  const filtered = filterHeadersFooters(allItems, repeated);

  // Fix multi-column reading order (academic papers, IEEE, etc.)
  // Must happen BEFORE groupIntoBlocks so items are pre-sorted in reading order.
  const contextItems = applyColumnReordering(filtered);

  // Build font profile for heading detection
  const profile = buildFontProfile(contextItems);

  // Detect code fonts (subset fonts used in indented blocks)
  const codeFonts = detectCodeFont(contextItems, profile.bodySize);

  // Detect emphasis fonts (subset fonts used for bold/emphasis on short lines)
  const emphasisFonts = detectEmphasisFonts(contextItems, profile.bodySize);

  // Document statistics above use the context pages; output only the selected ones.
  const reordered =
    parsePages.length === selected.length
      ? contextItems
      : contextItems.filter((item) => selectedSet.has(item.page));

  // Real font styles: bold for heading detection, monospace for code
  // detection, bold/italic for inline emphasis
  throwIfCancelled(signal);
  const fonts = await resolveFonts(doc, reordered, signal);
  for (const message of fonts.errors) {
    messages.push({ code: "parse_failed", severity: "warning", message });
  }
  const boldFonts = new Set([...fonts.styles].filter(([, style]) => style.bold).map(([id]) => id));

  // Prefer tagged PDF semantics when a usable structure tree maps to text.
  // Empty/malformed trees fall back to the established visual heuristics.
  const taggedBlocks = buildTaggedBlocks(reordered, structTrees, profile);

  // Group into blocks (paragraphs, headings, list items)
  const rawBlocks = taggedBlocks ?? groupIntoBlocks(reordered, profile, emphasisFonts, boldFonts);

  // Merge consecutive very short blocks (diagram labels, formula fragments)
  // Join headings broken at a hyphen; table-of-contents lines become list
  // items, not headings full of dots
  const blocks = markTocBlocks(joinStackedHeadings(joinBrokenHeadings(mergeShortBlocks(rawBlocks))));

  // Promote first heading to H1 if no H1 exists (common for document titles
  // that get ranked deep by font-size analysis)
  if (!taggedBlocks) demoteRunningHeads(blocks, profile, allItems);
  promoteFirstHeading(blocks);
  if (!taggedBlocks) rankHeadingLevels(blocks);

  // Match links to text items (before tables: rows with links stay apart)
  const linkMap = matchLinksToText(reordered, allLinks);

  // Post-process: detect tables and code blocks
  const enrichedBlocks = detectTablesAndCode(blocks, trustedCodeFonts(codeFonts, blocks, fonts.styles), linkMap);

  options?.onProgress?.({
    stage: "assembling",
    currentPage: parsePages.length,
    totalPages: parsePages.length,
  });

  // Inline bold/italic from real font names
  if (emphasis) applyEmphasis(enrichedBlocks, fonts.styles);

  // Assemble markdown, then apply final Markdown cleanup, including URL
  // links, ligature repair, and hyphenated line-break repair.
  let markdown: string;
  let pages: PageMarkdown[] | undefined;
  if (wantsPages) {
    // Render page by page, so the pages join to exactly `markdown`.
    pages = pagesToMarkdown(enrichedBlocks, linkMap, selected);
    markdown = joinPages(pages, "none");
  } else {
    markdown = normalizeMarkdownFragment(blocksToMarkdown(enrichedBlocks, linkMap));
  }

  // Extract metadata if requested (yamlFrontMatter implies includeMetadata)
  let metadata: ConversionMetadata | undefined;
  if (options?.includeMetadata || options?.yamlFrontMatter) {
    metadata = await extractMetadata(doc, signal, true);
    throwIfCancelled(signal);

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
  let frontMatter = "";
  if (options?.yamlFrontMatter && metadata) {
    const yaml = metadataToYaml(metadata);
    if (yaml) frontMatter = yaml + "\n\n";
  }
  markdown = frontMatter + markdown;
  const wordCount = markdown.split(/\s+/).filter(Boolean).length;
  if (pages && options?.pageMarkers === "comment") {
    markdown = frontMatter + joinPages(pages, "comment");
  }

  const wantsStructured =
    options?.outputFormat === "json" || options?.chunkBy !== undefined;
  const structured = wantsStructured
    ? buildStructuredOutput(enrichedBlocks, linkMap)
    : undefined;
  const chunks = structured
    ? buildChunks(enrichedBlocks, linkMap, structured, options)
    : undefined;

  // A cancel that lands after the last PDF.js call still wins over the result.
  throwIfCancelled(signal);

  const processingMs = performance.now() - startTime;

  return {
    status: messages.length > 0 ? "partial" : "success",
    markdown,
    messages,
    stats: { pageCount: totalPages, wordCount, processingMs },
    metadata,
    structured,
    chunks,
    pages: options?.perPage ? pages : undefined,
  };
}
