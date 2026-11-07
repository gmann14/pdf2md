// @vitest-environment node

import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  isChildResult,
  median,
  parseBenchArgs,
  runBench,
  summarizeFile,
  totalsFor,
} from "../../../bench/run";
import { parseQualityReport, type QualitySnapshot } from "../../../autoresearch/compare-results";
import { readBenchSummary, renderSummary } from "../../../autoresearch/run-quality-suite";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const distBuilt = existsSync(resolve(here, "../dist/index.js"));

describe("bench helpers", () => {
  it("takes the median of odd and even samples", () => {
    expect(median([30, 10, 20])).toBe(20);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(median([])).toBe(0);
  });

  it("parses arguments and rejects bad ones", () => {
    const opts = parseBenchArgs(["--runs", "5", "--only", "a.pdf, b.pdf", "--out", "/tmp/x.json"]);
    expect(opts.runs).toBe(5);
    expect(opts.only).toEqual(["a.pdf", "b.pdf"]);
    expect(opts.out).toBe("/tmp/x.json");
    expect(parseBenchArgs([]).runs).toBe(3);
    expect(() => parseBenchArgs(["--runs", "0"])).toThrow(/positive integer/);
    expect(() => parseBenchArgs(["--runs"])).toThrow(/needs a value/);
    expect(() => parseBenchArgs(["--fast"])).toThrow(/Unknown argument/);
  });

  it("summarises child results and totals", () => {
    const row = summarizeFile("a.pdf", 1000, { status: "success", pageCount: 2, timesMs: [300, 100, 120], maxRssKb: 204800 });
    expect(row).toMatchObject({ medianMs: 120, coldMs: 300, minMs: 100, maxMs: 300, peakRssMb: 200 });
    const other = { ...row, file: "b.pdf", medianMs: 80.4, peakRssMb: 250 };
    expect(totalsFor([row, other])).toEqual({ files: 2, medianMs: 200.4, maxPeakRssMb: 250 });
  });

  it("validates child output", () => {
    expect(isChildResult({ status: "success", pageCount: 1, timesMs: [1], maxRssKb: 1 })).toBe(true);
    expect(isChildResult({ status: "success", pageCount: 1, timesMs: [], maxRssKb: 1 })).toBe(false);
    expect(isChildResult({ status: "success", pageCount: 1, timesMs: ["1"], maxRssKb: 1 })).toBe(false);
    expect(isChildResult(null)).toBe(false);
  });

  it.skipIf(!distBuilt)("benchmarks a PDF in a child process and writes JSON", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pdf2md-bench-"));
    try {
      await symlink(join(repoRoot, "test-corpus/simple-report.pdf"), join(dir, "simple-report.pdf"));
      const out = join(dir, "latest.json");
      const report = await runBench({ runs: 2, dir, out, only: [] });
      expect(report.files).toHaveLength(1);
      expect(report.files[0]).toMatchObject({ file: "simple-report.pdf", status: "success" });
      expect(report.files[0].medianMs).toBeGreaterThan(0);
      expect(report.files[0].peakRssMb).toBeGreaterThan(10);
      const written = JSON.parse(await readFile(out, "utf-8")) as { totals: { files: number } };
      expect(written.totals.files).toBe(1);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }, 60_000);
});

describe("autoresearch timing", () => {
  const report = `
**Blind Average Score:** 9.0/10

| PDF | Category | Pages | Words | Time | Score |
| --- | -------- | ----: | ----: | ---: | ----: |
| a.pdf | Report | 3 | 100 | 120ms | **9.0** |
| b.pdf | Report | 3 | 100 | 30ms | **8.0** |

| Dimension | Blind Avg |
| --------- | --------: |
| headingDetection | 9.0/10 |
`;

  it("sums the Time column into totalMs", () => {
    expect(parseQualityReport(report, "blind1").totalMs).toBe(150);
  });

  it("reads bench/latest.json totals and ignores a missing or malformed file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "pdf2md-ar-"));
    try {
      expect(await readBenchSummary(dir)).toBeUndefined();
      await mkdir(join(dir, "bench"));
      await writeFile(join(dir, "bench/latest.json"), "{not json");
      expect(await readBenchSummary(dir)).toBeUndefined();
      await writeFile(
        join(dir, "bench/latest.json"),
        JSON.stringify({ generatedAt: "t", gitSha: "abc", runs: 3, totals: { files: 2, medianMs: 1234.5, maxPeakRssMb: 300 } }),
      );
      expect(await readBenchSummary(dir)).toEqual({
        generatedAt: "t",
        gitSha: "abc",
        runs: 3,
        files: 2,
        totalMedianMs: 1234.5,
        maxPeakRssMb: 300,
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("puts total milliseconds and the bench line in the summary", () => {
    const metrics = parseQualityReport(report, "blind1");
    const snapshot: QualitySnapshot = {
      timestamp: "t",
      gitSha: "abc",
      branch: "b",
      diffSummary: "",
      datasets: { training: metrics, blind1: metrics, blind2: metrics, blind3: { ...metrics, totalMs: undefined } },
      combined: 9,
      bench: { generatedAt: "t", gitSha: "abc", runs: 3, files: 2, totalMedianMs: 1234.5, maxPeakRssMb: 300 },
    };
    const md = renderSummary(snapshot, "PASS");
    expect(md).toContain("| blind1 | 9.0/10 | 2 | 150 |");
    expect(md).toContain("| blind3 | 9.0/10 | 2 | – |");
    expect(md).toContain("Total conversion time (evaluate runs, single run per PDF): 450 ms");
    expect(md).toContain("1234.5 ms total of per-file medians over 2 files");
  });
});
