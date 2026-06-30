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
}

export interface ConversionResult {
  status: ConversionStatus;
  markdown: string;
  messages: ConversionMessage[];
  stats: ConversionStats;
  metadata?: ConversionMetadata;
  structured?: StructuredOutput;
  chunks?: ConversionChunk[];
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
  maxPages?: number;
  includeMetadata?: boolean;
  /** Request structured JSON-friendly output alongside the markdown contract */
  outputFormat?: "markdown" | "json";
  /** Split structured output into RAG-friendly chunks */
  chunkBy?: "page" | "heading" | "token";
  /** Approximate token budget for chunkBy: "token"; defaults to 800 */
  maxTokensPerChunk?: number;
  /** Prepend PDF metadata as YAML front matter to the markdown output */
  yamlFrontMatter?: boolean;
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

/** Maximum file size in bytes (15MB) */
export const MAX_FILE_SIZE = 15 * 1024 * 1024;
