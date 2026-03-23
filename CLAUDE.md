# pdf2md

## What is this?

A free, client-side PDF-to-Markdown converter web app. SEO play targeting "pdf to markdown" keyword. Also useful for our own AI/LLM workflows.

## Stack

- Next.js (SSG for SEO, client-side for conversion)
- TypeScript (strict)
- Tailwind CSS
- PDF.js (runs in Web Worker, client-side only)
- Deployed on Vercel (free tier)

## Key Decisions

- **Next.js over Vite** — SSR/SSG is critical for SEO. The conversion runs client-side regardless.
- **No backend for MVP** — Everything runs in the browser. Files never leave the client.
- **15MB file limit** — PDF.js uses 5-10x file size in RAM. 15MB keeps peak memory under ~150MB.
- **MIT license** — Maximum adoption for open-source credibility and backlinks.

## Architecture

The conversion pipeline:
1. Parse PDF via PDF.js Web Worker
2. Extract text items with position/font metadata
3. Build font size histogram → detect headings
4. Group text into paragraphs by vertical proximity
5. Detect lists from bullet/number patterns
6. Extract links via getAnnotations()
7. Strip repeated headers/footers
8. Apply bold/italic from font name heuristics
9. Assemble Markdown output

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run test     # Run tests
npm run lint     # Lint check
```

## Important Files

- `docs/spec.md` — Full product spec
- `research/` — Competitor analysis, tech research, stress test findings

## Conventions

- All PDF processing happens client-side in a Web Worker
- No server-side file handling in MVP (Phases 1-3)
- Test with diverse PDFs: simple report, academic paper, resume, invoice, code docs
- Privacy-first: no file uploads, minimal analytics (Plausible)
