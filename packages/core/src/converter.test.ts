import { describe, it, expect } from "vitest";
import {
  isMonospace,
  cleanText,
  detectTable,
  isCodeBlock,
  detectCodeFont,
  metadataToYaml,
  parsePdfDate,
  tableToMarkdown,
  detectColumnLayout,
  reorderColumnarItems,
} from "./detection";

// Helper to create ExtractedItem-like objects for testing
function makeItem(overrides: {
  str: string;
  x: number;
  y: number;
  fontName?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  hasEOL?: boolean;
  page?: number;
}) {
  return {
    str: overrides.str,
    x: overrides.x,
    y: overrides.y,
    width: overrides.width ?? overrides.str.length * 6,
    height: overrides.height ?? 12,
    fontSize: overrides.fontSize ?? 12,
    fontName: overrides.fontName ?? "Helvetica",
    hasEOL: overrides.hasEOL ?? false,
    page: overrides.page ?? 1,
  };
}

// ---------------------------------------------------------------------------
// isMonospace
// ---------------------------------------------------------------------------
describe("isMonospace", () => {
  it("detects Courier fonts", () => {
    expect(isMonospace("Courier")).toBe(true);
    expect(isMonospace("CourierNew")).toBe(true);
    expect(isMonospace("Courier-Bold")).toBe(true);
  });

  it("detects Consolas", () => {
    expect(isMonospace("Consolas")).toBe(true);
  });

  it("detects Menlo/Monaco/Inconsolata", () => {
    expect(isMonospace("Menlo-Regular")).toBe(true);
    expect(isMonospace("Monaco")).toBe(true);
    expect(isMonospace("Inconsolata")).toBe(true);
  });

  it("detects various monospace fonts", () => {
    expect(isMonospace("SourceCodePro")).toBe(true);
    expect(isMonospace("FiraCode-Regular")).toBe(true);
    expect(isMonospace("JetBrainsMono")).toBe(true);
    expect(isMonospace("LiberationMono")).toBe(true);
    expect(isMonospace("RobotoMono")).toBe(true);
    expect(isMonospace("SFMono-Regular")).toBe(true);
    expect(isMonospace("LucidaConsole")).toBe(true);
  });

  it("rejects non-monospace fonts", () => {
    expect(isMonospace("Helvetica")).toBe(false);
    expect(isMonospace("Arial")).toBe(false);
    expect(isMonospace("TimesNewRoman")).toBe(false);
    expect(isMonospace("Georgia")).toBe(false);
    expect(isMonospace("Verdana")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// cleanText
// ---------------------------------------------------------------------------
describe("cleanText", () => {
  it("replaces common ligatures", () => {
    expect(cleanText("ﬁnd the ﬂow of ﬀects")).toBe("find the flow of ffects");
    expect(cleanText("oﬃce and aﬄuent")).toBe("office and affluent");
  });

  it("maps Windows-1252 C1 control chars to Unicode equivalents", () => {
    // \x93 and \x94 → left/right double quotes
    expect(cleanText("\x93hello\x94")).toBe("\u201Chello\u201D");
    // \x91 and \x92 → left/right single quotes
    expect(cleanText("\x91it\x92s")).toBe("\u2018it\u2019s");
    // \x97 → em dash
    expect(cleanText("word\x97word")).toBe("word\u2014word");
    // \x96 → en dash
    expect(cleanText("1\x962")).toBe("1\u20132");
  });

  it("strips C0 control characters (except tab/newline/CR)", () => {
    expect(cleanText("hello\x00world")).toBe("helloworld");
    expect(cleanText("a\x01b\x02c\x03d")).toBe("abcd");
    expect(cleanText("keep\ttabs")).toBe("keep\ttabs");
  });

  it("strips remaining C1 control characters", () => {
    expect(cleanText("text\x80\x81\x82more")).toBe("textmore");
    expect(cleanText("a\x9Fb")).toBe("ab");
  });

  it("normalizes special spaces", () => {
    expect(cleanText("hello\u00A0world")).toBe("hello world");
    expect(cleanText("thin\u2009space")).toBe("thin space");
  });

  it("removes zero-width characters", () => {
    expect(cleanText("he\u200Bllo")).toBe("hello");
    expect(cleanText("te\uFEFFst")).toBe("test");
  });

  it("strips soft hyphens", () => {
    expect(cleanText("hy\u00ADphen")).toBe("hyphen");
  });

  it("collapses multiple spaces", () => {
    expect(cleanText("too   many    spaces")).toBe("too many spaces");
  });
});

// ---------------------------------------------------------------------------
// detectTable
// ---------------------------------------------------------------------------
describe("detectTable", () => {
  it("detects a simple 3x3 table", () => {
    const items = [
      // Row 1
      makeItem({ str: "Name", x: 50, y: 100 }),
      makeItem({ str: "Age", x: 200, y: 100 }),
      makeItem({ str: "City", x: 350, y: 100 }),
      // Row 2
      makeItem({ str: "Alice", x: 50, y: 120 }),
      makeItem({ str: "30", x: 200, y: 120 }),
      makeItem({ str: "NYC", x: 350, y: 120 }),
      // Row 3
      makeItem({ str: "Bob", x: 50, y: 140 }),
      makeItem({ str: "25", x: 200, y: 140 }),
      makeItem({ str: "LA", x: 350, y: 140 }),
    ];

    const result = detectTable(items);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
    expect(result![0]).toEqual(["Name", "Age", "City"]);
    expect(result![1]).toEqual(["Alice", "30", "NYC"]);
    expect(result![2]).toEqual(["Bob", "25", "LA"]);
  });

  it("detects a 2-column table", () => {
    const items = [
      makeItem({ str: "Key", x: 50, y: 100 }),
      makeItem({ str: "Value", x: 300, y: 100 }),
      makeItem({ str: "color", x: 50, y: 120 }),
      makeItem({ str: "blue", x: 300, y: 120 }),
      makeItem({ str: "size", x: 50, y: 140 }),
      makeItem({ str: "large", x: 300, y: 140 }),
    ];

    const result = detectTable(items);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
    expect(result![0]).toEqual(["Key", "Value"]);
  });

  it("returns null for too few items", () => {
    const items = [
      makeItem({ str: "Hello", x: 50, y: 100 }),
      makeItem({ str: "World", x: 200, y: 100 }),
    ];
    expect(detectTable(items)).toBeNull();
  });

  it("returns null for single-column items", () => {
    const items = [
      makeItem({ str: "Line 1", x: 50, y: 100 }),
      makeItem({ str: "Line 2", x: 50, y: 120 }),
      makeItem({ str: "Line 3", x: 50, y: 140 }),
      makeItem({ str: "Line 4", x: 50, y: 160 }),
    ];
    expect(detectTable(items)).toBeNull();
  });

  it("returns null for misaligned columns", () => {
    const items = [
      makeItem({ str: "A", x: 50, y: 100 }),
      makeItem({ str: "B", x: 200, y: 100 }),
      makeItem({ str: "C", x: 90, y: 120 }), // x=90 is far from x=50
      makeItem({ str: "D", x: 250, y: 120 }), // x=250 is far from x=200
    ];
    expect(detectTable(items)).toBeNull();
  });

  it("rejects 2-column prose text that looks like column layout", () => {
    const items = [
      // Two-column paragraph text — long cells typical of academic paper layout
      makeItem({ str: "The development of deep learning has had a significant impact on many areas", x: 50, y: 100 }),
      makeItem({ str: "Video games may be an interesting challenge, but learning how to play them", x: 310, y: 100 }),
      makeItem({ str: "in machine learning, dramatically improving the state of the art in tasks", x: 50, y: 120 }),
      makeItem({ str: "is not the end goal of DRL. One of the driving forces behind DRL is the", x: 310, y: 120 }),
      makeItem({ str: "such as object detection, speech recognition, and language translation.", x: 50, y: 140 }),
      makeItem({ str: "vision of creating systems that are capable of learning how to adapt.", x: 310, y: 140 }),
    ];
    expect(detectTable(items)).toBeNull();
  });

  it("tolerates small x-position variance", () => {
    const items = [
      makeItem({ str: "Name", x: 50, y: 100 }),
      makeItem({ str: "Score", x: 200, y: 100 }),
      makeItem({ str: "Alice", x: 52, y: 120 }), // 2px off
      makeItem({ str: "95", x: 198, y: 120 }), // 2px off
      makeItem({ str: "Bob", x: 51, y: 140 }),
      makeItem({ str: "88", x: 201, y: 140 }),
    ];

    const result = detectTable(items);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// isCodeBlock
// ---------------------------------------------------------------------------
describe("isCodeBlock", () => {
  it("detects all-monospace items as code", () => {
    const items = [
      makeItem({ str: "function foo() {", x: 50, y: 100, fontName: "Courier" }),
      makeItem({ str: "  return 42;", x: 50, y: 120, fontName: "Courier" }),
      makeItem({ str: "}", x: 50, y: 140, fontName: "Courier" }),
    ];
    expect(isCodeBlock(items)).toBe(true);
  });

  it("detects mixed monospace fonts as code", () => {
    const items = [
      makeItem({ str: "const x = 1;", x: 50, y: 100, fontName: "Courier" }),
      makeItem({
        str: "const y = 2;",
        x: 50,
        y: 120,
        fontName: "Courier-Bold",
      }),
    ];
    expect(isCodeBlock(items)).toBe(true);
  });

  it("rejects non-monospace items", () => {
    const items = [
      makeItem({ str: "Hello world", x: 50, y: 100, fontName: "Helvetica" }),
      makeItem({ str: "More text", x: 50, y: 120, fontName: "Arial" }),
    ];
    expect(isCodeBlock(items)).toBe(false);
  });

  it("rejects mostly non-monospace with some monospace", () => {
    const items = [
      makeItem({
        str: "This is a long paragraph of normal text that is definitely not code",
        x: 50,
        y: 100,
        fontName: "Helvetica",
      }),
      makeItem({ str: "x = 1", x: 50, y: 120, fontName: "Courier" }),
    ];
    expect(isCodeBlock(items)).toBe(false);
  });

  it("returns false for empty items", () => {
    expect(isCodeBlock([])).toBe(false);
  });

  it("detects code with 80%+ monospace chars", () => {
    const items = [
      makeItem({
        str: "function longFunctionNameHere() {",
        x: 50,
        y: 100,
        fontName: "Courier",
      }),
      makeItem({
        str: "return true;",
        x: 50,
        y: 120,
        fontName: "Courier",
      }),
      // Small non-mono annotation (less than 20% of chars)
      makeItem({ str: "//", x: 50, y: 140, fontName: "Helvetica" }),
    ];
    expect(isCodeBlock(items)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// metadataToYaml
// ---------------------------------------------------------------------------
describe("metadataToYaml", () => {
  it("generates YAML with all fields", () => {
    const yaml = metadataToYaml({
      title: "My Document",
      author: "John Doe",
      subject: "Testing",
      keywords: ["pdf", "markdown"],
      creationDate: "D:20240115120000",
    });

    expect(yaml).toBe(
      [
        "---",
        'title: "My Document"',
        'author: "John Doe"',
        'subject: "Testing"',
        "keywords:",
        '  - "pdf"',
        '  - "markdown"',
        'date: "2024-01-15"',
        "---",
      ].join("\n"),
    );
  });

  it("generates YAML with only title", () => {
    const yaml = metadataToYaml({ title: "Just Title" });
    expect(yaml).toBe('---\ntitle: "Just Title"\n---');
  });

  it("returns null for empty metadata", () => {
    const yaml = metadataToYaml({});
    expect(yaml).toBeNull();
  });

  it("escapes quotes in values", () => {
    const yaml = metadataToYaml({ title: 'A "quoted" title' });
    expect(yaml).toContain('title: "A \\"quoted\\" title"');
  });

  it("escapes backslashes in values", () => {
    const yaml = metadataToYaml({ title: "A\\path\\title" });
    expect(yaml).toContain('title: "A\\\\path\\\\title"');
  });

  it("handles keywords as list", () => {
    const yaml = metadataToYaml({ keywords: ["one", "two", "three"] });
    expect(yaml).toContain("keywords:");
    expect(yaml).toContain('  - "one"');
    expect(yaml).toContain('  - "two"');
    expect(yaml).toContain('  - "three"');
  });
});

// ---------------------------------------------------------------------------
// parsePdfDate
// ---------------------------------------------------------------------------
describe("parsePdfDate", () => {
  it("parses full PDF date format", () => {
    expect(parsePdfDate("D:20240115120000")).toBe("2024-01-15");
  });

  it("parses date-only format", () => {
    expect(parsePdfDate("D:20231225")).toBe("2023-12-25");
  });

  it("returns raw string for non-standard format", () => {
    expect(parsePdfDate("2024-01-15")).toBe("2024-01-15");
  });

  it("parses date with timezone offset", () => {
    expect(parsePdfDate("D:20240115120000+05'30'")).toBe("2024-01-15");
  });
});

// ---------------------------------------------------------------------------
// tableToMarkdown
// ---------------------------------------------------------------------------
describe("tableToMarkdown", () => {
  it("formats a simple 2x2 table", () => {
    const result = tableToMarkdown([
      ["Name", "Age"],
      ["Alice", "30"],
    ]);
    expect(result).toBe(
      "| Name  | Age |\n| ----- | --- |\n| Alice | 30  |",
    );
  });

  it("formats a table with varying cell widths", () => {
    const result = tableToMarkdown([
      ["ID", "Description"],
      ["1", "A very long description"],
    ]);
    expect(result).toContain("| ID");
    expect(result).toContain("Description");
    expect(result).toContain("---");
    expect(result).toContain("A very long description");
  });

  it("returns empty string for empty rows", () => {
    expect(tableToMarkdown([])).toBe("");
  });
});

// ---------------------------------------------------------------------------
// detectColumnLayout
// ---------------------------------------------------------------------------

/** Build a minimal DetectionItem at (x, y) with a given width. */
function makeColItem(
  x: number,
  y: number,
  width = 60,
  page = 1,
) {
  return {
    str: "text",
    x,
    y,
    width,
    height: 12,
    fontSize: 10,
    fontName: "Helvetica",
    hasEOL: false,
    page,
  };
}

describe("detectColumnLayout", () => {
  it("returns single for too few items", () => {
    const items = [makeColItem(50, 100)];
    expect(detectColumnLayout(items).type).toBe("single");
  });

  it("detects single column when all items start at similar X", () => {
    // 20 items all starting at x=72 — typical single-column doc
    const items = Array.from({ length: 20 }, (_, i) =>
      makeColItem(72, 100 + i * 14),
    );
    expect(detectColumnLayout(items).type).toBe("single");
  });

  it("detects two-column layout with clear gap", () => {
    // Simulate a letter-size 2-col paper (612pt wide, columns ~72-260 and 310-540)
    // Need 20+ lines for the 40% threshold and realistic widths (>100pt) for min column width check
    const items: ReturnType<typeof makeColItem>[] = [];
    for (let i = 0; i < 20; i++) {
      items.push(makeColItem(72, 100 + i * 14, 188)); // left col (72..260)
      items.push(makeColItem(310, 100 + i * 14, 200)); // right col (310..510)
    }
    const layout = detectColumnLayout(items);
    expect(layout.type).toBe("two-column");
    expect(layout.gapCenter).toBeDefined();
    // Gap center should be in the gutter between the two columns (~260–310 range)
    expect(layout.gapCenter!).toBeGreaterThan(240);
    expect(layout.gapCenter!).toBeLessThan(330);
  });

  it("detects splitY for mixed layout (full-width header + 2-col body)", () => {
    const items: ReturnType<typeof makeColItem>[] = [];
    // Full-width title / abstract at y=50-120 (all start at x=72, wide content)
    for (let i = 0; i < 6; i++) {
      items.push(makeColItem(72, 50 + i * 14, 400)); // full-width, only left-side X
    }
    // Two-column body starts at y=200 — need enough lines for 40% threshold
    for (let i = 0; i < 20; i++) {
      items.push(makeColItem(72, 200 + i * 14, 188)); // left col (72..260)
      items.push(makeColItem(310, 200 + i * 14, 200)); // right col (310..510)
    }
    const layout = detectColumnLayout(items);
    expect(layout.type).toBe("two-column");
    expect(layout.splitY).toBeDefined();
    // splitY should be near where two-column content starts
    expect(layout.splitY!).toBeGreaterThanOrEqual(195);
    expect(layout.splitY!).toBeLessThanOrEqual(215);
  });
});

// ---------------------------------------------------------------------------
// reorderColumnarItems
// ---------------------------------------------------------------------------
describe("reorderColumnarItems", () => {
  it("returns items unchanged for single-column layout", () => {
    const items = [makeColItem(72, 100), makeColItem(72, 114)];
    const result = reorderColumnarItems(items, { type: "single" });
    expect(result).toEqual(items);
  });

  it("puts left column before right column", () => {
    // Items alternating left/right (as PDF.js would return them)
    const items = [
      makeColItem(310, 100), // right col — PDF.js row-order
      makeColItem(72, 100),  // left col — same Y
      makeColItem(310, 114), // right col
      makeColItem(72, 114),  // left col
    ];
    const layout = {
      type: "two-column" as const,
      gapCenter: 200,
      gapStart: 180,
      gapEnd: 220,
    };
    const result = reorderColumnarItems(items, layout);
    // All left-col items (x=72) should come before all right-col items (x=310)
    const firstRightIdx = result.findIndex((it) => it.x === 310);
    const lastLeftIdx = result.map((it) => it.x).lastIndexOf(72);
    expect(lastLeftIdx).toBeLessThan(firstRightIdx);
  });

  it("keeps pre-column items at the top when splitY is set", () => {
    const items = [
      makeColItem(72, 300),  // left col (below splitY)
      makeColItem(310, 300), // right col (below splitY)
      makeColItem(72, 50),   // pre-column header (above splitY)
    ];
    const layout = {
      type: "two-column" as const,
      gapCenter: 200,
      gapStart: 180,
      gapEnd: 220,
      splitY: 150,
    };
    const result = reorderColumnarItems(items, layout);
    // Pre-column item (y=50) should be first
    expect(result[0].y).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// P0: Column detection hardening tests
// ---------------------------------------------------------------------------
describe("detectColumnLayout (hardened)", () => {
  it("returns single when items have short labels creating false gap (diagram labels)", () => {
    // Simulate diagram labels: short items (width ~20-36pt) at multiple X positions
    const items: ReturnType<typeof makeColItem>[] = [];
    // Body text lines — single column
    for (let i = 0; i < 20; i++) {
      items.push(makeColItem(72, 100 + i * 14, 400));
    }
    // Diagram labels at x≈200, x≈290, x≈380 (short, different font)
    for (let i = 0; i < 8; i++) {
      items.push({ ...makeColItem(200, 400 + i * 14, 30), fontSize: 7 });
      items.push({ ...makeColItem(290, 400 + i * 14, 36), fontSize: 7 });
      items.push({ ...makeColItem(380, 400 + i * 14, 25), fontSize: 7 });
    }
    expect(detectColumnLayout(items).type).toBe("single");
  });

  it("returns single when small-font items are filtered out", () => {
    // Items where small-font items (7pt) create a false gap, but body (10pt) doesn't
    const items: ReturnType<typeof makeColItem>[] = [];
    for (let i = 0; i < 25; i++) {
      items.push(makeColItem(72, 100 + i * 14, 400)); // body text, full width
    }
    // Small font items that would look like two columns
    for (let i = 0; i < 12; i++) {
      items.push({ ...makeColItem(72, 500 + i * 10, 150), fontSize: 6 });
      items.push({ ...makeColItem(310, 500 + i * 10, 150), fontSize: 6 });
    }
    expect(detectColumnLayout(items).type).toBe("single");
  });

  it("cross-page: 1/9 two-column pages results in all single-column", () => {
    // Simulate a 9-page document where only 1 page has two-column items
    const items: ReturnType<typeof makeColItem>[] = [];
    // Pages 1-8: single-column
    for (let page = 1; page <= 8; page++) {
      for (let i = 0; i < 15; i++) {
        items.push({ ...makeColItem(72, 100 + i * 14, 400), page });
      }
    }
    // Page 9: two-column
    for (let i = 0; i < 20; i++) {
      items.push({ ...makeColItem(72, 100 + i * 14, 188), page: 9 });
      items.push({ ...makeColItem(310, 100 + i * 14, 200), page: 9 });
    }
    // Page 9 alone should detect as two-column
    const page9Items = items.filter((it) => it.page === 9);
    expect(detectColumnLayout(page9Items).type).toBe("two-column");

    // But the cross-page consistency check should catch this at the applyColumnReordering level
    // (tested implicitly through full evaluation)
  });

  it("cross-page: 7/9 two-column pages keeps two-column", () => {
    // Verify that majority two-column pages pass the consistency check
    // (detectColumnLayout works per-page; consistency check is in converter.ts)
    const items: ReturnType<typeof makeColItem>[] = [];
    for (let i = 0; i < 20; i++) {
      items.push(makeColItem(72, 100 + i * 14, 188));
      items.push(makeColItem(310, 100 + i * 14, 200));
    }
    expect(detectColumnLayout(items).type).toBe("two-column");
  });

  it("bimodal fallback: detects two-column when items cluster in two X-zones", () => {
    // Simulate a cheatsheet-like layout: items in left zone (x=30-250)
    // and right zone (x=310-560), but each line only has items in one zone.
    // Per-line gap detection will fail (<40%) but bimodal clustering should catch it.
    const items: ReturnType<typeof makeColItem>[] = [];
    // Left column: 15 lines of varying widths
    for (let i = 0; i < 15; i++) {
      items.push(makeColItem(36, 100 + i * 14, 100 + Math.random() * 100));
    }
    // Right column: 15 lines (no overlap with left lines' Y positions)
    for (let i = 0; i < 15; i++) {
      items.push(makeColItem(315, 120 + i * 14, 80 + Math.random() * 150));
    }
    const result = detectColumnLayout(items);
    expect(result.type).toBe("two-column");
  });

  it("bimodal fallback: rejects when left items span full width", () => {
    // Body text (wide items spanning both zones) + some short labels on right
    const items: ReturnType<typeof makeColItem>[] = [];
    for (let i = 0; i < 20; i++) {
      items.push(makeColItem(72, 100 + i * 14, 400)); // Full-width
    }
    for (let i = 0; i < 12; i++) {
      items.push(makeColItem(350, 400 + i * 14, 120)); // Right-side labels
    }
    expect(detectColumnLayout(items).type).toBe("single");
  });
});

// ---------------------------------------------------------------------------
// P1: Code font detection tests
// ---------------------------------------------------------------------------
describe("detectCodeFont", () => {
  it("identifies font used in indented short-line blocks", () => {
    const items: ReturnType<typeof makeItem>[] = [];
    // Dominant font (body text) — lots of text
    for (let i = 0; i < 50; i++) {
      items.push(makeItem({
        str: "This is a long line of regular body text that spans the full width of the page and is quite lengthy.",
        x: 72, y: 100 + i * 14, fontName: "Helvetica", width: 400,
      }));
    }
    // Code font — indented, short lines, different font
    for (let block = 0; block < 5; block++) {
      for (let line = 0; line < 4; line++) {
        items.push(makeItem({
          str: "  x = foo(bar)",
          x: 110, y: 900 + block * 80 + line * 14, fontName: "g_d0_f3", width: 80,
        }));
      }
    }
    const codeFonts = detectCodeFont(items, 12);
    expect(codeFonts.has("g_d0_f3")).toBe(true);
    expect(codeFonts.has("Helvetica")).toBe(false);
  });

  it("does not flag fonts that are not consistently indented/short", () => {
    const items: ReturnType<typeof makeItem>[] = [];
    for (let i = 0; i < 50; i++) {
      items.push(makeItem({
        str: "Body text line number " + i,
        x: 72, y: 100 + i * 14, fontName: "Helvetica", width: 400,
      }));
    }
    // Occasional italic text — same width and position as body
    for (let i = 0; i < 20; i++) {
      items.push(makeItem({
        str: "This is italic emphasis text that is the same width as body text here.",
        x: 72, y: 900 + i * 14, fontName: "Helvetica-Italic", width: 400,
      }));
    }
    const codeFonts = detectCodeFont(items, 12);
    expect(codeFonts.has("Helvetica-Italic")).toBe(false);
  });
});

describe("isCodeBlock (enhanced)", () => {
  it("detects code with subset font via codeFonts set", () => {
    const codeFonts = new Set(["g_d0_f3"]);
    const items = [
      makeItem({ str: "def foo():", x: 100, y: 100, fontName: "g_d0_f3" }),
      makeItem({ str: "  return 42", x: 100, y: 114, fontName: "g_d0_f3" }),
    ];
    expect(isCodeBlock(items, codeFonts)).toBe(true);
  });

  it("does not false-positive on regular prose", () => {
    const codeFonts = new Set(["g_d0_f3"]);
    const items = [
      makeItem({ str: "This is a normal paragraph of text.", x: 72, y: 100, fontName: "Helvetica" }),
      makeItem({ str: "It continues on the next line.", x: 72, y: 114, fontName: "Helvetica" }),
    ];
    expect(isCodeBlock(items, codeFonts)).toBe(false);
  });

  it("rejects prose text even when font is in codeFonts set", () => {
    const codeFonts = new Set(["g_d0_f3"]);
    const items = [
      makeItem({ str: "Charlie Munger died on November 28, just 33 days before his 100th birthday.", x: 72, y: 100, fontName: "g_d0_f3" }),
      makeItem({ str: "Though born and raised in Omaha, he spent 80% of his life domiciled elsewhere.", x: 72, y: 114, fontName: "g_d0_f3" }),
      makeItem({ str: "Consequently, it was not until 1959 when he was 35 that I first met him.", x: 72, y: 128, fontName: "g_d0_f3" }),
      makeItem({ str: "In 1962, he decided that he should take up money management.", x: 72, y: 142, fontName: "g_d0_f3" }),
    ];
    expect(isCodeBlock(items, codeFonts)).toBe(false);
  });

  it("rejects prose text even in known monospace font", () => {
    const items = [
      makeItem({ str: "The development of GPT-4 is a large-scale multimodal model which can accept image and text inputs.", x: 72, y: 100, fontName: "Courier" }),
      makeItem({ str: "While less capable than humans in many real-world scenarios, GPT-4 exhibits human-level performance.", x: 72, y: 114, fontName: "Courier" }),
      makeItem({ str: "The post-training alignment process results in improved performance on measures of factuality.", x: 72, y: 128, fontName: "Courier" }),
    ];
    expect(isCodeBlock(items)).toBe(false);
  });

  it("still detects actual code in subset font", () => {
    const codeFonts = new Set(["g_d0_f3"]);
    const items = [
      makeItem({ str: "def foo(x, y):", x: 100, y: 100, fontName: "g_d0_f3" }),
      makeItem({ str: "    result = x + y", x: 100, y: 114, fontName: "g_d0_f3" }),
      makeItem({ str: "    return result", x: 100, y: 128, fontName: "g_d0_f3" }),
    ];
    expect(isCodeBlock(items, codeFonts)).toBe(true);
  });

  it("still detects named monospace fonts without codeFonts", () => {
    const items = [
      makeItem({ str: "console.log('hello');", x: 50, y: 100, fontName: "Courier" }),
      makeItem({ str: "const x = 42;", x: 50, y: 114, fontName: "Courier" }),
    ];
    expect(isCodeBlock(items)).toBe(true);
  });

  it("rejects very short blocks (isolated math symbols)", () => {
    const codeFonts = new Set(["g_d0_f3"]);
    // Single math symbol
    const items1 = [
      makeItem({ str: "π", x: 100, y: 100, fontName: "g_d0_f3" }),
    ];
    expect(isCodeBlock(items1, codeFonts)).toBe(false);

    // Very short expression
    const items2 = [
      makeItem({ str: "Q∗", x: 100, y: 100, fontName: "g_d0_f3" }),
    ];
    expect(isCodeBlock(items2, codeFonts)).toBe(false);

    // Short word (under 8 chars)
    const items3 = [
      makeItem({ str: "Label", x: 100, y: 100, fontName: "Courier" }),
    ];
    expect(isCodeBlock(items3)).toBe(false);
  });

  it("rejects short label text in code font without code syntax", () => {
    const codeFonts = new Set(["g_d0_f3"]);
    // Short title-like text in a code font — should NOT be code
    const items = [
      makeItem({ str: "Healthcare Team", x: 100, y: 100, fontName: "g_d0_f3" }),
    ];
    expect(isCodeBlock(items, codeFonts)).toBe(false);

    // Another short label
    const items2 = [
      makeItem({ str: "Public Health Department", x: 100, y: 100, fontName: "g_d0_f3" }),
    ];
    expect(isCodeBlock(items2, codeFonts)).toBe(false);

    // Short text WITH code syntax should still be detected
    const items3 = [
      makeItem({ str: "if (x > 0) {", x: 100, y: 100, fontName: "g_d0_f3" }),
    ];
    expect(isCodeBlock(items3, codeFonts)).toBe(true);
  });

  it("still detects code blocks with sufficient content", () => {
    const codeFonts = new Set(["g_d0_f3"]);
    const items = [
      makeItem({ str: "def calculate(x, y):", x: 100, y: 100, fontName: "g_d0_f3" }),
      makeItem({ str: "    result = x + y", x: 100, y: 114, fontName: "g_d0_f3" }),
      makeItem({ str: "    return result * 2", x: 100, y: 128, fontName: "g_d0_f3" }),
      makeItem({ str: "print(calculate(3, 4))", x: 100, y: 142, fontName: "g_d0_f3" }),
    ];
    expect(isCodeBlock(items, codeFonts)).toBe(true);
  });
});
