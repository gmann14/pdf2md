/**
 * opendocsg-compatible entry point: `@pdf2md/core/compat`.
 *
 * Its default export has the signature of `@opendocsg/pdf2md`, so switching is
 * a one-line change:
 *
 *   const pdf2md = require("@pdf2md/core/compat"); // was "@opendocsg/pdf2md"
 *   const markdown = await pdf2md(fs.readFileSync("file.pdf"), callbacks);
 *
 * Pages are joined with `<!-- PAGE_BREAK -->\n`, each page ending in `\n`, as
 * opendocsg does. Differences are listed in docs/migrating-from-opendocsg.md.
 */
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { convertWithHooks } from "./converter.js";
import type { ConvertOptions } from "./types.js";

/** The page separator opendocsg puts between pages. */
export const PAGE_BREAK = "<!-- PAGE_BREAK -->\n";

/** A page as passed to `pageParsed` and `documentParsed`. */
export interface Page {
  /** 0-based page index. */
  index: number;
  /**
   * Filled once the page is converted: one synthetic `TextItem` per line of
   * the page's Markdown (`str` is the line; position and font are zero/empty).
   * Empty until then.
   */
  items: TextItem[];
}

// The `any` types below mirror opendocsg's published types/pdf2md.d.ts, so
// code written against those types compiles unchanged.
/** Never passed to `fontParsed` (see the migration doc); declared for type compatibility. */
export interface Font {
  ids: Set<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: Map<string, any>;
}

/** The PDF.js `getMetadata()` result, as opendocsg passes it. */
export interface Metadata {
  info: object;
  metadata: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parsedData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRaw: () => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: (name: any) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAll: () => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    has: (name: any) => any;
  };
}

export interface Callbacks {
  /** Called with PDF.js `getMetadata()` once the document has loaded. */
  metadataParsed?: (metadata: Metadata) => void;
  /** Called after each page is converted, with every page (later pages still empty). */
  pageParsed?: (pages: Page[]) => void;
  /** Not called: pdf2md does not expose PDF.js font objects. */
  fontParsed?: (font: Font) => void;
  /** Called once the document has loaded, before any page is converted. */
  documentParsed?: (document: PDFDocumentProxy, pages: Page[]) => void;
}

/** PDF bytes, or opendocsg's `{ data }` form of PDF.js `DocumentInitParameters`. */
export type PdfInput = ArrayBuffer | ArrayBufferView | { data: ArrayBuffer | ArrayBufferView };

/** Empty XMP metadata, for PDFs without any (PDF.js passes `null`). */
const NO_XMP: Metadata["metadata"] = {
  parsedData: new Map<string, unknown>(),
  rawData: "",
  getRaw: () => "",
  get: () => null,
  getAll: () => ({}),
  has: () => false,
};

function toBytes(input: PdfInput): ArrayBuffer | Uint8Array {
  const source: unknown =
    typeof input === "object" && input !== null && "data" in input ? input.data : input;
  if (source instanceof ArrayBuffer) return source;
  if (ArrayBuffer.isView(source)) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }
  throw new TypeError(
    "@pdf2md/core/compat takes the PDF bytes (Buffer, Uint8Array, ArrayBuffer or { data }); URLs and file paths are not supported.",
  );
}

function syntheticItems(markdown: string): TextItem[] {
  return markdown
    .split("\n")
    .filter((line) => line.length > 0)
    .map((str) => ({
      str,
      dir: "ltr",
      transform: [1, 0, 0, 1, 0, 0],
      width: 0,
      height: 0,
      fontName: "",
      hasEOL: true,
    }));
}

/** An Error carrying pdf2md's machine-readable conversion code. */
export class Pdf2mdError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "Pdf2mdError";
    this.code = code;
  }
}

/**
 * Convert a PDF to Markdown with opendocsg's API. Resolves to the Markdown of
 * every page, joined with `<!-- PAGE_BREAK -->\n` (page count − 1 markers).
 * Rejects with a `Pdf2mdError` if the PDF cannot be read; a PDF with no text
 * layer resolves to empty pages, as with opendocsg.
 */
export default async function pdf2md(pdfBuffer: PdfInput, callbacks?: Callbacks): Promise<string> {
  const bytes = toBytes(pdfBuffer);
  let pages: Page[] = [];

  const options: ConvertOptions = { perPage: true };
  const result = await convertWithHooks(bytes, options, {
    onDocument: async (doc) => {
      pages = Array.from({ length: doc.numPages }, (_, index) => ({ index, items: [] }));
      if (callbacks?.metadataParsed) {
        const meta = await doc.getMetadata();
        // PDF.js's Metadata class, typed the way opendocsg types it.
        const xmp = meta?.metadata as unknown as Metadata["metadata"] | null | undefined;
        callbacks.metadataParsed({ ...meta, info: meta?.info ?? {}, metadata: xmp ?? NO_XMP });
      }
      callbacks?.documentParsed?.(doc, pages);
    },
  });

  if (result.status === "failed") {
    const message = result.messages[0];
    if (message?.code !== "no_extractable_text") {
      throw new Pdf2mdError(message?.code ?? "parse_failed", message?.message ?? "Conversion failed.");
    }
  }

  const pageCount = result.stats.pageCount;
  if (pages.length !== pageCount) {
    pages = Array.from({ length: pageCount }, (_, index) => ({ index, items: [] }));
  }
  const byNumber = new Map((result.pages ?? []).map((p) => [p.pageNumber, p.markdown]));
  const texts: string[] = [];
  for (const page of pages) {
    const markdown = byNumber.get(page.index + 1) ?? "";
    page.items = syntheticItems(markdown);
    callbacks?.pageParsed?.(pages);
    texts.push(markdown + "\n");
  }
  return texts.join(PAGE_BREAK);
}
