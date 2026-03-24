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

const buffer = await readFile("document.pdf");
const result = await convert(buffer.buffer);

console.log(result.markdown);
console.log(result.stats); // { pageCount, wordCount, processingMs }
```

### Options

```ts
const result = await convert(buffer.buffer, {
  maxPages: 10,           // Limit number of pages to convert
  includeMetadata: true,  // Extract title, author, etc.
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
  metadata?: { title?: string; author?: string; subject?: string; keywords?: string[]; creationDate?: string };
}
```

## CLI Usage

```sh
npx @pdf2md/core document.pdf > output.md
```

Prints Markdown to stdout. Warnings and errors go to stderr.

## Conversion Pipeline

1. Parse PDF via PDF.js
2. Extract text items with position/font metadata
3. Extract link annotations
4. Detect and strip repeated headers/footers
5. Build font size histogram for heading detection (H1-H6)
6. Group text into blocks by vertical proximity
7. Classify blocks: heading, list-item, or paragraph
8. Match link annotations to text by bounding box overlap
9. Apply bold/italic from font name heuristics
10. Assemble Markdown output

## Limits

- 15 MB maximum file size
- No OCR support (scanned/image-based PDFs return an error)
- Password-protected PDFs are not supported

## License

MIT
