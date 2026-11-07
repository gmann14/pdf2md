// @vitest-environment node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getPdfInfo } from "./info.js";
import { makePdf, reportPages } from "./testing/make-pdf.js";

const corpus = resolve(dirname(fileURLToPath(import.meta.url)), "../../../test-corpus");

describe("getPdfInfo", () => {
  it("reports page count, metadata and text-layer pages", async () => {
    const info = await getPdfInfo(await readFile(resolve(corpus, "real-pdfs/whitepaper-bitcoin.pdf")));
    expect(info.status).toBe("success");
    expect(info.pageCount).toBe(9);
    expect(info.pagesWithText).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(info.metadata?.pdfVersion).toMatch(/^\d\.\d$/);
    expect(info.metadata?.hasTextLayer).toBe(true);
    expect(typeof info.metadata?.isTagged).toBe("boolean");
  });

  it("lists only the pages that have text", async () => {
    const pages = reportPages(4);
    pages[1] = [];
    const info = await getPdfInfo(makePdf({ pages }));
    expect(info.pageCount).toBe(4);
    expect(info.pagesWithText).toEqual([1, 3, 4]);
  });

  it("reports a PDF without text as having no text layer", async () => {
    const info = await getPdfInfo(makePdf({ pages: [[], []] }));
    expect(info.pagesWithText).toEqual([]);
    expect(info.metadata?.hasTextLayer).toBe(false);
  });

  it("fails without rejecting on a non-PDF or an oversized file", async () => {
    const bad = await getPdfInfo(await readFile(resolve(corpus, "invalid-not-a-pdf.pdf")));
    expect(bad.status).toBe("failed");
    expect(bad.messages[0]?.code).toBe("parse_failed");

    const big = await getPdfInfo(makePdf({ pages: reportPages(1) }), { maxFileSizeBytes: 10 });
    expect(big.messages[0]?.code).toBe("oversized");
  });
});
