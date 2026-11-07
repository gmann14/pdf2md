# @pdf2md/core

Convert PDF files to Markdown. Runs client-side in the browser or in Node.js.

## Install

```sh
npm install @pdf2md/core
```

## Library Usage

```ts
import { convert } from "@pdf2md/core";
import { readFile } from "node:fs/promises";

const buffer = await readFile("document.pdf"); // a Node Buffer works as-is
const result = await convert(buffer);

console.log(result.markdown);
console.log(result.stats); // { pageCount, wordCount, processingMs }
```

`convert()` accepts an `ArrayBuffer` or any `Uint8Array` (including a Node `Buffer`).
It copies the bytes before handing them to PDF.js, so your buffer is never detached.

CommonJS works too:

```js
const { convert } = require("@pdf2md/core");
```

### Options

```ts
const result = await convert(buffer, {
  maxPages: 10,           // Limit number of pages to convert
  pages: [1, 2, 5],       // Or { offset: -3 } for the last 3 pages, { offset: 10, length: 5 }
  perPage: true,          // Add result.pages: [{ pageNumber, markdown }]
  pageMarkers: "comment", // Put <!-- page N --> before each page ("none" by default)
  includeMetadata: true,  // Extract title, author, etc.
  outputFormat: "json",   // Include structured sections
  chunkBy: "heading",     // Optional: "page", "heading", or "token"
  maxTokensPerChunk: 800, // Used with chunkBy: "token"
  emphasis: false,        // Skip inline **bold**/*italic* (on by default; off is faster)
  signal: controller.signal, // AbortSignal for cancellation
  onProgress: (progress) => {
    console.log(`${progress.stage}: page ${progress.currentPage}/${progress.totalPages}`);
  },
});
```

### Result

```ts
interface ConversionResult {
  status: "success" | "partial" | "failed";
  markdown: string;
  messages: ConversionMessage[];  // Errors and warnings
  stats: { pageCount: number; wordCount: number; processingMs: number };
  metadata?: ConversionMetadata;  // With includeMetadata: title, author, producer, pdfVersion, isTagged, …
  structured?: { sections: StructuredSection[] };
  chunks?: ConversionChunk[];
  pages?: { pageNumber: number; markdown: string }[]; // With perPage
}
```

### Page selection

`pages` takes 1-based page numbers, or a 0-based `offset` (negative counts from
the end) with an optional `length`. Pages out of range are skipped and duplicates
dropped; a selection with no page in range returns an empty `success` result.
Up to 10 neighbouring pages are read (not output) so running headers and
heading sizes are still detected on a one-page read. With `perPage`, joining the
non-empty `result.pages[].markdown` with a blank line gives `result.markdown`.

## CLI Usage

```sh
npx @pdf2md/core document.pdf > output.md
npx @pdf2md/core --output json --chunk-by heading document.pdf > output.json
npx @pdf2md/core --output json --chunk-by token --max-tokens 800 document.pdf > chunks.json
```

Prints Markdown to stdout by default. JSON mode prints the full conversion
result, including `markdown`, `structured.sections`, and optional `chunks`.
Warnings and errors go to stderr.

## Conversion Pipeline

1. Parse PDF via PDF.js (Web Worker in browser, legacy build in Node.js)
2. Extract text items with position/font metadata per page
3. Extract link annotations per page
4. Detect and strip repeated headers/footers
5. Detect and fix multi-column reading order (per-page gap analysis)
6. Build font size histogram → heading detection (H1-H6)
7. Detect code fonts via subset font behavior analysis
8. Group text into blocks by vertical proximity
9. Classify blocks: heading (font size + bold + section numbers + ALL CAPS), list-item, paragraph
10. Detect tables (column alignment) and code blocks (monospace + syntax patterns)
11. Match link annotations to text by bounding box overlap
12. Apply bold/italic from font name heuristics
13. Text cleanup: ligature repair, control chars, special spaces
14. Assemble Markdown output with proper formatting

## Limits

- 15 MB maximum file size
- No OCR support (scanned/image-based PDFs return an error)
- Password-protected PDFs are not supported

## License

MIT
