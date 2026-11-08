// @vitest-environment node

import { describe, expect, it } from "vitest";
import { convert } from "./converter.js";
import { makePdf, type TestPdfLine } from "./testing/make-pdf.js";

const BODY = [
  "Approximately 48.8 million Medicare beneficiaries were enrolled in the",
  "prescription drug benefit program in 2021, and their claims were used",
  "to describe how often topical antifungal drugs were prescribed by each",
  "type of clinician, how much the prescriptions cost, and where they were",
  "written. Prescribers were grouped by specialty and by region of the",
];

/** Body lines in Times-Roman 11pt at 13pt leading, from PDF y `top` down. */
function body(top: number, x = 72): TestPdfLine[] {
  return BODY.map((text, i) => ({ text, x, y: top - i * 13, size: 11, font: "Times-Roman" }));
}

async function markdownOf(lines: TestPdfLine[]): Promise<string> {
  const result = await convert(makePdf({ pages: [lines] }));
  expect(result.status).toBe("success");
  return result.markdown;
}

function headings(markdown: string): string[] {
  return markdown.split("\n").filter((line) => line.startsWith("#"));
}

describe("heading detection and levels", () => {
  it("splits a body-size bold line from the paragraph under it and ranks it under the last size heading", async () => {
    const md = await markdownOf([
      { text: "Weekly Report Vol. 73", x: 72, y: 760, size: 13 },
      { text: "Antifungal Prescribing in 2021", x: 72, y: 730, size: 16, font: "Helvetica-Bold" },
      { text: "Methods", x: 72, y: 700, size: 12, font: "Helvetica-Bold" },
      { text: "Data Source", x: 72, y: 680, size: 10, font: "Helvetica-Bold" },
      ...body(666),
      { text: "Data Analysis", x: 72, y: 590, size: 10, font: "Helvetica-Bold" },
      ...body(576),
      { text: "Results", x: 72, y: 500, size: 12, font: "Helvetica-Bold" },
      ...body(486),
    ]);
    expect(headings(md)).toEqual([
      "# Antifungal Prescribing in 2021",
      "## Methods",
      "### Data Source",
      "### Data Analysis",
      "## Results",
    ]);
    // The masthead above the title is not a heading and takes no level.
    expect(md).toContain("Weekly Report Vol. 73");
    expect(md).toMatch(/### Data Source\n\nApproximately 48\.8 million/);
  });

  it("ranks body-size bold headings by size under a title: sections H2, subsections H3", async () => {
    const md = await markdownOf([
      { text: "Copyright Basics", x: 72, y: 740, size: 36, font: "Helvetica-Bold" },
      { text: "What Works Are Protected?", x: 72, y: 690, size: 11, font: "Helvetica-Bold" },
      ...body(670),
      { text: "Transfer of Ownership", x: 72, y: 590, size: 9.5, font: "Helvetica-Bold" },
      ...body(574),
      { text: "Who Can Claim Copyright?", x: 72, y: 500, size: 11, font: "Helvetica-Bold" },
      ...body(480),
      { text: "Termination of a Transfer", x: 72, y: 400, size: 9.5, font: "Helvetica-Bold" },
      ...body(384),
    ]);
    expect(headings(md)).toEqual([
      "# Copyright Basics",
      "## What Works Are Protected?",
      "### Transfer of Ownership",
      "## Who Can Claim Copyright?",
      "### Termination of a Transfer",
    ]);
  });

  it("keeps a wrapped two-line bold heading whole and reads loosely spaced bold lines as a paragraph", async () => {
    const md = await markdownOf([
      { text: "Report Title", x: 72, y: 760, size: 20, font: "Helvetica-Bold" },
      { text: "Variation in Prescribing by", x: 72, y: 720, size: 11, font: "Helvetica-Bold" },
      { text: "Prescriber Type and Region", x: 72, y: 706, size: 11, font: "Helvetica-Bold" },
      ...body(690),
      { text: "Copyright is a form of protection", x: 72, y: 600, size: 11, font: "Helvetica-Bold" },
      { text: "provided by U.S. law to authors of", x: 72, y: 582, size: 11, font: "Helvetica-Bold" },
      { text: "original works of authorship from", x: 72, y: 564, size: 11, font: "Helvetica-Bold" },
      { text: "the time the works are created", x: 72, y: 546, size: 11, font: "Helvetica-Bold" },
      ...body(520),
    ]);
    expect(headings(md)).toEqual([
      "# Report Title",
      "## Variation in Prescribing by Prescriber Type and Region",
    ]);
    expect(md).toContain("Copyright is a form of protection provided by U.S. law to authors of");
  });

  it("does not take a numbered list item that ends mid-sentence for a section heading", async () => {
    const md = await markdownOf([
      { text: "Who Can Claim Copyright", x: 72, y: 760, size: 18, font: "Helvetica-Bold" },
      ...body(730),
      { text: "1. When the work is created by an employee as part of the regular duties, or", x: 72, y: 650, size: 11, font: "Times-Roman" },
      ...body(620),
    ]);
    expect(headings(md)).toEqual(["# Who Can Claim Copyright"]);
  });

  it("does not take a bold table row, small bold labels or a footer led by a large glyph for headings", async () => {
    const md = await markdownOf([
      { text: "Annual Summary", x: 72, y: 760, size: 18, font: "Helvetica-Bold" },
      ...body(730),
      { text: "Region", x: 72, y: 650, size: 11, font: "Helvetica-Bold" },
      { text: "Prescriptions", x: 300, y: 650, size: 11, font: "Helvetica-Bold" },
      ...body(630),
      { text: "Characteristic", x: 72, y: 550, size: 8, font: "Helvetica-Bold" },
      ...body(530),
      { text: "1", x: 72, y: 60, size: 14 },
      { text: "Copyright Office, Library of Congress, 101 Independence Avenue SE, Washington, DC", x: 86, y: 60, size: 7 },
    ]);
    expect(headings(md)).toEqual(["# Annual Summary"]);
  });
});
