/**
 * Pure detection utilities for table, code block, and metadata processing.
 * Separated from converter.ts to avoid pdfjs-dist dependency in tests.
 */

import type { ConversionMetadata } from "./types.js";

// ---------------------------------------------------------------------------
// Internal types (mirrored from converter for decoupling)
// ---------------------------------------------------------------------------

export interface DetectionItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  hasEOL: boolean;
  page: number;
  /**
   * Monospace from the real font (name or fixed-pitch flag): true or false
   * once the font is resolved, undefined when it is not known.
   */
  monospace?: boolean;
}

// ---------------------------------------------------------------------------
// Font analysis
// ---------------------------------------------------------------------------

export function isMonospace(fontName: string): boolean {
  const lower = fontName.toLowerCase();
  return /courier|consolas|mono|menlo|monaco|inconsolata|fira.?code|source.?code|liberation.?mono|deja.?vu.?mono|roboto.?mono|noto.?mono|hack|iosevka|jetbrains.?mono|sf.?mono|andale|lucida.?console|fixed|terminal|nimbusmon|typewriter|\.cc\b|^(?:cm|sf|lm|ec|tc)tt|^(?:tx|px|ner|ber)tt|^(?:[a-z]{6}\+)?(?:cm|sf|lm)tt/.test(
    lower,
  );
}

/** Monospace by the resolved real font, else by the font name (test fixtures, legacy ids). */
function itemIsMonospace(item: DetectionItem): boolean {
  return item.monospace ?? isMonospace(item.fontName);
}

// ---------------------------------------------------------------------------
// Table detection
// ---------------------------------------------------------------------------

/**
 * Detect if items form a table (aligned columns across rows).
 * Returns an array of rows (each row is an array of cell strings), or null.
 */
export function detectTable(items: DetectionItem[]): string[][] | null {
  if (items.length < 4) return null; // Need at least 2x2

  // Sort items by Y (top-to-bottom), then X (left-to-right)
  const sorted = [...items].sort((a, b) => {
    if (Math.abs(a.y - b.y) > a.height * 0.3) return a.y - b.y;
    return a.x - b.x;
  });

  // Group items into rows by Y proximity
  const rows: DetectionItem[][] = [];
  let currentRow: DetectionItem[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (Math.abs(curr.y - prev.y) > curr.height * 0.5) {
      rows.push(foldSymbolItems(currentRow.sort((a, b) => a.x - b.x)));
      currentRow = [curr];
    } else {
      currentRow.push(curr);
    }
  }
  rows.push(foldSymbolItems(currentRow.sort((a, b) => a.x - b.x)));

  if (rows.length < 2) return null;

  // Find most common column count (must be >= 2)
  const colCounts = rows.map((r) => r.length);
  const countFreq = new Map<number, number>();
  for (const c of colCounts) {
    countFreq.set(c, (countFreq.get(c) ?? 0) + 1);
  }

  let bestCount = 0;
  let bestFreq = 0;
  for (const [count, freq] of countFreq) {
    if (count >= 2 && freq > bestFreq) {
      bestCount = count;
      bestFreq = freq;
    }
  }

  if (bestCount < 2 || bestFreq < 2) return null;

  // At least 60% of rows should have the expected column count
  if (bestFreq / rows.length < 0.6) return null;

  // Filter to rows with the expected column count
  const consistentRows = rows.filter((r) => r.length === bestCount);

  // Verify column alignment: x-positions in each column should be close
  for (let col = 0; col < bestCount; col++) {
    const xPositions = consistentRows.map((r) => r[col].x);
    const minX = Math.min(...xPositions);
    const maxX = Math.max(...xPositions);
    if (maxX - minX > 30) return null; // 30 PDF points tolerance
  }

  // Guard: reject 2-column "tables" where cells are long prose text.
  // Real table cells are typically short; two-column layouts produce long cells.
  if (bestCount === 2) {
    let totalCellLen = 0;
    let cellCount = 0;
    for (const row of consistentRows) {
      for (const item of row) {
        totalCellLen += item.str.trim().length;
        cellCount++;
      }
    }
    const avgCellLen = cellCount > 0 ? totalCellLen / cellCount : 0;
    if (avgCellLen > 40) return null; // prose, not tabular data
  }

  // A first column of bullet markers is a bulleted list whose label and text
  // happen to line up, not a table.
  if (consistentRows.every((r) => BULLET_MARKER.test(r[0].str.trim()))) return null;

  // Every row keeps its text. A row with fewer or more cells (a value row
  // without `$`, a subtotal, a label or heading on its own line, a cell drawn
  // as two items) is placed by x; when its items do not line up with the
  // columns, each goes into the nearest one. A row with an item that starts
  // outside the table's columns, or runs past them by half the table's
  // width (prose, text from elsewhere on the page), or with two items over
  // the same x span (lines of prose columns grouped as one row), means the
  // block is not one table, so it stays text.
  const anchors = columnAnchors(consistentRows, bestCount);
  const tableLeft = Math.min(...consistentRows.map((r) => r[0].x));
  const tableRight = Math.max(...consistentRows.map((r) => r[bestCount - 1].x + r[bestCount - 1].width));
  const cells: string[][] = [];
  for (const row of rows) {
    let placed: (DetectionItem | null)[] = row;
    if (row.length !== bestCount) {
      const outside = row.some(
        (item) =>
          item.x < tableLeft - PLACE_TOLERANCE ||
          item.x > tableRight + PLACE_TOLERANCE ||
          item.x + item.width > tableRight + Math.max(PLACE_TOLERANCE, (tableRight - tableLeft) / 2),
      );
      if (outside || hasStackedItems(row)) return null;
      placed = placeByX(row, anchors) ?? placeNearest(row, anchors);
    }
    cells.push(placed.map((item) => (item ? stripCellLeaders(item.str.trim()).replace(CURRENCY_SPACE, "$1") : "")));
  }

  // Drop columns that are empty in every row (leader-only or symbol columns).
  const keep = anchors.map((_, col) => cells.some((row) => row[col] !== ""));
  if (keep.every(Boolean)) return cells;
  if (keep.filter(Boolean).length < 2) return null;
  return cells.map((row) => row.filter((_, col) => keep[col]));
}

/** A cell that is only a list bullet. */
const BULLET_MARKER = /^[•‣⁃∙▪▫●○◦■□▶▸►◆◇–—-]$/;
const CURRENCY_ONLY = /^[$€£¥]$/;
const STARTS_NUMERIC = /^[(\-−–]?\d|^[(\-−–]?[.,]\d/;
const ENDS_NUMERIC = /\d\)?$/;
/**
 * An item that is only a dot leader: four or more dots (`. . . . .`), or a
 * short spaced fragment (`. .`) left between a row label and its first
 * number. `...` (not available) is kept.
 */
const LEADER_ONLY_ITEM = /^(?:(?:[.·…][ \t]?){4,}|[.·](?:[ \t]+[.·])+)$/;
/** `$ 5,428` → `$5,428`, matching the joined `$` `46,752` → `$46,752`. */
const CURRENCY_SPACE = /^([$€£¥])\s+(?=[(\-−–]?\d)/;

/**
 * Join a lone currency symbol to the number after it (`$` `46,752` → `$46,752`)
 * and a lone `%` to the number before it, so symbols do not become columns.
 * The joined item keeps the number's position so it still aligns with
 * rows that have no symbol. Items that are only a dot leader are dropped:
 * they would add a cell to some rows and not others.
 */
function foldSymbolItems(row: DetectionItem[]): DetectionItem[] {
  const out: DetectionItem[] = [];
  for (let i = 0; i < row.length; i++) {
    const item = row[i];
    const str = item.str.trim();
    if (LEADER_ONLY_ITEM.test(str)) continue;
    const next = row[i + 1];
    if (CURRENCY_ONLY.test(str) && next && STARTS_NUMERIC.test(next.str.trim())) {
      out.push({ ...next, str: str + next.str.trim() });
      i++;
      continue;
    }
    const prev = out[out.length - 1];
    if (str === "%" && prev && ENDS_NUMERIC.test(prev.str.trim())) {
      out[out.length - 1] = {
        ...prev,
        str: `${prev.str.trim()}%`,
        width: Math.max(prev.width, item.x + item.width - prev.x),
      };
      continue;
    }
    out.push(item);
  }
  return out;
}

interface ColumnAnchor {
  left: number;
  right: number;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function columnAnchors(rows: DetectionItem[][], count: number): ColumnAnchor[] {
  return Array.from({ length: count }, (_, col) => ({
    left: median(rows.map((r) => r[col].x)),
    right: median(rows.map((r) => r[col].x + r[col].width)),
  }));
}

/** Max distance (PDF points) from a column's left or right edge for x placement. */
const PLACE_TOLERANCE = 30;

/**
 * Put each item of a short row into the column whose left or right edge
 * (text or numbers) it lines up with. Null when an item fits no column or
 * two items would share one.
 */
function placeByX(row: DetectionItem[], anchors: ColumnAnchor[]): (DetectionItem | null)[] | null {
  const placed: (DetectionItem | null)[] = anchors.map(() => null);
  let lastCol = -1;
  for (const item of row) {
    let best = -1;
    let bestDist = Infinity;
    for (let col = lastCol + 1; col < anchors.length; col++) {
      const a = anchors[col];
      const dist = Math.min(Math.abs(item.x - a.left), Math.abs(item.x + item.width - a.right));
      if (dist < bestDist) {
        bestDist = dist;
        best = col;
      }
    }
    if (best < 0 || bestDist > PLACE_TOLERANCE) return null;
    placed[best] = item;
    lastCol = best;
  }
  return placed;
}

/**
 * True when two items of an x-sorted row overlap by more than half the
 * narrower one: stacked lines, not cells side by side.
 */
function hasStackedItems(row: DetectionItem[]): boolean {
  for (let i = 1; i < row.length; i++) {
    const prev = row[i - 1];
    const item = row[i];
    const overlap = Math.min(prev.x + prev.width, item.x + item.width) - Math.max(prev.x, item.x);
    if (overlap > Math.min(prev.width, item.width) * 0.5) return true;
  }
  return false;
}

/**
 * Put each item of a row into the column whose left or right edge is
 * nearest, with no tolerance. Items that land in the same column are joined
 * in x order, so no text is lost.
 */
function placeNearest(row: DetectionItem[], anchors: ColumnAnchor[]): (DetectionItem | null)[] {
  const placed: (DetectionItem | null)[] = anchors.map(() => null);
  for (const item of row) {
    let best = 0;
    let bestDist = Infinity;
    anchors.forEach((a, col) => {
      const dist = Math.min(Math.abs(item.x - a.left), Math.abs(item.x + item.width - a.right));
      if (dist < bestDist) {
        bestDist = dist;
        best = col;
      }
    });
    const prev = placed[best];
    placed[best] = prev
      ? {
          ...prev,
          str: prev.str.trim() + (itemsTouch(prev, item) ? "" : " ") + item.str.trim(),
          width: item.x + item.width - prev.x,
        }
      : item;
  }
  return placed;
}

/**
 * Two runs on a line touch (a word and its `,` drawn separately, a subscript)
 * when the gap between them is under 0.15 of the font size, or they overlap
 * by less than 0.25 of it: the same rule the converter uses to join items.
 */
function itemsTouch(prev: DetectionItem, next: DetectionItem): boolean {
  const size = Math.max(Math.min(prev.fontSize, next.fontSize), 1);
  const gap = next.x - (prev.x + prev.width);
  return gap > -size * 0.25 && gap < size * 0.15;
}

// ---------------------------------------------------------------------------
// Table-of-contents and dot-leader lines
// ---------------------------------------------------------------------------

/** A dot leader: 4 or more dots (or middle dots / ellipses), optionally spaced. */
const LEADER_RE = /(?:[.·…][ \t]?){4,}/g;
/** A long dot leader, too long to be an ellipsis in prose. */
const LONG_LEADER_RE = /(?:[.·…][ \t]?){8,}/g;
/** The page reference right after a leader: `17`, `A-3`, `B12` or a roman numeral `xiv`. */
const TOC_PAGE_RE = /^[ \t]*((?:[A-Z]-?)?\d{1,4}|[ivxlcdm]{1,7})(?=\s|$)/;
/** A TOC entry without a leader: a title, a space, and a page number at the end. */
const TOC_TRAILING_PAGE_RE = /^(\S.*\S)\s+(\d{1,3}|[ivxlc]{1,6})$/;

export interface TocEntry {
  title: string;
  /** Page reference, or "" for a long leader that ends without one. */
  page: string;
}

export interface TocParse {
  entries: TocEntry[];
  /** Text after the last entry. */
  tail: string;
}

function countLeaderUnits(leader: string): number {
  return (leader.match(/[.·…]/g) ?? []).length;
}

/**
 * Split text into table-of-contents entries: a title, a dot leader, and a page
 * reference (`1.1 Dense Retrieval . . . . 17`). One block of text may hold
 * several entries (TOC lines grouped into one paragraph, or two TOC columns
 * read across). A long leader with no page after it also ends an entry.
 * Returns null unless at least one entry has a page and the entries cover
 * nearly all of the text, so prose with an ellipsis is never split.
 */
export function parseTocEntries(text: string): TocParse | null {
  if (!/(?:[.·…][ \t]?){4}/.test(text)) return null;
  // alnumBefore[i]: letters and digits in text[0, i), so "does this title
  // have a word" is O(1) however many leaders are skipped.
  const alnumBefore = new Uint32Array(text.length + 1);
  for (let i = 0; i < text.length; i++) {
    alnumBefore[i + 1] = alnumBefore[i] + (/[\p{L}\p{N}]/u.test(text[i]) ? 1 : 0);
  }
  const entries: TocEntry[] = [];
  let start = 0;
  let paged = 0;
  for (const m of text.matchAll(LEADER_RE)) {
    const index = m.index ?? 0;
    if (index < start) continue;
    const leaderEnd = index + m[0].length;
    if (alnumBefore[index] === alnumBefore[start]) continue;
    const title = text.slice(start, index).trim();
    // Bounded lookahead so a long text never makes this quadratic.
    const page = text.slice(leaderEnd, leaderEnd + 16).match(TOC_PAGE_RE);
    if (page) {
      entries.push({ title, page: page[1] });
      paged++;
      start = leaderEnd + page[0].length;
    } else if (countLeaderUnits(m[0]) >= 8) {
      entries.push({ title, page: "" });
      start = leaderEnd;
    }
  }
  if (paged === 0) return null;
  const tail = text.slice(start).trim();
  if (tail.length > Math.max(30, text.length * 0.25)) return null;
  const avgTitle = entries.reduce((sum, e) => sum + e.title.length, 0) / entries.length;
  if (avgTitle > 150) return null;
  return { entries: entries.flatMap(splitLeaderlessEntry), tail };
}

/**
 * A chapter line drawn without a leader runs into the next entry's title:
 * `1 Linear regression 8 1.1 LMS algorithm`. Split it before a dotted section
 * number that follows a page number.
 */
const LEADERLESS_SPLIT = /^(.*\p{L}.*?)\s+(\d{1,4})\s+((?:\d+\.)+\d+\.?\s+\p{L}.*)$/u;

function splitLeaderlessEntry(entry: TocEntry): TocEntry[] {
  const m = entry.title.length <= 300 ? entry.title.match(LEADERLESS_SPLIT) : null;
  if (!m) return [entry];
  return [{ title: m[1], page: m[2] }, { title: m[3], page: entry.page }];
}

/**
 * A short line that ends in a page number (`1 Introduction 17`): a TOC entry
 * drawn without a leader. Only meaningful next to leader entries.
 */
export function parseTrailingPageEntry(text: string): TocEntry | null {
  const trimmed = text.trim();
  if (trimmed.length > 160) return null;
  const m = trimmed.match(TOC_TRAILING_PAGE_RE);
  if (!m || !/\s/.test(m[1]) || !/\p{L}/u.test(m[1])) return null;
  return { title: m[1], page: m[2] };
}

/** Markdown list item for a TOC entry: `- 1.1 Dense Retrieval — 17`. */
function tocEntryToMarkdown(entry: TocEntry): string {
  // "1. Introduction" after "- " would start a nested ordered list.
  const title = entry.title
    .replace(/^[•●▪◦‣•·▪–—-]\s*/, "")
    .replace(/^(\d{1,9})([.)])(\s)/, "$1\\$2$3");
  return entry.page ? `- ${title} — ${entry.page}` : `- ${title}`;
}

/**
 * Render a TOC block's text as Markdown list items with the leaders removed.
 * Falls back to one list item when the text cannot be split into entries.
 */
export function tocToMarkdown(text: string): string {
  const parsed = parseTocEntries(text);
  if (parsed) {
    const lines = parsed.entries.map(tocEntryToMarkdown);
    const tail = collapseLeaders(parsed.tail).trim();
    if (tail) lines.push(tocEntryToMarkdown({ title: tail, page: "" }));
    return lines.join("\n");
  }
  const entry = parseTrailingPageEntry(text);
  if (entry) return tocEntryToMarkdown(entry);
  return tocEntryToMarkdown({ title: collapseLeaders(text).trim(), page: "" });
}

/**
 * Replace long dot leaders that are not part of a TOC entry (form lines such
 * as `Enter the total rent paid . . . . . . 6a.`) with a single ellipsis.
 * Short runs are left alone: they are usually a real ellipsis.
 */
export function collapseLeaders(text: string): string {
  if (!/(?:[.·…][ \t]?){8}/.test(text)) return text;
  // No whitespace in the leader pattern itself: a leading `[ \t]*` would
  // rescan every long whitespace run that is not followed by a leader
  // (quadratic). Whitespace around the ellipsis is collapsed afterwards.
  return text
    .replace(LONG_LEADER_RE, " … ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ … $/, " …");
}

/** Remove dot leaders at the start or end of a table cell; a cell of only a leader becomes empty. */
export function stripCellLeaders(cell: string): string {
  if (!/(?:[.·…][ \t]?){4}/.test(cell)) return cell;
  let out = cell.replace(/^(?:[.·…][ \t]?){4,}\s*/, "");
  const end = trailingLeaderStart(out);
  if (end >= 0) out = out.slice(0, end);
  return collapseLeaders(out).trim();
}

/**
 * Index where a trailing dot leader (4+ dots, single spaces allowed) starts,
 * or -1. A backward scan: an end-anchored regex would be quadratic on a long
 * run of dots followed by other text.
 */
function trailingLeaderStart(text: string): number {
  const isDot = (ch: string | undefined) => ch === "." || ch === "·" || ch === "…";
  let i = text.length;
  while (i > 0 && /\s/.test(text[i - 1])) i--;
  let dots = 0;
  let begin = -1;
  while (i > 0) {
    const ch = text[i - 1];
    if (isDot(ch)) {
      dots++;
      begin = i - 1;
    } else if (!((ch === " " || ch === "\t") && isDot(text[i]))) {
      break;
    }
    i--;
  }
  return dots >= 4 ? begin : -1;
}

// ---------------------------------------------------------------------------
// Code block detection
// ---------------------------------------------------------------------------

/** Group items of the same font into consecutive runs (same page, close Y). */
function groupIntoRuns(items: DetectionItem[]): DetectionItem[][] {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => a.page - b.page || a.y - b.y);
  const runs: DetectionItem[][] = [];
  let currentRun: DetectionItem[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (curr.page === prev.page && Math.abs(curr.y - prev.y) < prev.fontSize * 2) {
      currentRun.push(curr);
    } else {
      runs.push(currentRun);
      currentRun = [curr];
    }
  }
  runs.push(currentRun);
  return runs;
}

/**
 * Detect fonts that are consistently used in indented, short-line blocks (code fonts).
 * Works even when font names are subset-encoded (e.g., g_d0_f3).
 */
export function detectCodeFont(
  allItems: DetectionItem[],
  bodyFontSize: number,
): Set<string> {
  // Group items by fontName
  const fontGroups = new Map<string, DetectionItem[]>();
  for (const item of allItems) {
    const arr = fontGroups.get(item.fontName);
    if (arr) arr.push(item);
    else fontGroups.set(item.fontName, [item]);
  }

  // Find the dominant font (most characters)
  let dominantFont = "";
  let dominantChars = 0;
  for (const [fontName, fontItems] of fontGroups) {
    const chars = fontItems.reduce((s, it) => s + it.str.length, 0);
    if (chars > dominantChars) {
      dominantChars = chars;
      dominantFont = fontName;
    }
  }

  // Estimate body text properties from dominant font
  const dominantItems = fontGroups.get(dominantFont) ?? [];
  const bodyLeftMargins: number[] = [];
  const bodyWidths: number[] = [];
  for (const item of dominantItems) {
    bodyLeftMargins.push(item.x);
    if (item.width > 0) bodyWidths.push(item.width);
  }
  bodyLeftMargins.sort((a, b) => a - b);
  const bodyLeftMargin = bodyLeftMargins.length > 0
    ? bodyLeftMargins[Math.floor(bodyLeftMargins.length * 0.1)] // 10th percentile
    : 72;
  const bodyAvgWidth = bodyWidths.length > 0
    ? bodyWidths.reduce((s, w) => s + w, 0) / bodyWidths.length
    : 400;

  const codeFonts = new Set<string>();

  for (const [fontName, fontItems] of fontGroups) {
    if (fontName === dominantFont) continue;
    if (fontItems.length < 10) continue;

    const runs = groupIntoRuns(fontItems);
    let indentedRunCount = 0;
    let totalRuns = 0;

    for (const run of runs) {
      if (run.length < 2) continue;
      totalRuns++;

      const avgX = run.reduce((s, it) => s + it.x, 0) / run.length;
      const avgWidth = run.reduce((s, it) => s + it.width, 0) / run.length;

      // Heuristic: indented (x > body margin + 20) OR short lines (width < 70% of body)
      if (avgX > bodyLeftMargin + 20 || avgWidth < bodyAvgWidth * 0.7) {
        indentedRunCount++;
      }
    }

    // If ≥70% of multi-line runs are indented/short → code font candidate
    // Require at least 5 runs to reduce false positives on prose in subset fonts
    if (totalRuns >= 5 && indentedRunCount / totalRuns >= 0.7) {
      codeFonts.add(fontName);
    }
  }

  return codeFonts;
}

/**
 * Check if text looks like natural prose rather than code.
 * Checks for sentence-ending punctuation and common English words.
 */
function looksLikeProse(items: DetectionItem[]): boolean {
  const allText = items.map((i) => i.str).join(" ");
  const words = allText.split(/\s+/).filter(Boolean);
  if (words.length < 5) return false;

  // Check for sentence-ending punctuation
  const sentenceEndings = (allText.match(/[.!?]/g) ?? []).length;
  if (sentenceEndings >= 3) return true;

  // Check for high frequency of common English words
  const commonPattern =
    /\b(the|and|a|an|is|are|was|were|to|in|of|for|on|with|at|by|from|it|this|that|be|have|do|not|but|or|as|we|our|his|her|its|has|had|will|would|can|could|may|should|about|than|into|also|been|which|their|more|these|other|some|very|when|what|there|all|after|most|who|between|both|such|only|over|any|each|new|many|how|where|every|through|just|well|being|those|own|first|then|before|still)\b/gi;
  const commonCount = (allText.match(commonPattern) ?? []).length;
  if (words.length > 0 && commonCount / words.length > 0.15) return true;

  return false;
}

/**
 * Check if text looks like mathematical notation rather than code.
 * Math has Greek letter names/symbols, math Unicode operators, and lacks programming structure.
 */
function looksLikeMath(items: DetectionItem[]): boolean {
  const allText = items.map((i) => i.str).join(" ");

  // Greek letter names commonly used in math notation
  const greekNames =
    /\b(alpha|beta|gamma|delta|epsilon|theta|lambda|mu|sigma|rho|phi|psi|omega|nabla|partial|infty|sum|prod|lim|arg\s*min|arg\s*max|sup|inf|log|exp|sin|cos|tan|max|min)\b/i;
  const greekCount = (allText.match(new RegExp(greekNames, "gi")) ?? []).length;

  // Math-specific Unicode: Greek letters (α-ωΑ-Ω), math operators (∀∃∈∉⊂⊃∪∩),
  // math symbols (∇∂∞≤≥≠≈∝∑∏∫), double-struck/norms (‖)
  const mathUnicode = (allText.match(/[\u0370-\u03FF\u2016\u2032-\u2037\u2200-\u22FF\u2190-\u21FF\u27C0-\u27EF∇∂∈∉⊂⊃⊆⊇∀∃∅∞≤≥≠≈∝∑∏∫‖′″]/g) ?? []).length;

  // If we see multiple Greek/math names or significant math Unicode, it's math
  if (greekCount >= 2) return true;
  if (mathUnicode >= 2) return true;
  if (greekCount >= 1 && mathUnicode >= 1) return true;

  // Single-letter variables with math-style operators: "f(x)", "T(x)", "x = y"
  // Combined with high parens density suggests math notation
  const singleLetterVars = (allText.match(/\b[a-zA-Z]\s*\(/g) ?? []).length;
  const parensCount = (allText.match(/[()]/g) ?? []).length;
  if (singleLetterVars >= 3 && parensCount >= 6) return true;

  // Norm notation: "||x||" or "‖x‖"
  if (/\|\|[^|]+\|\|/.test(allText)) return true;

  return false;
}

/**
 * Check if text contains positive evidence of being source code.
 * Looks for programming syntax patterns, not just "not prose."
 */
function looksLikeCode(items: DetectionItem[]): boolean {
  const allText = items.map((i) => i.str).join("\n");
  const lines = allText.split("\n").filter((l) => l.trim().length > 0);

  // If it looks like math notation, it's not code
  if (looksLikeMath(items)) return false;

  // Programming keywords at start of line or standalone
  const codeKeywords =
    /\b(function|def |class |import |from |const |let |var |if |else |for |while |return |public |private |static |void |int |string |bool |print|echo |require|include|module|export |interface |type |enum |struct |fn |impl |use |pub |async |await )\b/;
  if (codeKeywords.test(allText)) return true;

  // Code-specific operator patterns (not just parens which appear in prose)
  // Require combinations that rarely appear in natural text.
  // Curly braces are strong code signals on their own.
  if (/[{}]/.test(allText)) return true;
  // Multi-character operators that are unambiguously code
  const codeOperators = /=>|->|::|&&|\|\||==|!=|<<|>>|\+=|-=|\*=|\/=|#include|#define|\/\//;
  if (codeOperators.test(allText)) return true;
  // Semicolons are code-like only when they appear after closing parens/brackets
  // or in assignment-like contexts — not after prose words like "Cochairman;"
  if (/[)}\]]\s*;/.test(allText) || /;\s*$/.test(allText.trim())) return true;

  // Indentation variation: code has varying indent levels
  // Check if multiple lines have leading whitespace of different depths
  if (lines.length >= 3) {
    const indents = new Set<number>();
    for (const line of lines) {
      const match = line.match(/^(\s+)/);
      if (match) indents.add(Math.floor(match[1].length / 2));
    }
    // Multiple distinct indent levels + some indented lines → likely code
    if (indents.size >= 2) {
      const indentedLines = lines.filter((l) => /^\s{2,}/.test(l)).length;
      if (indentedLines / lines.length >= 0.3) return true;
    }
  }

  // High density of non-alphabetic syntax characters (typical of code)
  // Exclude semicolons (common in prose lists) and colons (common in labels)
  // Exclude lone parens — they appear in names like "Johnson (SD)" and math
  const syntaxChars = (allText.match(/[{}[\]=&|<>!@#$%^*+~`\\\/]/g) ?? []).length;
  if (allText.length > 20 && syntaxChars / allText.length > 0.08) return true;

  return false;
}

/**
 * Check if items form a code block.
 * Uses multiple signals: known monospace fonts, detected code fonts, and syntax patterns.
 * Includes a prose guard to prevent wrapping natural language text in code fences.
 */
export function isCodeBlock(items: DetectionItem[], codeFonts?: Set<string>): boolean {
  if (items.length === 0) return false;

  let monoChars = 0;
  let monoTotal = 0;
  let totalChars = 0;
  let codeFontChars = 0;
  for (const item of items) {
    const len = item.str.length;
    totalChars += len;
    // Punctuation in a font that was not resolved (quotes drawn from a
    // symbol font inside monospace code) does not count either way.
    if (item.monospace !== undefined || /[\p{L}\p{N}]/u.test(item.str)) monoTotal += len;
    if (itemIsMonospace(item)) {
      monoChars += len;
    }
    if (codeFonts?.has(item.fontName)) {
      codeFontChars += len;
    }
  }

  // Minimum content: reject very short blocks (isolated math symbols, single words)
  if (totalChars < 8) return false;

  // URL lists, a date-format line or a line of math are not code, whatever the font.
  const lines = textLines(items);
  const lineCount = lines.length;
  if (looksLikeNonCode(items, lines)) return false;

  // Signal 1: Known monospace font names
  // Require positive evidence of code — monospace fonts are also used for
  // legislative text, timetables, indices, and math notation.
  if (monoTotal > 0 && monoChars / monoTotal >= 0.8) {
    if (looksLikeProse(items)) return false;
    if (!looksLikeCode(items)) return false;
    return true;
  }

  // Signal 2: Detected code font (subset fonts like g_d0_f3). The caller
  // leaves out code fonts known to be proportional unless the document has
  // real monospace code. Require POSITIVE evidence of code, not just absence
  // of prose, and at least 2 lines: subset fonts are used for captions,
  // labels, URLs and table fragments, not just code.
  // One line passes only if part of it is set in a real monospace font
  // (keywords in typewriter type between italic variables) or it has syntax
  // prose and captions do not (braces, `->`, `::`, `[]`).
  const someMonospace = monoTotal > 0 && monoChars / monoTotal >= 0.15;
  const oneLineCode = someMonospace || STRONG_CODE_SYNTAX.test(items.map((i) => i.str).join(" "));
  if (totalChars > 0 && codeFonts && codeFontChars / totalChars >= 0.8 && (lineCount >= 2 || oneLineCode)) {
    if (looksLikeProse(items)) return false;
    if (!looksLikeCode(items)) return false;
    return true;
  }

  return false;
}

/** Syntax that prose, captions and labels almost never contain. */
const STRONG_CODE_SYNTAX = /[{}]|=>|->|::|<-|:=|&&|\|\||==|!=|\[\]|\(\)/;

function textLines(items: DetectionItem[]): string[] {
  const sorted = [...items].sort((a, b) => a.page - b.page || a.y - b.y || a.x - b.x);
  const lines: string[][] = [];
  let prev: DetectionItem | undefined;
  for (const item of sorted) {
    if (!prev || item.page !== prev.page || Math.abs(item.y - prev.y) > Math.max(prev.height, 1) * 0.5) {
      lines.push([]);
    }
    lines[lines.length - 1].push(item.str);
    prev = item;
  }
  return lines.map((parts) => parts.join(" ").trim());
}

/**
 * A URL on its own, optionally after a short label (`Source: https://…`) or
 * a footnote number (`2 https://…`).
 */
const URL_LINE =
  /^(?:\d{1,3}\s+)?(?:[\p{L} ]{1,20}:\s*)?(?:https?:\/\/\S+|www\.\S+|[\w-]+(?:\.[\w-]+)+\/\S*)$/iu;
const FOOTNOTE_NUMBER = /^\d{1,3}$/;
const DATE_FORMAT = /\b(?:DD|MM|YY|YYYY|HH)(?:[\s/.-]+(?:DD|MM|YY|YYYY|HH|SS))+\b/;

/**
 * Text that is not code whatever its font: lines that are all URLs (a list
 * of footnote links), or one line with a date-format placeholder or math.
 */
function looksLikeNonCode(items: DetectionItem[], lines: string[]): boolean {
  // A raised footnote number can sit on a line of its own above its URL.
  const content = lines.filter((line) => !FOOTNOTE_NUMBER.test(line));
  if (content.length > 0 && content.every((line) => URL_LINE.test(line))) return true;
  return lines.length === 1 && (DATE_FORMAT.test(lines[0]) || looksLikeMath(items));
}

// ---------------------------------------------------------------------------
// Text cleaning (ligatures, control chars, encoding artifacts)
// ---------------------------------------------------------------------------

/**
 * Clean PDF-extracted text: replace ligatures, strip control characters,
 * normalize special spaces, and collapse whitespace.
 */
export function cleanText(s: string): string {
  return s
    // Replace common ligatures
    .replace(/\uFB00/g, "ff")
    .replace(/\uFB01/g, "fi")
    .replace(/\uFB02/g, "fl")
    .replace(/\uFB03/g, "ffi")
    .replace(/\uFB04/g, "ffl")
    // Map Windows-1252 C1 control chars to their intended characters
    // (PDF.js sometimes emits these from fonts with non-standard encodings)
    .replace(/\u0091/g, "\u2018") // left single quote
    .replace(/\u0092/g, "\u2019") // right single quote
    .replace(/\u0093/g, "\u201C") // left double quote
    .replace(/\u0094/g, "\u201D") // right double quote
    .replace(/\u0096/g, "\u2013") // en dash
    .replace(/\u0097/g, "\u2014") // em dash
    .replace(/\u0085/g, "\u2026") // ellipsis
    // Bullet glyphs from Symbol and Wingdings fonts come through in the
    // private-use area; map them so list detection sees a bullet.
    .replace(/\uf0b7/g, "\u2022") // Symbol bullet
    .replace(/\uf0a7/g, "\u25aa") // Wingdings small square
    // Strip remaining C0 control chars (except tab, newline, carriage return)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Strip remaining C1 control chars (U+0080-U+009F) that weren't mapped above
    .replace(/[\x80-\x84\x86-\x90\x95\x98-\x9F]/g, "")
    // Normalize special spaces to regular space
    .replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, " ")
    // Remove zero-width characters
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
    // Strip soft hyphens
    .replace(/\u00AD/g, "")
    // Collapse multiple spaces
    .replace(/ {2,}/g, " ");
}

// ---------------------------------------------------------------------------
// YAML front matter
// ---------------------------------------------------------------------------

function escapeYaml(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Parse PDF date format (D:YYYYMMDDHHmmSSOHH'mm') to ISO date string.
 */
export function parsePdfDate(dateStr: string): string {
  const match = dateStr.match(
    /D:(\d{4})(\d{2})(\d{2})(?:(\d{2})(\d{2})(\d{2}))?/,
  );
  if (!match) return dateStr;
  const [, year, month, day] = match;
  return `${year}-${month}-${day}`;
}

export function metadataToYaml(metadata: ConversionMetadata): string | null {
  const lines: string[] = [];

  if (metadata.title) lines.push(`title: "${escapeYaml(metadata.title)}"`);
  if (metadata.author) lines.push(`author: "${escapeYaml(metadata.author)}"`);
  if (metadata.subject)
    lines.push(`subject: "${escapeYaml(metadata.subject)}"`);
  if (metadata.keywords && metadata.keywords.length > 0) {
    lines.push("keywords:");
    for (const kw of metadata.keywords) {
      lines.push(`  - "${escapeYaml(kw)}"`);
    }
  }
  if (metadata.creationDate) {
    lines.push(`date: "${parsePdfDate(metadata.creationDate)}"`);
  }

  if (lines.length === 0) return null;

  return ["---", ...lines, "---"].join("\n");
}

// ---------------------------------------------------------------------------
// Column layout detection
// ---------------------------------------------------------------------------

export interface ColumnLayout {
  type: "single" | "two-column";
  gapCenter?: number; // X midpoint of the gap between columns
  gapStart?: number; // X where the gap begins
  gapEnd?: number; // X where the gap ends
  splitY?: number; // Y where two-column layout begins (undefined = from top)
  /**
   * A narrow column of prose beside a wider column of prose (a summary box
   * beside the main text). Such a page is often the only two-column page of
   * a document, so the cross-page check keeps it.
   */
  sidebar?: boolean;
}

const COL_BIN_WIDTH = 8; // histogram bin width in PDF points
const COL_MIN_GAP_PTS = 20; // minimum column gap in PDF points

/** Group items into text lines by vertical proximity. */
function groupIntoLines(items: DetectionItem[]): DetectionItem[][] {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => a.y - b.y);
  const lines: DetectionItem[][] = [];
  let currentLine: DetectionItem[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const lineH = Math.max(prev.height, prev.fontSize, 8);
    if (Math.abs(curr.y - prev.y) <= lineH * 0.6) {
      currentLine.push(curr);
    } else {
      lines.push(currentLine);
      currentLine = [curr];
    }
  }
  lines.push(currentLine);
  return lines;
}

/** Merge a sorted list of [start, end] intervals (with small tolerance). */
function mergeIntervals(
  intervals: [number, number][],
  tol = 2,
): [number, number][] {
  const merged: [number, number][] = [];
  for (const [s, e] of intervals) {
    if (merged.length === 0 || s > merged[merged.length - 1][1] + tol) {
      merged.push([s, e]);
    } else {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
    }
  }
  return merged;
}

/**
 * Detect multi-column layout for a single page's text items.
 *
 * Algorithm (per-line gap analysis):
 * 1. Group items into text lines.
 * 2. For each line, compute merged X-coverage intervals and find any gap
 *    in the central 35–65% of the page that is ≥ 20pt wide.
 * 3. Collect detected gap centers across lines.
 * 4. If a consistent gap center appears in ≥ 30% of lines → two-column.
 *
 * This correctly handles mixed layouts (full-width title/abstract at top
 * followed by a two-column body) because the header lines produce no gap,
 * while the column lines consistently show the same gap.
 */
export function detectColumnLayout(items: DetectionItem[]): ColumnLayout {
  if (items.length < 8) return { type: "single" };

  // Filter out small-font items (diagram labels, footnotes, superscripts)
  // that can create false column gaps
  const sizeCharCount = new Map<number, number>();
  for (const item of items) {
    const rounded = Math.round(item.fontSize * 10) / 10;
    sizeCharCount.set(rounded, (sizeCharCount.get(rounded) ?? 0) + item.str.length);
  }
  let bodySize = 10;
  let maxCharCount = 0;
  for (const [size, count] of sizeCharCount) {
    if (count > maxCharCount) {
      maxCharCount = count;
      bodySize = size;
    }
  }
  const minFontSize = bodySize * 0.7;
  const filteredItems = items.filter((item) => item.fontSize >= minFontSize);
  if (filteredItems.length < 8) return { type: "single" };

  // Estimate rightmost edge of content (proxy for page content width)
  let maxRight = 0;
  for (const item of filteredItems) {
    if (item.width > 0) maxRight = Math.max(maxRight, item.x + item.width);
  }
  if (maxRight < 200) return { type: "single" };

  const searchMin = maxRight * 0.35;
  const searchMax = maxRight * 0.65;
  const lines = groupIntoLines(filteredItems);
  if (lines.length < 3) return { type: "single" };

  // Per-line gap detection: find gaps within each line's merged X-coverage
  const lineCenters: number[] = []; // gap centers detected per line

  for (const line of lines) {
    const sorted = line
      .map((it): [number, number] => [it.x, it.x + Math.max(it.width, 1)])
      .sort((a, b) => a[0] - b[0]);
    const merged = mergeIntervals(sorted);

    for (let i = 0; i + 1 < merged.length; i++) {
      const gS = merged[i][1]; // gap start (right edge of left interval)
      const gE = merged[i + 1][0]; // gap end (left edge of right interval)
      const gW = gE - gS;
      const gC = (gS + gE) / 2;

      if (gW >= COL_MIN_GAP_PTS && gC >= searchMin && gC <= searchMax) {
        lineCenters.push(gC);
        break; // only count one gap per line
      }
    }
  }

  // Minimum column span for validation (used in both primary and fallback paths)
  const MIN_COLUMN_SPAN = 100;

  // Require gap in at least 40% of lines (raised from 30% to reduce false positives)
  // Fallback: if per-line gaps are sparse but items show bimodal X-distribution
  // (clear left and right clusters with an empty gap), still detect two-column.
  // This catches layouts where each line has items in only one column.
  if (lineCenters.length < lines.length * 0.4) {
    // Collect items with width, sorted by left edge
    const byX = filteredItems
      .filter((it) => it.width > 0)
      .sort((a, b) => a.x - b.x);
    const leftEdges = byX.map((it) => it.x);
    // Furthest right edge of body-size text up to each index: the empty strip
    // between two clusters runs from it to the next left edge. A large title
    // or logo above the columns may run across the strip, so it is left out.
    const reachRight: number[] = [];
    byX.forEach((it, i) => {
      const prev = i > 0 ? reachRight[i - 1] : -Infinity;
      const edge = it.fontSize <= bodySize * 1.3 ? it.x + it.width : -Infinity;
      reachRight.push(Math.max(prev, edge));
    });

    // Find the largest gap between consecutive left-edge positions
    // in the search window — a large gap indicates two clusters of items.
    // A narrow sidebar beside a wide main column (Copyright Office circulars)
    // has its left-edge midpoint left of the window, so the centre of the
    // empty strip between the clusters may be in the window instead.
    let bestBimodalGapStart = 0;
    let bestBimodalGapEnd = 0;
    let bestBimodalGapWidth = 0;
    let bestBimodalCenter = 0;
    for (let i = 0; i + 1 < leftEdges.length; i++) {
      const gW = leftEdges[i + 1] - leftEdges[i];
      const gC = (leftEdges[i] + leftEdges[i + 1]) / 2;
      const stripCenter =
        reachRight[i] < leftEdges[i + 1] ? (reachRight[i] + leftEdges[i + 1]) / 2 : NaN;
      const inWindow = (c: number) => c >= searchMin && c <= searchMax;
      if (gW > bestBimodalGapWidth && (inWindow(gC) || inWindow(stripCenter))) {
        bestBimodalGapWidth = gW;
        bestBimodalGapStart = leftEdges[i];
        bestBimodalGapEnd = leftEdges[i + 1];
        bestBimodalCenter = inWindow(gC) ? gC : stripCenter;
      }
    }

    // Require a substantial gap between clusters (≥60pt)
    const MIN_BIMODAL_GAP = 60;
    if (bestBimodalGapWidth >= MIN_BIMODAL_GAP) {
      const bimodalCenter = bestBimodalCenter;
      let leftN = 0;
      let rightN = 0;
      for (const item of filteredItems) {
        if (item.x <= bestBimodalGapStart) leftN++;
        else if (item.x >= bestBimodalGapEnd) rightN++;
      }
      // Reject if many left-side items extend past the gap (full-width text)
      let leftCrossing = 0;
      for (const item of filteredItems) {
        if (
          item.x <= bestBimodalGapStart &&
          item.x + item.width > bestBimodalGapEnd
        ) {
          leftCrossing++;
        }
      }
      const bimodalRatio = leftN / (leftN + rightN);
      if (
        leftN >= 10 &&
        rightN >= 10 &&
        bimodalRatio >= 0.2 &&
        bimodalRatio <= 0.8 &&
        leftCrossing < leftN * 0.3 // <30% of left items cross the gap
      ) {
        // Verify column spans are substantial
        let lMin = Infinity, lMax = -Infinity;
        let rMin = Infinity, rMax = -Infinity;
        for (const item of filteredItems) {
          if (item.x <= bestBimodalGapStart) {
            lMin = Math.min(lMin, item.x);
            lMax = Math.max(lMax, item.x + item.width);
          } else if (item.x >= bestBimodalGapEnd) {
            rMin = Math.min(rMin, item.x);
            rMax = Math.max(rMax, item.x + item.width);
          }
        }
        if (lMax - lMin >= MIN_COLUMN_SPAN && rMax - rMin >= MIN_COLUMN_SPAN) {
          const splitY = findColumnSplitY(lines, bimodalCenter);
          return {
            type: "two-column",
            gapStart: bestBimodalGapStart,
            gapEnd: bestBimodalGapEnd,
            gapCenter: bimodalCenter,
            splitY,
            ...(isSidebarLayout(lines, bimodalCenter, bodySize) ? { sidebar: true } : {}),
          };
        }
      }
    }

    return { type: "single" };
  }

  // Find the consensus gap center (median, then filter within ±30pt)
  lineCenters.sort((a, b) => a - b);
  const medianCenter = lineCenters[Math.floor(lineCenters.length / 2)];
  const consistent = lineCenters.filter((c) => Math.abs(c - medianCenter) < 30);

  // Require consistent gap in at least 30% of lines (raised from 20%)
  if (consistent.length < lines.length * 0.3) return { type: "single" };

  const gapCenter =
    consistent.reduce((s, c) => s + c, 0) / consistent.length;

  // Average the actual gap bounds from consistent lines
  let sumGapStart = 0;
  let sumGapEnd = 0;
  let boundCount = 0;

  for (const line of lines) {
    const sorted = line
      .map((it): [number, number] => [it.x, it.x + Math.max(it.width, 1)])
      .sort((a, b) => a[0] - b[0]);
    const merged = mergeIntervals(sorted);

    for (let i = 0; i + 1 < merged.length; i++) {
      const gS = merged[i][1];
      const gE = merged[i + 1][0];
      const gC = (gS + gE) / 2;
      if (Math.abs(gC - gapCenter) < 30) {
        sumGapStart += gS;
        sumGapEnd += gE;
        boundCount++;
        break;
      }
    }
  }

  const gapStart =
    boundCount > 0 ? sumGapStart / boundCount : gapCenter - 15;
  const gapEnd = boundCount > 0 ? sumGapEnd / boundCount : gapCenter + 15;

  // Require each column to span a substantial width (not just short labels)
  // Uses column span (max right edge - min left edge) rather than individual
  // item widths, so columns with many short items (e.g., git commands) pass.
  let leftMin = Infinity, leftMax = -Infinity, leftItemCount = 0;
  let rightMin = Infinity, rightMax = -Infinity, rightItemCount = 0;
  for (const item of filteredItems) {
    if (item.x + item.width <= gapStart) {
      leftMin = Math.min(leftMin, item.x);
      leftMax = Math.max(leftMax, item.x + item.width);
      leftItemCount++;
    } else if (item.x >= gapEnd) {
      rightMin = Math.min(rightMin, item.x);
      rightMax = Math.max(rightMax, item.x + item.width);
      rightItemCount++;
    }
  }
  const leftSpan = leftItemCount > 0 ? leftMax - leftMin : 0;
  const rightSpan = rightItemCount > 0 ? rightMax - rightMin : 0;
  if (leftSpan < MIN_COLUMN_SPAN || rightSpan < MIN_COLUMN_SPAN) {
    return { type: "single" };
  }

  // Require meaningful content on both sides
  let leftCount = 0;
  let rightCount = 0;
  for (const item of filteredItems) {
    if (item.x < gapCenter) leftCount++;
    else rightCount++;
  }
  const ratio = leftCount / (leftCount + rightCount);
  if (ratio < 0.15 || ratio > 0.85) return { type: "single" };

  const splitY = findColumnSplitY(lines, gapCenter);
  return {
    type: "two-column",
    gapStart,
    gapEnd,
    gapCenter,
    splitY,
    ...(isSidebarLayout(lines, gapCenter, bodySize) ? { sidebar: true } : {}),
  };
}

/** A sidebar column is at most this share of the main column's width. */
const SIDEBAR_WIDTH_SHARE = 0.75;
/** Share of each column's lines that must be prose for a sidebar layout. */
const SIDEBAR_PROSE_LINES = 0.6;
/** A line of a column is prose when its text fills this share of the column. */
const SIDEBAR_PROSE_FILL = 0.6;

/**
 * True when the page is a narrow column of prose beside a wider column of
 * prose. Tables, forms and lists that look two-column have short pieces of
 * text, so most of their lines do not fill the column.
 */
function isSidebarLayout(lines: DetectionItem[][], gapCenter: number, bodySize: number): boolean {
  const sides = [[], []] as [number, number][][][];
  for (const line of lines) {
    const body = line.filter((it) => it.width > 0 && it.fontSize <= bodySize * 1.3);
    const cells = mergeIntervals(
      body.map((it): [number, number] => [it.x, it.x + it.width]).sort((a, b) => a[0] - b[0]),
      TABLE_CELL_GAP,
    );
    const left = cells.filter(([, end]) => end <= gapCenter);
    const right = cells.filter(([start]) => start >= gapCenter);
    if (left.length > 0) sides[0].push(left);
    if (right.length > 0) sides[1].push(right);
  }
  const spans = sides.map((side) => {
    const flat = side.flat();
    if (flat.length === 0) return { min: 0, width: 0 };
    const min = Math.min(...flat.map(([start]) => start));
    return { min, width: Math.max(...flat.map(([, end]) => end)) - min };
  });
  const [left, right] = spans;
  if (left.width <= 0 || right.width <= 0 || left.width > right.width * SIDEBAR_WIDTH_SHARE) return false;
  return sides.every((side, i) => {
    const prose = side.filter((cells) =>
      cells.some(([start, end]) => end - start >= spans[i].width * SIDEBAR_PROSE_FILL),
    ).length;
    return side.length >= 5 && prose >= side.length * SIDEBAR_PROSE_LINES;
  });
}

/**
 * Find the Y coordinate where two-column layout begins.
 * Scans lines from the top; returns the Y of the first line that has items
 * in BOTH the left and right column zones.
 */
function findColumnSplitY(
  lines: DetectionItem[][],
  gapCenter: number,
): number | undefined {
  for (const line of lines) {
    // A right-column line starts right of the gap centre; the gap is often
    // narrow (MMWR: 25pt), so a fixed margin past the centre misses it.
    const hasLeft = line.some((it) => it.x < gapCenter - 10);
    const hasRight = line.some((it) => it.x >= gapCenter);
    if (hasLeft && hasRight) {
      return Math.min(...line.map((it) => it.y));
    }
  }
  return undefined;
}

/** Min gap (pt) between two pieces of a line for them to count as separate cells. */
const TABLE_CELL_GAP = 10;
/** Min consecutive table-like lines that make a full-width table region. */
const MIN_TABLE_REGION_LINES = 3;
/** Min lines of column prose on a page before a full-width table is looked for. */
const MIN_PROSE_LINES = 3;
/**
 * A cell at least this share of its column's width is prose: a region with
 * one is column text beside a table, not a table across both columns.
 */
const PROSE_CELL_SHARE = 0.7;

/**
 * Upright text only. Rotated text (an arXiv stamp in the margin) has a zero
 * vertical scale, so its font size is 0 and its width runs down the page.
 */
function isUpright(item: DetectionItem): boolean {
  return item.fontSize > 0;
}

/** How far (share of a column's width) a full-width line reaches into each column. */
const FULL_WIDTH_REACH = 0.5;

/**
 * True when an item is a full-width line (a table caption, a page-wide
 * footnote): it reaches well into both columns. A short label that only
 * overlaps the gap does not count.
 */
function spansColumns(item: DetectionItem, gapCenter: number, columnWidth: number): boolean {
  const reach = columnWidth * FULL_WIDTH_REACH;
  return isUpright(item) && item.x <= gapCenter - reach && item.x + item.width >= gapCenter + reach;
}

/** A line's upright items as cells: runs of items closer than TABLE_CELL_GAP. */
function lineCells(line: DetectionItem[]): [number, number][] {
  return mergeIntervals(
    line
      .filter(isUpright)
      .map((it): [number, number] => [it.x, it.x + Math.max(it.width, 1)])
      .sort((a, b) => a[0] - b[0]),
    TABLE_CELL_GAP,
  );
}

/** A cell as wide as prose in one column (a text line split into several items). */
function isProseCell([start, end]: [number, number], columnWidth: number): boolean {
  return end - start >= columnWidth * PROSE_CELL_SHARE;
}

/**
 * A table row across both columns: at least four separate cells, with cells
 * on both sides of the gap and none as wide as prose. Two-column prose has
 * one wide cell per column.
 */
function isTableLikeLine(line: DetectionItem[], gapCenter: number, columnWidth: number): boolean {
  const cells = lineCells(line);
  if (cells.length < 4) return false;
  if (cells.some((cell) => isProseCell(cell, columnWidth))) return false;
  return cells.some(([, end]) => end <= gapCenter) && cells.some(([start]) => start >= gapCenter);
}

/**
 * Mark the lines (by index) of tables that run across both columns: runs of
 * at least three table-like lines, plus the lines between them (a section
 * label row such as `U.S. Census Bureau region`). A run with a prose-width
 * cell is a table in one column beside text, and is not marked.
 */
function fullWidthTableLines(
  lines: DetectionItem[][],
  gapCenter: number,
  columnWidth: number,
): Set<number> {
  const marked = new Set<number>();
  // Only a page with column prose has a table that interrupts its columns;
  // on a page of short entries (a multi-column word list) every line looks
  // like a table row.
  const proseLines = lines.filter((line) =>
    lineCells(line).some((cell) => isProseCell(cell, columnWidth)),
  ).length;
  if (proseLines < MIN_PROSE_LINES) return marked;
  const tableLike = lines.map((line) => isTableLikeLine(line, gapCenter, columnWidth));
  let i = 0;
  while (i < lines.length) {
    if (!tableLike[i]) {
      i++;
      continue;
    }
    // Extend the run while the next table-like line is close below.
    let end = i;
    let count = 1;
    for (let j = i + 1; j < lines.length; j++) {
      if (tableLike[j]) {
        end = j;
        count++;
      } else if (j - end > 2) {
        break;
      }
    }
    const hasProse = lines
      .slice(i, end + 1)
      .some((line) => lineCells(line).some((cell) => isProseCell(cell, columnWidth)));
    if (count >= MIN_TABLE_REGION_LINES && !hasProse) {
      for (let k = i; k <= end; k++) marked.add(k);
    }
    i = end + 1;
  }
  return marked;
}

/** Footnote text is at most this share of the body font size. */
const FOOTNOTE_SIZE_SHARE = 0.85;
/** A column's footnotes start at least this many body font sizes below its text. */
const FOOTNOTE_GAP = 1.5;

/** The font size with the most characters (0 when there are no upright items). */
function dominantFontSize(items: DetectionItem[]): number {
  const chars = new Map<number, number>();
  for (const item of items) {
    if (!isUpright(item)) continue;
    const size = Math.round(item.fontSize * 10) / 10;
    chars.set(size, (chars.get(size) ?? 0) + item.str.length);
  }
  let best = 0;
  let bestChars = 0;
  for (const [size, count] of chars) {
    if (count > bestChars) {
      best = size;
      bestChars = count;
    }
  }
  return best;
}

/**
 * Split a column (sorted top to bottom) into its body and the footnotes at
 * its foot: the trailing lines set smaller than the body text, below a gap
 * wider than the body's line spacing.
 */
function splitColumnFootnotes<T extends DetectionItem>(
  column: T[],
  bodySize: number,
): { body: T[]; notes: T[] } {
  if (bodySize <= 0 || column.length === 0) return { body: column, notes: [] };
  const lines = groupIntoLines(column) as T[][];
  const small = (line: T[]) =>
    line.every((it) => !isUpright(it) || it.fontSize <= bodySize * FOOTNOTE_SIZE_SHARE);
  let start = lines.length;
  while (start > 0 && small(lines[start - 1])) start--;
  if (start === 0 || start === lines.length) return { body: column, notes: [] };
  const lastBody = Math.max(...lines[start - 1].map((it) => it.y));
  const firstNote = Math.min(...lines[start].map((it) => it.y));
  if (firstNote - lastBody < bodySize * FOOTNOTE_GAP) return { body: column, notes: [] };
  const notes = new Set(lines.slice(start).flat());
  return {
    body: column.filter((it) => !notes.has(it)),
    notes: column.filter((it) => notes.has(it)),
  };
}

/** A footnote marker: up to three digits, letters or note symbols. */
const FOOTNOTE_MARKER = /^[0-9a-z*\u2020\u2021\u00A7\u00B6,]{1,3}$/i;

/**
 * Move each raised footnote marker (a smaller item a few points above the
 * baseline of the line it ends) from before that line to the end of it. A
 * sort by y puts the marker first because its baseline is higher.
 */
function placeRaisedMarkers<T extends DetectionItem>(column: T[]): T[] {
  const out = [...column];
  for (let i = 0; i + 1 < out.length; i++) {
    const marker = out[i];
    const next = out[i + 1];
    const rise = next.y - marker.y;
    if (
      !FOOTNOTE_MARKER.test(marker.str.trim()) ||
      !isUpright(marker) ||
      marker.fontSize > next.fontSize * FOOTNOTE_SIZE_SHARE ||
      rise <= 0 ||
      rise > next.fontSize * 0.5 ||
      next.x >= marker.x
    ) {
      continue;
    }
    // The rest of the marker's line: items on the next item's baseline to its left.
    let end = i + 1;
    while (end + 1 < out.length && Math.abs(out[end + 1].y - next.y) <= 3 && out[end + 1].x < marker.x) {
      end++;
    }
    out.splice(i, 1);
    out.splice(end, 0, marker);
  }
  return out;
}

/**
 * Reorder items to fix multi-column reading order.
 *
 * Output order:
 *   [pre-column items, sorted by Y]   ← full-width title/abstract at top
 *   then, top to bottom, each band below the split point:
 *   - a column band: left column items, then right column items
 *   - a full-width band (a line across the gap, such as a table caption, or a
 *     table whose columns span both text columns): its items by Y
 *
 * Uses a generic parameter so it works with both DetectionItem and
 * any superset (e.g. ExtractedItem in converter.ts).
 */
export function reorderColumnarItems<T extends DetectionItem>(
  items: T[],
  layout: ColumnLayout,
): T[] {
  if (layout.type === "single" || layout.gapCenter === undefined) return items;

  const { gapCenter, splitY } = layout;

  const sortByY = (a: T, b: T): number => {
    const dy = a.y - b.y;
    if (Math.abs(dy) > 3) return dy;
    return a.x - b.x;
  };

  const preColumn: T[] = [];
  const body: T[] = [];
  for (const item of items) {
    // Items above the split point belong to the full-width header section
    if (splitY !== undefined && item.y < splitY - 2) preColumn.push(item);
    else body.push(item);
  }
  preColumn.sort(sortByY);

  const lines = groupIntoLines(body) as T[][];
  let leftMin = Infinity;
  for (const item of body) if (isUpright(item)) leftMin = Math.min(leftMin, item.x);
  const columnWidth = Math.max(gapCenter - leftMin, 1);
  const tableLines = fullWidthTableLines(lines, gapCenter, columnWidth);

  const out: T[] = [...preColumn];
  let leftCol: T[] = [];
  let rightCol: T[] = [];
  const flushColumns = () => {
    // Footnotes at the foot of a column come after both columns, so a
    // sentence that runs from the left column into the right one stays whole.
    const bodySize = dominantFontSize([...leftCol, ...rightCol]);
    const left = splitColumnFootnotes(placeRaisedMarkers(leftCol.sort(sortByY)), bodySize);
    const right = splitColumnFootnotes(placeRaisedMarkers(rightCol.sort(sortByY)), bodySize);
    out.push(...left.body, ...right.body, ...left.notes, ...right.notes);
    leftCol = [];
    rightCol = [];
  };
  lines.forEach((line, index) => {
    if (tableLines.has(index) || line.some((it) => spansColumns(it, gapCenter, columnWidth))) {
      flushColumns();
      out.push(...[...line].sort(sortByY));
      return;
    }
    for (const item of line) {
      if (item.x < gapCenter) leftCol.push(item);
      else rightCol.push(item);
    }
  });
  flushColumns();
  return out;
}

// ---------------------------------------------------------------------------
// Markdown table formatting
// ---------------------------------------------------------------------------

export function tableToMarkdown(rows: string[][]): string {
  if (rows.length === 0) return "";

  // A `|` inside a cell would end the cell: escape it (GFM).
  rows = rows.map((row) => row.map((cell) => cell.replace(/\|/g, "\\|")));
  const colCount = rows[0].length;
  const colWidths = new Array(colCount).fill(3);
  for (const row of rows) {
    for (let i = 0; i < colCount; i++) {
      colWidths[i] = Math.max(colWidths[i], (row[i] ?? "").length);
    }
  }

  const header =
    "| " +
    rows[0].map((cell, i) => cell.padEnd(colWidths[i])).join(" | ") +
    " |";
  const separator =
    "| " +
    colWidths.map((w: number) => "-".repeat(w)).join(" | ") +
    " |";
  const dataRows = rows.slice(1).map(
    (row) =>
      "| " +
      row.map((cell, i) => cell.padEnd(colWidths[i])).join(" | ") +
      " |",
  );

  return [header, separator, ...dataRows].join("\n");
}

/**
 * Rejoin words that were hyphenated across line/column breaks by PDF text extraction.
 * Handles two patterns:
 * 1. Line-end: "repre-\nsentation" → "representation"
 * 2. Mid-line (column merge): "repre- sentation" → "representation"
 * Preserves intentional hyphens (e.g., "well-known") which have no space after hyphen.
 */
export function rejoinHyphenatedWords(markdown: string): string {
  const lines = markdown.split("\n");
  const result: string[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Track code block boundaries
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    // Don't modify lines inside code blocks
    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // Mid-line: "word- continuation" → "wordcontinuation"
    // The space after hyphen is the key signal that this is a PDF line-break artifact
    line = line.replace(/([a-z])- ([a-z])/g, "$1$2");

    // Line-end: "word-" + next line starts lowercase → rejoin
    const nextLine = i + 1 < lines.length ? lines[i + 1] : null;
    if (
      nextLine !== null &&
      /[a-z]-$/.test(line) &&
      /^[a-z]/.test(nextLine) &&
      !nextLine.trimStart().startsWith("```")
    ) {
      const dehyphenated = line.slice(0, -1);
      const match = nextLine.match(/^([a-z]+)(.*)/);
      if (match) {
        result.push(dehyphenated + match[1]);
        lines[i + 1] = match[2].trimStart();
        if (lines[i + 1].length === 0 && match[2].trim().length === 0) {
          i++;
        }
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}
