# PDF-to-Markdown Converter — Product Spec

*Draft: 2026-03-22 · Revised: 2026-03-23 (stress-tested, research-grounded)*
*Status: Ready to Build*

---

## Overview

A free, fast web tool that converts PDF files to clean Markdown. Entirely client-side — files never leave the browser. Deployed as a single-purpose SEO-optimized website. No signup required.

**Also useful for us:** Quick PDF-to-Markdown for feeding docs into Claude/LLM workflows. The tool we'd actually use daily.

**Working name:** pdf2md.dev (alternatives: pdftomarkdown.com, pdf-to-md.com — check availability)

---

## Problem

People working with AI tools, documentation systems, and static site generators constantly need to convert PDFs to Markdown. Current options:

- **pdf2md.morethan.io** — #1 on Google, but abandoned (last real update: 2021), React 15, basic text extraction only, no tables/images/OCR
- **Paid services** (Zamzar, CloudConvert, lightpdf) — usage limits, upsells
- **AI-powered tools** (notegpt.io, pdf.ai, deeppdf.ai) — gated or limited free tier
- **CLI tools** (marker, Docling) — require installation, not accessible to non-developers

The #1 result ranks purely on age (9 years) and backlinks (1,561 GitHub stars), not quality. A modern, well-designed tool with actual content strategy can take that spot.

---

## Target Users

1. **Developers feeding docs into AI/LLM workflows** — our primary use case
2. **Technical writers** converting legacy docs to Markdown
3. **Students** converting textbook PDFs to study notes
4. **Anyone who Googles "pdf to markdown"** — the SEO play

---

## Competitive Analysis

### Why pdf2md.morethan.io Ranks #1

It's **not** because morethan.io has high domain authority. It's a solo developer's personal domain (Johannes Zillmann) with a handful of hobby projects.

**What it has:**
- 9 years of age (live since May 2017)
- 1,561 GitHub stars → thousands of indirect backlinks
- First-mover advantage — was THE free tool for years
- Listed on developer tool directories, blog roundups, StackOverflow answers

**What it doesn't have:**
- Any content strategy (zero blog posts, no supporting pages)
- Modern tech (React 15, Webpack, Bootstrap 3)
- Table support, image extraction, OCR, or any ML
- Active maintenance (abandoned since 2021)
- Mobile responsiveness

**Our edge:** Better tool + content strategy + modern UX + privacy messaging. Realistic timeline to #1: 6-12 months with consistent effort.

### Other Competitors

| Tool | Type | Strength | Weakness |
|------|------|----------|----------|
| craftmarkdown.com | Free, client-side | Multi-format, privacy branding | Newer, less authority |
| blazedocs.io | Paid SaaS ($8/mo) | AI-powered, blog content | Paywall |
| notegpt.io | Freemium | AI features, summaries | Gated |
| deeppdf.ai | Free | AI-powered | No content strategy |
| marker (GitHub) | CLI tool | Best accuracy | Not a web tool |

---

## Core Features

### MVP (Phase 1) — Ship in a Weekend

Scope is deliberately tight. Match pdf2md.morethan.io's functionality with better UX, then iterate.

1. **Upload & Convert**
   - Drag-and-drop or file picker for PDF upload
   - Max file size: **15MB** (realistic for client-side; larger files cause browser memory issues)
   - Processing entirely client-side (files never leave the browser)
   - Progress indicator for multi-page PDFs

2. **Text Extraction + Basic Structure**
   - Clean text extraction with proper paragraph grouping
   - **Heading detection** (H1-H6) from font size histogram analysis
   - **List detection** (bullets and numbered) from text patterns + indentation
   - **Bold/italic** detection from font name heuristics (covers ~80% of cases)
   - **Link extraction** via `getAnnotations()` API matched to text positions
   - Page number / header / footer stripping via repeated-text detection

3. **Output**
   - Copy Markdown to clipboard (one-click)
   - Download as `.md` file
   - Side-by-side view: Markdown source | rendered preview
   - Stats: page count, word count

4. **NOT in MVP** (deferred to Phase 2+)
   - ~~Table detection~~ (multi-week problem, not weekend-scoped)
   - ~~Image extraction~~ (complex client-side, memory-heavy)
   - ~~Code block detection~~ (monospace font detection is unreliable)
   - ~~OCR~~ (requires server-side processing)

### Phase 2 — Polish + Differentiation (Week 2-3)

5. **Table detection** — Position-based clustering for borderless tables + `getOperatorList()` line detection for bordered tables. Accept ~50% quality; still better than competitors.
6. **Code block detection** — Best-effort monospace font detection
7. **Tagged PDF fast path** — If PDF has structure tree (`getStructTree()`), use it for semantic-accurate conversion. Covers ~10-15% of PDFs with much higher quality.
8. **"Copy for AI" button** — Copies markdown with a context prefix ("The following was extracted from a PDF:"). Small but valuable for our target audience.
9. **Multi-file drop** — Drop up to 5 PDFs, get a zip of `.md` files
10. **Metadata extraction** — Title, author, date from PDF metadata → YAML front matter

### Phase 3 — SEO & Launch

11. SEO implementation (meta tags, schema markup, below-fold content)
12. "How to Convert PDF to Markdown" guide (500-1000 words)
13. Privacy messaging: "Files never leave your browser"
14. OG image for social sharing
15. Open-source the repo with good README
16. Product Hunt, Hacker News, Reddit launches

### Phase 4 — Enhanced Backend (only if demand warrants)

17. FastAPI + Docling (Apache 2.0) on Railway (~$5/mo)
18. "Enhanced mode" button for complex PDFs
19. API endpoint for programmatic access
20. OCR mode for scanned PDFs

---

## Technical Architecture

### Stack: Next.js + PDF.js (Client-Side)

**Why Next.js over Vite:** This is an SEO play. Next.js gives us:
- SSR/SSG for the page shell → Google sees rendered HTML on first crawl
- Pre-rendered marketing content (how-to guide, feature list)
- Vercel free tier deployment with edge caching
- The PDF conversion still runs client-side in the browser

**Why not Vite:** No SSR means Google sees an empty page until JS loads. Fatal for an SEO-first project.

```
┌─────────────────────────────────────────────┐
│     Next.js App (Vercel, free tier)          │
│     SSG for marketing pages                  │
│     Client-side for conversion               │
│                                              │
│  ┌──────────────┐  ┌────────┐  ┌─────────┐ │
│  │ Upload       │  │ Copy / │  │ Preview │  │
│  │ Dropzone     │  │ Download│  │ Panel   │  │
│  └──────┬───────┘  └────────┘  └─────────┘ │
│         │                                    │
│         ▼                                    │
│  ┌──────────────────────────────────────┐   │
│  │  PDF.js (Web Worker, client-side)    │   │
│  │                                      │   │
│  │  1. Parse PDF in worker thread       │   │
│  │  2. Extract text + font metadata     │   │
│  │  3. Build font size histogram        │   │
│  │  4. Detect headings from histogram   │   │
│  │  5. Group text into paragraphs       │   │
│  │  6. Detect lists from patterns       │   │
│  │  7. Extract links via getAnnotations │   │
│  │  8. Strip headers/footers            │   │
│  │  9. Apply bold/italic formatting     │   │
│  │  10. Assemble Markdown               │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  Files never leave the browser               │
│  No server, no upload, no tracking           │
└──────────────────────────────────────────────┘
```

### Key Technical Details

**PDF.js version:** v5.x (latest stable, matches namtroi/pdf-to-markdown)

**PDF.js Worker setup:** Critical for non-blocking parsing. The worker file (`pdf.worker.js`, ~1.5MB) must be:
- Served from the same origin or CDN with proper CORS
- Aggressively cached (immutable hash in filename)
- Lazy-loaded — don't block initial page render

**Font size → heading detection algorithm:**
1. Extract all text items across all pages
2. Build histogram of font sizes (using `Math.abs(transform[3])`)
3. Most common size = body text
4. Sizes significantly larger than body = headings
5. Rank by size into H1-H6 (largest = H1)
6. Also check: starts new block (not mid-paragraph), possibly ALL CAPS

**Bold/italic detection:**
```
fontName contains "Bold" or "Bd" or "Heavy" → **bold**
fontName contains "Italic" or "It" or "Oblique" → *italic*
fontName contains "Courier" or "Mono" or "Consolas" → `code span`
```
Covers ~80% of cases. Fails on font subsets with opaque names (`g_d0_f1`).

**Link extraction:** Requires TWO API calls per page:
1. `page.getTextContent()` → text items with positions
2. `page.getAnnotations()` → link annotations with rectangles and URLs
3. Match annotations to text items by overlapping bounding boxes

**Memory budget:** PDF.js uses 5-10x file size in RAM during parsing. For our 15MB limit, peak memory is ~150MB. Acceptable on desktop, tight on mobile.

### Starting Point

**Primary:** Fork/study [namtroi/pdf-to-markdown](https://github.com/namtroi/pdf-to-markdown)
- Modern stack: React 19, TypeScript strict, Vite, PDF.js v5.4
- 12-stage pipeline with debug visualization
- 77% test coverage
- Built for RAG use cases
- **Note:** 1 star, solo dev — validate algorithm quality independently

**Secondary reference:** [@opendocsg/pdf2md](https://github.com/opengovsg/pdf2md) (474 stars, npm package)
- Simpler approach, good for understanding minimum viable algorithm
- Published npm package, proven in production

**Table detection (Phase 2):** Port [pdfplumber](https://github.com/jsvine/pdfplumber)'s algorithm
- Line detection → intersection finding → cell grouping
- Best documented table detection algorithm, directly portable to JS

---

## Client-Side Quality: Honest Assessment

What we can realistically deliver and what we can't. Important to set expectations.

### Handles Well (MVP)

| Content Type | Quality | Notes |
|---|---|---|
| Simple text paragraphs | 95%+ | PDF.js text extraction is solid |
| Single-column layout | 90%+ | Straightforward top-to-bottom |
| Heading detection | 80-90% | Font size heuristics work for standard docs |
| Bullet/numbered lists | 75-85% | Position + character pattern matching |
| Bold/italic | 70-80% | Font name heuristic, misses opaque names |
| Header/footer removal | 70-80% | Repeated text detection across pages |

### Handles Poorly (acknowledge, improve over time)

| Content Type | Quality | Notes |
|---|---|---|
| Tables (bordered) | 40-60% | Needs `getOperatorList()`, Phase 2 |
| Tables (borderless) | 20-40% | Heuristic only, fragile |
| Multi-column layout | 30-50% | Reading order ambiguous without ML |
| Math/formulas | 10-20% | Not recoverable as LaTeX client-side |
| Scanned PDFs | 0% | Needs OCR (Phase 4 backend) |

### vs. The Competition

For **standard business documents** (reports, articles, whitepapers): our client-side output is 75-85% quality. This matches or beats pdf2md.morethan.io. Good enough for RAG ingestion and reading.

For **complex documents**: quality drops to 40-60%. Server-side ML tools (marker, Docling) are 20-30 points better. This is what the Phase 4 "Enhanced mode" backend addresses.

---

## SEO Strategy

### Target Keywords
- "pdf to markdown" (primary, ~10k monthly searches)
- "convert pdf to markdown"
- "pdf to markdown online"
- "pdf to md"
- "pdf to markdown converter"
- "pdf table to markdown" (Phase 2 differentiator)

### Implementation
- **Framework:** Next.js SSG — Google sees fully rendered HTML
- **Title:** "PDF to Markdown Converter — Free Online Tool | pdf2md.dev"
- **H1:** "Convert PDF to Markdown"
- **Meta description:** "Free online PDF to Markdown converter. Handles headings, lists, links, and formatting. No signup. Files never leave your browser."
- **Schema markup:** SoftwareApplication, WebApplication
- **Below-fold content:** "How to Convert PDF to Markdown" guide (500-1000 words)
- **Page speed:** Target <1s LCP. Lazy-load PDF.js worker. Inline critical CSS.
- **Mobile:** Responsive, but stack panels vertically (no side-by-side on mobile)

### Content Strategy (blazedocs.io's playbook, but free)
1. "How to Convert PDF to Markdown" (tutorial)
2. "Best PDF to Markdown Converters Compared" (listicle, we're in it)
3. "PDF to Markdown for AI/LLM Workflows" (developer audience)
4. "PDF to Markdown API" (when Phase 4 ships)
5. Long-tail: "pdf to markdown python", "pdf to markdown with tables"

### Link Building
- Open-source repo with good README (GitHub backlinks)
- Product Hunt launch
- Hacker News "Show HN"
- Reddit: r/webdev, r/programming, r/ChatGPT, r/markdown
- Dev.to / Hashnode blog post
- Answer StackOverflow questions about PDF-to-markdown
- Get listed on "awesome-markdown" and tool aggregator lists

---

## Analytics & Observability (Day 1)

This is an SEO play — flying blind is not an option.

- **Analytics:** Plausible or Fathom (privacy-friendly, no cookie banner needed)
- **Search Console:** Google Search Console from day 1 — track keyword rankings
- **Error tracking:** Sentry (free tier) — client-side PDF parsing WILL throw errors on malformed PDFs
- **Conversion metrics:** Track (client-side, anonymized):
  - Number of conversions
  - PDF page count distribution
  - Success/failure rate
  - Which output action used (copy vs download)

---

## Development Phases

### Phase 1: Client-Side MVP (1 weekend, realistically 2-3 days)

- [ ] Initialize Next.js + TypeScript + Tailwind project
- [ ] Set up PDF.js with Web Worker (non-trivial — test worker file serving)
- [ ] Implement core conversion pipeline:
  - [ ] Text extraction via `getTextContent()`
  - [ ] Font size histogram → heading detection (H1-H6)
  - [ ] Paragraph grouping by vertical proximity
  - [ ] List detection (bullet chars + numbering patterns)
  - [ ] Bold/italic from font name heuristics
  - [ ] Link extraction via `getAnnotations()`
  - [ ] Page header/footer stripping (repeated text detection)
  - [ ] Markdown assembly + whitespace normalization
- [ ] Build UI: drag-and-drop upload, progress bar, split-view output
- [ ] Copy to clipboard + download .md buttons
- [ ] Deploy to Vercel (free tier)
- [ ] Basic Plausible analytics + Sentry error tracking
- [ ] Test with 10 diverse PDFs: simple report, academic paper, resume, invoice, code docs, two-column, large (50+ pages), non-English, PDF with images, scanned (expect failure)

### Phase 2: Quality + Differentiation (week 2-3)

- [ ] Table detection (position clustering + line detection)
- [ ] Tagged PDF fast path (`getStructTree()`)
- [ ] Code block detection (best-effort monospace)
- [ ] "Copy for AI" button
- [ ] Multi-file drop (up to 5 PDFs → zip)
- [ ] Metadata extraction → YAML front matter
- [ ] Error handling: corrupt PDFs, password-protected, oversized
- [ ] Mobile responsive (stack panels, file picker instead of drag-drop)
- [ ] PWA: service worker to cache app shell + PDF.js bundle (offline capable)

### Phase 3: SEO & Launch (week 3-4)

- [ ] SEO: meta tags, schema markup, OG image
- [ ] "How to Convert PDF to Markdown" content below fold
- [ ] Privacy policy page
- [ ] Open-source repo with good README + MIT license
- [ ] Google Search Console setup
- [ ] Product Hunt, HN, Reddit launches
- [ ] Blog post: "Building a free PDF-to-Markdown converter"

### Phase 4: Enhanced Backend (only if users demand better quality)

- [ ] FastAPI + Docling (Apache 2.0) on Railway (~$5/mo)
- [ ] "Enhanced mode" toggle in UI
- [ ] Rate limiting: 20 conversions/hr per IP (server-side only)
- [ ] File cleanup: cron every 15min, delete after 1hr
- [ ] API endpoint with docs

### Phase 5: Growth

- [ ] npm CLI package (`npx pdf2md file.pdf`)
- [ ] OCR for scanned PDFs (Tesseract or Docling built-in)
- [ ] Batch processing (folder upload)
- [ ] JSON structured output option (sections + hierarchy, for RAG)
- [ ] Configurable chunking (by page, heading, or token count)
- [ ] "Clean with AI" premium feature (optional monetization)

---

## "Use It Ourselves" Features

Features that make this a daily-driver tool for our own AI/LLM workflows, not just an SEO play:

1. **"Copy for AI" button** — Markdown with context prefix for pasting into Claude/ChatGPT
2. **Metadata extraction** — Title, author, date as YAML front matter for RAG indexing
3. **Multi-file drop** — Convert a batch without clicking 5 times
4. **JSON output mode** (Phase 5) — Structured output with sections, hierarchy, page numbers per chunk
5. **Configurable chunking** (Phase 5) — Split by page, heading, or token count for embeddings
6. **Keyboard shortcuts** — Ctrl+V to paste PDF from clipboard, Ctrl+C to copy output
7. **Comparison view** — Original PDF rendering alongside markdown output (uses PDF.js canvas render)

**Honest note:** For heavy-duty RAG workflows (hundreds of PDFs, complex layouts), a CLI wrapper around marker or Docling will always be better than a browser tool. This web tool is the 80% solution for quick conversions + the SEO play. The CLI is Phase 5.

---

## Cost Estimate

### Phase 1-3 (client-side only)

| Service | Cost |
|---------|------|
| Vercel (free tier) | $0 |
| Domain (.dev) | ~$12/year |
| Plausible analytics | $9/mo (or self-host free) |
| Sentry (free tier) | $0 |
| **Total** | **~$12-120/year** |

### Phase 4+ (with backend)

| Service | Cost |
|---------|------|
| Railway (FastAPI + Docling, 1GB RAM) | ~$5/mo |
| Vercel (frontend) | $0 |
| Domain | ~$12/year |
| **Total** | **~$72-180/year** |

---

## Key Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Client-side quality not good enough for complex docs | MEDIUM | Acceptable for MVP — current #1 is also basic client-side. "Enhanced mode" backend (Phase 4) handles complex cases. |
| Can't outrank 9-year-old incumbent | MEDIUM | Content strategy + better tool + active maintenance. 6-12 month timeline. The incumbent has zero content, abandoned tech. |
| PDF.js bundle size hurts page speed | LOW | Lazy-load worker, aggressive caching, code splitting. Worker is loaded after initial page render. |
| Browser memory issues on large PDFs | LOW | 15MB limit (not 50MB). Progress indicator. Graceful error on OOM. |
| craftmarkdown.com or blazedocs.io outpaces us | LOW | They're also trying — but neither has the open-source + content + free combination. |

---

## Open Questions

1. **Domain:** Check availability and pricing for pdf2md.dev, pdftomarkdown.com, pdf-to-md.com. Note: pdf2md.net already exists as a competitor.
2. **License:** MIT (maximum adoption) vs Apache 2.0 (patent protection). Recommendation: MIT.
3. **npm package name:** Is `pdf2md` available on npm? (`@opendocsg/pdf2md` exists.) May need scoped: `@pdf2md/core`.
4. **Plausible vs self-hosted analytics:** $9/mo is cheap but adds up. Could self-host on the Phase 4 Railway instance.
5. **namtroi/pdf-to-markdown quality:** Need to actually run it on our test corpus before committing to fork vs reimplement.

---

## Research Files

Detailed research that informed this spec:

- [Competitor Analysis: pdf2md.morethan.io](../research/competitor-analysis.md)
- [Spec Stress Test](../research/spec-stress-test.md)
- [Client-Side PDF.js Technical Research](../research/tech-research.md)
