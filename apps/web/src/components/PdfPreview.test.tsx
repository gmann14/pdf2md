import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PdfPreview } from "./PdfPreview";

vi.mock("@pdf2md/core", () => ({
  initPdfWorker: vi.fn(() => Promise.resolve()),
  getPdfjs: vi.fn(() =>
    Promise.resolve({
      getDocument: () => ({
        promise: Promise.resolve({
          destroy: vi.fn(() => Promise.resolve()),
          numPages: 1,
          getPage: vi.fn(() =>
            Promise.resolve({
              getViewport: vi.fn(() => ({ width: 612, height: 792 })),
              render: vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() })),
            }),
          ),
        }),
      }),
    }),
  ),
}));

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  root = null;
  container?.remove();
  container = null;
  vi.restoreAllMocks();
});

describe("PdfPreview", () => {
  it("shows the non-blocking fallback when canvas context setup fails", async () => {
    // Comparison view is optional visual QA. If browser canvas setup fails after
    // the PDF loads, the preview must fail closed so Markdown actions remain usable.
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
      throw new Error("forced canvas failure");
    });

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
      root?.render(
        <PdfPreview
          file={new File([new Uint8Array([37, 80, 68, 70])], "sample.pdf", {
            type: "application/pdf",
          })}
        />,
      );
    });

    await expect
      .poll(() => container?.textContent ?? "")
      .toContain("PDF preview unavailable. Markdown output and downloads are still available.");
  });
});
