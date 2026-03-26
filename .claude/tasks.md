# PDF2MD — Tasks

> Source of truth for project status. Updated after every work session.
> Last updated: 2026-03-26

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
- [x] Build 21-PDF real-world test corpus and quality evaluation framework (see `test-corpus/QUALITY-REPORT.md`)

## Phase 1.5: Extract npm Package ✅ DONE (2026-03-24)
- [x] Extract conversion pipeline to `packages/core/`
- [x] Clean public API: `convert(pdfBuffer, options) => Promise<ConversionResult>`
- [x] CLI wrapper: `npx @pdf2md/core file.pdf` (bin entry needs fix — npm stripped invalid script name)
- [x] Website imports from `@pdf2md/core` via workspace protocol
- [x] Subpath export `@pdf2md/core/types` for SSG-safe imports
- [x] Publish to npm — **PUBLISHED** `@pdf2md/core@0.1.0` (Mar 25, 2026)

## Phase 2: Quality + Differentiation — IN PROGRESS
- [x] Limited table detection (column alignment analysis → markdown tables)
- [ ] Tagged PDF fast path
- [x] Code block detection (monospace font → triple backtick fences)
- [x] Multi-file drop (up to 5 PDFs, sequential conversion, tabbed output)
- [x] Metadata extraction → YAML front matter (`yamlFrontMatter` option)
- [ ] Comparison view: original vs Markdown
- [x] **P0: Multi-column detection** — DONE 2026-03-26. Per-line gap analysis detects 2-column layouts automatically. Multi-column PDFs: 5.0-6.0 → 7.3-8.7/10 (+2.0-2.7 pts). Single-column unaffected.
- [ ] **P1: Code block detection enhancement** — font subset stripping + indentation heuristics
- [ ] **P2: Link annotation matching fix** — center-point matching to prevent misattribution
- [ ] **P3: Heading detection refinement** — bold + section numbering as heading indicators

## Phase 3: SEO & Launch — IN PROGRESS
- [x] SEO: meta tags, schema markup, OG image (layout.tsx + og-image.png + JSON-LD)
- [x] "How to Convert PDF to Markdown" content below fold (~700 words)
- [x] Privacy policy page (`/privacy`)
- [x] Open-source repo with README.md, CONTRIBUTING.md, LICENSE (MIT)
- [x] Footer with privacy/github/npm links
- [ ] Google Search Console setup
- [ ] Launch: HN, Reddit, Product Hunt

## Infra / Config
- GitHub: `gmann14/pdf2md`
- Stack: Next.js 15, TypeScript, Tailwind, PDF.js v5, pnpm monorepo
- 8 git commits (latest: Phase 2 quality improvements)
- **npm package:** `@pdf2md/core@0.1.0` published (npmjs.com/package/@pdf2md/core)
- Build works (static export)
- **Production URL:** https://pdf2md-five.vercel.app
- Vercel project: `prj_78nJRUrC3YGVgBbkjhLoqgeX6LUi` (root: `apps/web`)
- Test corpus: `test-corpus/` — 21 real-world PDFs, evaluation script, quality report
  - Overall quality: 8.0/10 automated, ~6.5/10 manual honest assessment
  - Top issue: multi-column text interleaving (affects 6+ PDFs)
  - See `test-corpus/QUALITY-REPORT.md` for full analysis

## Blockers
- **Multi-column layout** is the #1 quality gap vs competitors (Marker, MinerU). Should be addressed before launch if targeting academic/scientific users.
- Otherwise ready for launch activities.
