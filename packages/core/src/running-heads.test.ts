// @vitest-environment node

import { describe, expect, it } from "vitest";
import { convert } from "./converter.js";
import { makePdf, type TestPdfLine } from "./testing/make-pdf.js";

/** Two body lines at 11 pt, starting at `y` (PDF y is bottom-up). */
function body(y: number, words = "explains the widgets in plain words"): TestPdfLine[] {
  return [
    { text: `This body line ${words} for the reader.`, x: 72, y },
    { text: "A second body line keeps this a real paragraph of text.", x: 72, y: y - 14 },
  ];
}

/** One word per page, so body lines do not repeat as running headers or footers. */
const WORDS = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel"];

async function markdownOf(pages: TestPdfLine[][]): Promise<string> {
  return (await convert(makePdf({ pages }))).markdown;
}

function headings(markdown: string): string[] {
  return markdown.split("\n").filter((line) => /^#{1,6} /.test(line));
}

describe("chapter running heads", () => {
  it("does not take a chapter's bold running head for a heading", async () => {
    // Each chapter's head repeats on its own pages only: too few pages for
    // header stripping (under half), but at one height on 3+ pages.
    const pages: TestPdfLine[][] = Array.from({ length: 8 }, () => [...body(690), ...body(650)]);
    for (const [i, head] of [
      [1, "Chapter 1. Basics"],
      [2, "Chapter 1. Basics"],
      [3, "Chapter 1. Basics"],
      [5, "Chapter 2. Further work"],
      [6, "Chapter 2. Further work"],
      [7, "Chapter 2. Further work"],
    ] as const) {
      pages[i]?.unshift({ text: head, x: 72, y: 750, font: "Helvetica-Bold" }, { text: String(i + 1), x: 540, y: 750 });
    }
    pages[0]?.unshift({ text: "Widget Survey Report", x: 72, y: 740, size: 20 });
    const markdown = await markdownOf(pages);
    expect(markdown).not.toMatch(/^#+ Chapter \d/m);
    expect(markdown).toContain("Chapter 1. Basics");
  });

  it("keeps numbered headings that open their pages at one height", async () => {
    // "Article 4", "Article 12" and "Article 22" differ by a number that does
    // not run with the page, so they are not one running head and a page number.
    const pages = WORDS.map((word) => [...body(700, word), ...body(660, `also ${word}`)]);
    for (const [i, n] of [[1, 4], [4, 12], [6, 22]] as const) {
      pages[i]?.unshift({ text: `Article ${n}`, x: 72, y: 750, font: "Helvetica-Bold" });
    }
    pages[0]?.unshift({ text: "Widget Regulation", x: 72, y: 750, size: 20 });
    const found = headings(await markdownOf(pages));
    for (const n of [4, 12, 22]) expect(found.some((h) => h.endsWith(` Article ${n}`))).toBe(true);
  });

  it("keeps a recurring heading at the top of its pages when no page number shares its line", async () => {
    // A recipe book opens each notes page with the same heading.
    const pages = WORDS.map((word) => [...body(700, word), ...body(660, `also ${word}`)]);
    for (const i of [1, 4, 6]) pages[i]?.unshift({ text: "Food Safety Notes", x: 72, y: 750, font: "Helvetica-Bold" });
    pages[0]?.unshift({ text: "Widget Recipes", x: 72, y: 750, size: 20 });
    const markdown = await markdownOf(pages);
    expect(markdown.match(/^#+ Food Safety Notes$/gm)?.length).toBe(3);
  });
});
