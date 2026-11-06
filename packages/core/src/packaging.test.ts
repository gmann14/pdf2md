// @vitest-environment node

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const samplePdf = resolve(pkgDir, "../../test-corpus/real-pdfs/whitepaper-bitcoin.pdf");

/**
 * Builds the package (ESM + CommonJS) into a temp folder that carries the real
 * package.json, then loads it by name from a separate Node process, so the
 * `exports` map is what resolves `require()` and `import`.
 */
describe("published entry points", () => {
  let dir = "";

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "pdf2md-package-"));
    writeFileSync(join(dir, "package.json"), readFileSync(join(pkgDir, "package.json")));
    symlinkSync(join(pkgDir, "node_modules"), join(dir, "node_modules"), "dir");
    const tsc = join(pkgDir, "node_modules/typescript/bin/tsc");
    execFileSync(process.execPath, [tsc, "-p", join(pkgDir, "tsconfig.json"), "--outDir", join(dir, "dist")]);
    execFileSync(process.execPath, [join(pkgDir, "scripts/build-cjs.mjs"), "--out-dir", join(dir, "dist/cjs")]);
  }, 300_000);

  afterAll(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  function runNode(args: string[]): Record<string, unknown> {
    const out = execFileSync(process.execPath, args, { cwd: dir, encoding: "utf8" });
    const lastLine = out.trim().split("\n").pop() ?? "{}";
    return JSON.parse(lastLine) as Record<string, unknown>;
  }

  it("require() loads the CommonJS build and converts a Node Buffer", () => {
    const script = `
      const core = require("@pdf2md/core");
      const types = require("@pdf2md/core/types");
      const fs = require("node:fs");
      const buf = fs.readFileSync(${JSON.stringify(samplePdf)});
      const before = buf.byteLength;
      core.convert(buf).then((r) => console.log(JSON.stringify({
        resolved: require.resolve("@pdf2md/core"),
        status: r.status,
        words: r.stats.wordCount,
        unchanged: buf.byteLength === before,
        maxFileSize: types.MAX_FILE_SIZE,
      })));
    `;
    const result = runNode(["-e", script]);
    expect(result.resolved).toMatch(/dist[\\/]cjs[\\/]index\.js$/);
    expect(result.status).toBe("success");
    expect(result.words).toBeGreaterThan(1000);
    expect(result.unchanged).toBe(true);
    expect(result.maxFileSize).toBe(15 * 1024 * 1024);
  });

  it("import loads the ESM build and converts a Uint8Array", () => {
    const script = `
      const core = await import("@pdf2md/core");
      const fs = await import("node:fs");
      const bytes = new Uint8Array(fs.readFileSync(${JSON.stringify(samplePdf)}));
      const r = await core.convert(bytes);
      console.log(JSON.stringify({
        resolved: import.meta.resolve("@pdf2md/core"),
        status: r.status,
        unchanged: bytes.buffer.byteLength > 0,
      }));
    `;
    const result = runNode(["--input-type=module", "-e", script]);
    expect(result.resolved).toMatch(/dist\/index\.js$/);
    expect(result.resolved).not.toMatch(/cjs/);
    expect(result.status).toBe("success");
    expect(result.unchanged).toBe(true);
  });
});
