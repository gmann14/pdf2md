"use client";

import type { ConversionResult } from "@/lib/types";

interface ErrorDisplayProps {
  result: ConversionResult;
  onReset: () => void;
}

const errorTitles: Record<string, string> = {
  oversized: "File Too Large",
  password_protected: "Password Protected",
  no_extractable_text: "No Text Found",
  parse_failed: "Parsing Failed",
  worker_failed: "Processing Error",
  timeout: "Processing Timed Out",
  cancelled: "Cancelled",
};

export function ErrorDisplay({ result, onReset }: ErrorDisplayProps) {
  const error = result.messages.find((m) => m.severity === "error");
  if (!error) return null;

  const title = errorTitles[error.code] ?? "Conversion Failed";

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800">{title}</h3>
      <p className="mt-1 text-sm text-red-700">{error.message}</p>
      <button
        onClick={onReset}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Try Another File
      </button>
    </div>
  );
}
