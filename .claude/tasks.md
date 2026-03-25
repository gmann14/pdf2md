# PDF2MD — Tasks

> Source of truth for project status. Updated after every work session.
> Last updated: 2026-03-24

## Phase 1: Client-Side MVP ✅ COMPLETE
- [x] Initialize Next.js + TypeScript + Tailwind project (monorepo with pnpm)
- [x] PDF.js with Web Worker (dynamic import for SSG compatibility)
- [x] Core conversion pipeline (`apps/web/src/lib/converter.ts`):
  - [x] Parse PDF via PDF.js Web Worker
  - [x] Extract text items with position/font metadata
  - [x] Extract link annotations per page
  - [x] Detect and strip repeated headers/footers
  - [x] Font size histogram → heading detection (H1-H6)
  - [x] Group text into blocks by vertical proximity
  - [x] Classify blocks: heading, list-item, paragraph
  - [x] Match link annotations by bounding box overlap
  - [x] Bold/italic from font name heuristics
  - [x] Assemble Markdown output
- [x] UI components: Converter, DropZone, ErrorDisplay, OutputPane, ProgressBar
- [x] Unit tests for converter
- [x] Build passes (static export)
- [x] Failure states: oversized, password-protected, corrupt, no-text/scanned (in converter.ts + ErrorDisplay)
- [x] Copy to clipboard, "Copy for AI", download .md buttons (OutputPane)
- [x] Mobile support (responsive padding, stacked buttons, overflow-x-auto)
- [x] Accessibility baseline (aria-live, role=alert/status, aria-labels, focus management)
- [x] Deploy to Vercel — **LIVE at https://pdf2md-five.vercel.app**
- [ ] Plausible analytics + Sentry error tracking
- [ ] Build 12-PDF test corpus and evaluate quality

## Phase 1.5: Extract npm Package ✅ DONE (2026-03-24)
- [x] Extract conversion pipeline to `packages/core/`
- [x] Clean public API: `convert(pdfBuffer, options) => Promise<ConversionResult>`
- [x] CLI wrapper: `npx @pdf2md/core file.pdf` (bin entry needs fix — npm stripped invalid script name)
- [x] Website imports from `@pdf2md/core` via workspace protocol
- [x] Subpath export `@pdf2md/core/types` for SSG-safe imports
- [ ] Publish to npm — **needs OTP, package validated and ready**

## Phase 2: Quality + Differentiation — not started
- [ ] Limited table detection
- [ ] Tagged PDF fast path
- [ ] Code block detection (monospace)
- [ ] Multi-file drop (up to 5)
- [ ] Metadata extraction → YAML front matter
- [ ] Comparison view: original vs Markdown

## Phase 3: SEO & Launch — not started
- [ ] SEO: meta tags, schema markup, OG image
- [ ] "How to Convert PDF to Markdown" content below fold
- [ ] Privacy policy page
- [ ] Open-source repo with good README + MIT license
- [ ] Launch: HN, Reddit, Product Hunt

## Infra / Config
- GitHub: `gmann14/pdf2md`
- Stack: Next.js 15, TypeScript, Tailwind, PDF.js v5, pnpm monorepo
- 5 git commits (latest: 34f83c7 feat: extract PDF conversion engine into @pdf2md/core package)
- Build works (static export)
- **Production URL:** https://pdf2md-five.vercel.app
- Vercel project: `prj_78nJRUrC3YGVgBbkjhLoqgeX6LUi` (root: `apps/web`)
- Test corpus: `test-corpus/` directory with sample PDFs + screenshot

## Blockers
- None — Phase 1 completion is just frontend polish work
