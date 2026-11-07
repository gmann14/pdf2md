// Bench child (plain Node, no tsx): converts one PDF `runs` times with the built
// @pdf2md/core (packages/core/dist) and prints one BENCH_RESULT line for bench/run.ts.
// Plain Node, because tsx compiles PDF.js on load and inflates cold time and RSS.
// Usage: node --require ./test-corpus/node-polyfills.cjs bench/child.mjs <pdf> <runs>

import { readFile } from "node:fs/promises";

const [path, runsArg = "1"] = process.argv.slice(2);
if (!path) {
  console.error("usage: child.mjs <pdf> <runs>");
  process.exit(2);
}
const runs = Number(runsArg);

let core;
try {
  core = await import(new URL("../packages/core/dist/index.js", import.meta.url).href);
} catch (err) {
  console.error(`Cannot load packages/core/dist (run \`pnpm --filter @pdf2md/core build\`): ${err?.message ?? err}`);
  process.exit(3);
}

await core.initPdfWorker();
const bytes = new Uint8Array(await readFile(path));
const timesMs = [];
let status = "unknown";
let pageCount = 0;
for (let i = 0; i < runs; i++) {
  const copy = bytes.slice(); // PDF.js may detach the buffer it is given
  const start = performance.now();
  const result = await core.convert(copy.buffer, { includeMetadata: true, yamlFrontMatter: true });
  timesMs.push(performance.now() - start);
  status = result?.status ?? "unknown";
  pageCount = result?.stats?.pageCount ?? 0;
}
process.stdout.write(`\nBENCH_RESULT ${JSON.stringify({ status, pageCount, timesMs, maxRssKb: process.resourceUsage().maxRSS })}\n`);
