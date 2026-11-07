// @vitest-environment node

import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  H2H_DIR,
  converterAvailable,
  converterFromEnv,
  convertWith,
  evalInputDir,
  evalOutputPath,
  evalTargetFromEnv,
} from "../../../test-corpus/converters";
import {
  DIMENSIONS,
  formatComparison,
  pairDocs,
  parseCompareArgs,
  parseEvalReport,
  summarize,
  weightedScore,
  type Dimension,
} from "../../../test-corpus/compare-converters";

const corpusDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../../test-corpus");

const report = (time: number, dims: number[], fidelity?: [number, number, number]) => `
# Blind Quality Test Report

**Blind Average Score:** 9.0/10

## Score Summary

| PDF | Category | Pages | Words | Time | Score |
| --- | -------- | ----: | ----: | ---: | ----: |
| a.pdf | Report | 3 | 100 | ${time}ms | **9.0** |

## Detailed Score Breakdown

| PDF | Headings | Paragraphs | Lists | Tables | Code | Links | Metadata | No Garbage | Readability |
| --- | -------: | ---------: | ----: | -----: | ---: | ----: | -------: | ---------: | ----------: |
| a.pdf | ${dims.join(" | ")} |

## Dimension Averages

| Dimension | Blind Avg |
| --------- | --------: |
| headingDetection | 9/10 |
${
  fidelity
    ? `
## Text Fidelity

| PDF | Word recall % | Numeric recall % | Links out / annot / bare | Link precision % | Space-before-punct /10k | Bold | Italic | Code fences |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| a.pdf | ${fidelity[0]} | ${fidelity[1]} | 1 / 1 / 0 | ${fidelity[2]} | 0.0 | 0 | 0 | 0 |
`
    : ""
}`;

describe("converter adapter", () => {
  it("reads CONV and rejects unknown converters", () => {
    expect(converterFromEnv({})).toBe("pdf2md");
    expect(converterFromEnv({ CONV: "opendocsg" })).toBe("opendocsg");
    expect(() => converterFromEnv({ CONV: "marker" })).toThrow(/Unknown CONV=marker/);
  });

  it("keeps pdf2md output in the committed locations and sends other converters to .h2h", () => {
    expect(evalTargetFromEnv({})).toEqual({ converter: "pdf2md", outDir: undefined });
    expect(evalTargetFromEnv({ CONV: "opendocsg" }).outDir).toBe(join(H2H_DIR, "opendocsg"));
    expect(evalTargetFromEnv({ EVAL_OUT: "/tmp/x" }).outDir).toBe("/tmp/x");
    expect(evalOutputPath({ converter: "pdf2md", outDir: undefined }, "/repo/test-corpus", "results")).toBe(
      "/repo/test-corpus/results",
    );
    expect(evalOutputPath({ converter: "opendocsg", outDir: "/out" }, "/repo/test-corpus", "results")).toBe("/out/results");
    expect(evalInputDir("/repo/test-corpus", "blind-pdfs", {})).toBe("/repo/test-corpus/blind-pdfs");
    expect(evalInputDir("/repo/test-corpus", "blind-pdfs", { EVAL_PDFS_ROOT: "/other" })).toBe("/other/blind-pdfs");
  });

  it("converts the same PDF with both converters", async () => {
    const bytes = new Uint8Array(await readFile(join(corpusDir, "simple-report.pdf")));
    const ours = await convertWith("pdf2md", bytes);
    expect(ours.status).toBe("success");
    expect(ours.markdown.length).toBeGreaterThan(0);
    // The input is copied, so the caller's buffer survives for the second converter.
    expect(bytes.byteLength).toBeGreaterThan(0);
    if (!(await converterAvailable("opendocsg"))) return; // optional devDependency
    const theirs = await convertWith("opendocsg", bytes);
    expect(theirs.status).toBe("success");
    expect(theirs.stats.pageCount).toBeGreaterThan(0);
    expect(theirs.stats.wordCount).toBeGreaterThan(0);
  });

  it("reports a failed opendocsg conversion instead of throwing", async () => {
    if (!(await converterAvailable("opendocsg"))) return;
    const result = await convertWith("opendocsg", new TextEncoder().encode("not a pdf"));
    expect(result.status).toBe("failed");
    expect(result.messages[0]?.code).toBe("parse_failed");
  });
});

describe("head-to-head comparison", () => {
  const dimsA = [9, 9, 9, 9, 9, 9, 9, 9, 9];
  const dimsB = [8, 8, 8, 6, 9, 8, 5, 8, 8];

  it("parses times, dimensions and fidelity from an evaluate report", () => {
    const parsed = parseEvalReport(report(1234, dimsA, [98.5, 90, 100]));
    expect(Object.keys(parsed)).toEqual(["a.pdf"]);
    expect(parsed["a.pdf"].timeMs).toBe(1234);
    expect(parsed["a.pdf"].dims.tableDetection).toBe(9);
    expect(parsed["a.pdf"].fidelity).toEqual({ wordRecall: 98.5, numericRecall: 90, linkPrecision: 100 });
    expect(parseEvalReport(report(1, dimsA))["a.pdf"].fidelity).toBeUndefined();
    expect(parseEvalReport("# empty")).toEqual({});
  });

  it("weights dimensions like the evaluate scripts, with or without metadata", () => {
    const dims = Object.fromEntries(DIMENSIONS.map((d) => [d, d === "metadataExtraction" ? 0 : 10])) as Record<
      Dimension,
      number
    >;
    expect(weightedScore(dims, true)).toBe(10);
    expect(weightedScore(dims)).toBeCloseTo((10 * (10.6 - 0.5)) / 10.6, 6);
  });

  it("pairs PDFs present for both converters and summarises wins, time and fidelity", () => {
    const a = { blind1: parseEvalReport(report(1000, dimsA, [99, 95, 100])) };
    const b = { blind1: parseEvalReport(report(500, dimsB, [98, 97, 50])), blind2: parseEvalReport(report(1, dimsB)) };
    const docs = pairDocs(a, b);
    expect(docs).toHaveLength(1);
    const summary = summarize(["pdf2md", "opendocsg"], docs);
    expect(summary.wins).toEqual([1, 0]);
    expect(summary.ties).toBe(0);
    expect(summary.totalMs).toEqual([1000, 500]);
    expect(summary.fidelity.pdfs).toBe(1);
    expect(summary.fidelity.linkPrecision).toEqual([100, 50]);
    expect(summary.dimensions.tableDetection).toEqual([9, 6]);
    const md = formatComparison(summary, docs, [{ title: "Extra", body: "body" }]);
    expect(md).toContain("| Total conversion time | 1.0 s | 0.5 s |");
    expect(md).toContain("| blind1 | a.pdf |");
    expect(md).toContain("## Extra");
    expect(md).toMatch(/rewards presence, not correctness/);
  });

  it("parses CLI arguments", () => {
    expect(parseCompareArgs(["--skip-run", "--sets", "training,blind2"])).toMatchObject({
      skipRun: true,
      sets: ["training", "blind2"],
    });
    expect(() => parseCompareArgs(["--sets", "nope"])).toThrow(/Unknown set/);
    expect(() => parseCompareArgs(["--bogus"])).toThrow(/Unknown argument/);
  });
});
