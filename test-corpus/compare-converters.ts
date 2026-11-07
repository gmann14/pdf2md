#!/usr/bin/env npx tsx
/**
 * Head-to-head comparison: pdf2md vs @opendocsg/pdf2md on the same PDFs, same machine.
 *
 * Runs each evaluate script once per converter (CONV=..., output in the git-ignored
 * test-corpus/.h2h/<converter>/), then reads the reports back and prints:
 *
 * - the heuristic 9-dimension score, per PDF and per dimension (with and without metadata)
 * - total conversion time
 * - the text-fidelity metrics (word recall, numeric recall, link precision)
 *
 * The heuristic scorer rewards presence, not correctness (see docs/quality-testing.md,
 * "Head-to-head comparison"). Do not quote these numbers publicly as "better than".
 *
 * Usage:
 *   pnpm compare:opendocsg [--skip-run] [--sets training,blind1,blind2,blind3]
 *                          [--pdfs-root <dir with real-pdfs/ and blind-pdfs*>]
 *
 * Sets whose PDF directory is missing are skipped (the blind sets are local-only).
 * If @opendocsg/pdf2md is not installed, the script says so and exits 0.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFidelitySection, type DocumentFidelity } from "../autoresearch/compare-results";
import { CONVERTER_NAMES, H2H_DIR, converterAvailable, type ConverterName } from "./converters";

const TEST_CORPUS_DIR = fileURLToPath(new URL(".", import.meta.url));
const ROOT_DIR = resolve(TEST_CORPUS_DIR, "..");

export const DATASETS = [
  { key: "training", script: "evaluate.ts", pdfDir: "real-pdfs", report: "QUALITY-REPORT.md" },
  { key: "blind1", script: "evaluate-blind.ts", pdfDir: "blind-pdfs", report: "BLIND-TEST-REPORT.md" },
  { key: "blind2", script: "evaluate-blind-2.ts", pdfDir: "blind-pdfs-2", report: "BLIND-TEST-2-REPORT.md" },
  { key: "blind3", script: "evaluate-blind-3.ts", pdfDir: "blind-pdfs-3", report: "BLIND-TEST-3-REPORT.md" },
] as const;

export type DatasetKey = (typeof DATASETS)[number]["key"];

/** Same weights as the evaluate scripts. */
export const DIMENSION_WEIGHTS = {
  headingDetection: 1.5,
  paragraphIntegrity: 2.0,
  listDetection: 1.0,
  tableDetection: 1.0,
  codeBlockDetection: 0.8,
  linkExtraction: 0.8,
  metadataExtraction: 0.5,
  noGarbage: 1.5,
  overallReadability: 1.5,
} as const;

export type Dimension = keyof typeof DIMENSION_WEIGHTS;
export const DIMENSIONS = Object.keys(DIMENSION_WEIGHTS) as Dimension[];

export interface DocResult {
  timeMs: number;
  dims: Record<Dimension, number>;
  fidelity?: DocumentFidelity;
}

export type ParsedReport = Record<string, DocResult>;

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

const SUMMARY_ROW = /^\|\s*([^|\s][^|]*?\.pdf)\s*\|[^|]*\|[^|]*\|[^|]*\|\s*(\d+)ms\s*\|\s*\*\*[\d.]+\*\*\s*\|/gm;

/** Read the Score Summary, Detailed Score Breakdown and Text Fidelity tables of an evaluate report. */
export function parseEvalReport(content: string): ParsedReport {
  const times = new Map<string, number>();
  for (const m of content.matchAll(SUMMARY_ROW)) times.set(m[1].trim(), Number(m[2]));

  const fidelity = parseFidelitySection(content) ?? {};
  const out: ParsedReport = {};
  const detailStart = content.indexOf("## Detailed Score Breakdown");
  if (detailStart === -1) return out;
  const nextSection = content.indexOf("\n## ", detailStart + 1);
  const detail = content.slice(detailStart, nextSection === -1 ? undefined : nextSection);
  for (const line of detail.split("\n")) {
    const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    if (cells.length !== DIMENSIONS.length + 1 || !cells[0].endsWith(".pdf")) continue;
    const values = cells.slice(1).map(Number);
    if (values.some((v) => !Number.isFinite(v))) continue;
    const dims = Object.fromEntries(DIMENSIONS.map((d, i) => [d, values[i]])) as Record<Dimension, number>;
    const file = cells[0];
    out[file] = { timeMs: times.get(file) ?? 0, dims, ...(fidelity[file] ? { fidelity: fidelity[file] } : {}) };
  }
  return out;
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

export function weightedScore(dims: Record<Dimension, number>, excludeMetadata = false): number {
  let sum = 0;
  let total = 0;
  for (const d of DIMENSIONS) {
    if (excludeMetadata && d === "metadataExtraction") continue;
    sum += dims[d] * DIMENSION_WEIGHTS[d];
    total += DIMENSION_WEIGHTS[d];
  }
  return total === 0 ? 0 : sum / total;
}

/** Differences smaller than this count as a tie. */
export const TIE_MARGIN = 0.05;

export interface DocComparison {
  dataset: DatasetKey;
  file: string;
  a: DocResult;
  b: DocResult;
}

export interface ComparisonSummary {
  converters: [ConverterName, ConverterName];
  pdfs: number;
  scoreAll: [number, number];
  scoreNoMetadata: [number, number];
  dimensions: Record<Dimension, [number, number]>;
  /** PDFs where a / b scores higher (metadata excluded), and ties. */
  wins: [number, number];
  ties: number;
  totalMs: [number, number];
  /** Means over PDFs that have fidelity rows for both converters (percent). */
  fidelity: { pdfs: number; wordRecall: [number, number]; numericRecall: [number, number]; linkPrecision: [number, number] };
}

const mean = (xs: number[]) => (xs.length === 0 ? 0 : xs.reduce((s, x) => s + x, 0) / xs.length);

export function pairDocs(
  a: Partial<Record<DatasetKey, ParsedReport>>,
  b: Partial<Record<DatasetKey, ParsedReport>>,
): DocComparison[] {
  const docs: DocComparison[] = [];
  for (const { key } of DATASETS) {
    const ra = a[key];
    const rb = b[key];
    if (!ra || !rb) continue;
    for (const file of Object.keys(ra).sort()) {
      const docB = rb[file];
      if (docB) docs.push({ dataset: key, file, a: ra[file], b: docB });
    }
  }
  return docs;
}

export function summarize(converters: [ConverterName, ConverterName], docs: DocComparison[]): ComparisonSummary {
  const pick = (f: (d: DocResult) => number): [number, number] => [mean(docs.map((d) => f(d.a))), mean(docs.map((d) => f(d.b)))];
  let winsA = 0;
  let winsB = 0;
  for (const d of docs) {
    const sa = weightedScore(d.a.dims, true);
    const sb = weightedScore(d.b.dims, true);
    if (sa > sb + TIE_MARGIN) winsA++;
    else if (sb > sa + TIE_MARGIN) winsB++;
  }
  const withFidelity = docs.filter((d) => d.a.fidelity && d.b.fidelity);
  const fid = (f: (x: DocumentFidelity) => number): [number, number] => [
    mean(withFidelity.map((d) => f(d.a.fidelity as DocumentFidelity))),
    mean(withFidelity.map((d) => f(d.b.fidelity as DocumentFidelity))),
  ];
  return {
    converters,
    pdfs: docs.length,
    scoreAll: pick((d) => weightedScore(d.dims)),
    scoreNoMetadata: pick((d) => weightedScore(d.dims, true)),
    dimensions: Object.fromEntries(DIMENSIONS.map((dim) => [dim, pick((d) => d.dims[dim])])) as Record<Dimension, [number, number]>,
    wins: [winsA, winsB],
    ties: docs.length - winsA - winsB,
    totalMs: [docs.reduce((s, d) => s + d.a.timeMs, 0), docs.reduce((s, d) => s + d.b.timeMs, 0)],
    fidelity: {
      pdfs: withFidelity.length,
      wordRecall: fid((x) => x.wordRecall),
      numericRecall: fid((x) => x.numericRecall),
      linkPrecision: fid((x) => x.linkPrecision),
    },
  };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

const f1 = (v: number) => v.toFixed(1);
const f2 = (v: number) => v.toFixed(2);
const secs = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

export interface ExtraSection {
  title: string;
  body: string;
}

export function formatComparison(summary: ComparisonSummary, docs: DocComparison[], extra: ExtraSection[] = []): string {
  const [a, b] = summary.converters;
  const lines: string[] = [
    `# Head-to-head: ${a} vs ${b}`,
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "> The heuristic scorer rewards presence, not correctness: any 3+ table lines score 9 on tables,",
    "> no code fences scores 9 on code in most categories, 10+ links score 9 whatever they point at.",
    "> Read the fidelity and reference-test numbers alongside it. See docs/quality-testing.md.",
    "",
    "## Summary",
    "",
    `| | ${a} | ${b} |`,
    "| --- | ---: | ---: |",
    `| PDFs compared | ${summary.pdfs} | ${summary.pdfs} |`,
    `| Weighted score, all 9 dimensions | ${f2(summary.scoreAll[0])} | ${f2(summary.scoreAll[1])} |`,
    `| Weighted score, metadata excluded | ${f2(summary.scoreNoMetadata[0])} | ${f2(summary.scoreNoMetadata[1])} |`,
    `| PDFs where it scores higher (metadata excluded, margin ${TIE_MARGIN}) | ${summary.wins[0]} | ${summary.wins[1]} |`,
    `| Total conversion time | ${secs(summary.totalMs[0])} | ${secs(summary.totalMs[1])} |`,
    `| Mean word recall % (${summary.fidelity.pdfs} PDFs) | ${f1(summary.fidelity.wordRecall[0])} | ${f1(summary.fidelity.wordRecall[1])} |`,
    `| Mean numeric recall % | ${f1(summary.fidelity.numericRecall[0])} | ${f1(summary.fidelity.numericRecall[1])} |`,
    `| Mean link precision % | ${f1(summary.fidelity.linkPrecision[0])} | ${f1(summary.fidelity.linkPrecision[1])} |`,
    "",
    `Ties: ${summary.ties}.`,
    "",
    "## Dimension averages",
    "",
    `| Dimension | ${a} | ${b} |`,
    "| --- | ---: | ---: |",
    ...DIMENSIONS.map((d) => `| ${d} | ${f1(summary.dimensions[d][0])} | ${f1(summary.dimensions[d][1])} |`),
    "",
    "## Per PDF",
    "",
    `Score is the weighted score with metadata excluded. WR = word recall %, NR = numeric recall %, LP = link precision %.`,
    "",
    `| Set | PDF | Score ${a} | Score ${b} | ms ${a} | ms ${b} | WR ${a} | WR ${b} | NR ${a} | NR ${b} | LP ${a} | LP ${b} |`,
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  const fid = (d: DocResult, k: keyof DocumentFidelity) => (d.fidelity ? f1(d.fidelity[k]) : "–");
  for (const d of docs) {
    lines.push(
      `| ${d.dataset} | ${d.file} | ${f1(weightedScore(d.a.dims, true))} | ${f1(weightedScore(d.b.dims, true))} | ${d.a.timeMs} | ${d.b.timeMs} | ${fid(d.a, "wordRecall")} | ${fid(d.b, "wordRecall")} | ${fid(d.a, "numericRecall")} | ${fid(d.b, "numericRecall")} | ${fid(d.a, "linkPrecision")} | ${fid(d.b, "linkPrecision")} |`,
    );
  }
  for (const section of extra) lines.push("", `## ${section.title}`, "", section.body);
  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

interface CliOptions {
  skipRun: boolean;
  sets: DatasetKey[];
  pdfsRoot: string;
}

export function parseCompareArgs(argv: string[]): CliOptions {
  const options: CliOptions = { skipRun: false, sets: DATASETS.map((d) => d.key), pdfsRoot: TEST_CORPUS_DIR };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--skip-run") options.skipRun = true;
    else if (arg === "--sets") {
      const keys = (argv[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      const valid = DATASETS.map((d) => d.key as string);
      for (const k of keys) if (!valid.includes(k)) throw new Error(`Unknown set ${k}. Expected: ${valid.join(", ")}`);
      options.sets = keys as DatasetKey[];
    } else if (arg === "--pdfs-root") {
      const root = argv[++i];
      if (!root) throw new Error("--pdfs-root needs a directory");
      options.pdfsRoot = resolve(root);
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function runEvaluate(script: string, converter: ConverterName, pdfsRoot: string): Promise<void> {
  return new Promise<void>((resolvePromise, reject) => {
    const child = spawn("npx", ["tsx", "--require", "./test-corpus/node-polyfills.cjs", `test-corpus/${script}`], {
      cwd: ROOT_DIR,
      stdio: ["ignore", "inherit", "inherit"],
      env: { ...process.env, CONV: converter, EVAL_OUT: join(H2H_DIR, converter), EVAL_PDFS_ROOT: pdfsRoot },
    });
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolvePromise() : reject(new Error(`${script} (CONV=${converter}) exited with ${code}`))));
  });
}

async function readReport(converter: ConverterName, report: string): Promise<ParsedReport | undefined> {
  const path = join(H2H_DIR, converter, report);
  try {
    return parseEvalReport(await readFile(path, "utf-8"));
  } catch (err) {
    console.warn(`  (no report at ${path}: ${err instanceof Error ? err.message : String(err)})`);
    return undefined;
  }
}

/** Optional extra sections (the reference-test comparison registers itself here). */
export type SectionProvider = (converters: [ConverterName, ConverterName]) => Promise<ExtraSection | undefined>;

export async function runComparison(argv: string[], providers: SectionProvider[] = []): Promise<void> {
  const options = parseCompareArgs(argv);
  const converters: [ConverterName, ConverterName] = [CONVERTER_NAMES[0], CONVERTER_NAMES[1]];
  if (!(await converterAvailable(converters[1]))) {
    console.log(`${converters[1]} is not installed; nothing to compare. Run \`pnpm install\` at the repo root.`);
    return;
  }

  const sets = DATASETS.filter((d) => options.sets.includes(d.key));
  const reports: Record<ConverterName, Partial<Record<DatasetKey, ParsedReport>>> = { pdf2md: {}, opendocsg: {} };
  for (const set of sets) {
    if (!existsSync(join(options.pdfsRoot, set.pdfDir))) {
      console.log(`Skipping ${set.key}: no ${set.pdfDir}/ under ${options.pdfsRoot}`);
      continue;
    }
    for (const conv of converters) {
      if (!options.skipRun) {
        console.log(`\n=== ${set.key} with ${conv}`);
        await runEvaluate(set.script, conv, options.pdfsRoot);
      }
      const parsed = await readReport(conv, set.report);
      if (parsed) reports[conv][set.key] = parsed;
    }
  }

  const docs = pairDocs(reports[converters[0]], reports[converters[1]]);
  if (docs.length === 0) {
    console.log("No PDFs to compare.");
    return;
  }
  const summary = summarize(converters, docs);
  const extra: ExtraSection[] = [];
  for (const provider of providers) {
    const section = await provider(converters);
    if (section) extra.push(section);
  }
  const markdown = formatComparison(summary, docs, extra);
  await mkdir(H2H_DIR, { recursive: true });
  await writeFile(join(H2H_DIR, "COMPARISON.md"), markdown, "utf-8");
  await writeFile(join(H2H_DIR, "comparison.json"), `${JSON.stringify({ summary, docs }, null, 2)}\n`, "utf-8");
  console.log(`\n${markdown}`);
  console.log(`Written to ${join(H2H_DIR, "COMPARISON.md")} and comparison.json`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runComparison(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
