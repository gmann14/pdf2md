import type {
  ConversionCode,
  ConversionResult,
} from "@pdf2md/core/types";

type ConversionEvent = "conversion_completed" | "output_action";
type OutputAction = "copy" | "download";

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string> },
    ) => void;
  }
}

interface ConversionTelemetryInput {
  result: ConversionResult;
  fileSizeBytes: number;
}

interface ClientExceptionInput extends ConversionTelemetryInput {
  error: unknown;
  code: ConversionCode;
}

export function trackConversion({
  result,
  fileSizeBytes,
}: ConversionTelemetryInput): void {
  if (!isBrowser()) return;

  const errorCode = getPrimaryErrorCode(result);
  trackPlausible("conversion_completed", {
    status: result.status,
    success: result.status === "failed" ? "false" : "true",
    page_count_bucket: bucketPageCount(result.stats.pageCount),
    file_size_bucket: bucketFileSize(fileSizeBytes),
    code: errorCode ?? "none",
  });
}

export function trackOutputAction(action: OutputAction): void {
  if (!isBrowser()) return;

  trackPlausible("output_action", {
    action,
  });
}

export function reportClientConversionException({
  error,
  code,
  result,
  fileSizeBytes,
}: ClientExceptionInput): void {
  reportToSentry({
    errorName: error instanceof Error ? error.name : "UnknownError",
    code,
    result,
    fileSizeBytes,
  });
}

export function reportClientParseFailure({
  result,
  fileSizeBytes,
}: ConversionTelemetryInput): void {
  const code = getPrimaryErrorCode(result);
  if (code !== "parse_failed") return;

  reportToSentry({
    errorName: "PdfParseFailure",
    code,
    result,
    fileSizeBytes,
  });
}

function reportToSentry({
  errorName,
  code,
  result,
  fileSizeBytes,
}: {
  errorName: string;
  code: ConversionCode;
  result: ConversionResult;
  fileSizeBytes: number;
}): void {
  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!isBrowser() || !sentryDsn) return;

  const endpoint = getSentryEnvelopeEndpoint(sentryDsn);
  if (!endpoint) return;

  const eventId = createEventId();
  const timestamp = new Date().toISOString();
  const payload = {
    event_id: eventId,
    timestamp,
    platform: "javascript",
    environment: getSentryEnvironment(),
    level: "error",
    logger: "pdf2md.telemetry",
    transaction: "client_pdf_conversion",
    tags: {
      conversion_code: code,
      conversion_status: result.status,
    },
    contexts: {
      conversion: {
        page_count_bucket: bucketPageCount(result.stats.pageCount),
        file_size_bucket: bucketFileSize(fileSizeBytes),
        success: result.status === "failed" ? "false" : "true",
      },
    },
    exception: {
      values: [
        {
          type: errorName,
          value: "Client PDF conversion exception",
        },
      ],
    },
  };

  const envelope = [
    JSON.stringify({ event_id: eventId, sent_at: timestamp }),
    JSON.stringify({ type: "event" }),
    JSON.stringify(payload),
  ].join("\n");

  void fetch(endpoint, {
    method: "POST",
    body: envelope,
    keepalive: true,
    headers: {
      "Content-Type": "application/x-sentry-envelope",
    },
  }).catch(() => {
    // Telemetry must never affect conversion behavior.
  });
}

export function getPrimaryErrorCode(
  result: ConversionResult,
): ConversionCode | undefined {
  return result.messages.find((message) => message.severity === "error")?.code;
}

export function bucketFileSize(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  if (mb <= 1) return "0-1mb";
  if (mb <= 5) return "1-5mb";
  if (mb <= 10) return "5-10mb";
  if (mb <= 15) return "10-15mb";
  return "15mb+";
}

export function bucketPageCount(pageCount: number): string {
  if (pageCount <= 0) return "unknown";
  if (pageCount <= 1) return "1";
  if (pageCount <= 5) return "2-5";
  if (pageCount <= 20) return "6-20";
  if (pageCount <= 100) return "21-100";
  return "100+";
}

export function getSentryEnvelopeEndpoint(dsn: string): string | null {
  try {
    const parsed = new URL(dsn);
    const projectId = parsed.pathname.split("/").filter(Boolean).pop();
    if (!projectId || !parsed.username) return null;

    const basePath = parsed.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, -1)
      .join("/");
    const pathPrefix = basePath ? `/${basePath}` : "";

    return `${parsed.protocol}//${parsed.host}${pathPrefix}/api/${projectId}/envelope/?sentry_key=${parsed.username}&sentry_version=7`;
  } catch {
    return null;
  }
}

function trackPlausible(
  eventName: ConversionEvent,
  props: Record<string, string>,
): void {
  window.plausible?.(eventName, { props });
}

function createEventId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getSentryEnvironment(): string {
  return (
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ??
    process.env.NODE_ENV ??
    "production"
  );
}
