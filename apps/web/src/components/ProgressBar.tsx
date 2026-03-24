"use client";

import type { ConversionProgress } from "@pdf2md/core/types";

const stageLabels: Record<string, string> = {
  loading: "Loading PDF...",
  parsing: "Extracting text...",
  structuring: "Detecting structure...",
  assembling: "Assembling Markdown...",
};

interface ProgressBarProps {
  progress: ConversionProgress;
  onCancel: () => void;
}

export function ProgressBar({ progress, onCancel }: ProgressBarProps) {
  const percent =
    progress.totalPages > 0
      ? Math.round((progress.currentPage / progress.totalPages) * 100)
      : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6" aria-live="polite" role="status">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span
          className="font-medium text-gray-700"
          role="status"
          aria-live="polite"
        >
          {stageLabels[progress.stage] ?? "Processing..."}
        </span>
        <span className="text-gray-500">
          {progress.stage === "parsing"
            ? `Page ${progress.currentPage} of ${progress.totalPages}`
            : `${percent}%`}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <button
        onClick={onCancel}
        className="mt-3 text-sm text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </div>
  );
}
