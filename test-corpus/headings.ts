#!/usr/bin/env npx tsx
/**
 * Corpus-wide heading check (no ground truth needed).
 *
 * The reference tests check 18 headings in 3 PDFs. This script looks at every
 * heading pdf2md writes for the whole corpus, so a heading change can be
 * measured everywhere before it lands:
 *
 * - per PDF: headings by level, plus counts of headings that are probably wrong
 *   (see `headingIssues`): level skips, body text glued on, sentence-like
 *   lines, headings without letters, and the same heading repeated
 * - `--save <file>` writes every heading (level and text) to a JSON snapshot;
 *   `--diff <file>` compares this run with a snapshot and lists headings added,
 *   removed or moved to another level, PDF by PDF
 *
 * Usage:
 *   pnpm check:headings [dir ...] [--pdfs-root <dir with real-pdfs/ and blind-pdfs*>]
 *     [--save snapshot.json] [--diff snapshot.json] [--show-private]
 *
 * With no dirs, runs real-pdfs plus the three blind sets (missing dirs are skipped).
 * The blind PDFs are private: the diff prints their heading text only with
 * `--show-private`, and snapshots that include them must never be committed
 * (write them outside the repo).
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { convert } from "../packages/core/src/converter";
import { normalize, parseMarkdown } from "./reference/checks";

// ---------------------------------------------------------------------------
// Analysis (pure, unit-tested)
// ---------------------------------------------------------------------------

export interface Heading {
  level: number;
  text: string;
}

export type HeadingIssue =
  /** Deeper than the heading before it by more than one level (H2 → H4). */
  | "level-skip"
  /** Over 15 words: body text glued onto a heading. */
  | "long"
  /** Ends like a sentence or clause (`.`, `,`, `;`) or opens in lower case. */
  | "sentence"
  /** No letters at all (a number, a symbol). */
  | "no-letters"
  /** The same text and level three or more times (a running header). */
  | "repeated";

export const HEADING_ISSUES: readonly HeadingIssue[] = ["level-skip", "long", "sentence", "no-letters", "repeated"];

export function extractHeadings(markdown: string): Heading[] {
  return parseMarkdown(markdown).headings.map((h) => ({ level: h.level, text: normalize(h.text) }));
}

/** The issues of each heading, in order (an empty list for a heading that looks fine). */
export function headingIssues(headings: Heading[]): HeadingIssue[][] {
  const seen = new Map<string, number>();
  for (const h of headings) {
    const key = `${h.level}\u0000${h.text}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return headings.map((h, i) => {
    const issues: HeadingIssue[] = [];
    const prev = headings[i - 1];
    if (prev && h.level > prev.level + 1) issues.push("level-skip");
    if (h.text.split(/\s+/).filter(Boolean).length > 15) issues.push("long");
    // An ellipsis or an abbreviation ("et al.", "Inc.", "U.S.") also ends in a
    // period; one letter or a run of capitals before the dot is let through.
    const sentenceEnd = /[,;]$/.test(h.text) || (/[a-z]{2}\.$/.test(h.text) && !/\b(?:al|etc|Inc|Ltd|Co|vs)\.$/.test(h.text));
    if (sentenceEnd || /^[a-z]/.test(h.text)) issues.push("sentence");
    if (!/\p{L}/u.test(h.text)) issues.push("no-letters");
    if ((seen.get(`${h.level}\u0000${h.text}`) ?? 0) >= 3) issues.push("repeated");
    return issues;
  });
}

export interface HeadingSummary {
  total: number;
  byLevel: number[]; // index 0 = H1 … 5 = H6
  issues: Record<HeadingIssue, number>;
}

export function summarize(headings: Heading[]): HeadingSummary {
  const byLevel = [0, 0, 0, 0, 0, 0];
  for (const h of headings) byLevel[h.level - 1]++;
  const issues = Object.fromEntries(HEADING_ISSUES.map((k) => [k, 0])) as Record<HeadingIssue, number>;
  for (const list of headingIssues(headings)) for (const issue of list) issues[issue]++;
  return { total: headings.length, byLevel, issues };
}

export interface HeadingDiff {
  added: Heading[];
  removed: Heading[];
  /** Same text, another level (matched in order of appearance). */
  relevelled: { text: string; from: number; to: number }[];
}

/** Headings added, removed or relevelled between two runs on the same PDF. */
export function diffHeadings(before: Heading[], after: Heading[]): HeadingDiff {
  const pool = new Map<string, number[]>();
  for (const h of before) {
    const levels = pool.get(h.text) ?? [];
    levels.push(h.level);
    pool.set(h.text, levels);
  }
  const added: Heading[] = [];
  const relevelled: HeadingDiff["relevelled"] = [];
  const unmatched: Heading[] = [];
  for (const h of after) {
    const levels = pool.get(h.text);
    const same = levels?.indexOf(h.level) ?? -1;
    if (levels && same >= 0) levels.splice(same, 1);
    else unmatched.push(h);
  }
  for (const h of unmatched) {
    const levels = pool.get(h.text);
    if (levels && levels.length > 0) relevelled.push({ text: h.text, from: levels.shift() as number, to: h.level });
    else added.push(h);
  }
  const removed: Heading[] = [];
  for (const [text, levels] of pool) for (const level of levels) removed.push({ level, text });
  return { added, removed, relevelled };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

export type HeadingSnapshot = Record<string, Record<string, Heading[]>>; // set → file → headings

const SETS = ["real-pdfs", "blind-pdfs", "blind-pdfs-2", "blind-pdfs-3"];

async function listPdfs(dir: string): Promise<string[]> {
  try {
    return (await readdir(dir)).filter((f) => f.endsWith(".pdf")).sort().map((f) => join(dir, f));
  } catch {
    return [];
  }
}

function pad(value: string | number, width: number): string {
  return String(value).padStart(width);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const scriptDir = fileURLToPath(new URL(".", import.meta.url));
  let root = scriptDir;
  let saveTo: string | undefined;
  let diffFrom: string | undefined;
  let showPrivate = false;
  const dirs: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--save") saveTo = args[++i];
    else if (args[i] === "--diff") diffFrom = args[++i];
    else if (args[i] === "--pdfs-root") root = resolve(args[++i] ?? "");
    else if (args[i] === "--show-private") showPrivate = true;
    else dirs.push(resolve(args[i]));
  }
  if (dirs.length === 0) dirs.push(...SETS.map((d) => join(root, d)));

  let before: HeadingSnapshot | undefined;
  if (diffFrom) {
    try {
      before = JSON.parse(await readFile(diffFrom, "utf-8")) as HeadingSnapshot;
    } catch (err) {
      throw new Error(`Could not read snapshot ${diffFrom}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const snapshot: HeadingSnapshot = {};
  const grand: HeadingSummary = summarize([]);
  for (const dir of dirs) {
    const files = await listPdfs(dir);
    if (files.length === 0) continue;
    const set = basename(dir);
    const isPrivate = set !== "real-pdfs";
    snapshot[set] = {};
    console.log(`\n## ${set}\n`);
    console.log(`| PDF | H1 | H2 | H3 | H4+ | ${HEADING_ISSUES.join(" | ")} |`);
    console.log(`| --- | ---: | ---: | ---: | ---: |${HEADING_ISSUES.map(() => " ---: |").join("")}`);
    const diffLines: string[] = [];
    for (const file of files) {
      const name = basename(file);
      let headings: Heading[];
      try {
        const result = await convert(new Uint8Array(await readFile(file)));
        headings = result.status === "failed" ? [] : extractHeadings(result.markdown);
      } catch (err) {
        console.error(`  ${set}/${name}: ERROR ${err instanceof Error ? err.message : String(err)}`);
        continue;
      }
      snapshot[set][name] = headings;
      const s = summarize(headings);
      grand.total += s.total;
      s.byLevel.forEach((n, i) => (grand.byLevel[i] += n));
      for (const k of HEADING_ISSUES) grand.issues[k] += s.issues[k];
      const deep = s.byLevel.slice(3).reduce((a, b) => a + b, 0);
      console.log(
        `| ${name} | ${s.byLevel[0]} | ${s.byLevel[1]} | ${s.byLevel[2]} | ${deep} |${HEADING_ISSUES.map((k) => ` ${s.issues[k]} |`).join("")}`,
      );

      const old = before?.[set]?.[name];
      if (!old) continue;
      const d = diffHeadings(old, headings);
      if (d.added.length + d.removed.length + d.relevelled.length === 0) continue;
      diffLines.push(`- ${name}: +${d.added.length} -${d.removed.length} ~${d.relevelled.length}`);
      if (isPrivate && !showPrivate) continue;
      const cut = (t: string) => (t.length > 90 ? `${t.slice(0, 87)}...` : t);
      for (const h of d.added) diffLines.push(`  + H${h.level} ${cut(h.text)}`);
      for (const h of d.removed) diffLines.push(`  - H${h.level} ${cut(h.text)}`);
      for (const r of d.relevelled) diffLines.push(`  ~ H${r.from}→H${r.to} ${cut(r.text)}`);
    }
    if (before) {
      console.log(`\n### Changes since the snapshot (${set})\n`);
      console.log(diffLines.length > 0 ? diffLines.join("\n") : "none");
    }
  }

  const deep = grand.byLevel.slice(3).reduce((a, b) => a + b, 0);
  console.log("\n## Totals\n");
  console.log(
    `headings ${pad(grand.total, 5)}  H1 ${grand.byLevel[0]}  H2 ${grand.byLevel[1]}  H3 ${grand.byLevel[2]}  H4+ ${deep}  | ` +
      HEADING_ISSUES.map((k) => `${k} ${grand.issues[k]}`).join("  "),
  );

  if (saveTo) {
    await writeFile(saveTo, JSON.stringify(snapshot, null, 1) + "\n", "utf-8");
    console.log(`\nSnapshot written to ${saveTo}`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
