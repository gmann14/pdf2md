import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ConversionResult } from "@pdf2md/core/types";
import { Converter } from "./Converter";

interface PendingRun {
  signal: AbortSignal;
  settle: (result: ConversionResult) => void;
}

const runs: PendingRun[] = [];

// Each convert() call stays pending until the test settles it, so the test
// controls exactly when a cancelled run finishes relative to a newer one.
vi.mock("@pdf2md/core", () => ({
  convert: vi.fn(
    (_buffer: ArrayBuffer, options: { signal: AbortSignal }) =>
      new Promise<ConversionResult>((resolve) => {
        runs.push({ signal: options.signal, settle: resolve });
      }),
  ),
}));

vi.mock("@/lib/telemetry", () => ({
  reportClientParseFailure: vi.fn(),
  reportClientConversionException: vi.fn(),
  trackConversion: vi.fn(),
  trackOutputAction: vi.fn(),
}));

const cancelled: ConversionResult = {
  status: "failed",
  markdown: "",
  messages: [{ code: "cancelled", severity: "error", message: "Conversion was cancelled." }],
  stats: { pageCount: 0, wordCount: 0, processingMs: 0 },
};

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  root = null;
  container?.remove();
  container = null;
  runs.length = 0;
});

async function choosePdf(): Promise<void> {
  const input = container?.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error("file input not rendered");
  const file = new File([new Uint8Array([37, 80, 68, 70])], "sample.pdf", { type: "application/pdf" });
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  await act(async () => {
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

async function clickCancel(): Promise<void> {
  const button = [...(container?.querySelectorAll("button") ?? [])].find((b) => b.textContent === "Cancel");
  if (!button) throw new Error("Cancel button not rendered");
  await act(async () => {
    button.click();
  });
}

describe("Converter cancel", () => {
  // Regression: Cancel returns to the drop zone at once, but the cancelled
  // conversion settles later. When it did, it cleared the shared abort ref
  // even if a newer conversion had started, so Cancel on the newer one did
  // nothing and that conversion kept running.
  it("still cancels a new conversion after an older cancelled one settles", async () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => {
      root?.render(<Converter />);
    });

    await choosePdf();
    await vi.waitFor(() => expect(runs).toHaveLength(1));
    await clickCancel();
    expect(runs[0].signal.aborted).toBe(true);

    await choosePdf();
    await vi.waitFor(() => expect(runs).toHaveLength(2));

    // The first, cancelled run only now settles.
    await act(async () => {
      runs[0].settle(cancelled);
    });

    await clickCancel();
    expect(runs[1].signal.aborted).toBe(true);
  });
});
