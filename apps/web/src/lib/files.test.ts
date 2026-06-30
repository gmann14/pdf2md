import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE } from "@pdf2md/core/types";
import { MAX_FILES, validatePdfFiles } from "./files";

describe("validatePdfFiles", () => {
  it("returns valid PDFs and reports non-PDF clipboard/drop contents", () => {
    // Paste handling intentionally ignores unrelated clipboard data while
    // drag/drop still alerts from the same validation result.
    const rejections: string[] = [];
    const valid = validatePdfFiles(
      [
        new File(["%PDF"], "paper.pdf", { type: "application/pdf" }),
        new File(["notes"], "notes.txt", { type: "text/plain" }),
      ],
      { onRejected: ({ message }) => rejections.push(message) },
    );

    expect(valid.map((file) => file.name)).toEqual(["paper.pdf"]);
    expect(rejections).toEqual(['"notes.txt" is not a PDF file.']);
  });

  it("rejects oversize PDFs before conversion", () => {
    // The browser must not hand files beyond the published memory limit to
    // PDF.js, whether they came from file picker, drop, or clipboard paste.
    const rejections: string[] = [];
    const oversized = new File([new Uint8Array(MAX_FILE_SIZE + 1)], "huge.pdf", {
      type: "application/pdf",
    });

    expect(validatePdfFiles([oversized], { onRejected: ({ message }) => rejections.push(message) })).toEqual([]);
    expect(rejections[0]).toContain("is too large");
  });

  it("keeps only the first five PDFs", () => {
    // Multi-file conversion is capped at five; paste should not bypass the same
    // limit already enforced for drag/drop and file picker uploads.
    const rejections: string[] = [];
    const files = Array.from({ length: MAX_FILES + 1 }, (_, index) =>
      new File(["%PDF"], `paper-${index + 1}.pdf`, { type: "application/pdf" }),
    );

    const valid = validatePdfFiles(files, { onRejected: ({ message }) => rejections.push(message) });

    expect(valid).toHaveLength(MAX_FILES);
    expect(valid.map((file) => file.name)).toEqual([
      "paper-1.pdf",
      "paper-2.pdf",
      "paper-3.pdf",
      "paper-4.pdf",
      "paper-5.pdf",
    ]);
    expect(rejections).toEqual(["Maximum 5 files at once. Only the first 5 will be converted."]);
  });
});
