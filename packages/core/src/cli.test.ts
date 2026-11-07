// @vitest-environment node

import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { makePdf, reportPages } from "./testing/make-pdf.js";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const corpus = resolve(pkgDir, "../../test-corpus");
const bitcoin = join(corpus, "real-pdfs/whitepaper-bitcoin.pdf"); // 9 pages
const simple = join(corpus, "simple-report.pdf");
const notPdf = join(corpus, "invalid-not-a-pdf.pdf");
const headerFooter = join(corpus, "fixtures/header-footer-numbers.pdf"); // 5 pages

/** Builds the real CLI (dist/bin/pdf2md.js) into a temp folder that carries the package.json. */
describe("pdf2md CLI (built binary)", () => {
  let dir = "";
  let bin = "";
  let partialPdf = "";

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "pdf2md-cli-"));
    writeFileSync(join(dir, "package.json"), readFileSync(join(pkgDir, "package.json")));
    symlinkSync(join(pkgDir, "node_modules"), join(dir, "node_modules"), "dir");
    const tsc = join(pkgDir, "node_modules/typescript/bin/tsc");
    execFileSync(process.execPath, [tsc, "-p", join(pkgDir, "tsconfig.json"), "--outDir", join(dir, "dist")]);
    bin = join(dir, "dist/bin/pdf2md.js");
    partialPdf = join(dir, "partial.pdf");
    writeFileSync(partialPdf, makePdf({ pages: reportPages(3), brokenPages: [2] }));
  }, 300_000);

  afterAll(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  function cli(args: string[], input?: Buffer) {
    const res = spawnSync(process.execPath, [bin, ...args], { cwd: dir, input, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    return { code: res.status, stdout: res.stdout, stderr: res.stderr };
  }

  it("--help lists every option", () => {
    const { code, stdout } = cli(["--help"]);
    expect(code).toBe(0);
    for (const flag of [
      "--pages",
      "-o, --out",
      "--output",
      "--chunk-by",
      "--max-tokens",
      "--yaml",
      "--no-metadata",
      "--max-size",
      "-q, --quiet",
      "-v, --version",
      "-h, --help",
      "stdin",
      "directory",
    ]) {
      expect(stdout, flag).toContain(flag);
    }
    expect(stdout).toContain("0 success, 2 partial");
  });

  it("--version prints the package version", () => {
    const version = (JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")) as { version: string }).version;
    for (const flag of ["--version", "-v"]) {
      const { code, stdout } = cli([flag]);
      expect(code).toBe(0);
      expect(stdout.trim()).toBe(version);
    }
  });

  it("prints Markdown for one file and exits 0", () => {
    const { code, stdout } = cli([bitcoin]);
    expect(code).toBe(0);
    expect(stdout).toContain("Bitcoin");
    expect(stdout.startsWith("---")).toBe(false);
  });

  it("--pages selects pages, including the last N", () => {
    const all = cli(["--output", "json", bitcoin]);
    const allPages = JSON.parse(all.stdout).stats.pageCount as number;
    expect(allPages).toBe(9);

    const first = cli(["--pages", "1", headerFooter]);
    expect(first.code).toBe(0);
    expect(first.stdout).toContain("Section 1 overview");
    expect(first.stdout).not.toContain("Section 2 overview");
    expect(first.stdout).not.toContain("Example Annual Report");

    const listed = cli(["--pages", "2-3,5", headerFooter]);
    expect(listed.stdout).toMatch(/Section 2 overview[\s\S]*Section 3 overview[\s\S]*Section 5 overview/);
    expect(listed.stdout).not.toContain("Section 4 overview");

    const last = cli(["--pages", "-2", headerFooter]);
    expect(last.stdout).toContain("Section 4 overview");
    expect(last.stdout).toContain("Section 5 overview");
    expect(last.stdout).not.toContain("Section 3 overview");
  });

  it("rejects a malformed --pages before reading the file", () => {
    const { code, stderr } = cli(["--pages", "5-2", bitcoin]);
    expect(code).toBe(1);
    expect(stderr).toMatch(/Invalid page range/);
  });

  it("-o/--out writes to a file", () => {
    const outFile = join(dir, "out/single.md");
    const { code, stdout } = cli(["-o", outFile, simple]);
    expect(code).toBe(0);
    expect(stdout).toBe("");
    expect(readFileSync(outFile, "utf8").length).toBeGreaterThan(0);

    const intoDir = join(dir, "out-dir") + "/";
    expect(cli(["--out", intoDir, simple]).code).toBe(0);
    expect(existsSync(join(intoDir, "simple-report.md"))).toBe(true);
  });

  it("reads the PDF from stdin with -", () => {
    const { code, stdout } = cli(["-"], readFileSync(simple));
    expect(code).toBe(0);
    expect(stdout).toBe(cli([simple]).stdout);
  });

  it("converts several files or a directory into --out", () => {
    const inputDir = join(dir, "inputs");
    mkdirSync(inputDir);
    copyFileSync(simple, join(inputDir, "a.pdf"));
    copyFileSync(headerFooter, join(inputDir, "b.PDF"));
    writeFileSync(join(inputDir, "notes.txt"), "not a pdf");

    const outDir = join(dir, "batch-dir");
    const fromDir = cli(["--out", outDir, inputDir]);
    expect(fromDir.code).toBe(0);
    expect(readdirSync(outDir).sort()).toEqual(["a.md", "b.md"]);
    expect(readFileSync(join(outDir, "b.md"), "utf8")).toContain("Section 1 overview");

    const outFiles = join(dir, "batch-files");
    const fromFiles = cli(["--out", outFiles, "--output", "json", simple, headerFooter]);
    expect(fromFiles.code).toBe(0);
    expect(readdirSync(outFiles).sort()).toEqual(["header-footer-numbers.json", "simple-report.json"]);

    const noOut = cli([simple, headerFooter]);
    expect(noOut.code).toBe(1);
    expect(noOut.stderr).toContain("--out");
  });

  it("--yaml prepends front matter and --no-metadata drops metadata from JSON", () => {
    const yaml = cli(["--yaml", bitcoin]);
    expect(yaml.stdout.startsWith("---\n")).toBe(true);

    const withMeta = JSON.parse(cli(["--output", "json", bitcoin]).stdout);
    expect(withMeta.metadata?.pdfVersion).toBeDefined();
    const noMeta = JSON.parse(cli(["--output", "json", "--no-metadata", bitcoin]).stdout);
    expect(noMeta.metadata).toBeUndefined();

    expect(cli(["--yaml", "--no-metadata", bitcoin]).code).toBe(1);
  });

  it("--max-size fails larger files with exit 1", () => {
    const tooSmall = cli(["--max-size", "1KB", bitcoin]);
    expect(tooSmall.code).toBe(1);
    expect(tooSmall.stderr).toContain("exceeds");
    expect(cli(["--max-size", "15MB", bitcoin]).code).toBe(0);
    expect(cli(["--max-size", "lots", bitcoin]).code).toBe(1);
  });

  it("--chunk-by and --max-tokens give JSON chunks", () => {
    const result = JSON.parse(cli(["--chunk-by", "token", "--max-tokens", "200", bitcoin]).stdout);
    expect(result.chunks.length).toBeGreaterThan(1);
  });

  it("exits 2 on a partial result and --quiet hides its warnings", () => {
    const loud = cli([partialPdf]);
    expect(loud.code).toBe(2);
    expect(loud.stdout).toContain("Body text for page 1 ");
    expect(loud.stderr).toContain("[warning] Failed to extract page 2");

    const quiet = cli(["--quiet", partialPdf]);
    expect(quiet.code).toBe(2);
    expect(quiet.stderr).toBe("");

    const batch = cli(["-q", "--out", join(dir, "batch-partial"), simple, partialPdf]);
    expect(batch.code).toBe(2);
  });

  it("exits 1 on a failure, a missing file and an unknown option", () => {
    const bad = cli([notPdf]);
    expect(bad.code).toBe(1);
    expect(bad.stderr).toContain("[error]");
    expect(bad.stdout).toBe("");

    expect(cli([join(dir, "missing.pdf")]).code).toBe(1);
    expect(cli(["--frobnicate", simple]).code).toBe(1);
    expect(cli([]).code).toBe(1);

    // In a batch, one failure makes the exit code 1 but the other files are still written.
    const outDir = join(dir, "batch-fail");
    const batch = cli(["-q", "--out", outDir, notPdf, simple]);
    expect(batch.code).toBe(1);
    expect(readdirSync(outDir)).toEqual(["simple-report.md"]);
  });
});
