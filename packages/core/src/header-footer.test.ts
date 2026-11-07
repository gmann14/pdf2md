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

  it("keeps table-of-contents page numbers that sit in the header band", async () => {
    // Page numbers run at the top corners. The first contents line on each of
    // the two contents pages is in the same band, with its chapter number and
    // page number at the corners' x positions, but lower down.
    const pages = Array.from({ length: 12 }, (_, i): TestPdfLine[] => {
      const n = i + 1;
      return [
        { text: String(n), x: n % 2 === 0 ? 72 : 530, y: 750, size: 10 },
        { text: `Body text of page ${n} explains one more widget in plain words.`, x: 72, y: 600, size: 10 },
        { text: `A second line on page ${n} keeps this a real paragraph of text.`, x: 72, y: 586, size: 10 },
        { text: "End of the page text.", x: 72, y: 60, size: 10 },
      ];
    });
    pages[1].splice(1, 0, { text: "3", x: 72, y: 725, size: 10 }, { text: "Functions", x: 90, y: 725, size: 10 }, { text: "17", x: 530, y: 725, size: 10 });
    pages[2].splice(1, 0, { text: "9", x: 72, y: 725, size: 10 }, { text: "Case study", x: 90, y: 725, size: 10 }, { text: "83", x: 530, y: 725, size: 10 });
    const result = await convert(makePdf({ pages }));
    for (const entry of ["3", "Functions", "17", "9", "Case study", "83"]) {
      expect(result.markdown).toMatch(new RegExp(`(^|\\s)${entry}(\\s|$)`));
    }
    // The running page numbers are still stripped.
    expect(result.markdown).not.toMatch(/^(5|6|7|8)$/m);
  });

  it("keeps footnote labels that sit in the footer band", async () => {
    // A page number at the foot of every page, and on most pages a footnote
    // just above it whose raised label is at the left margin. Footnotes sit
    // on a grid, so the labels recur at one position on most pages too.
    const topics = ["gears", "levers", "pulleys", "springs", "valves", "pistons", "bearings", "cams", "chains", "belts"];
    const sources = ["Smith", "Jones", "Brown", "Taylor", "Wilson", "Davies", "Evans", "Thomas"];
    const pages = Array.from({ length: 10 }, (_, i): TestPdfLine[] => {
      const n = i + 1;
      const lines: TestPdfLine[] = [
        { text: `This page is about ${topics[i]} and how they fit together.`, x: 72, y: 700, size: 12 },
        { text: `Most ${topics[i]} wear out slowly when they are looked after.`, x: 72, y: 684, size: 12 },
        { text: String(n), x: 302, y: 40, size: 10 },
      ];
      if (n <= 8) {
        lines.push(
          { text: String(n + 40), x: 72, y: 62, size: 6 },
          { text: `See ${sources[i]} on ${topics[i]} for the full proof.`, x: 82, y: 60, size: 9 },
        );
      }
      return lines;
    });
    const result = await convert(makePdf({ pages }));
    for (let n = 1; n <= 8; n++) {
      expect(result.markdown).toMatch(new RegExp(`${n + 40}\\s+See ${sources[n - 1]} on ${topics[n - 1]} for the full proof\\.`));
    }
    expect(result.markdown).not.toMatch(/^(3|4|5)$/m);
  });
});
