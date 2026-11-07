import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer, toPageRange } from "./server.js";

const pkgDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const corpus = resolve(pkgDir, "../../test-corpus");
const bitcoin = join(corpus, "real-pdfs/whitepaper-bitcoin.pdf"); // 9 pages
const headerFooter = join(corpus, "fixtures/header-footer-numbers.pdf"); // 5 pages
const notPdf = join(corpus, "invalid-not-a-pdf.pdf");

let client: Client;

beforeAll(async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await createServer().connect(serverTransport);
  client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(clientTransport);
});

afterAll(async () => {
  await client?.close();
});

async function call(name: string, args: Record<string, unknown>): Promise<CallToolResult> {
  return (await client.callTool({ name, arguments: args })) as CallToolResult;
}

function text(result: CallToolResult): string {
  const first = result.content[0];
  return first?.type === "text" ? first.text : "";
}

describe("toPageRange", () => {
  it("compresses page lists", () => {
    expect(toPageRange([1, 2, 3, 5, 7, 8])).toBe("1-3,5,7-8");
    expect(toPageRange([])).toBe("");
  });
});

describe("pdf2md MCP server", () => {
  it("reports the package version", () => {
    const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")) as { version: string };
    expect(client.getServerVersion()).toEqual({ name: "pdf2md", version: pkg.version });
  });

  it("lists convert_pdf and pdf_info as read-only tools", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(["convert_pdf", "pdf_info"]);
    for (const tool of tools) {
      expect(tool.annotations?.readOnlyHint).toBe(true);
      expect(Object.keys(tool.inputSchema.properties ?? {})).toEqual(expect.arrayContaining(["file_path", "data_base64"]));
    }
    const convertTool = tools.find((t) => t.name === "convert_pdf");
    expect(Object.keys(convertTool?.inputSchema.properties ?? {})).toEqual(
      expect.arrayContaining(["pages", "format", "chunk_by", "max_chars"]),
    );
  });

  it("converts a tracked PDF to Markdown", async () => {
    const result = await call("convert_pdf", { file_path: bitcoin });
    expect(result.isError).toBeFalsy();
    expect(text(result)).toContain("Bitcoin");
    expect(text(result)).not.toContain("truncated");
  });

  it("converts the same PDF from base64", async () => {
    const fromPath = await call("convert_pdf", { file_path: bitcoin });
    const fromData = await call("convert_pdf", { data_base64: readFileSync(bitcoin).toString("base64") });
    expect(text(fromData)).toBe(text(fromPath));
  });

  it("converts a page slice", async () => {
    const result = await call("convert_pdf", { file_path: headerFooter, pages: "2-3" });
    expect(text(result)).toContain("Section 2 overview");
    expect(text(result)).toContain("Section 3 overview");
    expect(text(result)).not.toContain("Section 1 overview");
    expect(text(result)).not.toContain("Example Annual Report");

    const listed = await call("convert_pdf", { file_path: headerFooter, pages: [5], format: "json" });
    const structured = listed.structuredContent as { pages: Array<{ pageNumber: number }>; pageCount: number };
    expect(structured.pages.map((p) => p.pageNumber)).toEqual([5]);
    expect(structured.pageCount).toBe(5);
  });

  it("returns JSON chunks as structured content", async () => {
    const result = await call("convert_pdf", { file_path: bitcoin, format: "chunks", chunk_by: "page" });
    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as {
      chunks: Array<{ pageStart: number; markdown: string }>;
      truncated: boolean;
      metadata?: { pdfVersion?: string };
    };
    expect(structured.chunks).toHaveLength(9);
    expect(structured.chunks[0]?.pageStart).toBe(1);
    expect(structured.truncated).toBe(false);
    expect(structured.metadata?.pdfVersion).toBeDefined();
    expect(JSON.parse(text(result))).toEqual(structured);
  });

  it("truncates at a page boundary with a next_pages hint", async () => {
    const json = await call("convert_pdf", { file_path: bitcoin, format: "json", max_chars: 8000 });
    const structured = json.structuredContent as {
      pages: Array<{ pageNumber: number; markdown: string }>;
      markdown: string;
      truncated: boolean;
      next_pages?: string;
    };
    expect(structured.truncated).toBe(true);
    expect(structured.markdown.length).toBeLessThanOrEqual(8000);
    const last = structured.pages[structured.pages.length - 1]?.pageNumber ?? 0;
    expect(last).toBeGreaterThan(0);
    expect(structured.next_pages).toBe(`${last + 1}-9`);

    // Following the hint returns the rest.
    const rest = await call("convert_pdf", { file_path: bitcoin, format: "json", pages: structured.next_pages });
    const restPages = (rest.structuredContent as { pages: Array<{ pageNumber: number }> }).pages;
    expect(restPages[0]?.pageNumber).toBe(last + 1);

    const markdown = await call("convert_pdf", { file_path: bitcoin, max_chars: 8000 });
    expect(text(markdown)).toContain(`Call again with pages: "${structured.next_pages}"`);

    const chunks = await call("convert_pdf", { file_path: bitcoin, format: "chunks", chunk_by: "page", max_chars: 8000 });
    expect((chunks.structuredContent as { next_pages?: string }).next_pages).toBe(structured.next_pages);
  });

  it("reports a missing file as an error", async () => {
    const result = await call("convert_pdf", { file_path: join(corpus, "no-such-file.pdf") });
    expect(result.isError).toBe(true);
    expect(text(result)).toContain("Error reading file");
  });

  it("reports a non-PDF as a conversion failure", async () => {
    const result = await call("convert_pdf", { file_path: notPdf });
    expect(result.isError).toBe(true);
    expect(text(result)).toContain("Conversion failed");
    expect(text(result)).toContain("Failed to parse PDF");
  });

  it("needs exactly one of file_path and data_base64", async () => {
    expect((await call("convert_pdf", {})).isError).toBe(true);
    expect((await call("convert_pdf", { file_path: bitcoin, data_base64: "AAAA" })).isError).toBe(true);
  });

  it("answers an out-of-range slice without an error", async () => {
    const result = await call("convert_pdf", { file_path: headerFooter, pages: "40-50" });
    expect(result.isError).toBeFalsy();
    expect(text(result)).toContain("the document has 5 page(s)");
  });

  it("pdf_info reports pages, metadata and text-layer pages", async () => {
    const result = await call("pdf_info", { file_path: bitcoin });
    expect(result.isError).toBeFalsy();
    const info = result.structuredContent as {
      pageCount: number;
      pagesWithText: string;
      pagesWithoutText: string;
      isTagged: boolean;
      metadata?: { pdfVersion?: string };
    };
    expect(info.pageCount).toBe(9);
    expect(info.pagesWithText).toBe("1-9");
    expect(info.pagesWithoutText).toBe("");
    expect(typeof info.isTagged).toBe("boolean");
    expect(info.metadata?.pdfVersion).toBeDefined();

    const bad = await call("pdf_info", { file_path: notPdf });
    expect(bad.isError).toBe(true);
  });
});

describe("published package", () => {
  let dir = "";

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "pdf2md-mcp-pack-"));
  });

  afterAll(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it("depends on a core range that includes the current core, with no generic bin", () => {
    // pnpm rewrites workspace: ranges when packing; check the packed manifest.
    execFileSync("pnpm", ["pack", "--pack-destination", dir], { cwd: pkgDir, stdio: "pipe" });
    const tarball = execFileSync("ls", [dir], { encoding: "utf8" }).trim().split("\n")[0] ?? "";
    const manifest = JSON.parse(
      execFileSync("tar", ["-xzOf", join(dir, tarball), "package/package.json"], { encoding: "utf8" }),
    ) as { dependencies: Record<string, string>; bin: Record<string, string> };
    const coreVersion = (JSON.parse(readFileSync(join(pkgDir, "../core/package.json"), "utf8")) as { version: string })
      .version;

    const range = manifest.dependencies["@pdf2md/core"] ?? "";
    expect(range).toBe(`^${coreVersion}`);
    expect(Object.keys(manifest.bin)).toEqual(["pdf2md-mcp"]);
  });
});
