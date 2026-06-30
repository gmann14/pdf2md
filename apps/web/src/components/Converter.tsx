"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ConversionProgress, ConversionResult } from "@pdf2md/core/types";
import { DropZone } from "./DropZone";
import { ProgressBar } from "./ProgressBar";
import { OutputPane } from "./OutputPane";
import { ErrorDisplay } from "./ErrorDisplay";
import { createMarkdownZip, uniqueZipEntryName } from "@/lib/zip";
import { validatePdfFiles } from "@/lib/files";
import {
  reportClientParseFailure,
  reportClientConversionException,
  trackConversion,
  trackOutputAction,
} from "@/lib/telemetry";

interface FileConversion {
  fileName: string;
  file: File;
  status: "pending" | "converting" | "done";
  result?: ConversionResult;
  progress?: ConversionProgress;
}

type State =
  | { phase: "idle" }
  | { phase: "converting"; files: FileConversion[]; currentIndex: number }
  | { phase: "done"; files: FileConversion[] };

export function Converter() {
  const [state, setState] = useState<State>({ phase: "idle" });
  const [activeTab, setActiveTab] = useState(0);
  const [pasteStatus, setPasteStatus] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.phase === "done") {
      outputRef.current?.focus();
    }
  }, [state.phase]);

  const convertFiles = useCallback(async (files: File[]) => {
    setPasteStatus("");
    const fileConversions: FileConversion[] = files.map((f) => ({
      fileName: f.name,
      file: f,
      status: "pending" as const,
    }));

    setState({
      phase: "converting",
      files: fileConversions,
      currentIndex: 0,
    });

    const controller = new AbortController();
    abortRef.current = controller;

    // Dynamic import to avoid pulling pdfjs-dist into the SSG bundle
    const { convert } = await import("@pdf2md/core");

    for (let i = 0; i < files.length; i++) {
      if (controller.signal.aborted) break;

      // Mark current file as converting
      setState((prev) => {
        if (prev.phase !== "converting") return prev;
        const updated = [...prev.files];
        updated[i] = { ...updated[i], status: "converting" };
        return { ...prev, files: updated, currentIndex: i };
      });

      try {
        const buffer = await files[i].arrayBuffer();

        const result = await convert(buffer, {
          signal: controller.signal,
          onProgress: (progress) => {
            setState((prev) => {
              if (prev.phase !== "converting") return prev;
              const updated = [...prev.files];
              updated[i] = { ...updated[i], progress };
              return { ...prev, files: updated };
            });
          },
        });

        if (controller.signal.aborted) break;

        trackConversion({ result, fileSizeBytes: files[i].size });
        reportClientParseFailure({ result, fileSizeBytes: files[i].size });

        setState((prev) => {
          if (prev.phase !== "converting") return prev;
          const updated = [...prev.files];
          updated[i] = { ...updated[i], status: "done", result };
          return { ...prev, files: updated };
        });
      } catch (err) {
        if (controller.signal.aborted) break;

        const result: ConversionResult = {
          status: "failed",
          markdown: "",
          messages: [
            {
              code: "worker_failed",
              severity: "error",
              message: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`,
            },
          ],
          stats: { pageCount: 0, wordCount: 0, processingMs: 0 },
        };

        trackConversion({ result, fileSizeBytes: files[i].size });
        reportClientConversionException({
          error: err,
          code: "worker_failed",
          result,
          fileSizeBytes: files[i].size,
        });

        setState((prev) => {
          if (prev.phase !== "converting") return prev;
          const updated = [...prev.files];
          updated[i] = {
            ...updated[i],
            status: "done",
            result,
          };
          return { ...prev, files: updated };
        });
      }
    }

    if (!controller.signal.aborted) {
      setState((prev) => {
        if (prev.phase !== "converting") return prev;
        return { phase: "done", files: prev.files };
      });
    }

    abortRef.current = null;
  }, []);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    setState({ phase: "idle" });
  }, []);

  const handleReset = useCallback(() => {
    setActiveTab(0);
    setPasteStatus("");
    setState({ phase: "idle" });
  }, []);

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      if (state.phase === "converting") return;

      const clipboardFiles = event.clipboardData?.files;
      if (!clipboardFiles || clipboardFiles.length === 0) return;

      const valid = validatePdfFiles(clipboardFiles);
      if (valid.length === 0) {
        setPasteStatus("Clipboard did not contain a PDF.");
        return;
      }

      event.preventDefault();
      const countLabel = valid.length === 1 ? "1 PDF" : `${valid.length} PDFs`;
      setActiveTab(0);
      void convertFiles(valid);
      setPasteStatus(`Pasted ${countLabel}. Starting conversion.`);
    },
    [convertFiles, state.phase],
  );

  const handleDownloadZip = useCallback((files: FileConversion[]) => {
    const usedNames = new Set<string>();
    const successfulFiles = files
      .filter((file) => file.result && file.result.status !== "failed")
      .map((file) => ({
        name: uniqueZipEntryName(file.fileName, usedNames),
        content: file.result!.markdown,
      }));

    if (successfulFiles.length === 0) return;

    trackOutputAction("download");
    const blob = createMarkdownZip(successfulFiles);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdf2md-markdown.zip";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div onPaste={handlePaste}>
      <p className="sr-only" role="status" aria-live="polite">
        {pasteStatus}
      </p>
      <div aria-live="polite">
        {state.phase === "idle" && (
          <DropZone onFiles={convertFiles} />
        )}

        {state.phase === "converting" && (
          <div>
            {state.files.length > 1 && (
              <div className="mb-3 text-sm text-gray-600 dark:text-slate-300">
                Converting file {state.currentIndex + 1} of {state.files.length}:{" "}
                <span className="font-medium">{state.files[state.currentIndex]?.fileName}</span>
              </div>
            )}
            <ProgressBar
              progress={
                state.files[state.currentIndex]?.progress ?? {
                  stage: "loading",
                  currentPage: 0,
                  totalPages: 0,
                }
              }
              onCancel={handleCancel}
            />
          </div>
        )}

        {state.phase === "done" && (
          <div ref={outputRef} tabIndex={-1} className="outline-none">
            {/* Tabs for multiple files */}
            {state.files.length > 1 && (
              <div className="mb-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-sm text-gray-600 dark:text-slate-300">
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      {state.files.filter((file) => file.result?.status !== "failed").length}
                    </span>{" "}
                    of {state.files.length} converted files ready for bulk download.
                    {state.files.some((file) => file.result?.status === "failed") && (
                      <span className="ml-1 text-red-700 dark:text-red-300">Failed files are excluded.</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadZip(state.files)}
                    disabled={!state.files.some((file) => file.result && file.result.status !== "failed")}
                    aria-label="Download all converted Markdown files as a ZIP"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:focus:ring-offset-slate-950"
                  >
                    Download all .zip
                  </button>
                </div>

                <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-slate-800">
                  {state.files.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      className={`shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
                        idx === activeTab
                          ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                      aria-selected={idx === activeTab}
                      role="tab"
                    >
                      <span className="flex items-center gap-1.5">
                        {file.result?.status === "failed" && (
                          <span className="inline-block h-2 w-2 rounded-full bg-red-400" aria-hidden="true" />
                        )}
                        {file.result?.status === "success" && (
                          <span className="inline-block h-2 w-2 rounded-full bg-green-400" aria-hidden="true" />
                        )}
                        {file.result?.status === "partial" && (
                          <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" aria-hidden="true" />
                        )}
                        {file.fileName.replace(/\.pdf$/i, "")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active file output */}
            {state.files[activeTab]?.result?.status === "failed" ? (
              <ErrorDisplay
                result={state.files[activeTab].result!}
                onReset={handleReset}
              />
            ) : state.files[activeTab]?.result ? (
              <OutputPane
                result={state.files[activeTab].result!}
                fileName={state.files[activeTab].fileName}
                file={state.files[activeTab].file}
                onReset={handleReset}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
