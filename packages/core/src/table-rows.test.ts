// @vitest-environment node

import { describe, expect, it } from "vitest";
import { convert, joinTableRowBlocks } from "./converter.js";
import { makePdf, type TestPdfLine } from "./testing/make-pdf.js";

/** A table row at `y`: one line per cell, at the column x positions. */
function row(y: number, cells: string[], xs: number[]): TestPdfLine[] {
  return cells.flatMap((text, c) => (text ? [{ text, x: xs[c] ?? 0, y, size: 10 }] : []));
}

describe("tables whose rows are set apart", () => {
  it("joins one-line rows padded further apart than text lines into one table", async () => {
    // NIST Table 1: 10 pt rows 18 pt apart, the function cell only on the
    // first row of each group.
    const xs = [120, 178, 247, 298];
    const rows: string[][] = [
      ["ID", "Identify", "ID.AM", "Asset Management"],
      ["", "", "ID.BE", "Business Environment"],
      ["", "", "ID.GV", "Governance"],
      ["PR", "Protect", "PR.AC", "Access Control"],
      ["", "", "PR.AT", "Awareness and Training"],
      ["", "", "PR.DS", "Data Security"],
    ];
    const page: TestPdfLine[] = [
      { text: "Table 1: Function and Category Unique Identifiers", x: 188, y: 700, size: 10 },
      ...rows.flatMap((cells, r) => row(670 - r * 18, cells, xs)),
      { text: "Body text after the table explains how the identifiers are used.", x: 72, y: 540 },
    ];
    const markdown = (await convert(makePdf({ pages: [page] }))).markdown;
    expect(markdown).toMatch(/^\| ID +\| Identify +\| ID\.AM +\| Asset Management +\|$/m);
    expect(markdown).toMatch(/^\| +\| +\| ID\.BE +\| Business Environment +\|$/m);
    expect(markdown).toMatch(/^\| +\| +\| PR\.DS +\| Data Security +\|$/m);
  });

  it("leaves lines set apart as paragraphs when their parts do not line up", async () => {
    // Each line has a wide gap, but at a different place: no columns.
    const page: TestPdfLine[] = [
      [72, 300],
      [72, 200],
      [72, 420],
      [72, 250],
    ].flatMap(([a, b], r) => [
      { text: `Note ${r} on the widget`, x: a ?? 72, y: 700 - r * 24 },
      { text: "see page four", x: b ?? 300, y: 700 - r * 24 },
    ]);
    const markdown = (await convert(makePdf({ pages: [page] }))).markdown;
    expect(markdown).not.toContain("|");
  });

  it("leaves lines set apart as paragraphs when they would split into more columns than they have gaps", async () => {
    // Each line has one wide gap, but its words line up from line to line, so
    // a table of them would cut every word into its own column.
    const page: TestPdfLine[] = [0, 1, 2, 3].flatMap((r) => [
      { text: "alpha", x: 72, y: 700 - r * 24 },
      { text: "beta", x: 110, y: 700 - r * 24 },
      { text: `gamma ${r}`, x: 300, y: 700 - r * 24 },
    ]);
    const markdown = (await convert(makePdf({ pages: [page] }))).markdown;
    expect(markdown).not.toContain("|");
    expect(markdown).toContain("alpha beta gamma 2");
  });
});

describe("joinTableRowBlocks", () => {
  type Blocks = Parameters<typeof joinTableRowBlocks>[0];

  /** One one-line paragraph block per line, each part a run at its x. */
  function lineBlocks(lines: [number, string][][], pitch: number): Blocks {
    return lines.map((parts, r) => ({
      type: "paragraph" as const,
      items: parts.map(([x, str]) => ({
        str,
        x,
        y: 100 + r * pitch,
        width: str.length * 5,
        height: 10,
        fontSize: 10,
        fontName: "Helvetica",
        hasEOL: false,
        page: 1,
      })),
    }));
  }

  it("checks a long run of row-like lines that is not a table in linear time", () => {
    // A crafted page of thousands of two-part lines, each ending in a broken
    // word, fails the table checks. Trying the run again from every line
    // would cost a table detection per line over the whole run.
    const lines: [number, string][][] = Array.from({ length: 3000 }, (_, r) => [
      [72, `line ${r} of the left col-`],
      [320, `line ${r} of the right col-`],
    ]);
    const blocks = lineBlocks(lines, 14);
    const start = performance.now();
    expect(joinTableRowBlocks(blocks)).toEqual(blocks);
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it("leaves two columns of prose lines as paragraphs", () => {
    // GPO style manual: a two-column letter whose lines arrive one block each.
    const blocks = lineBlocks(
      [
        [[72, "1958. The record shows"], [320, "Sherman Williams, one of his secre-"]],
        [[72, "I agree with the goal of re-"], [320, "taries, who also informed the House"]],
        [[72, "forming the pensions and"], [320, "that on the following dates the"]],
        [[72, "allowances of former members"], [320, "payments were made in full."]],
      ],
      14,
    );
    expect(joinTableRowBlocks(blocks)).toEqual(blocks);
  });

  it("joins the same lines into a table when no cell ends in a broken word", () => {
    const blocks = lineBlocks(
      [
        [[72, "Asset Management"], [320, "ID.AM"]],
        [[72, "Business Environment"], [320, "ID.BE"]],
        [[72, "Governance"], [320, "ID.GV"]],
      ],
      18,
    );
    expect(joinTableRowBlocks(blocks)).toMatchObject([{ type: "table", tableRows: [["Asset Management", "ID.AM"], ["Business Environment", "ID.BE"], ["Governance", "ID.GV"]] }]);
  });

  it("leaves the lines apart when a line's parts would share one cell", () => {
    // The last line has two parts, but both fall in the first column: its
    // text runs across the columns, so the lines are not rows of one table.
    const blocks = lineBlocks(
      [
        [[72, "Alpha"], [200, "one"], [300, "1"]],
        [[72, "Beta"], [200, "two"], [300, "2"]],
        [[72, "Gamma"], [200, "three"], [300, "3"]],
        [[72, "Total"], [115, "of all"]],
      ],
      18,
    );
    expect(joinTableRowBlocks(blocks)).toEqual(blocks);
  });

  it("leaves lines with a link apart, so the link is kept", () => {
    // IRS Pub 17: "19 Education-Related Adjustments  Pub. 970, …" rows whose
    // publication titles are links. Table cells are plain text.
    const blocks = lineBlocks(
      [
        [[72, "19"], [120, "Education-Related Adjustments"], [320, "Pub. 970"]],
        [[72, "20"], [120, "Other Adjustments to Income"], [320, "Pub. 463"]],
        [[72, "22"], [120, "Medical and Dental Expenses"], [320, "Pub. 502"]],
      ],
      18,
    );
    expect(joinTableRowBlocks(blocks)).toMatchObject([{ type: "table" }]);
    const linked = blocks[1]?.items[2];
    const linkMap = new Map(linked ? [[linked, "https://www.irs.gov/pub463"]] : []);
    expect(joinTableRowBlocks(blocks, linkMap)).toEqual(blocks);
  });

  it("leaves two columns of text lines apart when every line runs the column's width", () => {
    // Census report: two text columns whose lines arrive one block each.
    const blocks = lineBlocks(
      [
        [[72, "poverty measure can be used to"], [320, "Additionally, it accounts for"]],
        [[72, "evaluate economic well-being back"], [320, "housing tenure by using different"]],
        [[72, "to 1959. Appendix A provides more"], [320, "thresholds for renters, owners"]],
        [[72, "information on the official poverty"], [320, "with a mortgage, and those who"]],
      ],
      14,
    );
    expect(joinTableRowBlocks(blocks)).toEqual(blocks);
  });
});
