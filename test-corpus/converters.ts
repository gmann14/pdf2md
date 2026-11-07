/**
 * Converter adapter for the evaluation scripts (head-to-head harness).
 *
 * `CONV=pdf2md` (default) runs this repo's converter. `CONV=opendocsg` runs
 * `@opendocsg/pdf2md` (root devDependency, exact version) and wraps its string
 * output in a `ConversionResult`, so the heuristic scorer, the fidelity checks
 * and the reference tests treat both converters the same way.
 *
 * Output location: `EVAL_OUT=<dir>` sends the per-PDF Markdown and the report
 * to that directory. With no `EVAL_OUT`, pdf2md writes to the committed
 * locations (`test-corpus/results`, `QUALITY-REPORT.md`, ...), as before, and
 * any other converter writes to the git-ignored `test-corpus/.h2h/<converter>/`.
 */

import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { convert } from "../packages/core/src/converter";
import type { ConversionResult, ConvertOptions } from "../packages/core/src/types";

export const CONVERTER_NAMES = ["pdf2md", "opendocsg"] as const;
export type ConverterName = (typeof CONVERTER_NAMES)[number];

/** Pinned in the root package.json devDependencies. */
export const OPENDOCSG_PACKAGE = "@opendocsg/pdf2md";

const TEST_CORPUS_DIR = fileURLToPath(new URL(".", import.meta.url));

/** Git-ignored root for head-to-head output. */
export const H2H_DIR = resolve(TEST_CORPUS_DIR, ".h2h");

export class ConverterUnavailableError extends Error {
  constructor(name: ConverterName, cause: unknown) {
    super(
      `${name} is not installed (${cause instanceof Error ? cause.message : String(cause)}). ` +
        `Run \`pnpm install\` at the repo root; ${OPENDOCSG_PACKAGE} is a root devDependency.`,
    );
    this.name = "ConverterUnavailableError";
  }
}

export function isConverterName(value: string): value is ConverterName {
  return (CONVERTER_NAMES as readonly string[]).includes(value);
}

export function converterFromEnv(env: NodeJS.ProcessEnv = process.env): ConverterName {
  const raw = env.CONV?.trim() || "pdf2md";
  if (!isConverterName(raw)) {
    throw new Error(`Unknown CONV=${raw}. Expected one of: ${CONVERTER_NAMES.join(", ")}`);
  }
  return raw;
}

export interface EvalTarget {
  converter: ConverterName;
  /** Directory for results and report; undefined means the committed locations. */
  outDir: string | undefined;
}

export function evalTargetFromEnv(env: NodeJS.ProcessEnv = process.env): EvalTarget {
  const converter = converterFromEnv(env);
  const explicit = env.EVAL_OUT?.trim();
  if (explicit) return { converter, outDir: resolve(explicit) };
  return { converter, outDir: converter === "pdf2md" ? undefined : join(H2H_DIR, converter) };
}

/**
 * Where an evaluate script reads its PDFs. `EVAL_PDFS_ROOT=<dir>` points at another
 * checkout's `test-corpus/` (the blind sets are local-only and live in one checkout).
 */
export function evalInputDir(scriptDir: string, name: string, env: NodeJS.ProcessEnv = process.env): string {
  const root = env.EVAL_PDFS_ROOT?.trim();
  return root ? resolve(root, name) : resolve(scriptDir, name);
}

/** Where an evaluate script writes `name` (a results dir or a report file). */
export function evalOutputPath(target: EvalTarget, scriptDir: string, name: string): string {
  return target.outDir ? join(target.outDir, name) : resolve(scriptDir, name);
}

// ---------------------------------------------------------------------------
// opendocsg
// ---------------------------------------------------------------------------

type OpendocsgFn = (
  data: Uint8Array,
  callbacks?: { documentParsed?: (document: unknown, pages: unknown[]) => void },
) => Promise<string>;

let opendocsgFn: OpendocsgFn | undefined;

function isOpendocsgModule(mod: unknown): mod is { default: OpendocsgFn } {
  return typeof mod === "object" && mod !== null && typeof (mod as { default?: unknown }).default === "function";
}

async function loadOpendocsg(): Promise<OpendocsgFn> {
  if (opendocsgFn) return opendocsgFn;
  let mod: unknown;
  try {
    mod = await import(OPENDOCSG_PACKAGE);
  } catch (err) {
    throw new ConverterUnavailableError("opendocsg", err);
  }
  if (!isOpendocsgModule(mod)) {
    throw new Error(`${OPENDOCSG_PACKAGE} did not export a function`);
  }
  opendocsgFn = mod.default;
  return opendocsgFn;
}

/** True when the converter can run here (opendocsg is optional). */
export async function converterAvailable(name: ConverterName): Promise<boolean> {
  if (name === "pdf2md") return true;
  try {
    await loadOpendocsg();
    return true;
  } catch {
    return false;
  }
}

function countWords(markdown: string): number {
  return markdown.split(/\s+/).filter(Boolean).length;
}

async function convertWithOpendocsg(data: Uint8Array): Promise<ConversionResult> {
  const fn = await loadOpendocsg();
  const start = performance.now();
  let pageCount = 0;
  try {
    const markdown = await fn(data, {
      documentParsed: (_document, pages) => {
        pageCount = Array.isArray(pages) ? pages.length : 0;
      },
    });
    return {
      status: "success",
      markdown,
      messages: [],
      metadata: {},
      stats: { pageCount, wordCount: countWords(markdown), processingMs: performance.now() - start },
    };
  } catch (err) {
    return {
      status: "failed",
      markdown: "",
      messages: [
        { code: "parse_failed", severity: "error", message: err instanceof Error ? err.message : String(err) },
      ],
      metadata: {},
      stats: { pageCount, wordCount: 0, processingMs: performance.now() - start },
    };
  }
}

/**
 * Convert with the named converter. The input is copied first, because PDF.js
 * may detach the buffer it is given and callers often reuse theirs.
 */
export async function convertWith(
  name: ConverterName,
  data: ArrayBuffer | Uint8Array,
  options: ConvertOptions = { includeMetadata: true, yamlFrontMatter: true },
): Promise<ConversionResult> {
  const bytes = data instanceof Uint8Array ? data.slice() : new Uint8Array(data.slice(0));
  if (name === "opendocsg") return convertWithOpendocsg(bytes);
  return convert(bytes.buffer, options);
}
