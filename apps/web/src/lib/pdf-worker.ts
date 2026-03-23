import { GlobalWorkerOptions } from "pdfjs-dist";

let workerInitialized = false;

export function initPdfWorker(): void {
  if (workerInitialized) return;

  // PDF.js v5 expects a worker URL or the worker source
  // Use the pre-built worker from pdfjs-dist
  GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  workerInitialized = true;
}
