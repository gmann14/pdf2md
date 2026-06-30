import { afterEach, describe, expect, it, vi } from "vitest";

const pdfjs = {
  GlobalWorkerOptions: {} as {
    workerPort?: Worker;
    workerSrc?: string;
  },
};

vi.mock("./pdf-compat.js", () => ({
  getPdfjs: vi.fn(async () => pdfjs),
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
  pdfjs.GlobalWorkerOptions = {};
});

describe("initPdfWorker", () => {
  it("uses an explicit module Worker in browsers", async () => {
    // WHY: Next dev was falling through PDF.js' workerSrc loader and failing at
    // runtime; handing PDF.js a Worker instance avoids that dev-only path.
    const createdWorkers: Array<{ url: URL; options: WorkerOptions }> = [];
    class MockWorker {
      constructor(url: URL, options: WorkerOptions) {
        createdWorkers.push({ url, options });
      }
    }

    vi.stubGlobal("window", {});
    vi.stubGlobal("Worker", MockWorker);

    const { initPdfWorker } = await import("./pdf-worker.js");
    await initPdfWorker();

    expect(createdWorkers).toHaveLength(1);
    expect(createdWorkers[0].url.toString()).toContain(
      "pdfjs-dist/build/pdf.worker.min.mjs",
    );
    expect(createdWorkers[0].options).toEqual({ type: "module" });
    expect(pdfjs.GlobalWorkerOptions.workerPort).toBeInstanceOf(MockWorker);
    expect(pdfjs.GlobalWorkerOptions.workerSrc).toBeUndefined();
  });

  it("falls back to workerSrc when Worker construction is unavailable", async () => {
    // WHY: older browsers or restrictive runtimes should still get the previous
    // PDF.js workerSrc behavior instead of failing conversion initialization.
    class ThrowingWorker {
      constructor() {
        throw new Error("worker construction blocked");
      }
    }

    vi.stubGlobal("window", {});
    vi.stubGlobal("Worker", ThrowingWorker);

    const { initPdfWorker } = await import("./pdf-worker.js");
    await initPdfWorker();

    expect(pdfjs.GlobalWorkerOptions.workerPort).toBeUndefined();
    expect(pdfjs.GlobalWorkerOptions.workerSrc).toContain(
      "pdfjs-dist/build/pdf.worker.min.mjs",
    );
  });
});
