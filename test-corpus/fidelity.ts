#!/usr/bin/env npx tsx
/**
 * Text-fidelity checks (no ground truth needed).
 *
 * Compares pdf2md's Markdown with the raw PDF.js text layer of the same PDF:
 *
 * - word recall: multiset overlap of word tokens (letters/digits, NFKC, lowercased)
 * - numeric-token recall: tokens like `2022`, `46,752`, `3.5`; standalone
 *   numbers in the top/bottom page bands (page numbers) are excluded
 * - link precision: each output `](http…)` link must be paid for by a URL
 *   annotation or a bare URL in the text layer with the same URL (multiset match)
 * - space-before-punctuation rate: `[a-z] [.,;:)]` per 10,000 output words
 * - counts: bold spans, italic spans, code fences
 *
 * These are reported separately from the 9-dimension heuristic score so the
 * score history stays comparable.
 *
 * Usage:
 *   npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/fidelity.ts [dir ...]
 *     [--json out.json] [--save-md outDir] [--update-baseline]
 *
 * With no dirs, runs real-pdfs plus the three blind sets (missing dirs are skipped).
 * `--update-baseline` rewrites test-corpus/fidelity-baseline.json from real-pdfs.
 */

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { convert } from "../packages/core/src/converter";
import { getPdfjs } from "../packages/core/src/pdf-compat";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TextLayerPage {
  /** Raw page text: items joined the way a plain text dump would join them. */
  text: string;
  /** Numeric tokens that are standalone items in the top/bottom 8% (page numbers). */
  bandNumbers: string[];
  /** URLs of Link annotations on this page. */
  annotationUrls: string[];
}

export interface TextLayer {
  pages: TextLayerPage[];
}

export interface FidelityMetrics {
  /** Word tokens in the text layer. */
  sourceWords: number;
  /** Fraction (0–1) of text-layer word tokens found in the output (multiset). */
  wordRecall: number;
  /** Numeric tokens in the text layer, page numbers excluded. */
  sourceNumbers: number;
  /** Fraction (0–1) of text-layer numeric tokens found in the output (multiset). */
  numericRecall: number;
  /** URL link annotations in the PDF. */
  linkAnnotations: number;
  /** Bare http(s) URLs in the text layer. */
  bareUrls: number;
  /** `](http…)` links in the output. */
  outputLinks: number;
  /** Fraction (0–1) of output links matched by an annotation or bare URL. 1 when there are no links. */
  linkPrecision: number;
  /** Output words (whitespace-separated). */
  outputWords: number;
  /** Occurrences of `[a-z] [.,;:)]` in the output. */
  spaceBeforePunct: number;
  /** spaceBeforePunct per 10,000 output words. */
  spaceBeforePunctPer10k: number;
  boldSpans: number;
  italicSpans: number;
  codeFences: number;
}

// ---------------------------------------------------------------------------
// Tokenisation helpers
// ---------------------------------------------------------------------------

const WORD_RE = /[\p{L}\p{N}]+/gu;
const NUMBER_RE = /\d(?:[\d,.]*\d)?/g;
const URL_RE = /https?:\/\/[^\s<>()[\]{}"']+/g;

function normalizeText(text: string): string {
  return text.normalize("NFKC").toLowerCase();
}

export function wordTokens(text: string): string[] {
  return normalizeText(text).match(WORD_RE) ?? [];
}

export function numericTokens(text: string): string[] {
  return (text.normalize("NFKC").match(NUMBER_RE) ?? []);
}

export function normalizeUrl(url: string): string {
  return url.trim().replace(/[.,;:!?'")\]]+$/, "").replace(/\/+$/, "").toLowerCase();
}

function counts(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tokens) map.set(t, (map.get(t) ?? 0) + 1);
  return map;
}

/** Multiset recall of `source` tokens in `output` tokens. */
export function multisetRecall(source: string[], output: string[]): number {
  if (source.length === 0) return 1;
  const out = counts(output);
  let hit = 0;
  for (const [token, n] of counts(source)) {
    hit += Math.min(n, out.get(token) ?? 0);
  }
  return hit / source.length;
}

// ---------------------------------------------------------------------------
// Markdown handling
// ---------------------------------------------------------------------------

const MD_LINK_RE = /\[((?:[^\][]|\[[^\]]*\])*)\]\(([^()\s]*(?:\([^()\s]*\)[^()\s]*)*)\)/g;

export function extractMarkdownLinks(markdown: string): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = [];
  for (const m of markdown.matchAll(MD_LINK_RE)) {
    links.push({ text: m[1], url: m[2] });
  }
  return links;
}

/** Strip Markdown syntax that is not document text: front matter, link targets, markers. */
export function stripMarkdown(markdown: string): string {
  let text = markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
  text = text.replace(MD_LINK_RE, (_m, label: string) => label);
  text = text
    .split("\n")
    .filter((line) => !/^\s*\|?\s*:?-{3,}/.test(line) && !/^```/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, ""))
    .join("\n");
  return text.replace(/\*\*|__|`/g, "").replace(/\|/g, " ");
}

export function countBoldSpans(markdown: string): number {
  return (markdown.match(/\*\*(?=\S)[^*\n]*?\S\*\*/g) ?? []).length;
}

export function countItalicSpans(markdown: string): number {
  const withoutBold = markdown.replace(/\*\*/g, "");
  const star = withoutBold.match(/(?<![\w*])\*(?=\S)[^*\n]*?\S\*(?![\w*])|(?<![\w*])\*[^*\s]\*(?![\w*])/g) ?? [];
  const underscore = withoutBold.match(/(?<![\w_])_(?=\S)[^_\n]*?\S_(?![\w_])/g) ?? [];
  return star.length + underscore.length;
}

export function countCodeFences(markdown: string): number {
  const fences = markdown.split("\n").filter((line) => /^```/.test(line)).length;
  return Math.floor(fences / 2);
}

export function countSpaceBeforePunct(markdown: string): number {
  return (markdown.match(/[a-z] [.,;:)]/g) ?? []).length;
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export function computeFidelity(layer: TextLayer, markdown: string): FidelityMetrics {
  const sourceText = layer.pages.map((p) => p.text).join("\n");
  const bodyText = stripMarkdown(markdown);

  const sourceWordTokens = wordTokens(sourceText);
  const outputWordTokens = wordTokens(bodyText);

  // Numbers: remove one occurrence per page-band number (page numbers, running dates).
  const bandCounts = counts(layer.pages.flatMap((p) => p.bandNumbers));
  const sourceNumbers: string[] = [];
  for (const token of numericTokens(sourceText)) {
    const left = bandCounts.get(token) ?? 0;
    if (left > 0) {
      bandCounts.set(token, left - 1);
      continue;
    }
    sourceNumbers.push(token);
  }
  const outputNumbers = numericTokens(bodyText);

  // Links: every annotation URL or bare text-layer URL pays for one output link.
  const budget = new Map<string, number>();
  let linkAnnotations = 0;
  let bareUrls = 0;
  for (const page of layer.pages) {
    for (const url of page.annotationUrls) {
      linkAnnotations++;
      const key = normalizeUrl(url);
      budget.set(key, (budget.get(key) ?? 0) + 1);
    }
    for (const url of page.text.match(URL_RE) ?? []) {
      bareUrls++;
      const key = normalizeUrl(url);
      budget.set(key, (budget.get(key) ?? 0) + 1);
    }
  }
  const outputLinkUrls = extractMarkdownLinks(markdown.replace(/^---\n[\s\S]*?\n---\n?/, ""))
    .map((l) => l.url)
    .filter((url) => /^https?:\/\//i.test(url));
  let matched = 0;
  for (const [url, n] of counts(outputLinkUrls.map(normalizeUrl))) {
    matched += Math.min(n, budget.get(url) ?? 0);
  }

  const outputWords = bodyText.split(/\s+/).filter(Boolean).length;
  const spaceBeforePunct = countSpaceBeforePunct(markdown);

  return {
    sourceWords: sourceWordTokens.length,
    wordRecall: multisetRecall(sourceWordTokens, outputWordTokens),
    sourceNumbers: sourceNumbers.length,
    numericRecall: multisetRecall(sourceNumbers, outputNumbers),
    linkAnnotations,
    bareUrls,
    outputLinks: outputLinkUrls.length,
    linkPrecision: outputLinkUrls.length === 0 ? 1 : matched / outputLinkUrls.length,
    outputWords,
    spaceBeforePunct,
    spaceBeforePunctPer10k: outputWords === 0 ? 0 : (spaceBeforePunct / outputWords) * 10_000,
    boldSpans: countBoldSpans(markdown),
    italicSpans: countItalicSpans(markdown),
    codeFences: countCodeFences(markdown),
  };
}

// ---------------------------------------------------------------------------
// Raw PDF.js text layer
// ---------------------------------------------------------------------------

interface RawItem {
  str: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  hasEOL: boolean;
}

/**
 * Join raw PDF.js items the way a plain text dump does: items on the same line
 * with no visible gap are concatenated, otherwise separated by a space; a line
 * change or `hasEOL` gives a newline. No other heuristics.
 */
export function joinRawItems(items: RawItem[]): string {
  let out = "";
  let prev: RawItem | null = null;
  for (const item of items) {
    if (prev) {
      const sameLine = Math.abs(item.y - prev.y) < Math.max(prev.fontSize, 1) * 0.5;
      if (prev.hasEOL || !sameLine) {
        out += "\n";
      } else {
        const gap = item.x - (prev.x + prev.width);
        const touching = gap < Math.max(prev.fontSize, 1) * 0.1;
        if (!touching && !/\s$/.test(out) && !/^\s/.test(item.str)) out += " ";
      }
    }
    out += item.str;
    prev = item;
  }
  return out;
}

export async function extractTextLayer(data: Uint8Array): Promise<TextLayer> {
  const { getDocument } = await getPdfjs();
  // Always hand PDF.js its own copy: it may detach the buffer it is given.
  const doc = await getDocument({ data: new Uint8Array(data), useSystemFonts: true }).promise;
  const pages: TextLayerPage[] = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const [content, annotations] = await Promise.all([
        page.getTextContent(),
        page.getAnnotations(),
      ]);
      const viewport = page.getViewport({ scale: 1 });
      const items: RawItem[] = [];
      for (const raw of content.items) {
        if (!("str" in raw)) continue;
        if (raw.str.length === 0 && !raw.hasEOL) continue;
        items.push({
          str: raw.str,
          x: raw.transform[4],
          y: viewport.height - raw.transform[5],
          width: raw.width,
          fontSize: Math.abs(raw.transform[3]) || raw.height || 1,
          hasEOL: raw.hasEOL,
        });
      }

      const band = viewport.height * 0.08;
      const bandNumbers: string[] = [];
      for (const item of items) {
        const trimmed = item.str.trim();
        if (!/^[\d,.\s]+$/.test(trimmed) || !/\d/.test(trimmed)) continue;
        if (item.y <= band || item.y >= viewport.height - band) {
          bandNumbers.push(...numericTokens(trimmed));
        }
      }

      const annotationUrls: string[] = [];
      for (const ann of annotations as Array<{ subtype?: string; url?: string }>) {
        if (ann.subtype === "Link" && typeof ann.url === "string" && /^https?:/i.test(ann.url)) {
          annotationUrls.push(ann.url);
        }
      }

      pages.push({ text: joinRawItems(items), bandNumbers, annotationUrls });
      page.cleanup();
    }
  } finally {
    await doc.destroy();
  }
  return { pages };
}

// ---------------------------------------------------------------------------
// Running over files
// ---------------------------------------------------------------------------

export interface FidelityRow extends FidelityMetrics {
  file: string;
  status: string;
}

export async function fidelityForFile(
  path: string,
  convertOptions: Parameters<typeof convert>[1] = { includeMetadata: true, yamlFrontMatter: true },
): Promise<{ row: FidelityRow; markdown: string }> {
  const bytes = new Uint8Array(await readFile(path));
  const layer = await extractTextLayer(bytes);
  const copy = bytes.slice();
  const result = await convert(copy.buffer, convertOptions);
  return {
    row: { file: basename(path), status: result.status, ...computeFidelity(layer, result.markdown) },
    markdown: result.markdown,
  };
}

const pct = (v: number) => (v * 100).toFixed(1);

/** Markdown table for the evaluate reports (separate from the 9-dimension score). */
export function formatFidelityTable(rows: FidelityRow[]): string {
  const lines = [
    "| PDF | Word recall % | Numeric recall % | Links out / annot / bare | Link precision % | Space-before-punct /10k | Bold | Italic | Code fences |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const r of rows) {
    lines.push(
      `| ${r.file} | ${pct(r.wordRecall)} | ${pct(r.numericRecall)} | ${r.outputLinks} / ${r.linkAnnotations} / ${r.bareUrls} | ${pct(r.linkPrecision)} | ${r.spaceBeforePunctPer10k.toFixed(1)} | ${r.boldSpans} | ${r.italicSpans} | ${r.codeFences} |`,
    );
  }
  return lines.join("\n");
}

export const FIDELITY_SECTION_HEADING = "## Text Fidelity";

/** Report section appended to the evaluate reports. Parsed by autoresearch/compare-results.ts. */
export function fidelityReportSection(rows: FidelityRow[]): string {
  return [
    FIDELITY_SECTION_HEADING,
    "",
    "Compared with the raw PDF.js text layer (`test-corpus/fidelity.ts`). Not part of the 9-dimension score.",
    "",
    formatFidelityTable(rows),
    "",
    formatTotals("Totals", totals(rows)),
  ].join("\n");
}

export interface FidelityTotals {
  files: number;
  meanWordRecall: number;
  meanNumericRecall: number;
  outputLinks: number;
  linkAnnotations: number;
  bareUrls: number;
  meanLinkPrecision: number;
  spaceBeforePunct: number;
  boldSpans: number;
  italicSpans: number;
  codeFences: number;
}

export function totals(rows: FidelityRow[]): FidelityTotals {
  const n = rows.length || 1;
  const sum = (f: (r: FidelityRow) => number) => rows.reduce((s, r) => s + f(r), 0);
  return {
    files: rows.length,
    meanWordRecall: sum((r) => r.wordRecall) / n,
    meanNumericRecall: sum((r) => r.numericRecall) / n,
    outputLinks: sum((r) => r.outputLinks),
    linkAnnotations: sum((r) => r.linkAnnotations),
    bareUrls: sum((r) => r.bareUrls),
    meanLinkPrecision: sum((r) => r.linkPrecision) / n,
    spaceBeforePunct: sum((r) => r.spaceBeforePunct),
    boldSpans: sum((r) => r.boldSpans),
    italicSpans: sum((r) => r.italicSpans),
    codeFences: sum((r) => r.codeFences),
  };
}

export function formatTotals(label: string, t: FidelityTotals): string {
  return `${label}: ${t.files} files | word recall ${pct(t.meanWordRecall)}% | numeric recall ${pct(t.meanNumericRecall)}% | links ${t.outputLinks} (annot ${t.linkAnnotations} + bare ${t.bareUrls}) precision ${pct(t.meanLinkPrecision)}% | space-before-punct ${t.spaceBeforePunct} | bold ${t.boldSpans} | italic ${t.italicSpans} | code fences ${t.codeFences}`;
}

// ---------------------------------------------------------------------------
// Baseline (ratchet) for the tracked corpus
// ---------------------------------------------------------------------------

export type FidelityBaseline = Record<
  string,
  Pick<FidelityMetrics, "wordRecall" | "numericRecall" | "linkPrecision" | "spaceBeforePunctPer10k">
>;

export const BASELINE_PATH = resolve(fileURLToPath(new URL(".", import.meta.url)), "fidelity-baseline.json");

const round4 = (v: number) => Math.round(v * 10_000) / 10_000;

export function toBaseline(rows: FidelityRow[]): FidelityBaseline {
  const baseline: FidelityBaseline = {};
  for (const r of [...rows].sort((a, b) => a.file.localeCompare(b.file))) {
    if (r.status === "failed") continue;
    baseline[r.file] = {
      wordRecall: round4(r.wordRecall),
      numericRecall: round4(r.numericRecall),
      linkPrecision: round4(r.linkPrecision),
      spaceBeforePunctPer10k: Math.round(r.spaceBeforePunctPer10k * 10) / 10,
    };
  }
  return baseline;
}

/** Ratchet tolerances: metrics may only improve, within measurement noise. */
export const RATCHET_TOLERANCE = {
  wordRecall: 0.005,
  numericRecall: 0.0005,
  linkPrecision: 0.0005,
  spaceBeforePunctPer10k: 0.5,
} as const;

export function ratchetFailures(row: FidelityRow, base: FidelityBaseline[string]): string[] {
  const failures: string[] = [];
  if (row.wordRecall < base.wordRecall - RATCHET_TOLERANCE.wordRecall) {
    failures.push(`word recall ${pct(row.wordRecall)}% < baseline ${pct(base.wordRecall)}%`);
  }
  if (row.numericRecall < base.numericRecall - RATCHET_TOLERANCE.numericRecall) {
    failures.push(`numeric recall ${pct(row.numericRecall)}% < baseline ${pct(base.numericRecall)}%`);
  }
  if (row.linkPrecision < base.linkPrecision - RATCHET_TOLERANCE.linkPrecision) {
    failures.push(`link precision ${pct(row.linkPrecision)}% < baseline ${pct(base.linkPrecision)}%`);
  }
  if (row.spaceBeforePunctPer10k > base.spaceBeforePunctPer10k + RATCHET_TOLERANCE.spaceBeforePunctPer10k) {
    failures.push(
      `space-before-punct ${row.spaceBeforePunctPer10k.toFixed(1)}/10k > baseline ${base.spaceBeforePunctPer10k.toFixed(1)}/10k`,
    );
  }
  return failures;
}

/**
 * Run the ratchet over one shard of the tracked corpus (files whose sorted
 * index % shardCount === shard). Sharding lets vitest spread the corpus over
 * its worker threads. Returns the list of problems (empty when all pass).
 */
export async function ratchetShard(
  corpusDir: string,
  shard: number,
  shardCount: number,
): Promise<{ checked: number; problems: string[] }> {
  const baseline = JSON.parse(await readFile(BASELINE_PATH, "utf-8")) as FidelityBaseline;
  const files = (await listPdfs(corpusDir)).filter((_, i) => i % shardCount === shard);
  const problems: string[] = [];
  for (const file of files) {
    const { row } = await fidelityForFile(file);
    const base = baseline[row.file];
    if (row.status === "failed") {
      // Scanned PDFs have no text layer; a baseline entry would mean conversion regressed.
      if (base) problems.push(`${row.file}: conversion failed but a baseline exists`);
      continue;
    }
    if (!base) {
      problems.push(`${row.file}: missing from fidelity-baseline.json`);
      continue;
    }
    for (const failure of ratchetFailures(row, base)) problems.push(`${row.file}: ${failure}`);
  }
  return { checked: files.length, problems };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function listPdfs(dir: string): Promise<string[]> {
  try {
    return (await readdir(dir)).filter((f) => f.endsWith(".pdf")).sort().map((f) => join(dir, f));
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const scriptDir = fileURLToPath(new URL(".", import.meta.url));
  let jsonOut: string | undefined;
  let saveMd: string | undefined;
  let updateBaseline = false;
  const dirs: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--json") jsonOut = args[++i];
    else if (args[i] === "--save-md") saveMd = args[++i];
    else if (args[i] === "--update-baseline") updateBaseline = true;
    else dirs.push(resolve(args[i]));
  }
  if (dirs.length === 0) {
    dirs.push(...["real-pdfs", "blind-pdfs", "blind-pdfs-2", "blind-pdfs-3"].map((d) => join(scriptDir, d)));
  }

  const all: Record<string, FidelityRow[]> = {};
  for (const dir of dirs) {
    const files = await listPdfs(dir);
    if (files.length === 0) continue;
    const label = basename(dir);
    const rows: FidelityRow[] = [];
    for (const file of files) {
      try {
        const start = performance.now();
        const { row, markdown } = await fidelityForFile(file);
        rows.push(row);
        if (saveMd) {
          await mkdir(join(saveMd, label), { recursive: true });
          await writeFile(join(saveMd, label, basename(file).replace(/\.pdf$/, ".md")), markdown, "utf-8");
        }
        console.error(`  ${label}/${row.file}: ${Math.round(performance.now() - start)}ms`);
      } catch (err) {
        console.error(`  ${label}/${basename(file)}: ERROR ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    all[label] = rows;
    console.log(`\n## ${label}\n`);
    console.log(formatFidelityTable(rows));
    console.log(`\n${formatTotals(label, totals(rows))}`);
  }

  console.log("\n## Totals\n");
  for (const [label, rows] of Object.entries(all)) console.log(formatTotals(label, totals(rows)));

  if (jsonOut) await writeFile(jsonOut, JSON.stringify(all, null, 2) + "\n", "utf-8");
  if (updateBaseline) {
    const rows = all["real-pdfs"];
    if (!rows) throw new Error("--update-baseline needs real-pdfs in the run");
    await writeFile(BASELINE_PATH, JSON.stringify(toBaseline(rows), null, 2) + "\n", "utf-8");
    console.log(`\nBaseline written to ${BASELINE_PATH}`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
