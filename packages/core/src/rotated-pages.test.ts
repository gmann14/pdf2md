// @vitest-environment node

import { describe, expect, it } from "vitest";
import { convert, pageTextTurn } from "./converter.js";
import { makePdf, type TestPdfLine } from "./testing/make-pdf.js";

const YEARS = ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];

/**
 * A table printed sideways on a portrait page (it reads upward): rows run
 * left to right across the page (PDF x), cells run bottom to top (PDF y).
 * Every row label sits at the same PDF y, so read upright the labels look
 * like one repeated line in the page band.
 */
function sidewaysTablePage(page: number): TestPdfLine[] {
  const columns = Array.from({ length: 16 }, (_, c) => 130 + c * 32);
  const lines: TestPdfLine[] = [
    { text: `Table B-${page}. People in Poverty by Year: 2016 to 2023`, x: 60, y: 72, size: 10, turn: 1 },
    { text: "Year", x: 90, y: 72, size: 8, turn: 1 },
    ...columns.map((y, c) => ({ text: `Col ${c + 1}`, x: 90, y, size: 8, turn: 1 as const })),
  ];
  YEARS.forEach((year, i) => {
    const x = 104 + i * 11;
    lines.push(
      { text: year, x, y: 72, size: 8, turn: 1 },
      ...columns.map((y, c) => ({ text: `${10 * c + i}.${page}`, x, y, size: 8, turn: 1 as const })),
    );
  });
  lines.push({ text: String(30 + page), x: 560, y: 700, size: 8, turn: 1 });
  return lines;
}

describe("pages printed sideways", () => {
  it("finds the turn of most of a page's text", () => {
    const item = (str: string, a: number, b: number) => ({ str, transform: [a, b, -b, a, 0, 0] });
    expect(pageTextTurn([item("upright text", 10, 0), item("stamp", 0, 10)])).toBe(0);
    expect(pageTextTurn([item("reads upward along the page", 0, 10), item("1", 10, 0)])).toBe(1);
    expect(pageTextTurn([item("upside down", -10, 0)])).toBe(2);
    expect(pageTextTurn([item("reads downward", 0, -10)])).toBe(3);
    expect(pageTextTurn([])).toBe(0);
  });

  it("reads a table printed sideways as a table and keeps every year", async () => {
    const result = await convert(makePdf({ pages: [1, 2, 3, 4].map(sidewaysTablePage) }));
    expect(result.status).toBe("success");
    const md = result.markdown;
    for (const year of YEARS) {
      // One row per year on each of the four pages.
      expect(md.match(new RegExp(`\\| ${year} +\\|`, "g"))?.length).toBe(4);
    }
    // The last row of each table (2016) sits in the reading frame's bottom band.
    expect(md).toMatch(/\| 2016 +\| 7\.1 +\| 17\.1 +\| 27\.1 +\|/);
  });

  it("keeps a table row of numbers on an upright page's last line while stripping the page number", async () => {
    const pages = [1, 2, 3, 4].map((page) => {
      const lines: TestPdfLine[] = [
        { text: "Quarterly Widget Review", x: 72, y: 750, size: 9 },
        { text: `Body text for page ${page} explains the widgets in plain words.`, x: 72, y: 700, size: 11 },
        { text: "A second line keeps this a real paragraph of body text.", x: 72, y: 686, size: 11 },
      ];
      for (let r = 0; r < 4; r++) {
        const y = 640 - r * 14;
        lines.push(
          { text: `Row ${r + 1}`, x: 72, y, size: 9 },
          ...[200, 280, 360, 440].map((x, c) => ({ text: String(100 * page + 10 * r + c), x, y, size: 9 })),
        );
      }
      lines.push(
        { text: "Total", x: 72, y: 60, size: 9 },
        ...[200, 280, 360, 440].map((x, c) => ({ text: String(900 + page + c), x, y: 60, size: 9 })),
        { text: String(page), x: 302, y: 30, size: 9 },
      );
      return lines;
    });
    const md = (await convert(makePdf({ pages }))).markdown;
    for (const page of [1, 2, 3, 4]) {
      for (let c = 0; c < 4; c++) expect(md).toContain(String(900 + page + c));
    }
    expect(md).not.toMatch(/^\s*[1-4]\s*$/m);
  });
});
