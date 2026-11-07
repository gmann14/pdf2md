// @vitest-environment node

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import pdf2md, { PAGE_BREAK, Pdf2mdError, type Metadata, type Page } from "./compat.js";
import { convert } from "./converter.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const filePath = resolve(repoRoot, "test-corpus/real-pdfs/whitepaper-bitcoin.pdf");

describe("opendocsg-compatible entry point", () => {
  it("runs opendocsg's README usage", async () => {
    // From the opendocsg README: read a file, pass the Buffer, get Markdown text.
    const pdfBuffer = readFileSync(filePath);
    const text = await pdf2md(pdfBuffer, {}).then((t) => t);
    expect(typeof text).toBe("string");
    expect(text).toContain("Bitcoin");
  });

  for (const name of ["whitepaper-bitcoin.pdf", "tables-cdc-report.pdf", "scanned-declaration.pdf"]) {
    it(`puts page count - 1 page breaks between pages (${name})`, async () => {
      const bytes = readFileSync(resolve(repoRoot, "test-corpus/real-pdfs", name));
      const text = await pdf2md(bytes);
      const { stats } = await convert(bytes);
      expect(text.split(PAGE_BREAK)).toHaveLength(stats.pageCount);
      expect(text.match(/<!-- PAGE_BREAK -->/g) ?? []).toHaveLength(stats.pageCount - 1);
      expect(text.endsWith("\n")).toBe(true);
    });
  }

  it("matches the per-page Markdown of convert()", async () => {
    const bytes = readFileSync(filePath);
    const text = await pdf2md(bytes);
    const result = await convert(bytes, { perPage: true });
    expect(text).toBe((result.pages ?? []).map((p) => p.markdown + "\n").join(PAGE_BREAK));
  });

  it("fires metadataParsed, documentParsed and pageParsed", async () => {
    const events: string[] = [];
    let metadata: Metadata | undefined;
    let snapshot: Array<{ index: number; items: number }> = [];
    const text = await pdf2md(readFileSync(filePath), {
      metadataParsed: (m) => {
        events.push("metadata");
        metadata = m;
      },
      documentParsed: (doc, pages) => {
        events.push(`document:${doc.numPages}:${pages.length}`);
      },
      pageParsed: (pages: Page[]) => {
        events.push("page");
        snapshot = pages.map((p) => ({ index: p.index, items: p.items.length }));
      },
      fontParsed: () => events.push("font"),
    });
    expect(events[0]).toBe("metadata");
    expect(events[1]).toBe("document:9:9");
    expect(events.filter((e) => e === "page")).toHaveLength(9);
    expect(events).not.toContain("font");
    expect(snapshot.map((p) => p.index)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(snapshot.every((p) => p.items > 0)).toBe(true);
    expect(metadata?.info).toHaveProperty("PDFFormatVersion");
    expect(typeof metadata?.metadata.get).toBe("function");
    expect(text.length).toBeGreaterThan(1000);
  });

  it("accepts an ArrayBuffer, a typed-array view and { data }", async () => {
    const buf = readFileSync(filePath);
    const expected = await pdf2md(buf);
    const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    expect(await pdf2md(arrayBuffer)).toBe(expected);
    expect(await pdf2md({ data: new Uint8Array(buf) })).toBe(expected);
    expect(await pdf2md(new DataView(arrayBuffer))).toBe(expected);
  });

  it("rejects with a coded error for a file that is not a PDF", async () => {
    const notPdf = readFileSync(resolve(repoRoot, "test-corpus/invalid-not-a-pdf.pdf"));
    await expect(pdf2md(notPdf)).rejects.toBeInstanceOf(Pdf2mdError);
    await expect(pdf2md(notPdf)).rejects.toMatchObject({ code: "parse_failed" });
  });

  it("rejects a file path with a clear TypeError", async () => {
    await expect(pdf2md(filePath as unknown as Uint8Array)).rejects.toThrow(TypeError);
  });
});
