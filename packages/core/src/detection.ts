/**
 * Pure detection utilities for table, code block, and metadata processing.
 * Separated from converter.ts to avoid pdfjs-dist dependency in tests.
 */

import type { ConversionMetadata } from "./types";

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
}

// ---------------------------------------------------------------------------
// Font analysis
// ---------------------------------------------------------------------------

export function isMonospace(fontName: string): boolean {
  const lower = fontName.toLowerCase();
  return /courier|consolas|mono|menlo|monaco|inconsolata|fira.?code|source.?code|liberation.?mono|deja.?vu.?mono|roboto.?mono|noto.?mono|hack|iosevka|jetbrains.?mono|sf.?mono|andale|lucida.?console|fixed|terminal|nimbusmon|\.cc\b/.test(
    lower,
  );
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
      currentRow.sort((a, b) => a.x - b.x);
      rows.push(currentRow);
      currentRow = [curr];
    } else {
      currentRow.push(curr);
    }
  }
  currentRow.sort((a, b) => a.x - b.x);
  rows.push(currentRow);

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

  return consistentRows.map((row) => row.map((item) => item.str.trim()));
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
 * Check if items form a code block.
 * Uses multiple signals: known monospace fonts, detected code fonts, and syntax patterns.
 * Includes a prose guard to prevent wrapping natural language text in code fences.
 */
export function isCodeBlock(items: DetectionItem[], codeFonts?: Set<string>): boolean {
  if (items.length === 0) return false;

  let monoChars = 0;
  let totalChars = 0;
  let codeFontChars = 0;
  for (const item of items) {
    const len = item.str.length;
    totalChars += len;
    if (isMonospace(item.fontName)) {
      monoChars += len;
    }
    if (codeFonts?.has(item.fontName)) {
      codeFontChars += len;
    }
  }

  // Minimum content: reject very short blocks (isolated math symbols, single words)
  if (totalChars < 8) return false;

  // Signal 1: Known monospace font names
  if (totalChars > 0 && monoChars / totalChars >= 0.8) {
    // Even with monospace fonts, reject if text is clearly prose
    if (looksLikeProse(items)) return false;
    return true;
  }

  // Signal 2: Detected code font (subset fonts like g_d0_f3)
  // More conservative: also reject if text looks like prose or a short label
  if (totalChars > 0 && codeFonts && codeFontChars / totalChars >= 0.8) {
    if (looksLikeProse(items)) return false;
    // Reject short blocks that look like labels/titles (no code syntax)
    if (totalChars < 50 && !/[{}()=;:<>\/\\|&!@#$%^*+~`]/.test(items.map((i) => i.str).join(""))) {
      return false;
    }
    return true;
  }

  return false;
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
    // Collect item left-edge X positions, sorted
    const leftEdges = filteredItems
      .filter((it) => it.width > 0)
      .map((it) => it.x)
      .sort((a, b) => a - b);

    // Find the largest gap between consecutive left-edge positions
    // in the search window — a large gap indicates two clusters of items
    let bestBimodalGapStart = 0;
    let bestBimodalGapEnd = 0;
    let bestBimodalGapWidth = 0;
    for (let i = 0; i + 1 < leftEdges.length; i++) {
      const gW = leftEdges[i + 1] - leftEdges[i];
      const gC = (leftEdges[i] + leftEdges[i + 1]) / 2;
      if (
        gW > bestBimodalGapWidth &&
        gC >= searchMin &&
        gC <= searchMax
      ) {
        bestBimodalGapWidth = gW;
        bestBimodalGapStart = leftEdges[i];
        bestBimodalGapEnd = leftEdges[i + 1];
      }
    }

    // Require a substantial gap between clusters (≥60pt)
    const MIN_BIMODAL_GAP = 60;
    if (bestBimodalGapWidth >= MIN_BIMODAL_GAP) {
      const bimodalCenter = (bestBimodalGapStart + bestBimodalGapEnd) / 2;
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
  return { type: "two-column", gapStart, gapEnd, gapCenter, splitY };
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
    const hasLeft = line.some((it) => it.x < gapCenter - 10);
    const hasRight = line.some((it) => it.x > gapCenter + 10);
    if (hasLeft && hasRight) {
      return Math.min(...line.map((it) => it.y));
    }
  }
  return undefined;
}

/**
 * Reorder items to fix multi-column reading order.
 *
 * Output order:
 *   [pre-column items, sorted by Y]   ← full-width title/abstract at top
 *   [left column items, sorted by Y]  ← left column top to bottom
 *   [right column items, sorted by Y] ← right column top to bottom
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

  const preColumn: T[] = [];
  const leftCol: T[] = [];
  const rightCol: T[] = [];

  for (const item of items) {
    // Items above the split point belong to the full-width header section
    if (splitY !== undefined && item.y < splitY - 2) {
      preColumn.push(item);
    } else if (item.x < gapCenter) {
      leftCol.push(item);
    } else {
      rightCol.push(item);
    }
  }

  const sortByY = (a: T, b: T): number => {
    const dy = a.y - b.y;
    if (Math.abs(dy) > 3) return dy;
    return a.x - b.x;
  };

  preColumn.sort(sortByY);
  leftCol.sort(sortByY);
  rightCol.sort(sortByY);

  return [...preColumn, ...leftCol, ...rightCol];
}

// ---------------------------------------------------------------------------
// Markdown table formatting
// ---------------------------------------------------------------------------

export function tableToMarkdown(rows: string[][]): string {
  if (rows.length === 0) return "";

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
