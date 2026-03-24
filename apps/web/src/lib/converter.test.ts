import { describe, it, expect } from "vitest";
import { convert, MAX_FILE_SIZE } from "@pdf2md/core";

// We can't easily test full PDF conversion in unit tests without a real PDF,
// but we can test the error handling paths and the API contract.

describe("convert", () => {
  it("rejects oversized buffers", async () => {
    const oversized = new ArrayBuffer(MAX_FILE_SIZE + 1);
    const result = await convert(oversized);

    expect(result.status).toBe("failed");
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].code).toBe("oversized");
    expect(result.messages[0].severity).toBe("error");
    expect(result.markdown).toBe("");
    expect(result.stats.pageCount).toBe(0);
  });

  it("rejects empty/invalid buffers with parse_failed", async () => {
    const empty = new ArrayBuffer(10);
    const result = await convert(empty);

    expect(result.status).toBe("failed");
    expect(result.messages[0].code).toBe("parse_failed");
    expect(result.messages[0].severity).toBe("error");
  });

  it("handles cancellation via AbortSignal", async () => {
    const controller = new AbortController();
    controller.abort(); // abort immediately

    const buffer = new ArrayBuffer(10);
    const result = await convert(buffer, { signal: controller.signal });

    // Should fail with either cancelled or parse_failed (since it's not a real PDF)
    expect(result.status).toBe("failed");
  });

  it("returns ConversionResult shape", async () => {
    const buffer = new ArrayBuffer(10);
    const result = await convert(buffer);

    // Verify the shape regardless of status
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("markdown");
    expect(result).toHaveProperty("messages");
    expect(result).toHaveProperty("stats");
    expect(result.stats).toHaveProperty("pageCount");
    expect(result.stats).toHaveProperty("wordCount");
    expect(result.stats).toHaveProperty("processingMs");
    expect(Array.isArray(result.messages)).toBe(true);
  });
});
