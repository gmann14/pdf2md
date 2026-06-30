"use client";

import { useEffect, useRef, useState } from "react";

interface PdfPreviewProps {
  file: File;
}

type PreviewState =
  | { phase: "loading" }
  | { phase: "ready"; pageCount: number }
  | { phase: "failed"; message: string };

interface LoadedPdf {
  destroy?: () => Promise<void>;
  getPage: (pageNumber: number) => Promise<{
    getViewport: (params: { scale: number }) => { width: number; height: number };
    render: (params: {
      canvas: HTMLCanvasElement;
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
    }) => { promise: Promise<void>; cancel?: () => void };
  }>;
  numPages: number;
}

export function PdfPreview({ file }: PdfPreviewProps) {
  const [state, setState] = useState<PreviewState>({ phase: "loading" });
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<LoadedPdf | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState({ phase: "loading" });
    setPageNumber(1);
    pdfRef.current = null;

    async function loadPdf() {
      try {
        const { getPdfjs, initPdfWorker } = await import("@pdf2md/core");
        await initPdfWorker();

        const pdfjs = await getPdfjs();
        const data = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(data) });
        const pdf = (await loadingTask.promise) as unknown as LoadedPdf;
        if (cancelled) {
          await pdf.destroy?.();
          return;
        }

        pdfRef.current = pdf;
        setState({ phase: "ready", pageCount: pdf.numPages });
      } catch (err) {
        if (!cancelled) {
          setState({
            phase: "failed",
            message: err instanceof Error ? err.message : "Unable to render PDF preview.",
          });
        }
      }
    }

    void loadPdf();

    return () => {
      cancelled = true;
      void pdfRef.current?.destroy?.();
      pdfRef.current = null;
    };
  }, [file]);

  useEffect(() => {
    if (state.phase !== "ready") return;

    let cancelled = false;
    let renderTask: { promise: Promise<void>; cancel?: () => void } | null = null;

    async function renderPage() {
      const pdf = pdfRef.current;
      const canvas = canvasRef.current;
      if (!pdf || !canvas) return;

      try {
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("PDF preview canvas is unavailable.");
        }

        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const targetWidth = Math.min(760, Math.max(320, Math.floor(canvas.clientWidth || 520)));
        const cssScale = targetWidth / baseViewport.width;
        const viewport = page.getViewport({ scale: cssScale });
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        renderTask = page.render({ canvas, canvasContext: context, viewport });
        await renderTask.promise;
      } catch (err) {
        if (!cancelled) {
          setState({
            phase: "failed",
            message: err instanceof Error ? err.message : "Unable to render PDF preview.",
          });
        }
      }
    }

    void renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel?.();
    };
  }, [pageNumber, state]);

  const pageCount = state.phase === "ready" ? state.pageCount : 0;

  return (
    <section
      aria-label="Original PDF preview"
      className="flex min-h-[24rem] flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Original PDF</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">{file.name}</p>
        </div>

        {state.phase === "ready" && (
          <div className="flex items-center gap-2" aria-label="PDF page controls">
            <button
              type="button"
              onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
              disabled={pageNumber <= 1}
              className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
              aria-label="Previous PDF page"
            >
              Previous
            </button>
            <span className="min-w-20 text-center text-xs text-gray-600 dark:text-slate-300" aria-live="polite">
              Page {pageNumber} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPageNumber((current) => Math.min(pageCount, current + 1))}
              disabled={pageNumber >= pageCount}
              className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
              aria-label="Next PDF page"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 items-start justify-center overflow-auto p-4">
        {state.phase === "loading" && (
          <p className="self-center text-sm text-gray-500 dark:text-slate-400" role="status">
            Loading PDF preview...
          </p>
        )}

        {state.phase === "failed" && (
          <div className="self-center rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900 dark:border-yellow-900/70 dark:bg-yellow-950/40 dark:text-yellow-200" role="status">
            PDF preview unavailable. Markdown output and downloads are still available.
            <span className="sr-only"> {state.message}</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={state.phase === "ready" ? "max-w-full rounded bg-white shadow-sm" : "hidden"}
          aria-label={`Rendered PDF page ${pageNumber}`}
        />
      </div>
    </section>
  );
}
