import { afterEach, describe, expect, it, vi } from "vitest";
import type { ConversionResult } from "@pdf2md/core/types";
import {
  bucketFileSize,
  bucketPageCount,
  getPrimaryErrorCode,
  getSentryEnvelopeEndpoint,
  trackConversion,
  trackOutputAction,
} from "./telemetry";

const failedResult: ConversionResult = {
  status: "failed",
  markdown: "private extracted markdown",
  messages: [
    {
      code: "parse_failed",
      severity: "error",
      message: "private parser details",
    },
  ],
  stats: {
    pageCount: 12,
    wordCount: 1234,
    processingMs: 500,
  },
  metadata: {
    title: "Private PDF Title",
    author: "Private Author",
  },
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
  delete window.plausible;
});

describe("telemetry", () => {
  it("buckets file sizes and page counts so analytics never receives raw document metrics", () => {
    // Raw byte and page counts are more identifying than coarse product metrics,
    // so conversion analytics must use stable ranges instead.
    expect(bucketFileSize(512 * 1024)).toBe("0-1mb");
    expect(bucketFileSize(3 * 1024 * 1024)).toBe("1-5mb");
    expect(bucketFileSize(8 * 1024 * 1024)).toBe("5-10mb");
    expect(bucketFileSize(12 * 1024 * 1024)).toBe("10-15mb");
    expect(bucketFileSize(20 * 1024 * 1024)).toBe("15mb+");

    expect(bucketPageCount(0)).toBe("unknown");
    expect(bucketPageCount(1)).toBe("1");
    expect(bucketPageCount(4)).toBe("2-5");
    expect(bucketPageCount(12)).toBe("6-20");
    expect(bucketPageCount(75)).toBe("21-100");
    expect(bucketPageCount(200)).toBe("100+");
  });

  it("tracks conversion analytics with status, code, and buckets only", () => {
    // The acceptance criteria allow aggregate conversion metrics, but not
    // filenames, text, generated markdown, PDF metadata, or exact sizes.
    const plausible = vi.fn();
    window.plausible = plausible;

    trackConversion({
      result: failedResult,
      fileSizeBytes: 8_250_000,
    });

    expect(plausible).toHaveBeenCalledWith("conversion_completed", {
      props: {
        status: "failed",
        success: "false",
        page_count_bucket: "6-20",
        file_size_bucket: "5-10mb",
        code: "parse_failed",
      },
    });
    expect(JSON.stringify(plausible.mock.calls)).not.toContain("private");
    expect(JSON.stringify(plausible.mock.calls)).not.toContain("8250000");
  });

  it("tracks output actions as copy or download without document details", () => {
    // Output telemetry is useful for product decisions, but the event must not
    // reveal which file was converted or any Markdown content.
    const plausible = vi.fn();
    window.plausible = plausible;

    trackOutputAction("copy");
    trackOutputAction("download");

    expect(plausible).toHaveBeenNthCalledWith(1, "output_action", {
      props: { action: "copy" },
    });
    expect(plausible).toHaveBeenNthCalledWith(2, "output_action", {
      props: { action: "download" },
    });
  });

  it("builds Sentry envelope endpoints from valid DSNs", () => {
    // Sentry reporting uses the public DSN in the browser; this verifies the
    // endpoint construction without adding server-only Sentry SDK code.
    expect(
      getSentryEnvelopeEndpoint(
        "https://public-key@example.ingest.sentry.io/123456",
      ),
    ).toBe(
      "https://example.ingest.sentry.io/api/123456/envelope/?sentry_key=public-key&sentry_version=7",
    );

    expect(getSentryEnvelopeEndpoint("not a dsn")).toBeNull();
  });

  it("reports client exceptions to Sentry with stable code tags and sanitized payloads", async () => {
    // Browser PDF parser exceptions can contain arbitrary parser text; Sentry
    // events must keep the stable ConversionCode while replacing details with a
    // generic message and coarse buckets.
    vi.stubEnv(
      "NEXT_PUBLIC_SENTRY_DSN",
      "https://public-key@example.ingest.sentry.io/123456",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(null, { status: 200 }))),
    );

    const { reportClientConversionException } = await import("./telemetry");

    reportClientConversionException({
      error: new Error("private file invoice.pdf failed near Secret Clause"),
      code: "parse_failed",
      result: failedResult,
      fileSizeBytes: 8_250_000,
    });

    expect(fetch).toHaveBeenCalledOnce();
    const [, init] = vi.mocked(fetch).mock.calls[0];
    const body = String(init?.body);
    const payload = JSON.parse(body.split("\n")[2]);

    expect(payload.tags).toEqual({
      conversion_code: "parse_failed",
      conversion_status: "failed",
    });
    expect(payload.contexts.conversion).toEqual({
      page_count_bucket: "6-20",
      file_size_bucket: "5-10mb",
      success: "false",
    });
    expect(payload.exception.values[0].value).toBe(
      "Client PDF conversion exception",
    );
    expect(body).not.toContain("invoice.pdf");
    expect(body).not.toContain("Secret Clause");
    expect(body).not.toContain("private extracted markdown");
    expect(body).not.toContain("Private PDF Title");
    expect(body).not.toContain("8250000");
  });

  it("reports returned parse failures to Sentry without requiring thrown UI exceptions", async () => {
    // Core conversion catches malformed-PDF parser exceptions and returns a
    // parse_failed result, so the UI must still surface that stable failure in
    // Sentry for operational visibility.
    vi.stubEnv(
      "NEXT_PUBLIC_SENTRY_DSN",
      "https://public-key@example.ingest.sentry.io/123456",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response(null, { status: 200 }))),
    );

    const { reportClientParseFailure } = await import("./telemetry");

    reportClientParseFailure({
      result: failedResult,
      fileSizeBytes: 8_250_000,
    });

    expect(fetch).toHaveBeenCalledOnce();
    const [, init] = vi.mocked(fetch).mock.calls[0];
    const body = String(init?.body);
    const payload = JSON.parse(body.split("\n")[2]);

    expect(payload.exception.values[0].type).toBe("PdfParseFailure");
    expect(payload.tags.conversion_code).toBe("parse_failed");
    expect(body).not.toContain("private parser details");
    expect(body).not.toContain("private extracted markdown");
    expect(body).not.toContain("Private Author");
  });

  it("finds the primary error code for Sentry tags and failed analytics", () => {
    // Stable error codes, not human copy, are the durable contract for
    // observability dashboards and alert grouping.
    expect(getPrimaryErrorCode(failedResult)).toBe("parse_failed");
    expect(
      getPrimaryErrorCode({
        ...failedResult,
        status: "success",
        messages: [],
      }),
    ).toBeUndefined();
  });
});
