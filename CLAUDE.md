# pdf2md

## What is this?

A free, client-side PDF-to-Markdown converter web app. SEO play targeting "pdf to markdown" keyword. Also useful for our own AI/LLM workflows.

## Stack

- Next.js 15 (SSG for SEO, client-side for conversion)
- TypeScript (strict)
- Tailwind CSS v4
- PDF.js v5 (runs in Web Worker, client-side only)
- pnpm workspaces monorepo
- Vitest for testing
- Deployed on Vercel (free tier)

## Project Structure

```
apps/web/          — Next.js web app
  src/
    app/           — Next.js App Router pages
    components/    — React components (Converter, DropZone, OutputPane, etc.)
    lib/           — Thin wrappers; core logic lives in packages/core
packages/core/     — @pdf2md/core npm package (published v0.2.0)
  src/
    converter.ts   — Main conversion pipeline
    detection.ts   — Table, code block, column layout detection
    types.ts       — Shared types + constants
    pdf-compat.ts  — Node.js/browser PDF.js loader (legacy build for Node)
    pdf-worker.ts  — PDF.js worker initialization
    bin/pdf2md.ts  — CLI entry point
packages/mcp/      — @pdf2md/mcp MCP server (published v0.1.0)
  src/
    index.ts       — MCP server exposing convert_pdf tool
  bin/
    pdf2md-mcp.js  — CLI entry point
test-corpus/       — 28 real-world PDFs + evaluation framework + quality report
docs/              — Product spec, launch plan
research/          — Competitor analysis, tech research, stress test
```

## Key Decisions

- **Next.js over Vite** — SSR/SSG is critical for SEO. The conversion runs client-side regardless.
- **No backend for MVP** — Everything runs in the browser. Files never leave the client.
- **15MB file limit** — PDF.js uses 5-10x file size in RAM. 15MB keeps peak memory under ~150MB.
- **MIT license** — Maximum adoption for open-source credibility and backlinks.
- **Dynamic import for converter** — pdfjs-dist uses DOMMatrix, so converter.ts must be dynamically imported in client components to avoid SSG errors.

## Architecture

The conversion pipeline (in `packages/core/src/converter.ts` + `detection.ts`):
1. Parse PDF via PDF.js Web Worker
2. Extract text items with position/font metadata per page
3. Extract link annotations per page (coordinate-transformed)
4. Detect and strip repeated headers/footers (50% threshold)
5. Detect and fix multi-column reading order (per-page gap analysis)
6. Build font size histogram → detect headings (H1-H6)
7. Detect code fonts via subset font behavior analysis
8. Group text into blocks by vertical proximity
9. Classify blocks: heading (font size + bold + section numbers), list-item, paragraph
10. Post-process: detect tables (column alignment) and code blocks (monospace + subset fonts)
11. Match link annotations to text items (center-point + 50% overlap)
12. Apply bold/italic from font name heuristics
13. Assemble Markdown output with proper formatting
14. Optionally prepend YAML front matter from PDF metadata

Returns `ConversionResult` with status, markdown, messages (errors/warnings), stats, and optional metadata.

## Commands

```bash
pnpm dev           # Development server
pnpm build         # Production build (static export)
pnpm test          # Run vitest tests
pnpm lint          # Lint check
pnpm typecheck     # TypeScript type check
```

## Important Files

- `docs/spec.md` — Full product spec (source of truth)
- `docs/launch-plan.md` — Marketing and growth strategy
- `research/` — Competitor analysis, tech research, stress test findings
- `packages/core/src/converter.ts` — Core conversion pipeline
- `packages/core/src/detection.ts` — Table, code block, column detection algorithms
- `packages/core/src/types.ts` — Shared types (ConversionResult, etc.)
- `test-corpus/QUALITY-REPORT.md` — Quality scores across 28 real-world PDFs
- `.claude/tasks.md` — Project status tracker

## Conventions

- All PDF processing happens client-side via dynamic import
- No server-side file handling in MVP (Phases 1-3)
- Test with diverse PDFs: simple report, academic paper, resume, invoice, code docs
- Privacy-first: no file uploads, minimal analytics (Plausible)
- Conversion errors use stable machine-readable codes (see `ConversionCode` type)
