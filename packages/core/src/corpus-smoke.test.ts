// @vitest-environment node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { convert } from "./converter.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

async function readPdfFixture(relativePath: string): Promise<ArrayBuffer> {
  const buffer = await readFile(resolve(repoRoot, relativePath));
  return new Uint8Array(buffer) as unknown as ArrayBuffer;
}

describe("launch corpus smoke conversion", () => {
  it("converts a golden sample with headings, lists, and links", async () => {
    const result = await convert(
      await readPdfFixture("test-corpus/real-pdfs/code-git-cheatsheet.pdf"),
      { includeMetadata: true, yamlFrontMatter: true },
    );

    // This sample is a compact golden path for CI: it exercises title metadata
    // and heading detection without making every PR run the full quality suite.
    expect(result.status).toBe("success");
    expect(result.markdown).toContain("# GIT CHEAT SHEET");
    expect(result.markdown).toContain("#### SETUP");

    // List-like command sections have historically regressed into flat
    // paragraphs, so the smoke gate requires multiple Markdown headings.
    expect(result.markdown).toContain("### git status");
    expect(result.markdown).toContain("### git commit");

    // Link extraction must stay wired in PR CI because it depends on PDF
    // annotations as well as text extraction order.
    expect(result.markdown).toContain("https://windows.github.com");
    expect(result.markdown).toContain("http://git-scm.com");
    expect(result.messages.filter((message) => message.severity === "error")).toHaveLength(0);
  });

  it("converts a second golden sample with structured lists and table output", async () => {
    const result = await convert(
      await readPdfFixture("test-corpus/real-pdfs/whitepaper-bitcoin.pdf"),
      { includeMetadata: true, yamlFrontMatter: true },
    );

    // Bitcoin is a small real-world paper that catches regressions in numbered
    // section headings while keeping the smoke job fast enough for PRs.
    expect(result.status).toBe("success");
    expect(result.markdown).toContain("# Bitcoin: A Peer-to-Peer Electronic Cash System");
    expect(result.markdown).toContain("## 1. Introduction");

    // The transaction/network diagrams are converted through the table fallback;
    // requiring pipe tables guards against losing structured output entirely.
    expect(result.markdown).toContain("| Owner 1's");
    expect(result.markdown).toContain("| 1)  | New transactions are broadcast to all nodes.");
    expect(result.messages.filter((message) => message.severity === "error")).toHaveLength(0);
  });

  it("classifies an unreadable PDF fixture as an explicit parse failure", async () => {
    const result = await convert(
      await readPdfFixture("test-corpus/invalid-not-a-pdf.pdf"),
    );

    // PR CI needs a stable failure fixture so crashes and silent empty output
    // are rejected before launch corpus failures reach users.
    expect(result.status).toBe("failed");
    expect(result.markdown).toBe("");
    expect(result.messages).toContainEqual(
      expect.objectContaining({ code: "parse_failed", severity: "error" }),
    );
  });
});
