"use client";

import { useCallback, useRef, useState } from "react";
import type { ConversionProgress, ConversionResult } from "@/lib/types";
import { DropZone } from "./DropZone";
import { ProgressBar } from "./ProgressBar";
import { OutputPane } from "./OutputPane";
import { ErrorDisplay } from "./ErrorDisplay";

type State =
  | { phase: "idle" }
  | { phase: "converting"; progress: ConversionProgress; fileName: string }
  | { phase: "done"; result: ConversionResult; fileName: string };

export function Converter() {
  const [state, setState] = useState<State>({ phase: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const handleFile = useCallback(async (file: File) => {
    const controller = new AbortController();
    abortRef.current = controller;

    setState({
      phase: "converting",
      progress: { stage: "loading", currentPage: 0, totalPages: 0 },
      fileName: file.name,
    });

    try {
      const buffer = await file.arrayBuffer();

      // Dynamic import to avoid pulling pdfjs-dist into the SSG bundle
      const { convert } = await import("@/lib/converter");

      const result = await convert(buffer, {
        signal: controller.signal,
        onProgress: (progress) => {
          setState((prev) => {
            if (prev.phase !== "converting") return prev;
            return { ...prev, progress };
          });
        },
      });

      if (!controller.signal.aborted) {
        setState({ phase: "done", result, fileName: file.name });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setState({
          phase: "done",
          fileName: file.name,
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
        });
      }
    } finally {
      abortRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    setState({ phase: "idle" });
  }, []);

  const handleReset = useCallback(() => {
    setState({ phase: "idle" });
  }, []);

  return (
    <div>
      {state.phase === "idle" && (
        <DropZone onFile={handleFile} />
      )}

      {state.phase === "converting" && (
        <ProgressBar progress={state.progress} onCancel={handleCancel} />
      )}

      {state.phase === "done" && state.result.status === "failed" && (
        <ErrorDisplay result={state.result} onReset={handleReset} />
      )}

      {state.phase === "done" && state.result.status !== "failed" && (
        <OutputPane
          result={state.result}
          fileName={state.fileName}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
