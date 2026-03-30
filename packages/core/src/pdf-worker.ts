import { getPdfjs } from "./pdf-compat.js";

let workerInitialized = false;

export async function initPdfWorker(): Promise<void> {
  if (workerInitialized) return;

  const pdfjs = await getPdfjs();

  // In Node.js, PDF.js can run without a web worker (uses main thread).
  // In browsers, set the worker URL from the bundled worker file.
  if (typeof window !== "undefined" && typeof import.meta.url !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
  }

  workerInitialized = true;
}
