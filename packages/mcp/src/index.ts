#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { convert } from "@pdf2md/core";
import { MAX_FILE_SIZE } from "@pdf2md/core";

const server = new McpServer({
  name: "pdf2md",
  version: "0.1.0",
});

server.tool(
  "convert_pdf",
  "Convert a PDF file to Markdown. Returns clean, structured Markdown with headings, tables, code blocks, links, and lists preserved.",
  {
    file_path: z
      .string()
      .describe("Absolute or relative path to the PDF file to convert"),
    max_pages: z
      .number()
      .optional()
      .describe("Maximum number of pages to convert"),
    include_metadata: z
      .boolean()
      .optional()
      .describe("Include PDF metadata (title, author, etc.) in the output"),
    yaml_front_matter: z
      .boolean()
      .optional()
      .describe("Prepend YAML front matter with PDF metadata"),
  },
  async ({ file_path, max_pages, include_metadata, yaml_front_matter }) => {
    const absolutePath = resolve(file_path);

    let buffer: ArrayBuffer;
    try {
      const nodeBuffer = await readFile(absolutePath);

      if (nodeBuffer.byteLength > MAX_FILE_SIZE) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `File too large: ${(nodeBuffer.byteLength / 1024 / 1024).toFixed(1)}MB exceeds the 15MB limit.`,
            },
          ],
        };
      }

      buffer = nodeBuffer.buffer.slice(
        nodeBuffer.byteOffset,
        nodeBuffer.byteOffset + nodeBuffer.byteLength,
      );
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Error reading file: ${err instanceof Error ? err.message : "Unknown error"}`,
          },
        ],
      };
    }

    try {
      const result = await convert(buffer, {
        maxPages: max_pages,
        includeMetadata: include_metadata ?? true,
        yamlFrontMatter: yaml_front_matter,
      });

      if (result.status === "failed") {
        const errors = result.messages
          .map((m) => `[${m.severity}] ${m.message}`)
          .join("\n");
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Conversion failed:\n${errors}` }],
        };
      }

      const warnings = result.messages
        .filter((m) => m.severity === "warning")
        .map((m) => m.message);

      let text = result.markdown;

      if (warnings.length > 0) {
        text += `\n\n<!-- Warnings: ${warnings.join("; ")} -->`;
      }

      return {
        content: [{ type: "text" as const, text }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Conversion error: ${err instanceof Error ? err.message : "Unknown error"}`,
          },
        ],
      };
    }
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
