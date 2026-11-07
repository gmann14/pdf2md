import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { convert, getPdfInfo, metadataToYaml } from "@pdf2md/core";
import type { ConversionChunk, ConversionResult, ConvertOptions, PageMarkdown } from "@pdf2md/core";

/** Default cap on returned text, about 25k tokens: a page slice fits in an agent's context. */
export const DEFAULT_MAX_CHARS = 100_000;

function readVersion(): string {
  try {
    // src/server.ts and dist/server.js both sit one level below package.json.
    const pkg: unknown = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    const version = typeof pkg === "object" && pkg !== null ? (pkg as { version?: unknown }).version : undefined;
    return typeof version === "string" ? version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}

/** Compress sorted page numbers to a range string: [1,2,3,5] -> "1-3,5". */
export function toPageRange(pages: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < pages.length; i++) {
    const start = pages[i];
    while (i + 1 < pages.length && pages[i + 1] === pages[i] + 1) i++;
    parts.push(start === pages[i] ? String(start) : `${start}-${pages[i]}`);
  }
  return parts.join(",");
}

function errorResult(text: string): CallToolResult {
  return { isError: true, content: [{ type: "text", text }] };
}

const inputShape = {
  file_path: z.string().optional().describe("Path to the PDF file (absolute, or relative to the server's working directory)"),
  data_base64: z.string().optional().describe("The PDF bytes as base64, instead of file_path"),
};

/** Read the PDF from `file_path` or `data_base64` (exactly one). */
async function loadInput(args: { file_path?: string; data_base64?: string }): Promise<Uint8Array | CallToolResult> {
  const hasPath = typeof args.file_path === "string" && args.file_path.length > 0;
  const hasData = typeof args.data_base64 === "string" && args.data_base64.length > 0;
  if (hasPath === hasData) return errorResult("Pass exactly one of file_path or data_base64.");
  if (hasData) {
    const bytes = Buffer.from(args.data_base64 ?? "", "base64");
    if (bytes.byteLength === 0) return errorResult("data_base64 is not valid base64.");
    return new Uint8Array(bytes);
  }
  try {
    return new Uint8Array(await readFile(resolve(args.file_path ?? "")));
  } catch (err) {
    return errorResult(`Error reading file: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
}

function failureText(result: ConversionResult): string {
  return `Conversion failed:\n${result.messages.map((m) => `[${m.severity}] ${m.message}`).join("\n")}`;
}

interface Slice<T> {
  included: T[];
  /** Pages still to read, as a range string, when output was cut. */
  nextPages?: string;
  /** The first item alone was longer than max_chars and was cut. */
  cutFirst: boolean;
}

/** Whole pages until the next would pass `maxChars` (the first page is cut if it alone is too long). */
function slicePages(pages: PageMarkdown[], maxChars: number): Slice<PageMarkdown> {
  const included: PageMarkdown[] = [];
  let used = 0;
  for (const page of pages) {
    const cost = (included.length > 0 && page.markdown ? 2 : 0) + page.markdown.length;
    if (used + cost > maxChars) {
      if (included.length === 0) {
        included.push({ pageNumber: page.pageNumber, markdown: page.markdown.slice(0, maxChars) });
        const rest = pages.slice(1).map((p) => p.pageNumber);
        return { included, nextPages: rest.length > 0 ? toPageRange(rest) : undefined, cutFirst: true };
      }
      const rest = pages.slice(included.length).map((p) => p.pageNumber);
      return { included, nextPages: toPageRange(rest), cutFirst: false };
    }
    included.push(page);
    used += cost;
  }
  return { included, cutFirst: false };
}

/** Whole chunks until the next would pass `maxChars`; next_pages starts at the first chunk left out. */
function sliceChunks(chunks: ConversionChunk[], selected: number[], maxChars: number): Slice<ConversionChunk> {
  const included: ConversionChunk[] = [];
  let used = 0;
  for (const chunk of chunks) {
    if (used + chunk.markdown.length > maxChars) {
      if (included.length === 0) {
        included.push({ ...chunk, markdown: chunk.markdown.slice(0, maxChars) });
        const rest = selected.filter((p) => p > chunk.pageEnd);
        return { included, nextPages: rest.length > 0 ? toPageRange(rest) : undefined, cutFirst: true };
      }
      const rest = selected.filter((p) => p >= chunk.pageStart);
      return { included, nextPages: toPageRange(rest), cutFirst: false };
    }
    included.push(chunk);
    used += chunk.markdown.length;
  }
  return { included, cutFirst: false };
}

function truncationNote(maxChars: number, returned: number[], slice: Slice<unknown>, selectedCount: number, pageCount: number): string {
  const parts = [
    `Output truncated at max_chars=${maxChars}: returned page(s) ${toPageRange(returned)} of the ${selectedCount} selected (the document has ${pageCount}).`,
  ];
  if (slice.cutFirst) parts.push(`Page ${returned[0]} was cut; raise max_chars to read it whole.`);
  if (slice.nextPages) parts.push(`Call again with pages: "${slice.nextPages}" for the rest.`);
  return parts.join(" ");
}

/** Build the MCP server with the convert_pdf and pdf_info tools (not connected to a transport). */
export function createServer(): McpServer {
  const server = new McpServer({ name: "pdf2md", version: readVersion() });

  server.registerTool(
    "convert_pdf",
    {
      title: "Convert PDF to Markdown",
      description:
        "Convert a PDF to Markdown with headings, tables, code blocks, links and lists preserved. Read large PDFs in slices with `pages`; when output passes max_chars it is cut at a page boundary and `next_pages` says what to request next. Use pdf_info first to get the page count.",
      inputSchema: {
        ...inputShape,
        pages: z
          .union([z.string(), z.array(z.number().int().positive())])
          .optional()
          .describe('Pages to convert: "1-5,9", "-3" (the last 3 pages), or a list of 1-based page numbers. Default: all.'),
        format: z
          .enum(["markdown", "json", "chunks"])
          .optional()
          .describe("markdown (default): the Markdown text. json: per-page Markdown, metadata and stats as structured content. chunks: RAG-ready chunks as structured content."),
        chunk_by: z.enum(["page", "heading", "token"]).optional().describe("How to split for format: chunks (default: heading)"),
        max_chars: z
          .number()
          .int()
          .positive()
          .optional()
          .describe(`Maximum characters of Markdown to return (default ${DEFAULT_MAX_CHARS})`),
        max_pages: z.number().int().positive().optional().describe("Convert at most this many of the selected pages"),
        include_metadata: z.boolean().optional().describe("Include PDF metadata in json/chunks output (default: true)"),
        yaml_front_matter: z.boolean().optional().describe("Prepend YAML front matter with PDF metadata (markdown format)"),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async (args) => {
      const input = await loadInput(args);
      if (!(input instanceof Uint8Array)) return input;

      const format = args.format ?? "markdown";
      const maxChars = args.max_chars ?? DEFAULT_MAX_CHARS;
      const options: ConvertOptions = {
        pages: args.pages,
        maxPages: args.max_pages,
        includeMetadata: args.include_metadata ?? true,
        perPage: true,
        chunkBy: format === "chunks" ? (args.chunk_by ?? "heading") : undefined,
      };
      const result = await convert(input, options);
      if (result.status === "failed") return errorResult(failureText(result));

      const pageCount = result.stats.pageCount;
      const pages = result.pages ?? [];
      const selected = pages.map((p) => p.pageNumber);
      const warnings = result.messages.filter((m) => m.severity === "warning").map((m) => m.message);

      if (selected.length === 0) {
        return {
          content: [{ type: "text", text: `No pages in the selection; the document has ${pageCount} page(s).` }],
          ...(format === "markdown" ? {} : { structuredContent: { pageCount, pages: [], truncated: false } }),
        };
      }

      if (format === "chunks") {
        const slice = sliceChunks(result.chunks ?? [], selected, maxChars);
        const structured = {
          pageCount,
          chunks: slice.included,
          metadata: result.metadata,
          messages: result.messages,
          truncated: slice.nextPages !== undefined || slice.cutFirst,
          ...(slice.nextPages ? { next_pages: slice.nextPages } : {}),
        };
        return { content: [{ type: "text", text: JSON.stringify(structured, null, 2) }], structuredContent: structured };
      }

      const slice = slicePages(pages, maxChars);
      const truncated = slice.nextPages !== undefined || slice.cutFirst;
      const markdown = slice.included.map((p) => p.markdown).filter(Boolean).join("\n\n");

      if (format === "json") {
        const structured = {
          pageCount,
          markdown,
          pages: slice.included,
          metadata: result.metadata,
          stats: result.stats,
          messages: result.messages,
          truncated,
          ...(slice.nextPages ? { next_pages: slice.nextPages } : {}),
        };
        return { content: [{ type: "text", text: JSON.stringify(structured, null, 2) }], structuredContent: structured };
      }

      let text = markdown;
      if (args.yaml_front_matter && result.metadata) {
        const yaml = metadataToYaml(result.metadata);
        if (yaml) text = `${yaml}\n\n${text}`;
      }
      if (warnings.length > 0) text += `\n\n<!-- Warnings: ${warnings.join("; ")} -->`;
      if (truncated) {
        const returned = slice.included.map((p) => p.pageNumber);
        text += `\n\n<!-- ${truncationNote(maxChars, returned, slice, selected.length, pageCount)} -->`;
      }
      return { content: [{ type: "text", text }] };
    },
  );

  server.registerTool(
    "pdf_info",
    {
      title: "PDF info",
      description:
        "Page count, metadata (title, author, producer, PDF version, tagged, encrypted) and which pages have a text layer, without converting. Use it to plan convert_pdf page slices; pages without text are blank or scanned.",
      inputSchema: inputShape,
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async (args) => {
      const input = await loadInput(args);
      if (!(input instanceof Uint8Array)) return input;
      const info = await getPdfInfo(input);
      if (info.status === "failed") {
        return errorResult(`Could not read the PDF:\n${info.messages.map((m) => `[${m.severity}] ${m.message}`).join("\n")}`);
      }
      const withText = new Set(info.pagesWithText);
      const withoutText: number[] = [];
      for (let page = 1; page <= info.pageCount; page++) if (!withText.has(page)) withoutText.push(page);
      const structured = {
        pageCount: info.pageCount,
        isTagged: info.metadata?.isTagged ?? false,
        isEncrypted: info.metadata?.isEncrypted ?? false,
        pagesWithText: toPageRange(info.pagesWithText),
        pagesWithoutText: toPageRange(withoutText),
        metadata: info.metadata,
        messages: info.messages,
      };
      return { content: [{ type: "text", text: JSON.stringify(structured, null, 2) }], structuredContent: structured };
    },
  );

  return server;
}
