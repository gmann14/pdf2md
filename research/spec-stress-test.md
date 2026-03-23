# PDF-to-Markdown Spec Stress Test

*Reviewed: 2026-03-23*
*Spec: /Users/grahammann/clawd/docs/specs/pdf-to-markdown-spec.md*

---

## 1. MVP Feasibility: Can This Actually Be Built in a Weekend?

**Verdict: The "1 weekend" timeline is aggressive but possible IF you scope down hard.**

### What's realistic in a weekend:
- Vite + TypeScript scaffolding, drag-and-drop upload, PDF.js text extraction, basic paragraph grouping, copy/download buttons, deploy to Vercel. This gets you a functional but mediocre converter on par with pdf2md.morethan.io.

### What's NOT realistic in a weekend:
- **Table detection from positioned text.** This alone is a multi-week problem. You need to cluster text items by x/y coordinates, detect column alignment, infer row boundaries, handle merged cells, and deal with PDFs that use completely different internal representations for tables (some use actual table structures, most just position text). The spec lists this as an MVP feature.
- **Heading detection from font metadata.** PDF.js `getTextContent()` returns a `fontName` property that is an opaque internal identifier (like `g_d0_f1`), NOT a human-readable font name. You have to parse the font name string to guess if it contains "Bold" or "Italic" -- this is unreliable and varies wildly across PDFs. Font SIZE is available via `transform[0]` but requires calibration per-document since there's no absolute scale.
- **Code block detection from monospaced fonts.** Requires identifying monospaced fonts from the opaque fontName identifiers. Some PDFs embed custom fonts where you can't determine monospacing at all.
- **Image extraction.** PDF.js can render pages to canvas but extracting individual embedded images as separate files client-side is a separate, non-trivial problem. The `getOperatorList()` API can locate images but extracting them as PNGs requires significant work.
- **Page number/header/footer stripping.** Requires heuristics that detect repeated text at consistent positions across pages. Not hard conceptually but fiddly to get right.
- **Split-view preview.** UI work that eats time.
- **Testing with 10 diverse PDFs.** The spec lists this as a Phase 1 task. If you actually do this, you'll discover most of the above features don't work well, and you'll spend the rest of the weekend debugging.

### Missing from the task list:
- Setting up PDF.js worker (it runs in a Web Worker -- configuration is non-trivial)
- Handling the PDF.js WASM/worker bundle size (pdf.js is ~1.5MB+ minified)
- Progress indicator for large PDFs (parsing 50MB client-side can take 30+ seconds)
- Memory management for large PDFs in the browser (50MB PDF can easily consume 500MB+ RAM during parsing)
- Error boundary for browser crashes on large files
- Favicon, basic SEO meta tags, OG image -- small but time-consuming

**Recommendation:** Cut tables and images from MVP. Ship text extraction + heading detection (best-effort) + lists + copy/download. That's a weekend. Add tables and images in Phase 2.

---

## 2. Client-Side PDF.js Limitations -- The Brutal Truth

The spec is dangerously vague about what PDF.js can actually do. Here's the reality:

### What PDF.js `getTextContent()` gives you:
- **Text items** with: `str` (the text), `dir` (direction), `transform` (6-element matrix including position and scale), `width`, `height`, `fontName` (opaque reference into a `styles` dict)
- **Styles dict** with: `fontFamily` (unreliable -- often generic like "sans-serif"), `ascent`, `descent`, `vertical`

### What PDF.js does NOT give you:
- **Bold/italic detection.** There is no `fontWeight` or `fontStyle` property. You must parse the `fontName` string and hope it contains "Bold", "Italic", "BoldItalic", etc. Many PDFs use font subsets with names like `ABCDEF+TimesNewRoman` or just `g_d0_f1`. Some PDFs fake bold by drawing text twice with a slight offset -- PDF.js returns duplicate overlapping text items for these.
- **Semantic structure.** PDF.js knows nothing about headings, paragraphs, lists, or tables. It gives you a flat array of positioned text items. ALL structure detection is your problem.
- **Table boundaries.** Tables in PDFs are just positioned text. There are no table elements. You must cluster text by x/y coordinates and infer grid structure. This fails on:
  - Tables with varying column widths
  - Tables with merged cells
  - Tables with text wrapping within cells
  - Tables without visible borders (common in academic papers)
  - Multi-page tables
- **Hyperlinks.** `getTextContent()` does NOT return link URLs. You need `getAnnotations()` separately and then match annotation rectangles to text items by position. This is doable but the spec doesn't mention it.
- **Reliable font size.** The `transform` matrix gives you a scale factor, but the actual rendered size depends on the PDF's coordinate system, which varies per page. You need to normalize against the page's viewport.
- **List detection.** No bullet/number markers are structurally identified. You must pattern-match text items that start with bullet characters or numbering patterns, which breaks on:
  - Custom bullet characters (squares, dashes, arrows)
  - Numbered lists that don't start at 1
  - Multi-level indented lists
  - Lists where the bullet is a separate text item from the content

### Known PDF.js bugs that will bite you:
- `getTextContent()` sometimes returns empty items for PDFs with certain font encodings (Issue #11779, #20376)
- Font name transitions between normal and bold text can be lost (Issue #7297)
- `fontRef` attribution can be incorrect when font changes occur within a text operation (Issue #14755)
- Overlapping/duplicate text for PDFs that simulate bold via double-rendering

**Bottom line:** The spec's "12-stage pipeline" sounds impressive but stages 3 (heading detection), 6 (table detection), 7 (code blocks), and 8 (bold/italic/links) are all fighting against PDF.js limitations. The output quality for anything beyond simple single-column text documents will be poor.

---

## 3. The "Use It Ourselves" Angle

The spec says the target users include "Developers feeding documents into AI/LLM workflows." If you want this to be a daily-driver tool for your own RAG/LLM workflows, here's what's missing:

### Features that would make it a daily driver:
- **Batch/folder processing.** Listed as future but this is THE feature for AI workflows. Nobody converts one PDF at a time for RAG.
- **Structured output modes.** LLMs need different things: sometimes you want full markdown, sometimes you want chunked output with metadata (page numbers, section headers per chunk). The spec only outputs flat markdown.
- **Front matter / metadata extraction.** Title, author, date, subject from PDF metadata fields. Critical for RAG indexing.
- **Configurable chunking.** Split output by page, by heading, or by token count. Essential for embeddings.
- **JSON output option.** Not just markdown text but structured JSON with sections, their hierarchy, and content. Much more useful for programmatic consumption.
- **Drag-and-drop multiple files.** Not batch upload to a queue -- just drop 5 PDFs and get 5 markdown files in a zip.
- **Keyboard shortcuts.** Ctrl+V to paste a PDF from clipboard. Ctrl+C to copy output. Power user stuff.
- **Comparison mode.** Show original PDF rendering alongside markdown output so you can spot conversion errors. The spec has a "preview" but that's rendered markdown, not the original PDF.
- **"Copy for Claude/ChatGPT" button.** Copies markdown with a system prompt prefix like "The following is extracted from a PDF document:" -- small but useful for the target audience.

### What makes you stop using a tool:
- Output that requires more cleanup than manual conversion
- No way to handle the PDFs you actually encounter (scanned docs, two-column layouts, academic papers with equations)
- Slow for large documents with no progress feedback

**The honest truth:** For your own AI workflows, you'd get more value from a CLI wrapper around marker or Docling than from a client-side web tool. The web tool is for SEO/traffic; the CLI is for personal use. The spec conflates these two very different products.

---

## 4. namtroi/pdf-to-markdown -- Reality Check

**The repo exists.** It's at https://github.com/namtroi/pdf-to-markdown. Here's what I found:

### What it actually is:
- A fork/rewrite of `jzillmann/pdf-to-markdown` (the original behind pdf2md.morethan.io)
- Built with React 19 + TypeScript + Vite
- Uses PDF.js for client-side extraction
- The pipeline is roughly: Extract raw text/geometry -> Detect headers/lists -> Remove repetition/merge lines -> Detect code blocks -> Render markdown

### What the spec gets wrong:
- The spec says "12-stage pipeline." The actual pipeline appears to have fewer distinct stages (Extract, Structure, Refine, Render). The "12 stages" may be an exaggeration or counting sub-steps.
- The spec says "fork or reimplement." Forking is viable but the codebase may have its own opinions about architecture that conflict with your plans (React 19 patterns, state management, etc.).
- **Table detection capability is unclear/limited.** The repo description does not prominently feature table detection, which is the hardest problem. The original jzillmann/pdf-to-markdown had minimal table support.

### What to actually do:
- Don't fork it blindly. Read the source. The useful part is the text item clustering and heading detection heuristics. The rest (React UI, Vite config) you'd write yourself anyway.
- Consider also looking at `@opendocsg/pdf2md` (the npm library behind pdf2md.morethan.io) which is a simpler, library-only approach without the React coupling.

---

## 5. Technical Contradictions

### "Client-side, no upload" + "Rate limiting 20/hr per IP"
This is the most glaring contradiction in the spec. If processing is entirely client-side:
- There is no server to rate-limit against
- There is no "conversion" event the server can count
- You could add client-side rate limiting via localStorage, but any user can bypass it by clearing storage or using incognito mode
- You could add a server-side analytics ping that counts conversions, but that defeats the "files never leave your browser" privacy claim (the file doesn't leave, but the server knows you converted something)

**The rate limiting section (Feature 4) was clearly written for the server-side architecture and was never updated when the recommendation shifted to client-side.** The "files deleted after 1 hour" line is also nonsensical for client-side processing -- there are no server-stored files to delete.

### "Max file size: 50MB" + client-side processing
50MB PDFs client-side will cause:
- Browser memory issues (PDF.js can use 5-10x the file size in RAM during parsing)
- Main thread blocking if the worker isn't properly configured
- Tab crashes on mobile devices
- Processing times of 30-60+ seconds with no progress indication

The spec doesn't acknowledge these constraints. A realistic client-side limit is 10-20MB, with a "use enhanced mode for larger files" upsell.

### "Images: extract embedded images" + client-side
Client-side image extraction from PDFs via PDF.js is possible but complex:
- You need to use `getOperatorList()` and process `OPS.paintImageXObject` operations
- Extract image data as ImageData objects
- Convert to PNG/JPEG via canvas
- Package into a downloadable zip
- Memory usage balloons significantly

The spec treats this as a simple feature. It's not. It's easily a full day of work and will cause memory issues on large PDFs.

### Tech stack confusion
- The "Conversion Engine" section header says "(Python)" and lists Python libraries (marker, MinerU, Docling, PyMuPDF)
- The recommendation says "Start with Option A" which is pure client-side JavaScript
- The Backend section describes FastAPI (Python) endpoints
- The Frontend section says Next.js
- The recommendation says Vite
- Phase 1 says "Vite + TypeScript (or Next.js if you want SSR for SEO)"

**This spec was written iteratively and never reconciled.** The Python section is irrelevant for the MVP but takes up significant space and creates confusion about what's actually being built.

---

## 6. Missing Implementation Details

### PDF.js Setup
- Which PDF.js version? The API has changed significantly between versions.
- Worker configuration: PDF.js needs a Web Worker for non-blocking parsing. You need to serve `pdf.worker.js` correctly from your bundler. Vite and webpack handle this differently.
- WASM vs non-WASM build? The WASM build is faster but adds complexity.
- The `pdf.js` bundle is ~1.5MB. How does this affect the "<1s LCP" target?

### Heading Detection Algorithm
The spec says "detect heading hierarchy from font size/weight" but gives no algorithm. Here's what you actually need:
1. Collect all unique font sizes from the document
2. Sort them and determine which sizes correspond to which heading levels
3. Handle documents where heading sizes aren't consistent
4. Handle documents where body text size varies
5. Decide: is something with a larger font but appearing mid-paragraph a heading? (Hint: you also need to check if it starts a new line/block)
6. Handle ALL CAPS text that might be headings but at the same font size

### Table Detection Algorithm
The spec says "detect table structures from grid-aligned text" with no algorithm. This is the hardest unsolved problem in PDF parsing. You need:
1. Cluster text items by y-coordinate (same row) with tolerance for slight misalignment
2. Identify column boundaries from x-coordinate clustering
3. Determine if the clusters actually form a grid vs. just columnar text
4. Handle multi-line cell content
5. Handle merged cells (where text spans multiple column/row boundaries)
6. Distinguish tables from two-column page layouts (extremely common failure mode)
7. Handle tables that span page breaks

**None of this is specified.** The spec just says "detect tables" as if it's a checkbox item.

### Font Name Parsing
No spec for how to map PDF.js fontName identifiers to bold/italic/monospace detection. You need a heuristic like:
```
if fontName contains "Bold" -> bold
if fontName contains "Italic" or "Oblique" -> italic
if fontName contains "Courier" or "Mono" or "Consolas" -> monospace
```
This fails on: font subsets (ABCDEF+FontName), CJK fonts, custom fonts, encrypted font names.

---

## 7. Deployment Decision: Vite vs Next.js

The spec waffles on this. Here's the clear answer:

### For pure client-side MVP (Phase 1): Use Vite.
- Simpler setup, faster builds
- No SSR complexity
- Static hosting on Vercel/Cloudflare Pages (free)
- **BUT:** No SSR means Google sees an empty page until JavaScript loads and renders. For an SEO play, this matters.

### For SEO (which is the stated goal): Use Next.js.
- SSR/SSG means Google gets fully rendered HTML on first crawl
- Meta tags rendered server-side
- Can pre-render the marketing content (how-to guide, feature list) statically
- The PDF conversion still happens client-side, but the page shell is SSR
- Slightly more complex setup but still deployable on Vercel free tier

**The spec should say: Next.js for the page shell (SSR for SEO), with the PDF.js conversion engine running client-side in the browser.** This is Option B's frontend without the backend. The spec currently presents this as an either/or when it should be a clear recommendation.

### What's actually missing from deployment:
- CSP (Content Security Policy) headers for PDF.js worker
- How to serve the PDF.js worker file from the CDN
- Cache headers for the PDF.js bundle (it's 1.5MB -- needs aggressive caching)
- Whether to use Vercel Edge Functions or Cloudflare Workers for any server-side needs

---

## 8. Domain Strategy

The spec lists three candidates with no analysis:
- **pdf2md.dev** -- `.dev` TLD is developer-friendly but less recognizable to general audience. pdf2md.morethan.io already "owns" the pdf2md brand in search.
- **pdftomarkdown.com** -- Best for SEO (exact match for "pdf to markdown" query) but probably taken or expensive.
- **markdownpdf.com** -- Implies markdown-TO-pdf (the opposite direction). Bad choice.

### What the spec should include:
- Actual WHOIS lookups for each domain
- Price for each
- Note that `pdf2md.net` already exists as a competitor
- Alternative suggestions: `pdf-to-md.com`, `pdftomd.com`, `markdownfrompdf.com`
- Whether `.dev` domains get any SEO boost (they don't -- TLD is irrelevant to Google ranking)

---

## 9. Open Source Strategy

The spec mentions "open-source the core library" and "GitHub repo with good README" but doesn't specify:

### Missing details:
- **License.** This is critical. MIT is the standard for maximum adoption. Apache 2.0 is fine. GPL/AGPL would kill adoption. The spec mentions Docling's Apache 2.0 license approvingly but never states what license the project itself should use.
- **What gets open-sourced.** The conversion library? The whole website? Just the pipeline? The spec should separate the npm-publishable library from the website code.
- **Package name.** Is `pdf2md` available on npm? (Probably not -- `@opendocsg/pdf2md` exists.)
- **How open source helps SEO.** It helps via:
  - Backlinks from GitHub (GitHub pages have high domain authority)
  - Backlinks from npm registry
  - Blog posts and discussions that link to the project
  - README that links back to the hosted tool
  - Stars/forks signal credibility
- **Contribution guidelines.** Without them, you'll get low-quality PRs that eat your time.

---

## 10. Missing From the Spec Entirely

### Analytics
- No mention of any analytics tool (Plausible, Fathom, PostHog, Google Analytics)
- How will you know if the SEO strategy is working?
- How will you measure conversion success rates, failure rates, or what types of PDFs people upload?
- For a project whose entire thesis is "rank for a keyword," you need search console integration from day 1

### Error Tracking
- No mention of Sentry or similar
- Client-side PDF parsing WILL throw errors on malformed PDFs
- You need visibility into what fails and why, or you'll never improve quality

### Accessibility
- No mention of ARIA labels, keyboard navigation, screen reader support
- The drag-and-drop upload needs keyboard-accessible alternatives (the file picker handles this, but the spec doesn't mention ensuring it)
- The split-view result panel needs proper ARIA roles

### Performance Budget
- The spec says "<1s LCP" but PDF.js is 1.5MB+
- No mention of code splitting, lazy loading the PDF.js worker, or a loading state
- No mention of what happens on slow connections (3G mobile)

### PWA / Offline Support
- A client-side tool that "files never leave your browser" is a natural PWA candidate
- Service worker could cache the app shell and PDF.js bundle
- Users could convert PDFs offline
- This is a genuine differentiator that's completely unmentioned

### i18n
- Not critical for MVP but the spec's SEO section doesn't consider non-English keywords
- "PDF zu Markdown," "PDF vers Markdown" etc. are untapped search volume

### Testing Strategy
- "Test with 10 diverse PDFs" is listed but there's no mention of:
  - Automated regression tests
  - A test corpus with expected output
  - CI/CD pipeline
  - How to measure conversion quality quantitatively

### Legal / Privacy
- The spec mentions privacy as a differentiator but doesn't specify:
  - Privacy policy page (required if you have analytics)
  - Cookie consent (required in EU if using analytics)
  - Terms of service

### Mobile UX
- Spec says "mobile responsive" but doesn't address:
  - How does a split-view markdown editor work on a 375px-wide phone?
  - File picker on mobile (no drag-and-drop)
  - 50MB PDF on a mobile browser will crash most phones

### Competitor pdf2md.net
- The spec's competitive analysis misses pdf2md.net entirely, which is a direct competitor already using a very similar domain to the proposed names

---

## Summary: Top 5 Actions Before Building

1. **Cut tables and images from MVP scope.** Ship text + headings + lists. Add tables in week 2. The spec's MVP is actually a v2.
2. **Pick Next.js, not Vite.** The whole point is SEO. Use Next.js with static generation for the marketing shell and client-side PDF.js for the conversion.
3. **Delete the Python/backend sections from the MVP spec.** They create confusion. Create a separate "Phase 4 Backend Spec" document when/if you get there.
4. **Fix the contradictions.** Remove rate limiting, file deletion, and 50MB limit from the client-side spec. Replace with realistic client-side constraints (10-20MB, localStorage-based usage tracking for analytics only).
5. **Add analytics and error tracking from day 1.** Without Plausible/PostHog and Sentry, you're flying blind on an SEO play. You won't know if you're winning.
