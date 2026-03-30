# PDF2MD — Tasks

> Source of truth for project status. Updated after every work session.
> Last updated: 2026-03-30

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
- [x] **P1: Code block detection enhancement** — DONE 2026-03-27. Subset font behavior analysis (indentation + line width heuristics)
- [x] **P2: Link annotation matching fix** — DONE 2026-03-27. Stricter link annotation matching to prevent spurious links on prose
- [x] **P3: Heading detection refinement** — DONE 2026-03-27. Multi-signal: bold lines, section numbers ("1.1" and "1 Introduction" styles)
- [x] **Quality polish round** — DONE 2026-03-30. Five fixes:
  - Prose guard in code block detection (eliminated false code blocks on Berkshire letter, IEEE paper)
  - Table detection guard for 2-column prose (eliminated false tables on RL survey)
  - ALL_CAPS heading detection + font size threshold lowered to 1.10x
  - Text cleanup: ligatures, special spaces, zero-width chars
  - Fallback metadata title extraction from first heading when PDF metadata is empty
  - Results: 8.3→8.4/10 avg, metadataExtraction 5.0→8.0/10, headingDetection 8.4→8.4/10 (same score but much cleaner output)
- [x] **Quality round 2** — DONE 2026-03-30. Four improvements + expanded corpus:
  - Font-pair emphasis detection for bold headings in subset-font PDFs (Berkshire headings 4→9)
  - Roman numeral section headers (I., II., III.) detected as headings (RL survey headings 4→8)
  - Bare URL auto-linking in markdown output
  - Min 8-char code block threshold (eliminates isolated math symbols)
  - Expanded test corpus: 21→28 PDFs (legal contract, census tables, infographic, landscape Gantt, footnote-heavy academic, CJK Chinese, filled form)
  - Improved scoring: penalizes false code blocks, adjusted expectations for new categories
  - Key improvements: Berkshire 7.8→8.5, RL survey 7.7→8.0, legal contract 8.2→9.0, scanned declaration 7.6→8.4
- [x] **Quality round 3** — DONE 2026-03-30. Text cleanup + scoring refinements:
  - Bug fix: emphasisFonts not passed to final classifyBlock call (last block of every doc missed emphasis heading detection)
  - Moved cleanText() to detection.ts as exported function (testable)
  - Enhanced cleanText: Windows-1252 C1 control char mapping (quotes, dashes, ellipsis), C0/C1 control char stripping
  - Split ligature repair: "h tt ps"→"https", "di ff"→"diff", "commi tt ed"→"committed", etc. (kerned PDFs)
  - Fixed noGarbage scoring: exclude markdown links from "long word" check, exclude table separators/spaces from "repeated char" check, added Greek/CJK as acceptable Unicode ranges
  - 8 new tests for cleanText (ligatures, control chars, special spaces, zero-width chars)
  - Results: **8.4→8.9/10 avg** (+0.5). noGarbage 6.8→9.9, IEEE paper 8.3→9.6, census 8.3→9.6, slides 8.0→9.0, form 7.4→8.4

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
- 15 git commits (latest: heading detection + code block detection improvements)
- **npm package:** `@pdf2md/core@0.1.0` published (npmjs.com/package/@pdf2md/core)
- Build works (static export)
- **Production URL:** https://pdf2md-five.vercel.app
- Vercel project: `prj_78nJRUrC3YGVgBbkjhLoqgeX6LUi` (root: `apps/web`)
- Test corpus: `test-corpus/` — 28 real-world PDFs, evaluation script, quality report
  - Overall quality: **8.9/10** automated (28/28 PDFs pass, 64 unit tests)
  - Quality round 3 landed Mar 30 (text cleanup, ligature repair, scoring fixes)
  - Remaining weak dimensions: linkExtraction (7.3, many PDFs lack link annotations), listDetection (8.0), metadataExtraction (7.9)
  - See `test-corpus/QUALITY-REPORT.md` for full analysis

## Blockers
- No critical blockers. Ready for launch activities.
- Remaining quality gaps (column interleaving on cheatsheets/forms, CJK spacing) are PDF.js limitations or inherently hard layout problems.
