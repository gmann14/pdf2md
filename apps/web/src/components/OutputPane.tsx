"use client";

import { useState, useCallback } from "react";
import type { ConversionResult } from "@/lib/types";

interface OutputPaneProps {
  result: ConversionResult;
  fileName: string;
  onReset: () => void;
}

export function OutputPane({ result, fileName, onReset }: OutputPaneProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
      }
    },
    [],
  );

  const handleCopy = () => copyToClipboard(result.markdown, "copy");

  const handleCopyForAI = () => {
    const prefix = `The following is Markdown extracted from a PDF document "${fileName}":\n\n---\n\n`;
    copyToClipboard(prefix + result.markdown, "ai");
  };

  const handleDownload = () => {
    const blob = new Blob([result.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.replace(/\.pdf$/i, ".md");
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasWarnings = result.messages.some((m) => m.severity === "warning");

  return (
    <div className="space-y-4">
      {/* Status and stats */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              result.status === "success"
                ? "bg-green-100 text-green-800"
                : result.status === "partial"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
            role="status"
          >
            {result.status === "success"
              ? "Converted"
              : result.status === "partial"
                ? "Converted with warnings"
                : "Failed"}
          </span>
          <span className="text-xs text-gray-500">
            {result.stats.pageCount} page{result.stats.pageCount !== 1 ? "s" : ""} &middot;{" "}
            {result.stats.wordCount.toLocaleString()} words &middot;{" "}
            {(result.stats.processingMs / 1000).toFixed(1)}s
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Convert another
        </button>
      </div>

      {/* Warnings */}
      {hasWarnings && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          {result.messages
            .filter((m) => m.severity === "warning")
            .map((m, i) => (
              <p key={i} className="text-sm text-yellow-800">
                {m.message}
              </p>
            ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {copied === "copy" ? "Copied!" : "Copy Markdown"}
        </button>
        <button
          onClick={handleCopyForAI}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {copied === "ai" ? "Copied!" : "Copy for AI"}
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Download .md
        </button>

        <div className="ml-auto">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-pressed={showPreview}
          >
            {showPreview ? "Raw" : "Preview"}
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {showPreview ? (
          <div
            className="prose prose-sm max-w-none p-6"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(result.markdown),
            }}
          />
        ) : (
          <pre className="max-h-[60vh] overflow-auto p-6 text-sm leading-relaxed text-gray-800">
            <code>{result.markdown}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

/**
 * Minimal markdown→HTML for preview. No external dependency needed for MVP.
 * Handles: headings, bold, italic, links, lists, paragraphs.
 */
function markdownToHtml(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Headings
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/m);
      if (headingMatch) {
        const level = headingMatch[1].length;
        return `<h${level}>${inlineToHtml(headingMatch[2])}</h${level}>`;
      }

      // List items (consecutive lines starting with - or N.)
      const lines = trimmed.split("\n");
      if (lines.every((l) => /^[-*]\s/.test(l.trim()) || l.trim() === "")) {
        const items = lines
          .filter((l) => l.trim())
          .map((l) => `<li>${inlineToHtml(l.replace(/^[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      if (
        lines.every((l) => /^\d+[.)]\s/.test(l.trim()) || l.trim() === "")
      ) {
        const items = lines
          .filter((l) => l.trim())
          .map((l) =>
            `<li>${inlineToHtml(l.replace(/^\d+[.)]\s+/, ""))}</li>`,
          )
          .join("");
        return `<ol>${items}</ol>`;
      }

      return `<p>${inlineToHtml(trimmed)}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

function inlineToHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
}
