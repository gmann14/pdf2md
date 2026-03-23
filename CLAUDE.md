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
    lib/           — Core logic (converter.ts, types.ts, pdf-worker.ts)
packages/core/     — (Phase 1.5) Extracted npm package
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

The conversion pipeline (in `apps/web/src/lib/converter.ts`):
1. Parse PDF via PDF.js Web Worker
2. Extract text items with position/font metadata per page
3. Extract link annotations per page
4. Detect and strip repeated headers/footers
5. Build font size histogram → detect headings (H1-H6)
6. Group text into blocks by vertical proximity
7. Classify blocks: heading, list-item, or paragraph
8. Match link annotations to text items by bounding box overlap
9. Apply bold/italic from font name heuristics
10. Assemble Markdown output with proper formatting

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
- `apps/web/src/lib/converter.ts` — Core conversion pipeline
- `apps/web/src/lib/types.ts` — Shared types (ConversionResult, etc.)

## Conventions

- All PDF processing happens client-side via dynamic import
- No server-side file handling in MVP (Phases 1-3)
- Test with diverse PDFs: simple report, academic paper, resume, invoice, code docs
- Privacy-first: no file uploads, minimal analytics (Plausible)
- Conversion errors use stable machine-readable codes (see `ConversionCode` type)
