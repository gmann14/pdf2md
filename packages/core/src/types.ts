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
  signal?: AbortSignal;
  onProgress?: (progress: ConversionProgress) => void;
}

/** Maximum file size in bytes (15MB) */
export const MAX_FILE_SIZE = 15 * 1024 * 1024;
