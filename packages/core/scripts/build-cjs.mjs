#!/usr/bin/env node
/**
 * Build the CommonJS copy of @pdf2md/core into dist/cjs (or --out-dir <dir>).
 *
 * The package is ESM ("type": "module"), and TypeScript's nodenext mode picks
 * the output format from the nearest package.json. So the sources are staged
 * into a temp folder marked "type": "commonjs" and compiled there. nodenext
 * keeps `import()` as a real dynamic import in CommonJS output, which the
 * Node path needs to load PDF.js's ESM-only build.
 *
 * The only ESM-only syntax in the sources is `import.meta.url` in
 * pdf-worker.ts, used to locate the PDF.js worker in browsers. CommonJS
 * output cannot contain it, so the staged copy uses the file URL of the
 * compiled module instead. Browsers and bundlers use the ESM build.
 */
import { execFileSync } from "node:child_process";
import {
  cpSync,
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

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out-dir");
const outDir = resolve(outIndex >= 0 ? args[outIndex + 1] : join(pkgDir, "dist/cjs"));

const IMPORT_META_REPLACEMENTS = { "pdf-worker.ts": 2 };
const CJS_FILE_URL = 'require("node:url").pathToFileURL(__filename).href';

const stage = mkdtempSync(join(tmpdir(), "pdf2md-cjs-"));
try {
  const stagedSrc = join(stage, "src");
  cpSync(join(pkgDir, "src"), stagedSrc, {
    recursive: true,
    filter: (src) =>
      !src.endsWith(".test.ts") &&
      !src.includes(`${join("src", "bin")}`) &&
      !src.includes(`${join("src", "testing")}`),
  });

  for (const file of readdirSync(stagedSrc)) {
    if (!file.endsWith(".ts")) continue;
    const path = join(stagedSrc, file);
    const source = readFileSync(path, "utf8");
    const count = source.split("import.meta.url").length - 1;
    const expected = IMPORT_META_REPLACEMENTS[file] ?? 0;
    if (count !== expected) {
      throw new Error(
        `${file}: expected ${expected} use(s) of import.meta.url, found ${count}. Update scripts/build-cjs.mjs.`,
      );
    }
    if (count > 0) writeFileSync(path, source.replaceAll("import.meta.url", CJS_FILE_URL));
  }

  writeFileSync(join(stage, "package.json"), JSON.stringify({ type: "commonjs" }));
  writeFileSync(
    join(stage, "tsconfig.json"),
    JSON.stringify({
      extends: join(pkgDir, "tsconfig.json"),
      compilerOptions: {
        module: "nodenext",
        moduleResolution: "nodenext",
        rootDir: stagedSrc,
        outDir,
        declarationMap: false,
        sourceMap: false,
        types: ["node"],
      },
      include: [join(stagedSrc, "**/*.ts")],
      exclude: [],
    }),
  );

  // Resolve pdfjs-dist and @types/node from the package's own node_modules.
  symlinkSync(join(pkgDir, "node_modules"), join(stage, "node_modules"), "dir");

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const tsc = join(pkgDir, "node_modules/typescript/bin/tsc");
  execFileSync(process.execPath, [tsc, "-p", join(stage, "tsconfig.json")], { stdio: "inherit" });
  writeFileSync(join(outDir, "package.json"), JSON.stringify({ type: "commonjs" }, null, 2) + "\n");

  // opendocsg's CommonJS export is the function itself, so make
  // require("@pdf2md/core/compat") return pdf2md (with its named exports and
  // `.default` still attached for `import pdf2md from` under esModuleInterop).
  const compatPath = join(outDir, "compat.js");
  writeFileSync(
    compatPath,
    readFileSync(compatPath, "utf8") +
      "\nmodule.exports = Object.assign(exports.default, exports);\n",
  );
} finally {
  rmSync(stage, { recursive: true, force: true });
}
