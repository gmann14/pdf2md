import { describe, it, expect } from "vitest";
import {
  isMonospace,
  detectTable,
  isCodeBlock,
  metadataToYaml,
  parsePdfDate,
  tableToMarkdown,
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
