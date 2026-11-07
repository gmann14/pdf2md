/**
 * Reference-test checks (olmOCR-bench style, plus heading, link and emphasis).
 *
 * Every check runs on the converter's Markdown, parsed with markdown-it (CommonMark),
 * so a marker that a renderer would show literally does not count as structure.
 * Text is normalised before matching: NFKC, curly quotes to straight, dash variants
 * to "-", soft hyphens removed, whitespace collapsed. Matching is case-sensitive.
 */

import MarkdownIt from "markdown-it";
import { normalizeUrl } from "../fidelity";

type Token = ReturnType<MarkdownIt["parse"]>[number];

interface BaseTest {
  /** Unique, stable id: `<pdf stem>-p<page>-<short slug>`. */
  id: string;
  /** File name in test-corpus/real-pdfs/. */
  pdf: string;
  /** 1-based page the expectation was checked on. */
  page: number;
  /** Why this test exists or what was checked, when not obvious. */
  note?: string;
}

export interface PresentTest extends BaseTest { type: "present"; text: string }
export interface AbsentTest extends BaseTest { type: "absent"; text: string; /** Allowed occurrences (default 0). */ maxCount?: number }
export interface OrderTest extends BaseTest { type: "order"; before: string; after: string }
export interface TableTest extends BaseTest {
  type: "table";
  cell: string;
  right?: string;
  left?: string;
  below?: string;
  above?: string;
}
export interface HeadingTest extends BaseTest { type: "heading"; text: string; /** Exact level, when the hierarchy is unambiguous. */ level?: number }
export interface LinkTest extends BaseTest { type: "link"; text: string; url: string }
export interface EmphasisTest extends BaseTest { type: "emphasis"; text: string; style: "bold" | "italic" }
/** Text is (part of) one list item; `ordered` pins a numbered or a bulleted list. */
export interface ListTest extends BaseTest { type: "list"; text: string; ordered?: boolean }

export type ReferenceTest = PresentTest | AbsentTest | OrderTest | TableTest | HeadingTest | LinkTest | EmphasisTest | ListTest;
export type TestType = ReferenceTest["type"];
export const TEST_TYPES: readonly TestType[] = ["present", "absent", "order", "table", "heading", "link", "emphasis", "list"];

export interface CheckResult {
  pass: boolean;
  /** Short reason when it fails. */
  detail?: string;
}

// ---------------------------------------------------------------------------
// Normalisation and parsing
// ---------------------------------------------------------------------------

export function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/­/g, "")
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‐-―−]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

const md = new MarkdownIt({ html: true });

function stripFrontMatter(markdown: string): string {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function inlineText(children: Token[] | null): string {
  let out = "";
  for (const t of children ?? []) {
    if (t.type === "text" || t.type === "code_inline") out += t.content;
    else if (t.type === "softbreak" || t.type === "hardbreak") out += " ";
    else if (t.type === "image") out += t.content;
  }
  return out;
}

export interface ParsedMarkdown {
  /** Visible text, one block per line, whitespace-normalised. */
  text: string;
  headings: { level: number; text: string }[];
  links: { text: string; url: string }[];
  bold: string[];
  italic: string[];
  /** Text of each list item (its first paragraph and any continuation), with the list kind. */
  listItems: { text: string; ordered: boolean }[];
  /** Each table as rows of normalised cell text (header row first). */
  tables: string[][][];
}

export function parseMarkdown(markdown: string): ParsedMarkdown {
  const tokens = md.parse(stripFrontMatter(markdown), {});
  const blocks: string[] = [];
  const headings: ParsedMarkdown["headings"] = [];
  const links: ParsedMarkdown["links"] = [];
  const bold: string[] = [];
  const italic: string[] = [];
  const tables: string[][][] = [];
  const listItems: ParsedMarkdown["listItems"] = [];
  const listKinds: boolean[] = [];
  const itemStack: { text: string[]; ordered: boolean }[] = [];
  let table: string[][] | undefined;
  let row: string[] | undefined;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === "bullet_list_open" || t.type === "ordered_list_open") listKinds.push(t.type === "ordered_list_open");
    else if (t.type === "bullet_list_close" || t.type === "ordered_list_close") listKinds.pop();
    else if (t.type === "list_item_open") itemStack.push({ text: [], ordered: listKinds[listKinds.length - 1] ?? false });
    else if (t.type === "list_item_close") {
      const item = itemStack.pop();
      if (item) listItems.push({ text: item.text.join(" "), ordered: item.ordered });
    } else if (t.type === "table_open") table = [];
    else if (t.type === "table_close") {
      if (table) tables.push(table);
      table = undefined;
    } else if (t.type === "tr_open") row = [];
    else if (t.type === "tr_close") {
      if (table && row) table.push(row);
      row = undefined;
    } else if (t.type === "fence" || t.type === "code_block") {
      blocks.push(normalize(t.content));
    } else if (t.type === "inline") {
      const text = normalize(inlineText(t.children));
      blocks.push(text);
      if (row) row.push(text);
      const item = itemStack[itemStack.length - 1];
      if (item) item.text.push(text);
      const prev = tokens[i - 1];
      if (prev?.type === "heading_open") headings.push({ level: Number(prev.tag.slice(1)), text });
      collectInline(t.children ?? [], links, bold, italic);
    }
  }
  return { text: blocks.join("\n"), headings, links, bold, italic, listItems, tables };
}

function collectInline(children: Token[], links: ParsedMarkdown["links"], bold: string[], italic: string[]): void {
  const open: { kind: "link" | "strong" | "em"; text: string; url?: string }[] = [];
  for (const t of children) {
    if (t.type === "link_open") open.push({ kind: "link", text: "", url: t.attrGet("href") ?? "" });
    else if (t.type === "strong_open") open.push({ kind: "strong", text: "" });
    else if (t.type === "em_open") open.push({ kind: "em", text: "" });
    else if (t.type === "link_close" || t.type === "strong_close" || t.type === "em_close") {
      const kind = t.type === "link_close" ? "link" : t.type === "strong_close" ? "strong" : "em";
      const idx = open.map((o) => o.kind).lastIndexOf(kind);
      if (idx === -1) continue;
      const [span] = open.splice(idx, 1);
      const text = normalize(span.text);
      if (kind === "link") links.push({ text, url: span.url ?? "" });
      else if (kind === "strong") bold.push(text);
      else italic.push(text);
    } else {
      const piece =
        t.type === "text" || t.type === "code_inline" ? t.content : t.type === "softbreak" || t.type === "hardbreak" ? " " : "";
      for (const o of open) o.text += piece;
    }
  }
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function flat(text: string): string {
  return text.replace(/\n/g, " ");
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  for (let i = haystack.indexOf(needle); i !== -1; i = haystack.indexOf(needle, i + needle.length)) count++;
  return count;
}

function checkTable(parsed: ParsedMarkdown, test: TableTest): CheckResult {
  const want = normalize(test.cell);
  let found = false;
  for (const grid of parsed.tables) {
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] !== want) continue;
        found = true;
        const ok =
          (test.right === undefined || grid[r][c + 1] === normalize(test.right)) &&
          (test.left === undefined || grid[r][c - 1] === normalize(test.left)) &&
          (test.below === undefined || grid[r + 1]?.[c] === normalize(test.below)) &&
          (test.above === undefined || grid[r - 1]?.[c] === normalize(test.above));
        if (ok) return { pass: true };
      }
    }
  }
  return { pass: false, detail: found ? "cell found, neighbour differs" : parsed.tables.length ? "cell not in any table" : "no tables" };
}

export function runCheck(parsed: ParsedMarkdown, test: ReferenceTest): CheckResult {
  const text = flat(parsed.text);
  switch (test.type) {
    case "present": {
      return text.includes(normalize(test.text)) ? { pass: true } : { pass: false, detail: "text not found" };
    }
    case "absent": {
      const n = countOccurrences(text, normalize(test.text));
      const max = test.maxCount ?? 0;
      return n <= max ? { pass: true } : { pass: false, detail: `found ${n}×, allowed ${max}` };
    }
    case "order": {
      const a = text.indexOf(normalize(test.before));
      const b = text.indexOf(normalize(test.after));
      if (a === -1 || b === -1) return { pass: false, detail: `${a === -1 ? "before" : "after"} text not found` };
      return a < b ? { pass: true } : { pass: false, detail: "wrong order" };
    }
    case "table":
      return checkTable(parsed, test);
    case "heading": {
      const want = normalize(test.text);
      const hits = parsed.headings.filter((h) => h.text === want);
      if (hits.length === 0) return { pass: false, detail: "no heading with this text" };
      if (test.level !== undefined && !hits.some((h) => h.level === test.level)) {
        return { pass: false, detail: `heading level ${hits.map((h) => h.level).join("/")}, want ${test.level}` };
      }
      return { pass: true };
    }
    case "link": {
      const want = normalize(test.text);
      const url = normalizeUrl(test.url);
      const sameUrl = parsed.links.filter((l) => normalizeUrl(l.url) === url);
      if (sameUrl.some((l) => l.text.includes(want))) return { pass: true };
      return { pass: false, detail: sameUrl.length ? "URL linked from other text" : "URL not linked" };
    }
    case "list": {
      const want = normalize(test.text);
      const hits = parsed.listItems.filter((li) => li.text.includes(want));
      if (hits.length === 0) return { pass: false, detail: "not in a list item" };
      if (test.ordered !== undefined && !hits.some((li) => li.ordered === test.ordered)) {
        return { pass: false, detail: `in a ${test.ordered ? "bulleted" : "numbered"} list` };
      }
      return { pass: true };
    }
    case "emphasis": {
      const spans = test.style === "bold" ? parsed.bold : parsed.italic;
      return spans.some((s) => s.includes(normalize(test.text)))
        ? { pass: true }
        : { pass: false, detail: `no ${test.style} span with this text` };
    }
  }
}

// ---------------------------------------------------------------------------
// Validation of JSONL rows
// ---------------------------------------------------------------------------

const STRING_FIELDS: Record<TestType, { required: string[]; optional: string[] }> = {
  present: { required: ["text"], optional: [] },
  absent: { required: ["text"], optional: [] },
  order: { required: ["before", "after"], optional: [] },
  table: { required: ["cell"], optional: ["right", "left", "below", "above"] },
  heading: { required: ["text"], optional: [] },
  link: { required: ["text", "url"], optional: [] },
  emphasis: { required: ["text", "style"], optional: [] },
  list: { required: ["text"], optional: [] },
};

/** Validate one parsed JSONL row; throws with a readable message. */
export function validateTest(row: unknown): ReferenceTest {
  if (typeof row !== "object" || row === null) throw new Error("not an object");
  const r = row as Record<string, unknown>;
  for (const k of ["id", "pdf", "type"]) if (typeof r[k] !== "string" || !r[k]) throw new Error(`missing ${k}`);
  if (!Number.isInteger(r.page) || (r.page as number) < 1) throw new Error(`${String(r.id)}: page must be a positive integer`);
  const type = r.type as TestType;
  if (!TEST_TYPES.includes(type)) throw new Error(`${String(r.id)}: unknown type ${String(r.type)}`);
  const spec = STRING_FIELDS[type];
  for (const k of spec.required) if (typeof r[k] !== "string" || !(r[k] as string).trim()) throw new Error(`${String(r.id)}: ${type} needs ${k}`);
  for (const k of spec.optional) if (r[k] !== undefined && typeof r[k] !== "string") throw new Error(`${String(r.id)}: ${k} must be a string`);
  if (type === "table" && ["right", "left", "below", "above"].every((k) => r[k] === undefined)) {
    throw new Error(`${String(r.id)}: table needs at least one neighbour`);
  }
  if (type === "emphasis" && r.style !== "bold" && r.style !== "italic") throw new Error(`${String(r.id)}: style must be bold or italic`);
  if (type === "heading" && r.level !== undefined && !(Number.isInteger(r.level) && (r.level as number) >= 1 && (r.level as number) <= 6)) {
    throw new Error(`${String(r.id)}: level must be 1-6`);
  }
  if (type === "absent" && r.maxCount !== undefined && !(Number.isInteger(r.maxCount) && (r.maxCount as number) >= 0)) {
    throw new Error(`${String(r.id)}: maxCount must be a non-negative integer`);
  }
  if (type === "list" && r.ordered !== undefined && typeof r.ordered !== "boolean") throw new Error(`${String(r.id)}: ordered must be a boolean`);
  if (r.note !== undefined && typeof r.note !== "string") throw new Error(`${String(r.id)}: note must be a string`);
  return r as unknown as ReferenceTest;
}
