"use client";

import { useCallback, useRef, useState } from "react";
import { MAX_FILE_SIZE } from "@pdf2md/core/types";
import { MAX_FILES, validatePdfFiles } from "@/lib/files";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function DropZone({ onFiles, disabled }: DropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const valid = validatePdfFiles(fileList, {
        onRejected: ({ message }) => alert(message),
      });

      if (valid.length > 0) {
        onFiles(valid);
      }
    },
    [onFiles],
  );

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    },
    [disabled],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (disabled) return;

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) handleFiles(files);
    },
    [disabled, handleFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) handleFiles(files);
      // Reset so the same files can be re-selected
      e.target.value = "";
    },
    [handleFiles],
  );

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload PDF files"
      aria-disabled={disabled}
      className={`
        flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed
        px-6 py-10 sm:py-16 text-center transition-colors
        ${
          disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60 dark:border-slate-800 dark:bg-slate-900"
            : dragActive
              ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
              : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500 dark:hover:bg-slate-800"
        }
      `}
    >
      <svg
        className="mb-4 h-8 w-8 text-gray-400 sm:h-10 sm:w-10 dark:text-slate-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z"
        />
        <polyline
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          points="14 4 14 9 19 9"
        />
      </svg>
      <p className="text-sm font-medium text-gray-700 dark:text-slate-200">
        {dragActive ? "Drop your PDFs here" : "Drag & drop PDFs, or click to select"}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
        Up to {MAX_FILES} files, max {MAX_FILE_SIZE / 1024 / 1024}MB each — files never leave your browser
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
