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

  return consistentRows.map((row) => row.map((item) => item.str.trim()));
}

// ---------------------------------------------------------------------------
// Code block detection
// ---------------------------------------------------------------------------

/**
 * Check if items are all (or nearly all) monospace font, indicating a code block.
 */
export function isCodeBlock(items: DetectionItem[]): boolean {
  if (items.length === 0) return false;

  let monoChars = 0;
  let totalChars = 0;
  for (const item of items) {
    const len = item.str.length;
    totalChars += len;
    if (isMonospace(item.fontName)) {
      monoChars += len;
    }
  }

  return totalChars > 0 && monoChars / totalChars >= 0.8;
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
