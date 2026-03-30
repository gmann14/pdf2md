#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { convert } from "../converter.js";

async function main(): Promise<void> {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Usage: pdf2md <file.pdf>");
    process.exit(1);
  }

  const absolutePath = resolve(filePath);

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

  const result = await convert(buffer, { includeMetadata: true });

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

  process.stdout.write(result.markdown);
}

main();
