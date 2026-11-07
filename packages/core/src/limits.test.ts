// @vitest-environment node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { convert } from "./converter.js";
import { getPdfjs } from "./pdf-compat.js";
import { makePdf, reportPages } from "./testing/make-pdf.js";
import type { ConversionResult, ConvertOptions } from "./types.js";
import { MAX_FILE_SIZE } from "./types.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const realPdf = (name: string) => readFile(resolve(repoRoot, "test-corpus/real-pdfs", name));

describe("file size limit", () => {
  const twentyMb = makePdf({ pages: reportPages(3), paddingBytes: 20 * 1024 * 1024 });

  it("converts a 20 MB PDF in Node with default options", async () => {
    expect(twentyMb.byteLength).toBeGreaterThan(20 * 1024 * 1024);
    const result = await convert(twentyMb);
    expect(result.status).toBe("success");
    expect(result.markdown).toContain("Body text for page 2 ");
  });

  it("fails with oversized when maxFileSizeBytes is 15 MB", async () => {
    const result = await convert(twentyMb, { maxFileSizeBytes: MAX_FILE_SIZE });
    expect(result.status).toBe("failed");
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0]?.code).toBe("oversized");
    expect(result.messages[0]?.message).toBe("File size (20MB) exceeds the 15MB limit.");
  });

  it("accepts a file exactly at the limit", async () => {
    const small = makePdf({ pages: reportPages(1) });
    const result = await convert(small, { maxFileSizeBytes: small.byteLength });
    expect(result.status).toBe("success");
  });
});

describe("timeout", () => {
  it("returns timeout for timeoutMs: 1", async () => {
    const result = await convert(await realPdf("academic-attention-paper.pdf"), { timeoutMs: 1 });
    expect(result.status).toBe("failed");
    expect(result.markdown).toBe("");
    expect(result.messages).toEqual([
      { code: "timeout", severity: "error", message: "Conversion timed out after 1 ms." },
    ]);
  });

  it("still converts within a generous timeout", async () => {
    const result = await convert(await realPdf("whitepaper-bitcoin.pdf"), { timeoutMs: 60_000 });
    expect(result.status).toBe("success");
  });

  it("reports a caller cancel as cancelled, not timeout", async () => {
    const controller = new AbortController();
    controller.abort();
    const result = await convert(await realPdf("whitepaper-bitcoin.pdf"), {
      timeoutMs: 60_000,
      signal: controller.signal,
    });
    expect(result.messages[0]?.code).toBe("cancelled");
  });
});

describe("errors after loading", () => {
  it("returns failed, not a rejection, when structuring throws", async () => {
    const promise = convert(makePdf({ pages: reportPages(3) }), {
      onProgress: (p) => {
        if (p.stage === "structuring") throw new Error("boom in structuring");
      },
    });
    await expect(promise).resolves.toBeDefined();
    const result = await promise;
    expect(result.status).toBe("failed");
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0]?.code).toBe("parse_failed");
    expect(result.messages[0]?.message).toContain("boom in structuring");
    expect(result.stats.pageCount).toBe(3);
  });
});

describe("the document is destroyed in every path", () => {
  let destroySpy: ReturnType<typeof vi.spyOn>;
  let proto: { destroy: () => Promise<void> };

  beforeAll(async () => {
    // PDFDocumentProxy is not exported, so take its prototype from a loaded document.
    const { getDocument } = await getPdfjs();
    const probe = await getDocument({ data: makePdf({ pages: reportPages(1) }) }).promise;
    proto = Object.getPrototypeOf(probe) as { destroy: () => Promise<void> };
    await probe.destroy();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const textPdf = makePdf({ pages: reportPages(4) });
  const blankPdf = makePdf({ pages: [[], []] });
  const paths: Array<[string, Uint8Array, () => ConvertOptions, string]> = [
    ["success", textPdf, () => ({}), "success"],
    ["no extractable text", blankPdf, () => ({}), "no_extractable_text"],
    ["empty selection", textPdf, () => ({ pages: [99] }), "success"],
    ["timeout", textPdf, () => ({ timeoutMs: 0 }), "timeout"],
    [
      "cancel mid-conversion",
      textPdf,
      () => {
        const controller = new AbortController();
        return {
          signal: controller.signal,
          onProgress: (p) => {
            if (p.stage === "parsing") controller.abort();
          },
        };
      },
      "cancelled",
    ],
    [
      "error in structuring",
      textPdf,
      () => ({
        onProgress: (p) => {
          if (p.stage === "structuring") throw new Error("forced");
        },
      }),
      "parse_failed",
    ],
  ];

  for (const [name, bytes, options, expected] of paths) {
    it(name, async () => {
      destroySpy = vi.spyOn(proto, "destroy");
      const result: ConversionResult = await convert(bytes, options());
      expect(result.messages[0]?.code ?? result.status).toBe(expected);
      expect(destroySpy).toHaveBeenCalledTimes(1);
    });
  }
});
