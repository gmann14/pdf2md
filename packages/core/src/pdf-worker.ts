import { getPdfjs } from "./pdf-compat.js";

let workerInitialized = false;

function getWorkerUrl(): URL {
  return new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url);
}

export async function initPdfWorker(): Promise<void> {
  if (workerInitialized) return;

  const pdfjs = await getPdfjs();

  // In Node.js, PDF.js can run without a web worker (uses main thread). In
  // browsers, prefer passing PDF.js an actual module Worker so Next dev does
  // not have to re-import the worker script through PDF.js' fallback loader.
  if (typeof window !== "undefined" && typeof import.meta.url !== "undefined") {
    const workerUrl = getWorkerUrl();

    if (typeof Worker !== "undefined") {
      try {
        pdfjs.GlobalWorkerOptions.workerPort = new Worker(workerUrl, {
          type: "module",
        });
      } catch {
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.toString();
      }
    } else {
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.toString();
    }
  }

  workerInitialized = true;
}
