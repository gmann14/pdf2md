export { convert } from "./converter.js";
export { initPdfWorker } from "./pdf-worker.js";
export { getPdfjs } from "./pdf-compat.js";
export { MAX_FILE_SIZE } from "./types.js";
export {
  isMonospace,
  detectTable,
  isCodeBlock,
  metadataToYaml,
  parsePdfDate,
  tableToMarkdown,
} from "./detection.js";
export type {
  ConversionCode,
  ConversionChunk,
  ConversionMessage,
  ConversionMetadata,
  ConversionProgress,
  ConversionResult,
  ConversionStage,
  ConversionStats,
  ConversionStatus,
  ConvertOptions,
  StructuredOutput,
  StructuredSection,
} from "./types.js";
