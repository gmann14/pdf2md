# pdf2md

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@pdf2md/core)](https://www.npmjs.com/package/@pdf2md/core)

Free, fast PDF to Markdown converter. Runs entirely client-side — files never leave your browser.

**Live at [pdf2md-five.vercel.app](https://pdf2md-five.vercel.app)**

## Features

- **Heading detection** (H1–H6) from font size analysis
- **Table detection** for grid-aligned and bordered tables
- **Code block detection** from monospace font regions
- **List preservation** — bullets, numbered lists, indentation
- **Link extraction** from PDF annotations
- **Bold and italic** from font name heuristics
- **Header/footer stripping** via repeated text detection
- **Metadata extraction** — title, author, dates as YAML front matter
- **Multi-file support** — drop up to 5 PDFs at once
- **100% client-side** — no uploads, no accounts, no tracking

## Quick Start

### Web App

Visit [pdf2md-five.vercel.app](https://pdf2md-five.vercel.app), drop a PDF, and get Markdown.

### npm Package

```bash
npm install @pdf2md/core
```

```typescript
import { convert } from "@pdf2md/core";
import { readFile } from "node:fs/promises";

const buffer = await readFile("document.pdf");
const result = await convert(buffer.buffer);

console.log(result.markdown);
console.log(result.stats); // { pageCount, wordCount, processingMs }
```

### CLI

```bash
npx @pdf2md/core document.pdf > output.md
```

## API Reference

### `convert(pdfBuffer, options?)`

Converts a PDF buffer to Markdown.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `pdfBuffer` | `ArrayBuffer` | The PDF file contents |
| `options.maxPages` | `number` | Limit number of pages to convert |
| `options.includeMetadata` | `boolean` | Extract title, author, etc. |
| `options.signal` | `AbortSignal` | Cancel in-progress conversion |
| `options.onProgress` | `function` | Progress callback |

**Returns:** `Promise<ConversionResult>`

```typescript
interface ConversionResult {
  status: "success" | "partial" | "failed";
  markdown: string;
  messages: ConversionMessage[];
  stats: {
    pageCount: number;
    wordCount: number;
    processingMs: number;
  };
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creationDate?: string;
  };
}
```

### Options Example

```typescript
const controller = new AbortController();

const result = await convert(pdfBuffer, {
  maxPages: 10,
  includeMetadata: true,
  signal: controller.signal,
  onProgress: ({ stage, currentPage, totalPages }) => {
    console.log(`${stage}: ${currentPage}/${totalPages}`);
  },
});
```

## Project Structure

```
apps/web/          — Next.js web app (SSG for SEO, client-side conversion)
packages/core/     — @pdf2md/core npm package (conversion engine + CLI)
docs/              — Product spec, launch plan
research/          — Competitor analysis, tech research
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm

### Setup

```bash
git clone https://github.com/gmann14/pdf2md.git
cd pdf2md
pnpm install
```

### Commands

```bash
pnpm dev           # Development server
pnpm build         # Production build (packages + web app)
pnpm test          # Run all tests
pnpm lint          # Lint check
pnpm typecheck     # TypeScript type check
```

## Tech Stack

- [Next.js 15](https://nextjs.org/) — SSG for SEO, client-side conversion
- [PDF.js v5](https://mozilla.github.io/pdf.js/) — PDF parsing in Web Workers
- [TypeScript](https://www.typescriptlang.org/) — Strict mode
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [Vitest](https://vitest.dev/) — Testing
- [pnpm workspaces](https://pnpm.io/workspaces) — Monorepo

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](LICENSE)
