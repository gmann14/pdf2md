// @vitest-environment node

import { describe, expect, it } from "vitest";
import { convert } from "./converter.js";
import { makePdf, type TestPdfLine } from "./testing/make-pdf.js";

/** A body page of a book chapter, with an optional running header. PDF y is bottom-up. */
function bookPage(n: number, header: boolean): TestPdfLine[] {
  return [
    ...(header ? [{ text: "Vector Calculus", x: 72, y: 750, size: 9 }] : []),
    { text: `Section ${n} works through one more example in full.`, x: 72, y: 690, size: 11 },
    { text: `The second line of page ${n} keeps this a paragraph of text.`, x: 72, y: 675, size: 11 },
    { text: String(n), x: 302, y: 40, size: 9 },
  ];
}

describe("running headers", () => {
  it("strips a header on even pages only when the chapter title shares its text", async () => {
    // Pages 2, 4 and 6 carry the header at one height; page 1 has the chapter
    // title, with the same text, lower down. That is 4 of 8 pages, but only 3
    // at the header's height.
    const pages = Array.from({ length: 8 }, (_, i) => bookPage(i + 1, [2, 4, 6].includes(i + 1)));
    pages[0].unshift({ text: "Vector Calculus", x: 72, y: 720, size: 9 });
    const result = await convert(makePdf({ pages }));
    expect(result.markdown).toContain("Section 2 works through one more example in full.");
    expect(result.markdown.match(/Vector Calculus/g)?.length ?? 0).toBe(0);
  });

  it("keeps text that opens several pages at a different height each time", async () => {
    // Clause references fold to the same text once digits are ignored.
    const pages = Array.from({ length: 6 }, (_, i) => bookPage(i + 1, false));
    for (const [page, y] of [[0, 745], [2, 735], [4, 725]] as const) {
      pages[page].unshift({ text: `GSAR 552.270-${page + 10}`, x: 72, y, size: 11 });
    }
    const result = await convert(makePdf({ pages }));
    for (const ref of ["GSAR 552.270-10", "GSAR 552.270-12", "GSAR 552.270-14"]) {
      expect(result.markdown).toContain(ref);
    }
  });
});
