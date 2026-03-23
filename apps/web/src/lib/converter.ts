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
}

interface AnnotationLink {
  url: string;
  rect: [number, number, number, number]; // [x1, y1, x2, y2]
}

interface Block {
  items: ExtractedItem[];
  type: "paragraph" | "heading" | "list-item";
  headingLevel?: number;
  listMarker?: string;
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
// Paragraph grouping by vertical proximity
// ---------------------------------------------------------------------------

function groupIntoBlocks(
  items: ExtractedItem[],
  profile: FontProfile,
): Block[] {
  if (items.length === 0) return [];

  // Sort by page, then Y (top to bottom), then X (left to right)
  const sorted = [...items].sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
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
      // Check if item overlaps with link annotation rectangle
      const itemRight = item.x + item.width;
      const itemBottom = item.y + item.height;

      if (
        item.x < lx2 &&
        itemRight > lx1 &&
        item.y < ly2 &&
        itemBottom > ly1
      ) {
        linkMap.set(item, link.url);
        break;
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

function blocksToMarkdown(
  blocks: Block[],
  linkMap: Map<ExtractedItem, string>,
): string {
  const parts: string[] = [];

  for (const block of blocks) {
    const text = assembleBlockText(block, linkMap);
    if (text.length === 0) continue;

    switch (block.type) {
      case "heading": {
        const prefix = "#".repeat(block.headingLevel ?? 1);
        // Strip any bold markers from headings (redundant)
        const cleanText = text.replace(/\*\*/g, "");
        parts.push(`${prefix} ${cleanText}`);
        break;
      }
      case "list-item": {
        // Remove the original bullet/number marker from text
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

  // Build font profile for heading detection
  const profile = buildFontProfile(filtered);

  // Group into blocks (paragraphs, headings, list items)
  const blocks = groupIntoBlocks(filtered, profile);

  // Match links to text items
  const linkMap = matchLinksToText(filtered, allLinks);

  options?.onProgress?.({
    stage: "assembling",
    currentPage: maxPages,
    totalPages: maxPages,
  });

  // Assemble markdown
  const markdown = blocksToMarkdown(blocks, linkMap);

  // Extract metadata if requested
  let metadata: ConversionMetadata | undefined;
  if (options?.includeMetadata) {
    metadata = await extractMetadata(doc);
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
