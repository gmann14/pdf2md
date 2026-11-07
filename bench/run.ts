#!/usr/bin/env npx tsx
/**
 * Performance benchmark: converts every tracked corpus PDF several times and writes
 * per-file median milliseconds and peak RSS to bench/latest.json.
 *
 * Each PDF runs in its own plain-Node child process (bench/child.mjs) against the built
 * packages/core/dist, so peak RSS (`process.resourceUsage().maxRSS`) belongs to that file
 * alone; it includes Node and PDF.js start-up (about 100 MB, the same for every file).
 * Timings are wall-clock around `convert()`. The first run also loads PDF.js (`coldMs`);
 * with the default 3 runs the median is a warm run.
 *
 * `pnpm bench` builds packages/core first.
 *
 * Timings are noisy (machine load, thermal state), so nothing gates on them.
 *
 * Usage:
 *   pnpm bench [--runs 3] [--dir test-corpus/real-pdfs] [--out bench/latest.json] [--only a.pdf,b.pdf]
 */

import { execFile as execFileCallback, spawn } from "node:child_process";
import { cpus } from "node:os";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const BENCH_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(BENCH_DIR, "..");
const POLYFILLS = join(ROOT_DIR, "test-corpus/node-polyfills.cjs");
const CHILD = join(BENCH_DIR, "child.mjs");

export interface ChildResult {
  status: string;
  pageCount: number;
  timesMs: number[];
  maxRssKb: number;
}

export interface BenchFile {
  file: string;
  sizeBytes: number;
  pageCount: number;
  status: string;
  medianMs: number;
  /** First run: includes loading PDF.js and its fonts in a fresh process. */
  coldMs: number;
  minMs: number;
  maxMs: number;
  peakRssMb: number;
}

export interface BenchReport {
  generatedAt: string;
  gitSha: string;
  node: string;
  platform: string;
  cpu: string;
  runs: number;
  corpus: string;
  files: BenchFile[];
  totals: {
    files: number;
    /** Sum of per-file medians. */
    medianMs: number;
    maxPeakRssMb: number;
  };
}

export interface BenchOptions {
  runs: number;
  dir: string;
  out: string;
  only: string[];
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function parseBenchArgs(argv: string[]): BenchOptions {
  const options: BenchOptions = {
    runs: 3,
    dir: join(ROOT_DIR, "test-corpus/real-pdfs"),
    out: join(BENCH_DIR, "latest.json"),
    only: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      const value = argv[++i];
      if (value === undefined) throw new Error(`${arg} needs a value`);
      return value;
    };
    if (arg === "--runs") {
      options.runs = Number(next());
      if (!Number.isInteger(options.runs) || options.runs < 1) throw new Error("--runs must be a positive integer");
    } else if (arg === "--dir") options.dir = resolve(next());
    else if (arg === "--out") options.out = resolve(next());
    else if (arg === "--only") options.only = next().split(",").map((s) => s.trim()).filter(Boolean);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

const round1 = (v: number) => Math.round(v * 10) / 10;

export function summarizeFile(file: string, sizeBytes: number, child: ChildResult): BenchFile {
  return {
    file,
    sizeBytes,
    pageCount: child.pageCount,
    status: child.status,
    medianMs: round1(median(child.timesMs)),
    coldMs: round1(child.timesMs[0] ?? 0),
    minMs: round1(Math.min(...child.timesMs)),
    maxMs: round1(Math.max(...child.timesMs)),
    // maxRSS is reported in kilobytes on Linux and macOS.
    peakRssMb: round1(child.maxRssKb / 1024),
  };
}

export function totalsFor(files: BenchFile[]): BenchReport["totals"] {
  return {
    files: files.length,
    medianMs: round1(files.reduce((s, f) => s + f.medianMs, 0)),
    maxPeakRssMb: files.reduce((m, f) => Math.max(m, f.peakRssMb), 0),
  };
}

export function isChildResult(value: unknown): value is ChildResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.status === "string" &&
    typeof v.pageCount === "number" &&
    typeof v.maxRssKb === "number" &&
    Array.isArray(v.timesMs) &&
    v.timesMs.length > 0 &&
    v.timesMs.every((t) => typeof t === "number")
  );
}

function benchOneFile(path: string, runs: number): Promise<ChildResult> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      ["--require", POLYFILLS, CHILD, path, String(runs)],
      { cwd: ROOT_DIR, stdio: ["ignore", "pipe", "pipe"] },
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk: Buffer) => (stderr += chunk.toString()));
    child.on("error", reject);
    child.on("exit", (code) => {
      const line = stdout.split("\n").find((l) => l.startsWith("BENCH_RESULT "));
      if (code !== 0 || !line) {
        reject(new Error(`bench child for ${basename(path)} exited with ${code}: ${stderr.trim().slice(-500)}`));
        return;
      }
      try {
        const parsed: unknown = JSON.parse(line.slice("BENCH_RESULT ".length));
        if (!isChildResult(parsed)) throw new Error("unexpected shape");
        resolvePromise(parsed);
      } catch (err) {
        reject(new Error(`bad bench output for ${basename(path)}: ${err instanceof Error ? err.message : String(err)}`));
      }
    });
  });
}

async function gitSha(): Promise<string> {
  try {
    const { stdout } = await execFile("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT_DIR });
    return stdout.trim();
  } catch {
    return "unknown";
  }
}

export async function runBench(options: BenchOptions): Promise<BenchReport> {
  const names = (await readdir(options.dir))
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .filter((f) => options.only.length === 0 || options.only.includes(f))
    .sort();
  if (names.length === 0) throw new Error(`No PDFs found in ${options.dir}`);

  const files: BenchFile[] = [];
  for (const name of names) {
    const path = join(options.dir, name);
    const { size } = await stat(path);
    const child = await benchOneFile(path, options.runs);
    const row = summarizeFile(name, size, child);
    files.push(row);
    console.log(`${row.medianMs.toFixed(0).padStart(7)} ms  ${row.peakRssMb.toFixed(0).padStart(5)} MB  ${name} (${row.status})`);
  }

  const report: BenchReport = {
    generatedAt: new Date().toISOString(),
    gitSha: await gitSha(),
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
    cpu: cpus()[0]?.model ?? "unknown",
    runs: options.runs,
    corpus: options.dir.startsWith(ROOT_DIR) ? options.dir.slice(ROOT_DIR.length + 1) : options.dir,
    files,
    totals: totalsFor(files),
  };
  await mkdir(dirname(options.out), { recursive: true });
  await writeFile(options.out, `${JSON.stringify(report, null, 2)}\n`, "utf-8");
  return report;
}

async function main(): Promise<void> {
  const options = parseBenchArgs(process.argv.slice(2));
  const report = await runBench(options);
  const slowest = [...report.files].sort((a, b) => b.medianMs - a.medianMs).slice(0, 3);
  console.log(
    `\nTotal (sum of medians, ${report.runs} runs each): ${report.totals.medianMs.toFixed(0)} ms over ${report.totals.files} files; ` +
      `max peak RSS ${report.totals.maxPeakRssMb.toFixed(0)} MB`,
  );
  console.log(`Slowest: ${slowest.map((f) => `${f.file} ${f.medianMs.toFixed(0)} ms`).join(", ")}`);
  console.log(`Written to ${options.out}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
