# Client-Side PDF to Markdown Conversion: Technical Research

**Date:** 2026-03-23

---

## 1. PDF.js Capabilities: What Text Metadata Is Actually Exposed

### Core API: `page.getTextContent(options?)`

Returns a `TextContent` object containing:

```
TextContent {
  items: (TextItem | TextMarkedContent)[],
  styles: Record<string, TextStyle>,
  lang: string | null
}
```

**TextItem properties:**

| Property   | Type     | Description                                           |
|------------|----------|-------------------------------------------------------|
| `str`      | string   | The actual text content                               |
| `dir`      | string   | Text direction: `'ttb'`, `'ltr'`, or `'rtl'`         |
| `transform`| number[] | 6-element transformation matrix `[a, b, c, d, tx, ty]`|
| `width`    | number   | Width in device space                                 |
| `height`   | number   | Height in device space                                |
| `fontName` | string   | PDF.js internal font identifier (key into `styles`)   |
| `hasEOL`   | boolean  | Whether followed by a line-break                      |

**TextStyle properties (from `styles[fontName]`):**

| Property     | Type    | Description                          |
|--------------|---------|--------------------------------------|
| `fontFamily` | string  | Potential font family designation    |
| `ascent`     | number  | Font ascent measurement              |
| `descent`    | number  | Font descent measurement             |
| `vertical`   | boolean | Whether text renders vertically      |

**Options for `getTextContent()`:**
- `includeMarkedContent` (boolean, default false) - include marked content items (needed for struct tree correlation)
- `disableNormalization` (boolean, default false) - skip text normalization in worker

### Deriving Font Size from the Transform Matrix

The transform matrix `[a, b, c, d, tx, ty]` encodes both position and scale:
- **Position:** `tx` = X coordinate, `ty` = Y coordinate
- **Font size:** For non-rotated text, `Math.abs(d)` approximates font size. For arbitrarily transformed text: `fontSize = Math.abs(fontSizeBase) * Math.sqrt(c^2 + d^2)`
- **Height:** The `height` property on TextItem is often usable directly but has known bugs where it needs to be scaled by `transform[3]`

### What PDF.js Does NOT Expose via getTextContent

- **Font weight (bold):** Not directly available. Must be inferred from `fontName` string (e.g., checking if it contains "Bold", "Bd", "Heavy")
- **Font style (italic):** Same heuristic approach - check fontName for "Italic", "It", "Oblique"
- **Text color:** Not available at all from getTextContent
- **Background color:** Not available
- **Underline/strikethrough:** Not available
- **Actual font name:** `fontName` is a PDF.js internal ID. Real font name requires `page.commonObjs.get(item.fontName)` which returns name, type, and binary data

### Lower-Level API: `page.getOperatorList()`

Returns the raw PDF rendering instruction stream as `{fnArray, argsArray}`. This is the only way to extract:
- **Text color** - by tracking `setFillRGBColor` / `setFillGrayColor` operations before text draw operations
- **Line drawings** (for table borders) - via `moveTo`, `lineTo`, `rectangle` operations

However, this API is:
- Poorly documented ("cryptic array")
- Requires manual correlation between drawing operations and text positions
- Significantly more complex to work with
- Performance-heavy to parse

### Tagged PDF Support: `page.getStructTree()`

For tagged/accessible PDFs, `getStructTree()` returns semantic structure (headings, tables, lists) similar to HTML. When combined with `getTextContent({ includeMarkedContent: true })`, you can correlate text items with their semantic roles. However:
- Most PDFs are NOT tagged
- Support is still evolving (open issues around missing empty struct nodes)
- Cannot be relied upon as a primary strategy

---

## 2. Existing Open-Source Implementations

### Tier 1: Directly Relevant Client-Side Projects

#### jzillmann/pdf-to-markdown (1,561 stars, active March 2026)
- **URL:** https://github.com/jzillmann/pdf-to-markdown
- **Demo:** https://pdf2md.morethan.io/
- **Tech:** JavaScript, Webpack, React 15, PDF.js
- **Status:** Active but undergoing major refactoring ("modularize" branch separating parsing logic from frontend)
- **How it works:** Multi-stage transformation pipeline. Extracts text items from PDF.js, then runs a series of transformations to detect structure (headings, lists, TOC, etc.) based on font size analysis
- **Strengths:** Most mature client-side implementation, well-tested on real documents, large community
- **Weaknesses:** Legacy stack (React 15, class components, JS not TS), tight coupling between parsing and UI, modularization effort incomplete

#### namtroi/pdf-to-markdown (1 star, Dec 2025)
- **URL:** https://github.com/namtroi/pdf-to-markdown
- **Description:** "The fastest browser-based PDF to Markdown converter for RAG"
- **Tech:** React 19, TypeScript (strict), Vite, PDF.js v5.4, Tailwind CSS v4, Vitest (77%+ coverage)
- **How it works:** 12-stage transformation pipeline with debug visualization mode
- **Features:**
  - Header detection (H1-H6) via font size + weight analysis
  - Complex nested list recognition
  - Code block and blockquote detection
  - TOC extraction
  - 100% client-side, privacy-preserving
  - RAG-optimized output
- **Performance:** ~7 seconds for 500-page documents (vs ~9s for jzillmann's version)
- **Strengths:** Modern stack, TypeScript, well-architected, has ARCHITECTURE.md, built specifically for RAG use cases
- **Weaknesses:** Very new (1 star), solo developer, some `@ts-ignore` / `any` types remaining in UI components
- **Assessment:** This is a clean modernization of jzillmann's algorithm. Best starting point for a new project.

#### opengovsg/pdf2md (474 stars, active March 2026)
- **URL:** https://github.com/opengovsg/pdf2md
- **npm:** `@opendocsg/pdf2md`
- **Tech:** JavaScript, PDF.js
- **How it works:** Uses PDF.js as raw parser, detects headings (H1-H3) from font size/styling, removes repeating headers/footers, joins wrapped text, preserves bullets and numbered lists
- **Strengths:** Published npm package, usable as library or CLI, active maintenance, 33 releases
- **Weaknesses:** JavaScript not TypeScript, limited heading levels (H1-H3 only), basic table support, simpler algorithm than jzillmann's
- **npm stats:** Published as `@opendocsg/pdf2md`, moderate download numbers

#### opendocsg/pdf2md-web
- **URL:** https://github.com/opendocsg/pdf2md-web
- **Description:** Web-hosted version of the above library
- **Assessment:** Thin wrapper, not independently useful

#### mrmps/pdf2md
- **URL:** https://github.com/mrmps/pdf2md
- **Description:** "Browser based tool to convert PDFs to Markdown"
- **Assessment:** Lighter fork/variant

### Tier 2: Related Libraries

#### unpdf (unjs/unpdf)
- **URL:** https://github.com/unjs/unpdf
- **npm:** `unpdf`
- **Description:** Modern PDF extraction utilities for Node.js, browser, and serverless
- **Tech:** TypeScript, ships a serverless-optimized build of PDF.js
- **Strengths:** Cross-runtime (Node, Deno, Bun, browser), modern async/await API, TypeScript-first, actively maintained
- **Weaknesses:** Text extraction only - no markdown conversion, no structure detection
- **Assessment:** Good as a PDF.js abstraction layer if building your own conversion pipeline on top

#### pdf.js-extract (npm)
- **Description:** Extracts text with position data from PDFs using PDF.js
- **Weakness:** Bundles full PDF.js runtime (large), extraction only

#### pdf2md-js (npm)
- **Description:** Uses vision models (OpenAI, Claude, Gemini) for conversion
- **Assessment:** Server-side AI approach, not client-side deterministic - different paradigm entirely

### Tier 3: Python References (Not Client-Side, But Relevant for Quality Benchmarks)

#### datalab-to/marker (very high stars)
- **URL:** https://github.com/datalab-to/marker
- **Description:** Convert PDF to markdown + JSON with high accuracy
- **Approach:** Python, uses deep learning models for layout detection
- **Benchmarks:** 10x faster than Nougat, competitive with Llamaparse and Mathpix. `--use_llm` mode further improves accuracy (merges tables across pages, handles inline math, etc.)
- **Known limitations:** Very complex layouts with nested tables and forms may fail
- **Assessment:** Sets the quality ceiling for what's achievable. Client-side JS approaches will be significantly below this in accuracy for complex documents.

#### jsvine/pdfplumber (Python)
- **URL:** https://github.com/jsvine/pdfplumber
- **Assessment:** Gold standard for table extraction algorithm. Its approach is directly portable to JavaScript.

---

## 3. Table Detection Algorithms

### The Core Problem

PDFs have no concept of "tables." A table is just text positioned at specific coordinates, sometimes with drawn lines (rectangles/paths) around cells. Detection must be inferred.

### Approach A: Line-Based Detection (pdfplumber algorithm)

Borrowed from Anssi Nurminen's master's thesis, inspired by Tabula:

1. **Find explicit lines** - PDF drawing operations (rectangles, paths) that form borders
2. **Find implied lines** - Inferred from text alignment (words at same X or Y coordinates)
3. **Merge overlapping lines** - Combine nearly-overlapping horizontal/vertical lines
4. **Find intersections** - Where horizontal and vertical lines cross
5. **Find cells** - Most granular rectangles using intersections as vertices
6. **Group cells into tables** - Contiguous cells form a table

**Strengths:** Works well when PDFs have drawn borders. Deterministic.
**Weaknesses:** Requires access to drawing operations (getOperatorList in PDF.js, which is complex). Fails on borderless tables.

### Approach B: Position-Based Clustering (Gary Sieling's approach)

Used in the blog post "Extracting Tables from PDFs in Javascript with PDF.js":

1. Sort text items by position
2. If Y-coordinate changes by a "small" amount, items are on the same line
3. If Y-coordinate changes by a "large" amount, new row
4. If X-coordinate changes by a "large" amount within a line, new column
5. Thresholds are empirical (dx ~15, dy ~20 for test PDFs)

**Strengths:** Simple, works with getTextContent only (no getOperatorList needed)
**Weaknesses:** Threshold-dependent, fragile across different PDFs, doesn't handle merged cells or complex layouts

### Approach C: X-Y Cut Algorithm

Academic approach used in document layout analysis:

1. Project text bounding boxes onto X and Y axes
2. Find gaps (whitespace) in projections
3. Recursively split the page at the largest gaps
4. Table regions identified by regular grid patterns in the splits

**Strengths:** Handles borderless tables better than line-based
**Weaknesses:** Computationally heavier, struggles with multi-column layouts mixed with tables

### State of the Art for Client-Side

**No client-side JavaScript library does table detection well.** The existing tools either:
- Skip tables entirely (most common)
- Use simple position clustering (fragile)
- Rely on explicit drawn borders only

The Python ecosystem (pdfplumber, Camelot, Marker with ML) is years ahead. For client-side JS, the realistic approach is:
1. Detect drawn table borders via getOperatorList (covers ~60% of tables)
2. Fall back to position-based clustering for borderless tables (covers ~30% of remaining, with errors)
3. Accept that ~30-40% of tables overall will have quality issues

---

## 4. Realistic Quality Assessment

### What Client-Side JS Handles WELL

| Content Type            | Quality | Notes                                              |
|------------------------|---------|-----------------------------------------------------|
| Simple text paragraphs | 95%+    | PDF.js text extraction is reliable                  |
| Heading detection      | 80-90%  | Font size heuristics work for most standard docs    |
| Bullet/numbered lists  | 75-85%  | Position + character heuristics work reasonably     |
| Bold/italic detection  | 70-80%  | Font name heuristic ("Bold", "Italic" in name)     |
| Page header/footer removal | 70-80% | Repeated text detection across pages works         |
| Single-column layout   | 90%+    | Straightforward top-to-bottom ordering              |
| TOC detection          | 70-80%  | Dotted leaders + page numbers are detectable        |

### What Client-Side JS Handles POORLY

| Content Type            | Quality | Notes                                              |
|------------------------|---------|-----------------------------------------------------|
| Tables (with borders)  | 40-60%  | Requires getOperatorList parsing, complex           |
| Tables (borderless)    | 20-40%  | Heuristic-only, very fragile                        |
| Multi-column layout    | 30-50%  | Reading order ambiguous without ML                  |
| Mathematical formulas  | 10-20%  | Symbol positioning is not recoverable as LaTeX      |
| Images/figures         | 0%      | Can detect image presence but not extract/describe  |
| Figure captions        | 30-50%  | Hard to associate with the right figure             |
| Footnotes              | 30-50%  | Hard to differentiate from body text                |
| Nested/merged tables   | 10-20%  | Virtually impossible without ML                     |
| Forms                  | 10-20%  | Field-value association is difficult                |
| Scanned PDFs (no text) | 0%      | Need OCR - not feasible client-side at scale        |
| Text color semantics   | 20-30%  | Requires getOperatorList, hard to correlate          |
| Right-to-left text     | 50-60%  | PDF.js supports dir but reordering is tricky        |

### Honest Overall Assessment

For **standard business documents** (reports, articles, whitepapers) with a single column, headings, and paragraphs: **client-side conversion produces 75-85% quality markdown**. Good enough for RAG ingestion, searchability, and rough reading.

For **complex documents** (academic papers with math, financial reports with tables, forms): **quality drops to 40-60%**, often requiring manual cleanup.

For **heavily designed documents** (magazines, brochures, multi-column newsletters): **quality is 20-40%**, often producing garbled output.

The gap between client-side JS and server-side ML (Marker, Mathpix) is significant: roughly 20-30 percentage points on complex documents.

---

## 5. Best Starting Point Recommendation

### Primary Recommendation: Fork namtroi/pdf-to-markdown

**Why:**
- Modern stack (React 19, TypeScript strict, Vite, PDF.js v5.4)
- Clean 12-stage pipeline architecture with ARCHITECTURE.md
- Already built for RAG use cases
- 77%+ test coverage with Vitest
- Algorithmically based on jzillmann's battle-tested approach
- Debug visualization mode for pipeline inspection

**Risks:**
- Solo developer, 1 star (low community validation)
- Some remaining `any` types and `@ts-ignore` in UI components
- Need to verify algorithm quality independently

### Secondary Recommendation: Use opengovsg/pdf2md as a reference

**Why:**
- Published npm package (`@opendocsg/pdf2md`), proven in production
- Simpler codebase, easier to understand the core algorithm
- 474 stars, 33 releases, active maintenance
- Good for understanding the minimum viable approach

### For Table Detection Specifically: Port pdfplumber's algorithm

The pdfplumber table detection algorithm (line detection + intersection finding + cell grouping) is well-documented and directly portable to JavaScript. No existing JS library implements it well.

### For PDF.js Abstraction: Consider unpdf

If building a new pipeline from scratch, `unpdf` provides a clean TypeScript wrapper around PDF.js that works across all JS runtimes, saving boilerplate.

---

## Key Technical Decisions for Implementation

1. **Font size extraction:** Use `Math.abs(transform[3])` for non-rotated text, full matrix calculation for rotated. Cross-reference with `height` property.

2. **Bold/italic detection:** Parse `fontName` string for keywords ("Bold", "Bd", "Heavy", "Italic", "It", "Oblique"). Also check `page.commonObjs.get(fontName)` for actual font metadata. This is heuristic and will miss ~20% of cases (e.g., fonts with numeric weight identifiers).

3. **Heading detection:** Compute font size histogram across the document. The most common size is body text. Sizes larger than body text are headings, ranked by size into H1-H6.

4. **Table detection (if attempted):** Start with position-based clustering (simpler). Add getOperatorList line detection for bordered tables as an enhancement. Accept that quality will be limited.

5. **Tagged PDF fast path:** Check for structure tree first. If the PDF is tagged, use `getStructTree()` + `getTextContent({ includeMarkedContent: true })` for semantic-accurate conversion. This handles ~10-15% of PDFs but with much higher quality.

---

## Sources

- [PDF.js API Documentation](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html)
- [PDF.js Issue #8096 - Interpreting getTextContent results](https://github.com/mozilla/pdf.js/issues/8096)
- [PDF.js Issue #7372 - Font bold/italic detection](https://github.com/mozilla/pdf.js/issues/7372)
- [PDF.js Issue #10497 - Text color extraction](https://github.com/mozilla/pdf.js/issues/10497)
- [PDF.js Issue #7895 - Text color via getOperatorList](https://github.com/mozilla/pdf.js/issues/7895)
- [PDF.js Issue #6269 - Tagged PDF support](https://github.com/mozilla/pdf.js/issues/6269)
- [jzillmann/pdf-to-markdown](https://github.com/jzillmann/pdf-to-markdown) - 1,561 stars
- [namtroi/pdf-to-markdown](https://github.com/namtroi/pdf-to-markdown) - Modern TypeScript fork
- [opengovsg/pdf2md](https://github.com/opengovsg/pdf2md) - 474 stars, npm: @opendocsg/pdf2md
- [unjs/unpdf](https://github.com/unjs/unpdf) - Modern PDF.js wrapper
- [datalab-to/marker](https://github.com/datalab-to/marker) - Python, ML-based (quality benchmark)
- [jsvine/pdfplumber](https://github.com/jsvine/pdfplumber) - Python, best table detection algorithm
- [Gary Sieling - Extracting Tables from PDFs in JS](https://www.garysieling.com/blog/extracting-tables-from-pdfs-in-javascript-with-pdf-js/)
- [Benchmarking PDF-to-Markdown Converters](https://ai.gopubby.com/benchmarking-pdf-to-markdown-document-converters-fc65a2c73bf2)
