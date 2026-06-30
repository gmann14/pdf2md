import { beforeEach, describe, expect, it, vi } from "vitest";
import { convert } from "./converter.js";

const mocks = vi.hoisted(() => ({
  doc: undefined as unknown,
}));

vi.mock("./pdf-worker.js", () => ({
  initPdfWorker: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./pdf-compat.js", () => ({
  getPdfjs: vi.fn().mockResolvedValue({
    getDocument: vi.fn(() => ({
      promise: Promise.resolve(mocks.doc),
      destroy: vi.fn(),
    })),
  }),
}));

interface MockTextItem {
  str: string;
  transform: [number, number, number, number, number, number];
  width: number;
  height: number;
  fontName: string;
  hasEOL: boolean;
}

function textItem(
  str: string,
  x: number,
  y: number,
  fontSize = 12,
  fontName = "Helvetica",
): MockTextItem {
  return {
    str,
    transform: [fontSize, 0, 0, fontSize, x, y],
    width: str.length * (fontSize / 2),
    height: fontSize,
    fontName,
    hasEOL: true,
  };
}

function makePage(items: MockTextItem[]) {
  return {
    getViewport: vi.fn(() => ({ height: 800 })),
    getAnnotations: vi.fn().mockResolvedValue([]),
    getStructTree: vi.fn().mockResolvedValue(null),
    getTextContent: vi.fn().mockResolvedValue({ items }),
  };
}

function makeDoc() {
  const pages = [
    makePage([
      textItem("Overview", 72, 740, 22, "Helvetica-Bold"),
      textItem("This page introduces the conversion workflow.", 72, 705),
      textItem("Details", 72, 660, 18, "Helvetica-Bold"),
      textItem("Nested section text for retrieval.", 72, 625),
    ]),
    makePage([
      textItem("Second Page", 72, 740, 22, "Helvetica-Bold"),
      textItem("More source text belongs to page two.", 72, 705),
    ]),
  ];

  return {
    numPages: 2,
    destroy: vi.fn(),
    getPage: vi.fn((pageNum: number) => Promise.resolve(pages[pageNum - 1])),
  };
}

describe("structured output and chunking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.doc = makeDoc();
  });

  it("returns hierarchical sections without breaking the markdown contract", async () => {
    // WHY: RAG callers need section hierarchy and source pages, while existing
    // callers still depend on result.markdown being populated in every mode.
    const result = await convert(new ArrayBuffer(8), { outputFormat: "json" });

    expect(result.status).toBe("success");
    expect(result.markdown).toContain("# Overview");
    expect(result.structured?.sections).toHaveLength(2);
    expect(result.structured?.sections[0]).toMatchObject({
      title: "Overview",
      level: 1,
      pageStart: 1,
      pageEnd: 1,
    });
    expect(result.structured?.sections[0].children[0]).toMatchObject({
      title: "Details",
      level: 2,
      pageStart: 1,
      pageEnd: 1,
    });
    expect(result.structured?.sections[1]).toMatchObject({
      title: "Second Page",
      pageStart: 2,
      pageEnd: 2,
    });
  });

  it("chunks by page with each chunk carrying source-page metadata", async () => {
    // WHY: page-level chunking is the simplest provenance mode for retrieval
    // systems that need to cite or reopen the original PDF page.
    const result = await convert(new ArrayBuffer(8), { chunkBy: "page" });

    expect(result.chunks).toEqual([
      expect.objectContaining({
        id: "page-1",
        pageStart: 1,
        pageEnd: 1,
        sectionPath: ["Page 1"],
      }),
      expect.objectContaining({
        id: "page-2",
        pageStart: 2,
        pageEnd: 2,
        sectionPath: ["Page 2"],
      }),
    ]);
    expect(result.chunks?.[0].markdown).toContain("# Overview");
    expect(result.chunks?.[1].markdown).toContain("# Second Page");
  });

  it("chunks by heading using section paths for nested headings", async () => {
    // WHY: heading chunks should preserve document hierarchy so embedding
    // consumers can retain the parent section context.
    const result = await convert(new ArrayBuffer(8), { chunkBy: "heading" });

    expect(result.chunks?.map((chunk) => chunk.sectionPath)).toEqual([
      ["Overview"],
      ["Overview", "Details"],
      ["Second Page"],
    ]);
    expect(result.chunks?.[1]).toMatchObject({
      id: "heading-2",
      pageStart: 1,
      pageEnd: 1,
    });
  });

  it("chunks by approximate token count without dropping section text", async () => {
    // WHY: token-budget chunking is used before embeddings; it must split
    // oversized content but keep all Markdown segments in order.
    const result = await convert(new ArrayBuffer(8), {
      chunkBy: "token",
      maxTokensPerChunk: 8,
    });

    expect(result.chunks && result.chunks.length).toBeGreaterThan(1);
    expect(result.chunks?.map((chunk) => chunk.id)).toEqual(
      result.chunks?.map((_, index) => `token-${index + 1}`),
    );
    expect(result.chunks?.map((chunk) => chunk.markdown).join("\n\n")).toContain("Nested section text for retrieval.");
    expect(result.chunks?.every((chunk) => chunk.tokenEstimate > 0)).toBe(true);
  });
});
