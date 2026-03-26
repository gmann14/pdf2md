"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ConversionProgress, ConversionResult } from "@pdf2md/core/types";
import { DropZone } from "./DropZone";
import { ProgressBar } from "./ProgressBar";
import { OutputPane } from "./OutputPane";
import { ErrorDisplay } from "./ErrorDisplay";

interface FileConversion {
  fileName: string;
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
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.phase === "done") {
      outputRef.current?.focus();
    }
  }, [state.phase]);

  const convertFiles = useCallback(async (files: File[]) => {
    const fileConversions: FileConversion[] = files.map((f) => ({
      fileName: f.name,
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

        setState((prev) => {
          if (prev.phase !== "converting") return prev;
          const updated = [...prev.files];
          updated[i] = { ...updated[i], status: "done", result };
          return { ...prev, files: updated };
        });
      } catch (err) {
        if (controller.signal.aborted) break;

        setState((prev) => {
          if (prev.phase !== "converting") return prev;
          const updated = [...prev.files];
          updated[i] = {
            ...updated[i],
            status: "done",
            result: {
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
            },
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
    setState({ phase: "idle" });
  }, []);

  return (
    <div>
      <div aria-live="polite">
        {state.phase === "idle" && (
          <DropZone onFiles={convertFiles} />
        )}

        {state.phase === "converting" && (
          <div>
            {state.files.length > 1 && (
              <div className="mb-3 text-sm text-gray-600">
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
              <div className="mb-4 flex gap-1 overflow-x-auto border-b border-gray-200">
                {state.files.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`shrink-0 px-3 py-2 text-sm font-medium transition-colors ${
                      idx === activeTab
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
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
                onReset={handleReset}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
