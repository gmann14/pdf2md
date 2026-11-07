import { extractMetadata, openDocument, oversizedResult } from "./converter.js";
import { isNode } from "./env.js";
import type { ConversionMessage, ConversionMetadata } from "./types.js";
import { MAX_FILE_SIZE } from "./types.js";

export interface PdfInfo {
  status: "success" | "partial" | "failed";
  /** Pages in the document (0 if it could not be opened). */
  pageCount: number;
  /** PDF metadata, including `isTagged`, `isEncrypted` and `hasTextLayer`. */
  metadata?: ConversionMetadata;
  /** 1-based pages with extractable text. The others are blank or scanned. */
  pagesWithText: number[];
  messages: ConversionMessage[];
}

export interface PdfInfoOptions {
  /** Same as `ConvertOptions.maxFileSizeBytes`. */
  maxFileSizeBytes?: number;
}

/**
 * Describe a PDF without converting it: page count, metadata and which pages
 * have a text layer, so a caller can plan which pages to convert. Reads each
 * page's text content (cheap next to a conversion). Never rejects.
 */
export async function getPdfInfo(
  pdfBuffer: ArrayBuffer | Uint8Array,
  options?: PdfInfoOptions,
): Promise<PdfInfo> {
  const startTime = performance.now();
  const maxFileSize = options?.maxFileSizeBytes ?? (isNode ? Infinity : MAX_FILE_SIZE);
  if (pdfBuffer.byteLength > maxFileSize) {
    const { messages } = oversizedResult(pdfBuffer.byteLength, maxFileSize, startTime);
    return { status: "failed", pageCount: 0, pagesWithText: [], messages };
  }

  const opened = await openDocument(pdfBuffer, { emphasis: false }, startTime);
  if ("failed" in opened) {
    return { status: "failed", pageCount: 0, pagesWithText: [], messages: opened.failed.messages };
  }

  const { doc } = opened;
  const messages: ConversionMessage[] = [];
  const pagesWithText: number[] = [];
  try {
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      try {
        const page = await doc.getPage(pageNumber);
        const content = await page.getTextContent();
        if (content.items.some((item) => "str" in item && item.str.trim().length > 0)) {
          pagesWithText.push(pageNumber);
        }
      } catch (err) {
        messages.push({
          code: "parse_failed",
          severity: "warning",
          message: `Failed to read page ${pageNumber}: ${err instanceof Error ? err.message : "Unknown error"}`,
        });
      }
    }
    const metadata = await extractMetadata(doc, undefined, pagesWithText.length > 0);
    return {
      status: messages.length > 0 ? "partial" : "success",
      pageCount: doc.numPages,
      metadata,
      pagesWithText,
      messages,
    };
  } catch (err) {
    return {
      status: "failed",
      pageCount: doc.numPages,
      pagesWithText,
      messages: [
        {
          code: "parse_failed",
          severity: "error",
          message: `Failed to read PDF: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
      ],
    };
  } finally {
    try {
      await doc.destroy();
    } catch {
      // Already torn down; nothing to free.
    }
  }
}
