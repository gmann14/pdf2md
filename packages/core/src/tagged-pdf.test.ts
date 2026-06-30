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

function textItem(str: string, x: number, y: number): MockTextItem {
  return {
    str,
    transform: [12, 0, 0, 12, x, y],
    width: str.length * 6,
    height: 12,
    fontName: "Helvetica",
    hasEOL: true,
  };
}

function markedText(id: string, item: MockTextItem) {
  return [
    { type: "beginMarkedContentProps", id },
    item,
    { type: "endMarkedContent" },
  ];
}

function makeDoc(structTree: unknown) {
  return {
    numPages: 1,
    destroy: vi.fn(),
    getPage: vi.fn().mockResolvedValue({
      getViewport: vi.fn(() => ({ height: 800 })),
      getAnnotations: vi.fn().mockResolvedValue([]),
      getStructTree: vi.fn().mockResolvedValue(structTree),
      getTextContent: vi.fn().mockResolvedValue({
        items: [
          ...markedText("title", textItem("Tagged Title", 72, 740)),
          ...markedText("intro", textItem("Semantic paragraph from tags.", 72, 710)),
          ...markedText("item-one", textItem("First tagged item", 72, 680)),
          ...markedText("item-two", textItem("Second tagged item", 72, 660)),
        ],
      }),
    }),
  };
}

describe("tagged PDF struct tree fast path", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses structure tags for headings, paragraphs, and lists when visual cues are ambiguous", async () => {
    // WHY: tagged PDFs can expose semantic roles even when text has identical
    // font metrics, so the fast path must not depend on font-size heuristics.
    mocks.doc = makeDoc({
      role: "Root",
      children: [
        { role: "H1", children: [{ type: "content", id: "title" }] },
        { role: "P", children: [{ type: "content", id: "intro" }] },
        {
          role: "L",
          children: [
            { role: "LI", children: [{ type: "content", id: "item-one" }] },
            { role: "LI", children: [{ type: "content", id: "item-two" }] },
          ],
        },
      ],
    });

    const result = await convert(new ArrayBuffer(8));

    expect(result.status).toBe("success");
    expect(result.markdown).toBe(
      [
        "# Tagged Title",
        "",
        "Semantic paragraph from tags.",
        "",
        "- First tagged item",
        "",
        "- Second tagged item",
      ].join("\n"),
    );
  });

  it("falls back to visual heuristics when the structure tree cannot be mapped to text items", async () => {
    // WHY: real-world tagged PDFs sometimes contain stale or object-only trees;
    // conversion should preserve extractable text instead of emitting empty output.
    mocks.doc = makeDoc({
      role: "Root",
      children: [
        { role: "H1", children: [{ type: "content", id: "missing-title" }] },
      ],
    });

    const result = await convert(new ArrayBuffer(8));

    expect(result.status).toBe("success");
    expect(result.markdown).toContain("Tagged Title");
    expect(result.markdown).toContain("Semantic paragraph from tags.");
    expect(result.markdown).not.toContain("# Tagged Title");
  });
});
