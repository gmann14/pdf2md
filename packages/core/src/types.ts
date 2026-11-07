export type ConversionStatus = "success" | "partial" | "failed";

export type ConversionCode =
  | "oversized"
  | "password_protected"
  | "no_extractable_text"
  | "parse_failed"
  | "worker_failed"
  | "unsupported_layout"
  | "table_fallback"
  | "timeout"
  | "cancelled";

export interface ConversionMessage {
  code: ConversionCode;
  severity: "error" | "warning";
  message: string;
}

export interface ConversionStats {
  pageCount: number;
  wordCount: number;
  processingMs: number;
}

export interface ConversionMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creationDate?: string;
  /** The application that created the original document (PDF `Creator`). */
  creator?: string;
  /** The application that wrote the PDF (PDF `Producer`). */
  producer?: string;
  /** PDF version from the file header, e.g. "1.7". */
  pdfVersion?: string;
  /** Raw PDF date string, e.g. "D:20240101120000Z". */
  modificationDate?: string;
  /** The file is encrypted (it opened without a password, e.g. owner-password only). */
  isEncrypted?: boolean;
  /** The PDF is tagged (MarkInfo /Marked true). */
  isTagged?: boolean;
  /** At least one converted page has extractable text. */
  hasTextLayer?: boolean;
}

/** Markdown for one page, from `ConvertOptions.perPage`. */
export interface PageMarkdown {
  /** 1-based page number in the document. */
  pageNumber: number;
  markdown: string;
}

/**
 * Pages to convert: a list of 1-based page numbers; a 0-based `offset`
 * (negative counts from the end: `-3` is the last 3 pages) with an optional
 * `length` (default: to the end); or a range string such as `"1-5,9"` or
 * `"-3"` (the last 3 pages).
 */
export type PageSelection = number[] | { offset: number; length?: number } | string;

export interface ConversionResult {
  status: ConversionStatus;
  markdown: string;
  messages: ConversionMessage[];
  stats: ConversionStats;
  metadata?: ConversionMetadata;
  structured?: StructuredOutput;
  chunks?: ConversionChunk[];
  /**
   * One entry per selected page, in page order, when `perPage` is set. Joining
   * the non-empty `markdown` values with a blank line gives `result.markdown`
   * (without YAML front matter or page markers).
   */
  pages?: PageMarkdown[];
}

export type ConversionStage =
  | "loading"
  | "parsing"
  | "structuring"
  | "assembling";

export interface ConversionProgress {
  stage: ConversionStage;
  currentPage: number;
  totalPages: number;
}

export interface ConvertOptions {
  /** Convert at most this many pages (the first N pages, or the first N of `pages`). */
  maxPages?: number;
  /**
   * Convert only these pages. Out-of-range pages are skipped and duplicates
   * dropped; a selection with no page in range gives an empty `success`
   * result. Up to 10 neighbouring pages are also read (not output) so
   * running headers and the font profile are detected on short selections.
   */
  pages?: PageSelection;
  /** Add `result.pages`, the Markdown of each selected page. */
  perPage?: boolean;
  /** `"comment"` puts `<!-- page N -->` before each page's Markdown. Default `"none"`. */
  pageMarkers?: "none" | "comment";
  includeMetadata?: boolean;
  /** Request structured JSON-friendly output alongside the markdown contract */
  outputFormat?: "markdown" | "json";
  /** Split structured output into RAG-friendly chunks */
  chunkBy?: "page" | "heading" | "token";
  /** Approximate token budget for chunkBy: "token"; defaults to 800 */
  maxTokensPerChunk?: number;
  /** Prepend PDF metadata as YAML front matter to the markdown output */
  yamlFrontMatter?: boolean;
  /**
   * Emit inline **bold** and *italic* from the PDF's font names. Defaults to
   * true. Turning it off skips reading each page's operator list, which is faster.
   */
  emphasis?: boolean;
  /**
   * Reject files larger than this many bytes with the `oversized` code.
   * Defaults to no limit in Node.js and to `MAX_FILE_SIZE` (15 MB) in
   * browsers, where PDF.js memory use (5-10x the file size) is the constraint.
   * Pass `Infinity` to turn the browser limit off.
   */
  maxFileSizeBytes?: number;
  /**
   * Give up after this many milliseconds and return the `timeout` code. The
   * conversion is aborted through the same path as `signal`.
   */
  timeoutMs?: number;
  signal?: AbortSignal;
  onProgress?: (progress: ConversionProgress) => void;
}

export interface StructuredSection {
  id: string;
  title: string;
  level: number;
  markdown: string;
  pageStart: number;
  pageEnd: number;
  children: StructuredSection[];
}

export interface StructuredOutput {
  sections: StructuredSection[];
}

export interface ConversionChunk {
  id: string;
  markdown: string;
  pageStart: number;
  pageEnd: number;
  sectionPath: string[];
  wordCount: number;
  tokenEstimate: number;
}

/** The web app's file size limit in bytes (15 MB), and the browser default for `maxFileSizeBytes`. */
export const MAX_FILE_SIZE = 15 * 1024 * 1024;
