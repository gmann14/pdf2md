#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { convert } from "../converter.js";
import type { ConvertOptions } from "../types.js";

function printUsage(): void {
  console.error(
    [
      "Usage: pdf2md [options] <file.pdf>",
      "",
      "Options:",
      "  --output markdown|json       Print Markdown (default) or a JSON conversion result",
      "  --chunk-by page|heading|token Split JSON output into chunks",
      "  --max-tokens <count>          Approximate token budget for --chunk-by token",
      "  -h, --help                    Show this help",
    ].join("\n"),
  );
}

function parseArgs(argv: string[]): { filePath: string; options: ConvertOptions } {
  const options: ConvertOptions = { includeMetadata: true };
  let filePath: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "-h" || arg === "--help") {
      printUsage();
      process.exit(0);
    }

    if (arg === "--output") {
      const value = argv[++i];
      if (value !== "markdown" && value !== "json") {
        throw new Error("--output must be either 'markdown' or 'json'");
      }
      options.outputFormat = value;
      continue;
    }

    if (arg === "--chunk-by") {
      const value = argv[++i];
      if (value !== "page" && value !== "heading" && value !== "token") {
        throw new Error("--chunk-by must be one of: page, heading, token");
      }
      options.chunkBy = value;
      continue;
    }

    if (arg === "--max-tokens") {
      const value = Number(argv[++i]);
      if (!Number.isInteger(value) || value <= 0) {
        throw new Error("--max-tokens must be a positive integer");
      }
      options.maxTokensPerChunk = value;
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    if (filePath) {
      throw new Error("Only one PDF file can be converted at a time");
    }
    filePath = arg;
  }

  if (!filePath) {
    throw new Error("Missing PDF file path");
  }

  if (options.chunkBy && options.outputFormat !== "json") {
    options.outputFormat = "json";
  }

  return { filePath, options };
}

async function main(): Promise<void> {
  let parsed: { filePath: string; options: ConvertOptions };
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : "Invalid arguments");
    printUsage();
    process.exit(1);
  }

  const absolutePath = resolve(parsed.filePath);

  let buffer: ArrayBuffer;
  try {
    const nodeBuffer = await readFile(absolutePath);
    buffer = nodeBuffer.buffer.slice(
      nodeBuffer.byteOffset,
      nodeBuffer.byteOffset + nodeBuffer.byteLength,
    );
  } catch (err) {
    console.error(
      `Error reading file: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
    process.exit(1);
  }

  const result = await convert(buffer, parsed.options);

  if (result.status === "failed") {
    for (const msg of result.messages) {
      console.error(`[${msg.severity}] ${msg.message}`);
    }
    process.exit(1);
  }

  if (result.messages.length > 0) {
    for (const msg of result.messages) {
      console.error(`[${msg.severity}] ${msg.message}`);
    }
  }

  if (parsed.options.outputFormat === "json") {
    process.stdout.write(JSON.stringify(result, null, 2));
  } else {
    process.stdout.write(result.markdown);
  }
}

main();
