#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main(): Promise<void> {
  await createServer().connect(new StdioServerTransport());
}

main().catch((err: unknown) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
