import { GlobalWorkerOptions } from "pdfjs-dist";

let workerInitialized = false;

export function initPdfWorker(): void {
  if (workerInitialized) return;

  // In Node.js, PDF.js can run without a web worker (uses main thread).
  // In browsers, set the worker URL from the bundled worker file.
  if (typeof window !== "undefined" && typeof import.meta.url !== "undefined") {
    GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
  }

  workerInitialized = true;
}
