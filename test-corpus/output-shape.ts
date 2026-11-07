/**
 * Output-shape checks over the tracked corpus (test-corpus/real-pdfs).
 *
 * Where the fidelity ratchet (fidelity.ts) checks that the text survives,
 * these check the Markdown structure for known defects:
 *
 * - no heading ends with a hyphen (a heading broken at a line-end hyphen,
 *   or a wrapped body line or table row taken for a heading)
 *
 * Run from vitest with `pnpm test:fidelity` (src/output-shape-shard-*.corpus.test.ts).
 */

import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { convert } from "../packages/core/src/converter";

/** Lines outside fenced code blocks. */
export function proseLines(markdown: string): string[] {
  const out: string[] = [];
  let inCode = false;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (!inCode) out.push(line);
  }
  return out;
}

/** Headings (outside code) whose text ends with a hyphen. */
export function headingsEndingInHyphen(markdown: string): string[] {
  return proseLines(markdown).filter((line) => /^#{1,6} .*-\s*$/.test(line));
}

/** All problems found in one file's output. */
export function outputShapeProblems(markdown: string): string[] {
  return headingsEndingInHyphen(markdown).map((line) => `heading ends with a hyphen: ${line.slice(0, 80)}`);
}

async function listPdfs(dir: string): Promise<string[]> {
  return (await readdir(dir)).filter((f) => f.endsWith(".pdf")).sort().map((f) => join(dir, f));
}

/**
 * Convert one shard of the corpus (files whose sorted index % shardCount ===
 * shard) and collect problems, prefixed with the file name.
 */
export async function outputShapeShard(
  corpusDir: string,
  shard: number,
  shardCount: number,
): Promise<{ checked: number; problems: string[] }> {
  const files = (await listPdfs(corpusDir)).filter((_, i) => i % shardCount === shard);
  const problems: string[] = [];
  for (const file of files) {
    const bytes = await readFile(file);
    const result = await convert(new Uint8Array(bytes).buffer);
    if (result.status === "failed") continue;
    for (const problem of outputShapeProblems(result.markdown)) {
      problems.push(`${basename(file)}: ${problem}`);
    }
  }
  return { checked: files.length, problems };
}
