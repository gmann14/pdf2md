import { describe, expect, it } from "vitest";
import { createMarkdownZip, markdownFileNameFromPdf, uniqueZipEntryName } from "./zip";

describe("zip helpers", () => {
  it("sanitizes PDF names into stable Markdown filenames", () => {
    // Bulk downloads create files on the user's machine, so names must be
    // predictable and avoid path-like or shell-hostile characters.
    expect(markdownFileNameFromPdf("../Quarterly Report (Final).PDF")).toBe("Quarterly-Report-Final.md");
    expect(markdownFileNameFromPdf("résumé.pdf")).toBe("resume.md");
    expect(markdownFileNameFromPdf("!!!.pdf")).toBe("document.md");
  });

  it("deduplicates ZIP entry names case-insensitively", () => {
    // Some file systems collapse case, so the ZIP should not contain names that
    // overwrite each other when extracted.
    const usedNames = new Set<string>();
    expect(uniqueZipEntryName("Report.pdf", usedNames)).toBe("Report.md");
    expect(uniqueZipEntryName("report.pdf", usedNames)).toBe("report-2.md");
    expect(uniqueZipEntryName("report.pdf", usedNames)).toBe("report-3.md");
  });

  it("creates a readable ZIP containing every provided Markdown entry", async () => {
    // The multi-file workflow depends on this browser-only ZIP writer; checking
    // local headers and content guards against broken downloads without adding a
    // runtime ZIP dependency to the app bundle.
    const blob = createMarkdownZip([
      { name: "one.md", content: "# One\n\nHello" },
      { name: "two.md", content: "## Two\n\nWorld" },
    ]);

    expect(blob.type).toBe("application/zip");
    await expect(readStoredZip(blob)).resolves.toEqual({
      "one.md": "# One\n\nHello",
      "two.md": "## Two\n\nWorld",
    });
  });

  it("rejects empty archives", () => {
    // A disabled UI should prevent this, but the helper fails loudly if a future
    // caller accidentally tries to generate a useless empty ZIP.
    expect(() => createMarkdownZip([])).toThrow("Cannot create a ZIP without entries.");
  });
});

async function readStoredZip(blob: Blob): Promise<Record<string, string>> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const decoder = new TextDecoder();
  const entries: Record<string, string> = {};
  let offset = 0;

  while (view.getUint32(offset, true) === 0x04034b50) {
    const compressionMethod = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const fileNameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    const nameStart = offset + 30;
    const contentStart = nameStart + fileNameLength + extraLength;
    const contentEnd = contentStart + compressedSize;

    expect(compressionMethod).toBe(0);
    entries[decoder.decode(bytes.slice(nameStart, nameStart + fileNameLength))] =
      decoder.decode(bytes.slice(contentStart, contentEnd));

    offset = contentEnd;
  }

  expect(view.getUint32(offset, true)).toBe(0x02014b50);
  return entries;
}
