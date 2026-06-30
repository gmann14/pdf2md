import { MAX_FILE_SIZE } from "@pdf2md/core/types";

export const MAX_FILES = 5;

export type FileRejectionReason = "not_pdf" | "too_large" | "too_many";

export interface FileRejection {
  fileName?: string;
  reason: FileRejectionReason;
  message: string;
}

interface ValidatePdfFilesOptions {
  maxFiles?: number;
  onRejected?: (rejection: FileRejection) => void;
}

export function validatePdfFiles(
  fileList: FileList | File[],
  { maxFiles = MAX_FILES, onRejected }: ValidatePdfFilesOptions = {},
): File[] {
  const files = Array.from(fileList);
  const valid: File[] = [];

  for (const file of files) {
    if (file.type !== "application/pdf") {
      onRejected?.({
        fileName: file.name,
        reason: "not_pdf",
        message: `"${file.name}" is not a PDF file.`,
      });
      continue;
    }

    if (file.size > MAX_FILE_SIZE) {
      onRejected?.({
        fileName: file.name,
        reason: "too_large",
        message: `"${file.name}" is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
      });
      continue;
    }

    valid.push(file);
  }

  if (valid.length > maxFiles) {
    onRejected?.({
      reason: "too_many",
      message: `Maximum ${maxFiles} files at once. Only the first ${maxFiles} will be converted.`,
    });
    valid.splice(maxFiles);
  }

  return valid;
}
