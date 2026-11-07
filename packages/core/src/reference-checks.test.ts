// @vitest-environment node

import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { normalize, parseMarkdown, runCheck, validateTest, type ReferenceTest } from "../../../test-corpus/reference/checks";
import {
  checkMarkdown,
  compareToBaseline,
  loadCases,
  loadSources,
  tallyBy,
  toBaseline,
  type ReferenceResult,
} from "../../../test-corpus/reference/run";

const pdfDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../../test-corpus/real-pdfs");
const base = { id: "x", pdf: "a.pdf", page: 1 } as const;
const check = (markdown: string, test: ReferenceTest) => runCheck(parseMarkdown(markdown), test).pass;

const doc = `---
title: Front matter is ignored
---

# Report Title

## Methods

Body text with **bold words** and *an italic title*, see [Circular 33](https://www.copyright.gov/circs/circ33.pdf).
Second line of the same paragraph.

- First item
  that wraps
- Second item

1. Numbered item

| Drug | Count |
| --- | --- |
| Nystatin | 1,871,368 (29.0) |
| Ciclopirox | 657,986 (10.2) |

Footer text
Footer text
`;

describe("reference checks", () => {
  it("normalises quotes, dashes, soft hyphens and whitespace", () => {
    expect(normalize("“fixed”­  it’s – done")).toBe('"fixed" it\'s - done');
  });

  it("present and absent ignore Markdown syntax and front matter", () => {
    expect(check(doc, { ...base, type: "present", text: "Body text with bold words and an italic title" })).toBe(true);
    // Blocks are joined with a space, so text may run across a paragraph break.
    expect(check(doc, { ...base, type: "present", text: "same paragraph. First item" })).toBe(true);
    expect(check(doc, { ...base, type: "present", text: "Body text with **bold" })).toBe(false);
    expect(check(doc, { ...base, type: "absent", text: "Front matter is ignored" })).toBe(true);
    expect(check(doc, { ...base, type: "absent", text: "Footer text" })).toBe(false);
    expect(check(doc, { ...base, type: "absent", text: "Footer text", maxCount: 2 })).toBe(true);
  });

  it("order compares first occurrences", () => {
    expect(check(doc, { ...base, type: "order", before: "Methods", after: "Second item" })).toBe(true);
    expect(check(doc, { ...base, type: "order", before: "Second item", after: "Methods" })).toBe(false);
    expect(check(doc, { ...base, type: "order", before: "missing", after: "Methods" })).toBe(false);
  });

  it("table checks a cell and its neighbours", () => {
    expect(check(doc, { ...base, type: "table", cell: "Nystatin", right: "1,871,368 (29.0)", below: "Ciclopirox" })).toBe(true);
    expect(check(doc, { ...base, type: "table", cell: "Count", below: "1,871,368 (29.0)" })).toBe(true);
    expect(check(doc, { ...base, type: "table", cell: "657,986 (10.2)", left: "Ciclopirox", above: "1,871,368 (29.0)" })).toBe(true);
    expect(check(doc, { ...base, type: "table", cell: "Nystatin", right: "657,986 (10.2)" })).toBe(false);
    expect(check("Nystatin 1,871,368", { ...base, type: "table", cell: "Nystatin", right: "1,871,368" })).toBe(false);
  });

  it("heading checks text and optional level", () => {
    expect(check(doc, { ...base, type: "heading", text: "Report Title", level: 1 })).toBe(true);
    expect(check(doc, { ...base, type: "heading", text: "Methods" })).toBe(true);
    expect(check(doc, { ...base, type: "heading", text: "Methods", level: 3 })).toBe(false);
    expect(check(doc, { ...base, type: "heading", text: "Body text" })).toBe(false);
  });

  it("link needs the URL on the given text", () => {
    expect(check(doc, { ...base, type: "link", text: "Circular 33", url: "https://www.copyright.gov/circs/circ33.pdf" })).toBe(true);
    expect(check(doc, { ...base, type: "link", text: "Methods", url: "https://www.copyright.gov/circs/circ33.pdf" })).toBe(false);
    expect(check(doc, { ...base, type: "link", text: "Circular 33", url: "https://example.com" })).toBe(false);
  });

  it("emphasis uses CommonMark spans, not literal asterisks", () => {
    expect(check(doc, { ...base, type: "emphasis", text: "bold words", style: "bold" })).toBe(true);
    expect(check(doc, { ...base, type: "emphasis", text: "an italic title", style: "italic" })).toBe(true);
    expect(check(doc, { ...base, type: "emphasis", text: "bold words", style: "italic" })).toBe(false);
    expect(check("** not bold **", { ...base, type: "emphasis", text: "not bold", style: "bold" })).toBe(false);
  });

  it("list checks item text and list kind", () => {
    expect(check(doc, { ...base, type: "list", text: "First item that wraps", ordered: false })).toBe(true);
    expect(check(doc, { ...base, type: "list", text: "Numbered item", ordered: true })).toBe(true);
    expect(check(doc, { ...base, type: "list", text: "Numbered item", ordered: false })).toBe(false);
    expect(check(doc, { ...base, type: "list", text: "Methods" })).toBe(false);
  });

  it("rejects malformed cases", () => {
    expect(() => validateTest({ ...base, type: "table", cell: "a" })).toThrow(/neighbour/);
    expect(() => validateTest({ ...base, type: "emphasis", text: "a", style: "underline" })).toThrow(/style/);
    expect(() => validateTest({ ...base, type: "heading", text: "a", level: 7 })).toThrow(/level/);
    expect(() => validateTest({ ...base, type: "nope" })).toThrow(/unknown type/);
    expect(() => validateTest({ ...base, page: 0, type: "present", text: "a" })).toThrow(/page/);
    expect(validateTest({ ...base, type: "present", text: "a" }).type).toBe("present");
  });

  it("ratchets on the pass count and reports newly failing ids", () => {
    const tests: ReferenceTest[] = [
      { ...base, id: "a", type: "present", text: "Methods" },
      { ...base, id: "b", type: "present", text: "nowhere" },
    ];
    const result: ReferenceResult = { converter: "pdf2md", outcomes: checkMarkdown(doc, tests), conversionErrors: {} };
    expect(tallyBy(result.outcomes, (o) => o.test.type).get("present")).toEqual({ passed: 1, total: 2 });
    const baseline = toBaseline(result);
    expect(baseline).toEqual({ converter: "pdf2md", passed: 1, total: 2, passingIds: ["a"] });
    expect(compareToBaseline(result, baseline).ok).toBe(true);
    expect(compareToBaseline(result, { ...baseline, passed: 2, passingIds: ["a", "b"] })).toMatchObject({ ok: false, newlyFailing: ["b"] });
  });
});

describe("committed reference cases", () => {
  it("are well-formed, unique, and only use tracked PDFs with a recorded licence", async () => {
    const cases = await loadCases();
    const sources = await loadSources();
    expect(cases.length).toBeGreaterThan(100);
    for (const t of cases) {
      expect(sources[t.pdf], `${t.id}: ${t.pdf} has no entry in sources.json`).toBeDefined();
      expect(existsSync(join(pdfDir, t.pdf)), `${t.pdf} is not in real-pdfs`).toBe(true);
    }
    for (const entry of Object.values(sources)) expect(entry.licence).toMatch(/public domain/);
  });
});
