// @vitest-environment node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { convert } from "./converter.js";
import { resolvePageSelection, validatePageRange, withContextPages } from "./pages.js";
import { getPdfjs } from "./pdf-compat.js";
import { makePdf, reportPages } from "./testing/make-pdf.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const fixture = (name: string) => readFile(resolve(repoRoot, "test-corpus/fixtures", name));
const realPdf = (name: string) => readFile(resolve(repoRoot, "test-corpus/real-pdfs", name));

describe("resolvePageSelection", () => {
  it("keeps listed pages in range, sorted and deduplicated", () => {
    expect(resolvePageSelection([5, 2, 2, 9, 0, -1, 2.5, 5], 8)).toEqual([2, 5]);
  });

  it("takes a 0-based offset with an optional length", () => {
    expect(resolvePageSelection({ offset: 2, length: 3 }, 10)).toEqual([3, 4, 5]);
    expect(resolvePageSelection({ offset: 7 }, 10)).toEqual([8, 9, 10]);
    expect(resolvePageSelection({ offset: 8, length: 50 }, 10)).toEqual([9, 10]);
    expect(resolvePageSelection({ offset: 0, length: 0 }, 10)).toEqual([]);
  });

  it("counts a negative offset from the end", () => {
    expect(resolvePageSelection({ offset: -3 }, 10)).toEqual([8, 9, 10]);
    expect(resolvePageSelection({ offset: -3, length: 1 }, 10)).toEqual([8]);
    expect(resolvePageSelection({ offset: -50 }, 3)).toEqual([1, 2, 3]);
  });

  it("returns no pages for an out-of-range selection", () => {
    expect(resolvePageSelection([11, 12], 10)).toEqual([]);
    expect(resolvePageSelection({ offset: 10 }, 10)).toEqual([]);
  });

  it("selects every page when there is no selection", () => {
    expect(resolvePageSelection(undefined, 3)).toEqual([1, 2, 3]);
  });
});

describe("withContextPages", () => {
  it("adds up to 10 nearest neighbours", () => {
    expect(withContextPages([150], 300)).toEqual([145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155]);
    expect(withContextPages([1], 300)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(withContextPages([2, 3], 4)).toEqual([1, 2, 3, 4]);
    expect(withContextPages([], 4)).toEqual([]);
  });
});

describe("page-range strings", () => {
  it("resolves lists, ranges and last-N", () => {
    expect(resolvePageSelection("1-3,9", 20)).toEqual([1, 2, 3, 9]);
    expect(resolvePageSelection(" 4 ", 20)).toEqual([4]);
    expect(resolvePageSelection("-3", 20)).toEqual([18, 19, 20]);
    expect(resolvePageSelection("5-7,6-8,2", 20)).toEqual([2, 5, 6, 7, 8]);
    expect(resolvePageSelection("15-30", 20)).toEqual([15, 16, 17, 18, 19, 20]);
    expect(resolvePageSelection("30-40", 20)).toEqual([]);
  });

  it("rejects malformed ranges", () => {
    for (const bad of ["", "a", "3-1", "0", "1,,2", "-0", "1-", "99999999999999999999"]) {
      expect(() => validatePageRange(bad), bad).toThrow(/Invalid page range/);
      expect(() => resolvePageSelection(bad, 10), bad).toThrow(/Invalid page range/);
    }
  });

  it("returns a failed result, not a rejection, for a malformed range in convert", async () => {
    const result = await convert(makePdf({ pages: reportPages(2) }), { pages: "3-1" });
    expect(result.status).toBe("failed");
    expect(result.messages[0]?.code).toBe("parse_failed");
    expect(result.messages[0]?.message).toMatch(/Invalid page range/);
  });
});

describe("selection size is bounded", () => {
  const HUGE = 10_000_000;

  it("clamps huge range strings to the page count and maxPages before expanding", () => {
    const started = performance.now();
    expect(resolvePageSelection("1-999999999", 300)).toHaveLength(300);
    expect(resolvePageSelection("1-999999999", HUGE, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(resolvePageSelection("1-999999999,5-999999999", HUGE, 3)).toEqual([1, 2, 3]);
    expect(resolvePageSelection({ offset: 0 }, HUGE, 3)).toEqual([1, 2, 3]);
    expect(resolvePageSelection({ offset: -5 }, HUGE, 2)).toEqual([HUGE - 4, HUGE - 3]);
    expect(resolvePageSelection(undefined, HUGE, 4)).toEqual([1, 2, 3, 4]);
    expect(resolvePageSelection([HUGE, 1, 2], HUGE, 2)).toEqual([1, 2]);
    expect(performance.now() - started).toBeLessThan(500);
  });

  it("expands context in time independent of the page count", () => {
    const started = performance.now();
    expect(withContextPages([HUGE / 2], HUGE)).toHaveLength(11);
    expect(withContextPages([1], HUGE)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(withContextPages([HUGE], HUGE)).toHaveLength(11);
    // A fragmented selection: 100k isolated pages.
    const spaced = Array.from({ length: 100_000 }, (_, i) => 1 + i * 50);
    const withSpaced = withContextPages(spaced, HUGE);
    expect(withSpaced).toHaveLength(spaced.length + 10);
    expect(performance.now() - started).toBeLessThan(2000);
  });

  it("returns every page when the selection plus context covers the document", () => {
    expect(withContextPages([1, 2, 3], 12)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    const allButThree = Array.from({ length: 997 }, (_, i) => i + 1);
    expect(withContextPages(allButThree, 1000)).toHaveLength(1000);
  });
});

describe("convert with a page selection", () => {
  const twelvePages = makePdf({ pages: reportPages(12) });

  const pageNumbers = (pages: { pageNumber: number }[] | undefined) => pages?.map((p) => p.pageNumber);

  it("converts a list of pages", async () => {
    const result = await convert(twelvePages, { pages: [5, 2], perPage: true });
    expect(result.status).toBe("success");
    expect(pageNumbers(result.pages)).toEqual([2, 5]);
    expect(result.markdown).toContain("Body text for page 2 ");
    expect(result.markdown).toContain("Body text for page 5 ");
    expect(result.markdown).not.toMatch(/Body text for page (1|3|4|6) /);
    expect(result.stats.pageCount).toBe(12);
  });

  it("converts an offset and length", async () => {
    const result = await convert(twelvePages, { pages: { offset: 1, length: 2 }, perPage: true });
    expect(pageNumbers(result.pages)).toEqual([2, 3]);
  });

  it("converts the last pages for a negative offset", async () => {
    const result = await convert(twelvePages, { pages: { offset: -3 }, perPage: true });
    expect(pageNumbers(result.pages)).toEqual([10, 11, 12]);
    expect(result.markdown).toContain("Body text for page 12 ");
  });

  it("returns an empty success for an out-of-range selection", async () => {
    for (const pages of [[40, 41], { offset: 12 }]) {
      const result = await convert(twelvePages, { pages, perPage: true });
      expect(result.status).toBe("success");
      expect(result.markdown).toBe("");
      expect(result.pages).toEqual([]);
      expect(result.messages).toEqual([]);
      expect(result.stats.pageCount).toBe(12);
    }
  });

  it("deduplicates repeated pages", async () => {
    const result = await convert(twelvePages, { pages: [3, 3, 3], perPage: true });
    expect(pageNumbers(result.pages)).toEqual([3]);
    expect(result.markdown.match(/Body text for page 3 /g)).toHaveLength(1);
  });

  it("accepts a range string", async () => {
    const result = await convert(twelvePages, { pages: "2-3,11", perPage: true });
    expect(pageNumbers(result.pages)).toEqual([2, 3, 11]);
  });

  it("applies maxPages to the selection", async () => {
    const result = await convert(twelvePages, { pages: [4, 6, 8], maxPages: 2, perPage: true });
    expect(pageNumbers(result.pages)).toEqual([4, 6]);
  });

  it("adds page markers as comments", async () => {
    const result = await convert(twelvePages, { pages: [2, 3], pageMarkers: "comment" });
    expect(result.markdown.startsWith("<!-- page 2 -->\n\n")).toBe(true);
    expect(result.markdown).toContain("\n\n<!-- page 3 -->\n\n");
    expect(result.pages).toBeUndefined();
    // Markers are not counted as words.
    const plain = await convert(twelvePages, { pages: [2, 3] });
    expect(result.stats.wordCount).toBe(plain.stats.wordCount);
  });

  it("strips running headers and footers on a single-page read", async () => {
    const synthetic = await convert(twelvePages, { pages: [7] });
    expect(synthetic.markdown).toContain("Body text for page 7 ");
    expect(synthetic.markdown).not.toContain("Quarterly Widget Review");

    const tracked = await convert(await fixture("header-footer-numbers.pdf"), { pages: [3] });
    expect(tracked.status).toBe("success");
    expect(tracked.markdown).toContain("Section 3 overview");
    expect(tracked.markdown).not.toContain("Example Annual Report");
  });

  it("keeps body text that repeats near the top of nearby pages at different heights", async () => {
    // Clause references such as "GSAR 552.270-30" read the same once digits
    // are folded and often open a page, but at a different height each time.
    const bytes = await realPdf("legal-contract-clauses.pdf");
    for (const [page, ref] of [[2, "GSAR 552.270-30"], [3, "GSAR 552.204-9"], [6, "GSAR 552.270-10"]] as const) {
      const one = await convert(bytes, { pages: [page] });
      expect(one.markdown).toContain(ref);
    }
  });

  it("single-page output matches that page of a full conversion", async () => {
    const bytes = await realPdf("whitepaper-bitcoin.pdf");
    const full = await convert(bytes, { perPage: true });
    const one = await convert(bytes, { pages: [3] });
    expect(one.markdown).toBe(full.pages?.find((p) => p.pageNumber === 3)?.markdown);
  });
});

describe("perPage output", () => {
  for (const name of ["whitepaper-bitcoin.pdf", "multicolumn-gan-paper.pdf", "tables-cdc-report.pdf"]) {
    it(`joins to the full markdown (${name})`, async () => {
      const bytes = await realPdf(name);
      const plain = await convert(bytes);
      const result = await convert(bytes, { perPage: true });
      expect(result.pages).toHaveLength(result.stats.pageCount);
      const joined = (result.pages ?? []).map((p) => p.markdown).filter(Boolean).join("\n\n");
      expect(joined).toBe(result.markdown);
      expect(result.markdown).toBe(plain.markdown);
    });
  }
});

describe("page reads are bounded", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("selecting 1 page of a 300-page PDF parses at most 11 pages", async () => {
    const bytes = makePdf({ pages: reportPages(300) });
    // PDFDocumentProxy is not exported, so take its prototype from a loaded document.
    const { getDocument } = await getPdfjs();
    const probe = await getDocument({ data: new Uint8Array(bytes) }).promise;
    const proto = Object.getPrototypeOf(probe) as { getPage: (n: number) => Promise<unknown> };
    await probe.destroy();
    const spy = vi.spyOn(proto, "getPage");

    const result = await convert(bytes, { pages: [150], perPage: true });
    expect(result.status).toBe("success");
    expect(result.pages?.map((p) => p.pageNumber)).toEqual([150]);
    expect(result.markdown).toContain("Body text for page 150 ");
    expect(result.markdown).not.toContain("Quarterly Widget Review");

    const read = new Set(spy.mock.calls.map(([page]) => page));
    expect(read.has(150)).toBe(true);
    expect(read.size).toBeLessThanOrEqual(11);
  });
});

describe("metadata", () => {
  it("reports producer, version, encryption, tagging and text layer", async () => {
    const result = await convert(await realPdf("whitepaper-bitcoin.pdf"), { includeMetadata: true });
    const meta = result.metadata;
    expect(meta?.pdfVersion).toMatch(/^\d\.\d$/);
    expect(typeof meta?.producer).toBe("string");
    expect(meta?.isEncrypted).toBe(false);
    expect(typeof meta?.isTagged).toBe("boolean");
    expect(meta?.hasTextLayer).toBe(true);
  });

  it("reports a tagged PDF as tagged", async () => {
    const result = await convert(await realPdf("government-irs-w4.pdf"), { includeMetadata: true });
    expect(result.metadata?.isTagged).toBe(true);
  });
});
