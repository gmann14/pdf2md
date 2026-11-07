#!/usr/bin/env npx tsx
/**
 * Hand-checked reference tests (see test-corpus/reference/README.md).
 *
 * Converts each referenced PDF in test-corpus/real-pdfs once with the chosen converter,
 * runs every test in cases/*.jsonl against the whole-document Markdown, and prints the
 * pass rate by test type and by PDF.
 *
 * Usage:
 *   npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/reference/run.ts
 *     [--failures] [--only a.pdf] [--json out.json] [--update-baseline]
 *   CONV=opendocsg ... (any converter from test-corpus/converters.ts)
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { converterAvailable, converterFromEnv, convertWith, type ConverterName } from "../converters";
import { TEST_TYPES, parseMarkdown, runCheck, validateTest, type ReferenceTest } from "./checks";

const REFERENCE_DIR = fileURLToPath(new URL(".", import.meta.url));
export const CASES_DIR = join(REFERENCE_DIR, "cases");
export const PDF_DIR = resolve(REFERENCE_DIR, "../real-pdfs");
export const BASELINE_PATH = join(REFERENCE_DIR, "baseline.json");
export const SOURCES_PATH = join(REFERENCE_DIR, "sources.json");

export interface SourceEntry {
  publisher: string;
  licence: string;
  basis: string;
}

export interface TestOutcome {
  test: ReferenceTest;
  pass: boolean;
  detail?: string;
}

export interface ReferenceResult {
  converter: ConverterName;
  outcomes: TestOutcome[];
  /** PDFs that failed to convert (all their tests count as failed). */
  conversionErrors: Record<string, string>;
}

export interface ReferenceBaseline {
  converter: ConverterName;
  passed: number;
  total: number;
  passingIds: string[];
}

export async function loadCases(dir: string = CASES_DIR): Promise<ReferenceTest[]> {
  const files = (await readdir(dir)).filter((f) => f.endsWith(".jsonl")).sort();
  const tests: ReferenceTest[] = [];
  const ids = new Set<string>();
  for (const file of files) {
    const lines = (await readFile(join(dir, file), "utf-8")).split("\n");
    lines.forEach((line, i) => {
      if (!line.trim() || line.trim().startsWith("//")) return;
      let test: ReferenceTest;
      try {
        test = validateTest(JSON.parse(line));
      } catch (err) {
        throw new Error(`${file}:${i + 1}: ${err instanceof Error ? err.message : String(err)}`);
      }
      if (ids.has(test.id)) throw new Error(`${file}:${i + 1}: duplicate id ${test.id}`);
      ids.add(test.id);
      tests.push(test);
    });
  }
  return tests;
}

export async function loadSources(path: string = SOURCES_PATH): Promise<Record<string, SourceEntry>> {
  return JSON.parse(await readFile(path, "utf-8")) as Record<string, SourceEntry>;
}

export function checkMarkdown(markdown: string, tests: ReferenceTest[]): TestOutcome[] {
  const parsed = parseMarkdown(markdown);
  return tests.map((test) => ({ test, ...runCheck(parsed, test) }));
}

export async function runReference(
  converter: ConverterName,
  tests: ReferenceTest[],
  pdfDir: string = PDF_DIR,
): Promise<ReferenceResult> {
  const byPdf = new Map<string, ReferenceTest[]>();
  for (const t of tests) byPdf.set(t.pdf, [...(byPdf.get(t.pdf) ?? []), t]);
  const outcomes: TestOutcome[] = [];
  const conversionErrors: Record<string, string> = {};
  for (const [pdf, pdfTests] of [...byPdf].sort((a, b) => a[0].localeCompare(b[0]))) {
    let markdown = "";
    try {
      const result = await convertWith(converter, new Uint8Array(await readFile(join(pdfDir, pdf))));
      if (result.status === "failed") conversionErrors[pdf] = result.messages[0]?.message ?? "failed";
      markdown = result.markdown;
    } catch (err) {
      conversionErrors[pdf] = err instanceof Error ? err.message : String(err);
    }
    outcomes.push(...checkMarkdown(markdown, pdfTests));
  }
  return { converter, outcomes, conversionErrors };
}

export interface Tally {
  passed: number;
  total: number;
}

export function tallyBy<K extends string>(outcomes: TestOutcome[], key: (o: TestOutcome) => K): Map<K, Tally> {
  const map = new Map<K, Tally>();
  for (const o of outcomes) {
    const k = key(o);
    const t = map.get(k) ?? { passed: 0, total: 0 };
    t.total++;
    if (o.pass) t.passed++;
    map.set(k, t);
  }
  return map;
}

const pct = (t: Tally) => (t.total === 0 ? "–" : `${((t.passed / t.total) * 100).toFixed(1)}%`);

export function formatReferenceReport(result: ReferenceResult, showFailures = false): string {
  const all = tallyBy(result.outcomes, () => "all").get("all") ?? { passed: 0, total: 0 };
  const byType = tallyBy(result.outcomes, (o) => o.test.type);
  const byPdf = tallyBy(result.outcomes, (o) => o.test.pdf);
  const lines = [
    `Reference tests (${result.converter}): ${all.passed}/${all.total} passed (${pct(all)})`,
    "",
    "| Type | Passed | Total | Rate |",
    "| --- | ---: | ---: | ---: |",
    ...TEST_TYPES.filter((t) => byType.has(t)).map((t) => {
      const v = byType.get(t) as Tally;
      return `| ${t} | ${v.passed} | ${v.total} | ${pct(v)} |`;
    }),
    "",
    "| PDF | Passed | Total | Rate |",
    "| --- | ---: | ---: | ---: |",
    ...[...byPdf].map(([pdf, v]) => `| ${pdf} | ${v.passed} | ${v.total} | ${pct(v)} |`),
  ];
  for (const [pdf, msg] of Object.entries(result.conversionErrors)) lines.push("", `Conversion failed for ${pdf}: ${msg}`);
  if (showFailures) {
    lines.push("", "Failures:");
    for (const o of result.outcomes.filter((x) => !x.pass)) lines.push(`- ${o.test.id} [${o.test.type}] ${o.detail ?? ""}`);
  }
  return lines.join("\n");
}

export function toBaseline(result: ReferenceResult): ReferenceBaseline {
  const passing = result.outcomes.filter((o) => o.pass).map((o) => o.test.id).sort();
  return { converter: result.converter, passed: passing.length, total: result.outcomes.length, passingIds: passing };
}

/** Ratchet: the pass count may not drop below the baseline. Returns ids that newly fail (informational). */
export function compareToBaseline(result: ReferenceResult, baseline: ReferenceBaseline): { ok: boolean; passed: number; newlyFailing: string[] } {
  const now = new Set(result.outcomes.filter((o) => o.pass).map((o) => o.test.id));
  const newlyFailing = baseline.passingIds.filter((id) => !now.has(id));
  return { ok: now.size >= baseline.passed, passed: now.size, newlyFailing };
}

/** Section for `pnpm compare:opendocsg` (test-corpus/compare-converters.ts). */
export async function referenceComparisonSection(converters: [ConverterName, ConverterName]): Promise<{ title: string; body: string } | undefined> {
  const tests = await loadCases();
  if (tests.length === 0) return undefined;
  const rows: string[] = [];
  const results: ReferenceResult[] = [];
  for (const c of converters) {
    if (!(await converterAvailable(c))) return undefined;
    results.push(await runReference(c, tests));
  }
  const tallies = results.map((r) => tallyBy(r.outcomes, (o) => o.test.type));
  const totals = results.map((r) => tallyBy(r.outcomes, () => "all").get("all") as Tally);
  rows.push(`| Type | ${converters[0]} | ${converters[1]} |`, "| --- | ---: | ---: |");
  for (const t of TEST_TYPES) {
    if (!tallies[0].has(t)) continue;
    const [a, b] = tallies.map((m) => m.get(t) as Tally);
    rows.push(`| ${t} | ${a.passed}/${a.total} | ${b.passed}/${b.total} |`);
  }
  rows.push(`| **all** | **${totals[0].passed}/${totals[0].total}** | **${totals[1].passed}/${totals[1].total}** |`);
  return {
    title: "Hand-checked reference tests",
    body: `${rows.join("\n")}\n\nChecked by Claude against the PDF.js text layer, not by a person; see test-corpus/reference/README.md.`,
  };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const converter = converterFromEnv();
  const only = argv.includes("--only") ? argv[argv.indexOf("--only") + 1] : undefined;
  const jsonOut = argv.includes("--json") ? argv[argv.indexOf("--json") + 1] : undefined;
  let tests = await loadCases();
  if (only) tests = tests.filter((t) => t.pdf === only);
  const result = await runReference(converter, tests);
  console.log(formatReferenceReport(result, argv.includes("--failures")));
  if (jsonOut) await writeFile(jsonOut, `${JSON.stringify(result, null, 2)}\n`, "utf-8");
  if (argv.includes("--update-baseline")) {
    if (converter !== "pdf2md" || only) throw new Error("--update-baseline needs CONV=pdf2md and no --only");
    await writeFile(BASELINE_PATH, `${JSON.stringify(toBaseline(result), null, 2)}\n`, "utf-8");
    console.log(`\nBaseline written to ${BASELINE_PATH}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
