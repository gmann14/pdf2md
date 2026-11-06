# pdf2md improvement spec — November 2026

Written 6 Nov 2026. Goal: make pdf2md clearly the best JavaScript PDF-to-Markdown
converter that runs in the browser with nothing uploaded, and the easiest one for
agent tools and MCP servers to adopt.

This is a spec, not a plan pass. Each item under "Proposed items" is written so it
can be pasted into `IMPLEMENTATION_PLAN.md` as a Forge item once a number is
assigned (the last existing item is `pdf2md#27`). Line numbers refer to commit
`b723be2`.

**Decisions (6 Nov 2026; Graham asked Claude to settle the pdf2md questions):**
- **Name:** stays `pdf2md`.
- **Domain:** `getpdf2md.com`, bought by Graham at Cloudflare on 6 Nov 2026 (auto-renews 6 Nov
  2027; cancel before then if unused). Attached to the `pdf2md` Vercel project, `www` redirects
  to the bare domain. Closes q-2026-06-30-001. DNS records still to add (see
  `~/Coding/open-source/ACTIONS.md` item 4), then deploy current `main` with Graham's OK.
- **File-size limit:** the 15 MB cap moves out of `@pdf2md/core` into an option
  (`maxFileSizeBytes`, no limit by default in Node). The web app keeps passing 15 MB,
  because browser memory is the real constraint there (`docs/spec.md:309`).
- **OCR:** the optional in-browser `@pdf2md/ocr` add-on described below, not
  server-side OCR. It keeps the "nothing uploaded" promise. This supersedes
  `docs/spec.md:206, 231, 375, 545`.
- **Work queue:** the top five items plus the red-test fix are being built on branch
  `fix/output-quality-2026-11` (worktree `~/Coding/.worktrees/pdf2md/fix-output-quality`).
  The remaining items become Forge items in `IMPLEMENTATION_PLAN.md` once that
  branch merges.

---

## 1. Where pdf2md stands

### The head-to-head numbers

On the 26 blind PDFs (blind sets 1–3), scored by pdf2md's own heuristic scorer
(`test-corpus/evaluate-blind*.ts`), against `@opendocsg/pdf2md` 0.3.6:

| | pdf2md | opendocsg |
|---|---:|---:|
| Weighted score, metadata excluded | 9.03 | 8.78 |
| Weighted score, all 9 dimensions | 9.03 | 8.60 |
| Tables | 8.4 | 6.3 |
| No garbage | 9.3 | 8.5 |
| Code blocks | 8.1 | 8.7 |
| Headings / paragraphs / lists / links / readability | level | level |
| PDFs where it scores higher (metadata excluded) | 18 | 5 (all by ≤0.4) |
| Total conversion time, 26 PDFs, same machine | 69.4 s | 55.1 s |

### Read those numbers with care

The scorer counts whether things are present. It does not check whether they are correct,
so the numbers above say little about real quality:

- **Tables.** Any output with 3 or more `|` lines scores 9 (`evaluate-blind.ts:180-196`).
  opendocsg never outputs a Markdown table (0 table lines across all 26 outputs),
  so its 6.3 measures that it never tries. pdf2md's 8.4 does not show that its
  tables are right. Some are not (see the currency and lost-row item).
- **Code blocks.** In most categories, having no code fences scores 9 (`evaluate-blind.ts:198-231`).
  opendocsg outputs 0 code fences in the whole corpus. Its "better code
  blocks" score is pdf2md being penalised for 25 false-positive fences in
  brochures, tax forms and papers. opendocsg scores 2/10 on RFC 9293, where code
  is expected. pdf2md scores 9.
- **Links.** 10 or more links score 9 (`evaluate-blind.ts:233-254`), whatever they
  point at. pdf2md's link output is badly wrong (next section), and the scorer
  cannot see it.
- **Scanned PDF.** opendocsg "wins" `patent-waymo-autonomous.pdf` 6.5 vs 6.1, but
  both produce no text. opendocsg returns only `<!-- PAGE_BREAK -->` lines. pdf2md
  returns `status: failed, no_extractable_text`, which is the more honest result.
- The scorer was written while pdf2md was being built, and its categories reward
  what pdf2md does.

The honest conclusion is narrow. pdf2md produces more structure (tables, code fences,
YAML metadata) and is about level elsewhere. Neither converter has been checked
against ground truth.

### Silent errors the scorer cannot see

Reading the outputs side by side and checking them against the code turned up
problems that matter more than any score gap:

1. **Links are attached to text on the wrong pages.** `AnnotationLink` has no page
   number (`converter.ts:52-55`). `matchLinksToText` (`converter.ts:887-932`) checks
   every text item against every link rectangle in the whole document, so a link on
   page 3 wraps any text at the same position on every other page. Measured
   (link annotations with a URL → `](http` links in the output):
   - IRS Pub 17: 273 → 12,328
   - GPO style manual: 45 → 9,096
   - RFC 9293: 201 → 3,129
   - Tao math paper: 13 → 1,217
   - tracked training PDF `code-book-think-python.pdf`: 176 → 9,953

   Example from the Tao paper: `[(](https://doi.org/10.1007/s00454-022-00426-4)`
   appears 9 times, and `[Z](https://arxiv.org/abs/2303.10798) [=](https://arxiv.org/abs/2303.10798)`
   wraps single math symbols. This also accounts for most of the "math papers are
   weaker" observation, and for part of the slowness on long documents
   (O(items × links)).
2. **Every standalone number in the document is deleted when the PDF has page
   numbers.** `detectRepeatedText` normalises digits to `#` (`converter.ts:722`), so
   page numbers become the repeated string `"#"`. `filterHeadersFooters`
   (`converter.ts:756-765`) then removes every item on every page whose text is `"#"`,
   not just items in the header and footer bands. An instrumented scratch copy shows
   455 items removed across 79 pages of the Amazon annual report, and 357 in the MIT
   thesis. Effects visible in the output:
   - The Amazon free-cash-flow table loses its `2022 2023` column headers. "2022"
     appears 108 times in pdf2md's Amazon output vs 196 in opendocsg's.
   - Thesis table-of-contents entries lose their page numbers and chapter numbers
     (`1 Introduction 17` becomes `### Introduction`).
   - Probably the bare `M ⩾ ,` in the Tao paper, where the number after ⩾ is missing.
3. **Inline bold, italic and monospace detection never fires on real PDFs.**
   `isBold`, `isItalic` (`converter.ts:75-78`, `164-167`) and `isMonospace`
   (`detection.ts:28-33`) test `item.fontName`. PDF.js sets that to an internal id
   (`g_d0_f1`), not the font's name. The real name (`QGLBAA+TimesNewRomanBold`,
   `BMJGOD+TimesNRMTPro-Italic`) is only available from `page.commonObjs` after
   `page.getOperatorList()` (checked on the Amazon and Raspberry Pi PDFs with PDF.js
   5.5.207). So `applyInlineFormatting` (`converter.ts:938-946`) never adds
   markers. Across the corpus, pdf2md's output contains 25 `**`, all literal
   asterisks from the IRS text. opendocsg's contains 784 `**` (about 390 bold spans)
   and 121 `_italic_` spans. The unit tests pass only because they use made-up font
   names such as `"Courier"` and `"Courier-Bold"` (`converter.test.ts:237-251`). The
   "Verified-present" section of `IMPLEMENTATION_PLAN.md` lists "bold/italic" and
   "link annotation matching" as shipped. Both should come off that list.
4. **Words are always joined with a space.** `assembleBlockText` joins items with
   `" "` (`converter.ts:979`, `992`, `995`), even when PDF.js splits a word from the
   punctuation after it. The pattern `[a-z] [.,;:)]` occurs 3,874 times in pdf2md's
   blind output and 19 times in opendocsg's. Some of the 3,874 are table-of-contents
   dot leaders. Example (Amazon): `building primitive services . Think of them`, where
   opendocsg gives `building **primitive services**. Think of them`.

### Adoption facts

- **The main consumer uses opendocsg's internals, not its public API.**
  Desktop Commander (`src/tools/pdf/lib/pdf2md.ts`) does not call
  `pdf2md(buffer, callbacks)`. It loads `@opendocsg/pdf2md/lib/util/pdf` (`parse`) and
  `lib/util/transformations` (`makeTransformations`, `transform`) with a synchronous
  `createRequire` inside a `LazyPackage`. It needs:
  - per-page Markdown
  - page selection, as a number list or `{offset, length}` with a negative offset
    meaning the last N pages
  - metadata: title, author, creator, producer, PDF version, creation and
    modification dates, encrypted flag, page count

  Its LazyPackage comment cites package load times of 25–90 s on one user's machine
  timing out clients (DC #715). It pins `"@opendocsg/pdf2md": "0.3.4"` and
  `"unpdf": "~1.8.1"`.
- **`@pdf2md/core` cannot be loaded with `require()`.** Its `exports` has only an
  `import` condition. On Node 22.22, `require("@pdf2md/core")` throws
  `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- **`convert()` rejects a Node `Buffer`.** Passing the result of `fs.readFile`
  returns `status: failed`, `parse_failed: Please provide binary data as Uint8Array,
  rather than Buffer`. opendocsg wraps its input in `new Uint8Array(...)`.
- **Install footprint**, measured with fresh `npm install` on macOS arm64, 6 Nov:

  | Package | Size | Packages | Notes |
  |---|---:|---:|---|
  | `@pdf2md/core@0.3.0` | 61 MB | 4 | pdfjs-dist 35 MB; `@napi-rs/canvas-darwin-arm64` native binary 25 MB, pulled in as pdfjs-dist's optional dependency |
  | `@opendocsg/pdf2md@0.3.6` | 2.9 MB | 4 | uses unpdf's bundled PDF.js |
  | `@pdf2md/mcp@0.1.0` | 84 MB | 100 | |

  pdf2md's own code is 194 kB unpacked.
- **PDF.js version drift.** `"pdfjs-dist": "^5.2.133"`. The repo tests 5.5.207. A
  fresh install today resolves 5.7.284, a version CI has never run. The caret keeps
  out PDF.js 6.x (latest 6.5.438), where 6.4 stopped keeping font names unless
  `fontExtraProperties: true` is set. That is the change that broke Desktop
  Commander's PDF reads.
- **The browser setup is fragile even in pdf2md's own app.**
  - `apps/web/next.config.ts` needs about 80 lines to work around webpack#20095. It
    copies `pdf.min.mjs` into `public/`, sets it as an external, and aliases canvas
    to `false`.
  - `pdf-worker.ts:6` resolves the worker with a bare specifier inside
    `new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url)`. Some bundlers
    do not rewrite that.
  - This is the same kind of problem as opendocsg issues #76 (webpack) and #80
    (Next.js production).
- **The MCP package never got the core improvements.** `@pdf2md/mcp@0.1.0` on npm
  depends on `@pdf2md/core` **0.2.0** exactly (`workspace:*` was resolved at publish
  time). It has hardcoded `version: "0.1.0"` (`packages/mcp/src/index.ts:13`), uses
  the deprecated `server.tool` API (SDK 1.29 marks it `@deprecated Use registerTool`),
  and its bin list includes a generic `mcp` command.
- **Speed.** pdf2md took 1.26× opendocsg's total time and about 2× on the longest
  documents: IRS Pub 17 14.7 s vs 7.1 s, GPO manual 8.6 s vs 5.5 s. Single runs on
  one machine, so treat these as indicative.

### Before starting

`pnpm test` currently fails: 1 failed and 98 passed, in `src/readme.test.ts:32`. The
test expects the README to contain `Try it online:`, which commit `c4b11e4` removed.
The Forge gates (`pnpm typecheck`, `pnpm test`) are red until the test is brought in
line with the README decision.

---

## 2. Proposed items

Each item lists the problem with its evidence, the approach, acceptance criteria a
gate can check, complexity and dependencies. "Gate" means `pnpm typecheck`,
`pnpm test` and the corpus smoke test.

**Fixtures.**
- The blind PDFs are not tracked in git, so CI cannot use them. Gate-level
  acceptance uses either fixtures generated with `pdf-lib` (already used by
  `test-corpus/create-pdfs.mjs`) or the 28 tracked `test-corpus/real-pdfs/` files.
- Checks against the blind sets are listed separately as local checks for the
  autoresearch runner.

### (a) Output quality

### Proposed — Page-scoped link matching

- **Problem:** Link annotations are matched to text on every page, not just their
  own (`converter.ts:52-55`, `887-932`, `236`). Output links exceed real
  annotations by 10–90×. For example, the tracked `code-book-think-python.pdf` has
  176 URL annotations and 9,953 output links. Single glyphs get wrapped, as in
  `[(](https://doi.org/…)`. The vertical centre is also computed as
  `item.y + height/2`, but `item.y` is the baseline in top-down coordinates, so the
  glyph box runs from `y - height` to `y`.
- **Approach:**
  - Store `page` on `AnnotationLink` and match only items on the same page, using a
    per-page bucket so the matching becomes linear.
  - Fix the item box.
  - Merge consecutive items that share a URL into one `[text](url)`.
  - Do not wrap items that are only punctuation or symbols unless they fill the
    link rectangle.
- **Acceptance criteria:**
  - A new `pdf-lib` fixture places the same text at the same position on 3 pages,
    with a URL annotation on page 2 only. The output contains exactly one link, on
    the page 2 text.
  - For every tracked `real-pdfs/` file, the number of `](http` links in the output
    is at most the number of URL annotations plus the number of bare `http(s)://`
    URLs in the PDF.js text layer. This is checked by a vitest that uses the link
    precision metric from "Text-fidelity checks".
  - No two adjacent links in the output share a URL.
  - The existing smoke links (`https://windows.github.com`, `http://git-scm.com`)
    are still present.
  - Local check: IRS Pub 17 output has ≤ 400 links (273 annotations plus bare URLs).
- **Complexity:** low
- **Depends on:** none. "Text-fidelity checks" should land first so the improvement
  is measured.
- **Status:** proposed

### Proposed — Restrict header/footer stripping to the header and footer bands

- **Problem:** `filterHeadersFooters` (`converter.ts:756-765`) removes any item,
  anywhere on the page, whose digit-normalised text matches a repeated header or
  footer. A page number normalises to `"#"`, so every standalone integer in the body
  is deleted: years in table headers, TOC page numbers, chapter numbers, table
  cells. An instrumented copy removed 455 items across 79 pages of the Amazon 10-K.
- **Approach:**
  - Record, for each repeated string, the band (top or bottom) and approximate x
    position where it was found.
  - Remove an item only if it falls inside that band on its page, with x within a
    tolerance.
  - Keep the 50% page threshold.
- **Acceptance criteria:**
  - A `pdf-lib` fixture with 5 pages has footer page numbers 1–5, a body table whose
    cells include `2022` and `17`, and a TOC line ending in `17`. The output has no
    footer numbers, and every body number is still present.
  - A test asserts that the numeric-token recall from "Text-fidelity checks" is ≥ 0.98
    on every tracked `real-pdfs/` file, with page numbers excluded.
  - Repeated running headers on the tracked multi-page PDFs are still stripped:
    existing tests stay green.
  - Local check: the Amazon output contains `2022` at least 180 times (opendocsg: 196).
- **Complexity:** low
- **Depends on:** "Text-fidelity checks" for the recall metric
- **Status:** proposed

### Proposed — Inline bold and italic from real font names

- **Problem:** The bold, italic and monospace checks run on PDF.js's internal font
  id (`g_d0_f1`), so they never match a real PDF (`converter.ts:75-78`, `164-167`,
  `938-946`; `detection.ts:28-33`, `343`). pdf2md emits no inline emphasis. opendocsg
  emits about 390 bold and 121 italic spans across the same corpus.
  `detectEmphasisFonts` (`converter.ts:90-162`) is a workaround for the missing names.
- **Approach:**
  - In `extractPageItems`, call `page.getOperatorList()` once per page.
  - Resolve each `fontName` with `page.commonObjs.get(id)` and read `.name`, with the
    subset prefix `ABCDEF+` stripped.
  - Pass `fontExtraProperties: true` to `getDocument`. PDF.js ≥6.4 needs it to keep
    `name`; on 5.x it is harmless.
  - Store `fontRealName`, `bold`, `italic` and `monospace` on `ExtractedItem`. Use the
    name regex first, then font flags when present.
  - Emit emphasis per run of consecutive same-style items on a line, not per item,
    so the output is `**primitive services**`, never `**primitive** **services**`.
  - Never emit emphasis inside headings, code blocks, or blocks that are entirely
    bold (the heading and emphasis-line classifier already handles those).
  - Put trailing punctuation outside the markers.
  - Keep `detectEmphasisFonts` only as a fallback when names cannot be resolved.
  - Add `emphasis?: boolean` (default `true`) to `ConvertOptions`.
  - Measure what `getOperatorList()` costs. It was 6–42 ms per page in a spot check.
- **Acceptance criteria:**
  - A `pdf-lib` fixture with a Helvetica body line containing a HelveticaBold span
    and a HelveticaOblique span produces `**bold span**` and `*italic span*`, with
    no space before the following punctuation.
  - No `****`, `** **` or `**` immediately followed by whitespace anywhere in the
    tracked-corpus outputs (vitest over `real-pdfs/`).
  - No emphasis markers inside fenced code or heading lines.
  - A unit test uses a real PDF fixture, not a made-up font name, to show that
    `isBold` sees a bold font.
  - Total corpus conversion time rises by ≤ 15% (benchmark from "Performance budget").
  - Local check: blind-corpus output contains ≥ 300 bold spans.
- **Complexity:** med
- **Depends on:** none. It interacts with "PDF.js version policy" because of
  `fontExtraProperties`.
- **Status:** proposed

### Proposed — Gap-aware joining of text runs

- **Problem:** `assembleBlockText` always joins items with a space
  (`converter.ts:979`, `992`, `995`; also `codeBlockToMarkdown` `1012`). The result is
  `primitive services .`, `M ⩾ ,`, `( 46,752 )`. The pattern `[a-z] [.,;:)]` occurs
  3,874 times in pdf2md's blind output and 19 times in opendocsg's.
- **Approach:**
  - On the same line, insert a space only if the previous string does not already
    end in whitespace and the horizontal gap `next.x - (prev.x + prev.width)` exceeds
    about 0.15 × font size.
  - Never insert a space before closing punctuation, or after an opening
    bracket or quote, when the gap is below the threshold.
  - Keep line-to-line joining as it is. Hyphen repair already exists.
- **Acceptance criteria:**
  - A `pdf-lib` fixture draws `services` and `.` as separate runs with no gap and
    produces `services.`. Two runs with a normal word gap still produce two words.
  - On tracked `real-pdfs/`, the space-before-punctuation rate (from "Text-fidelity
    checks") is ≤ 5 per 10,000 words.
  - Word recall against the text layer does not drop by more than 0.5 points on any
    tracked file, so the change does not glue words together.
  - Local check: the blind-corpus count of `[a-z] [.,;:)]` is ≤ 400, down from 3,874.
- **Complexity:** low
- **Depends on:** "Text-fidelity checks"
- **Status:** proposed

### Proposed — Table cell cleanup: currency symbols, split tables, lost rows

- **Problem:**
  - Currency symbols become their own columns:
    `| Net cash provided by (used in) operating activities | $ | 46,752 | $ | 84,946 |`
    (Amazon). There are 11 rows like this in the blind output.
  - The same Amazon table is split into two tables, and its
    `Purchases of property and equipment… (58,321) (48,133)` row is missing from the
    first one. "58,321" appears twice in pdf2md's output and 3 times in opendocsg's
    (prose form).
  - The column headers `2022 2023` are lost. That part is the header/footer bug.
  - Tables are detected per paragraph block (`converter.ts:864-880`,
    `detection.ts:43`). When the block grouper splits a table, it becomes separate
    tables, and rows with fewer cells can fall outside both.
- **Approach:**
  - After `detectTable`, merge a cell that is only `$ € £ ¥` into the numeric cell to
    its right, and a cell that is only `%` into the cell to its left.
  - Drop columns that are empty in every row.
  - Before detection, merge adjacent paragraph blocks whose items share column x
    positions, so a table is not split by a row with fewer cells. Rows with fewer
    cells are placed by x position, not by index.
  - Trace the lost-row cause before coding the fix.
- **Acceptance criteria:**
  - A `pdf-lib` fixture of a 3-row financial table, with `$` drawn as a separate
    run, produces `| … | $46,752 | $84,946 |`.
  - Every row label in the fixture appears exactly once in the output.
  - The fixture's one table comes out as one table.
  - The tracked `tables-cdc-report.pdf` and `tables-census-poverty.pdf` outputs
    contain no column that is empty in every row.
  - The table-cell checks from "Hand-checked reference set" pass for the table
    pages in that set.
  - Local check: no `| $ |` cell in the blind outputs.
- **Complexity:** med
- **Depends on:** "Restrict header/footer stripping" (for the lost headers);
  "Hand-checked reference set" for the table checks
- **Status:** proposed

### Proposed — Fewer false-positive code blocks, using real monospace fonts

- **Problem:** pdf2md emits 55 code blocks across the blind outputs. Many are not
  code:
  - `nps.gov/grca/learn/nature` (brochure)
  - `D = { x , y w , y l ) } i =1` (Lancet)
  - `and face prosecution if I give false information. DD MM YYYY` (UK tax form)

  The monospace signal (`detection.ts:343`, `357`) is dead for the same reason as
  bold. Code detection relies on "subset font" heuristics (`detectCodeFont`,
  `detection.ts:151`), which also catch captions, URLs and math.
- **Approach:**
  - Make a monospace real font name (from the bold/italic item) the primary signal.
  - Require at least 2 lines for the subset-font signal.
  - Reject single-line blocks that are a URL, a date format, or that
    `looksLikeMath` accepts.
  - Keep `looksLikeCode` as the positive check.
- **Acceptance criteria:**
  - Tracked `code-haskell-report.pdf`, `code-book-think-python.pdf` and
    `code-git-cheatsheet.pdf` keep at least their current number of code blocks.
    The test asserts the counts.
  - A `pdf-lib` fixture with a one-line URL and a `DD MM YYYY` line in a
    non-monospace subset font produces no code fence.
  - Local check: no code fences in the brochure, Lancet, UK tax form, IRS and NJ
    Transit outputs, and RFC 9293 keeps ≥ 7.
- **Complexity:** med
- **Depends on:** "Inline bold and italic from real font names"
- **Status:** proposed

### Proposed — Table-of-contents and dot-leader lines

- **Problem:** TOC lines keep their dot leaders and lose their numbers:
  `1.1 Dense Retrieval . . . . . . . . . . . . . . . . . . . . .` (MIT thesis). Chapter
  entries are promoted to headings (`### Introduction`), and one is split across two
  headings (`### DiffCSE: … Sentence Em-` / `### beddings and Dense Retrieval`).
- **Approach:**
  - Detect lines with a dot-leader run (`(\.\s?){4,}`) followed by a page number.
  - Output them as list items with the leader removed: `- 1.1 Dense Retrieval — 17`.
  - Do not promote such lines to headings.
  - Join heading fragments whose first line ends in a hyphen.
- **Acceptance criteria:**
  - A `pdf-lib` TOC fixture produces list items with page numbers and no line
    matching `(\. ){5,}`.
  - No heading in the tracked-corpus outputs ends with `-`.
- **Complexity:** low
- **Depends on:** "Restrict header/footer stripping" (or the numbers are still lost)
- **Status:** proposed

### Proposed — Performance budget and benchmark

- **Problem:** pdf2md took 69.4 s for the 26 blind PDFs against opendocsg's 55.1 s,
  and about 2× on the longest documents. Link matching is O(items × links). The
  bold/italic item adds a `getOperatorList()` call per page.
- **Approach:**
  - Add a `pnpm bench` script that converts the tracked corpus 3 times and writes
    per-file median milliseconds and peak RSS to JSON. The autoresearch runner
    records it.
  - Fix link matching as part of the page-scoped link item.
  - Profile the 3 slowest files and fix the top hotspot.
  - Do not gate CI on timings, because they are noisy.
- **Acceptance criteria:**
  - `pnpm bench` exists and writes `bench/latest.json`.
  - The autoresearch summary includes total milliseconds.
  - Local check: total blind-corpus time is ≤ opendocsg's on the same machine,
    measured after the bold/italic item lands.
- **Complexity:** low
- **Depends on:** "Page-scoped link matching"
- **Status:** proposed

### Proposed — Optional OCR add-on for scanned pages (no upload)

- **Problem:** Scanned PDFs return `no_extractable_text`
  (`converter.ts:1631-1650`). The tracked `scanned-declaration.pdf` and the Waymo
  patent produce nothing. `docs/spec.md:206, 231, 375` assumes OCR needs a server
  backend, which would break the no-upload promise.
- **Approach:**
  - Create a separate package, `@pdf2md/ocr`, so `@pdf2md/core` gains no
    dependency.
  - Core accepts `ocr?: (page: PageImage) => Promise<OcrBlock[]>`. It calls it only
    for pages whose text layer has fewer than about 20 characters.
  - `@pdf2md/ocr` renders the page with PDF.js (a canvas in the browser;
    `@napi-rs/canvas` as an optional peer in Node) and runs tesseract.js.
  - The web app loads the tesseract worker, wasm core and language data lazily, from
    its own origin, never from a third-party CDN.
  - OCR output goes through the normal block pipeline. The result is
    `status: partial`, with a new warning code `ocr_used` that lists the page numbers.
  - The download size (wasm plus `eng` data, several MB) is shown before the first
    use in the web app.
  - This changes the direction in `docs/spec.md`. Graham decides first, then the
    spec is updated.
- **Acceptance criteria:**
  - `@pdf2md/core`'s `dependencies` is unchanged.
  - With `@pdf2md/ocr`, `scanned-declaration.pdf` produces ≥ 200 words. Without it,
    it still returns `no_extractable_text`.
  - A Playwright test converting a scanned PDF in the web app records zero requests
    to hosts other than the app's own origin.
  - Pages that already have text are never OCR'd (test with a mixed PDF fixture).
- **Complexity:** high
- **Depends on:** "Install footprint" (canvas handling); a spec decision from Graham
- **Status:** proposed

### (b) Evaluation

### Proposed — Text-fidelity checks (no ground truth needed)

- **Problem:** The scorer rewards presence. It gave the cross-page link output 9/10
  and cannot see deleted numbers or stray spaces.
- **Approach:**
  - Add `test-corpus/fidelity.ts`. For each PDF it extracts the raw PDF.js text layer
    (no heuristics) and compares it with the Markdown after the Markdown syntax is
    stripped:
    - **word recall:** multiset overlap of word tokens
    - **numeric-token recall:** tokens matching `\d[\d,.]*`
    - **link precision:** every output URL must be an annotation on the page of the
      linked text, or a bare URL in the text layer. Output link count ≤ annotations
      + bare URLs.
    - **space-before-punctuation rate per 10k words**
    - **counts:** emphasis spans and code fences
  - Report these as separate columns in the evaluate reports, not folded into the
    9-dimension score, so history stays comparable.
  - Change the autoresearch acceptance rule (`autoresearch/README.md`) so an
    experiment fails if any document's word recall drops by > 0.5 points, its
    numeric recall drops at all, or its link precision falls below 0.95.
- **Acceptance criteria:**
  - `fidelity.ts` runs on `real-pdfs/` from a vitest. It asserts the metrics are
    computed for every tracked file and match a committed baseline JSON within
    tolerance (ratchet: the baseline can only improve).
  - `compare-results.ts` prints PASS/FAIL using the new rule.
  - The current link-precision failure on `code-book-think-python.pdf` is visible in
    the first report.
- **Complexity:** low
- **Depends on:** none
- **Status:** proposed

### Proposed — Hand-checked reference set with unit tests

- **Problem:** No test checks output correctness against a known answer.
- **Approach:**
  - Pick 12–15 pages from tracked `real-pdfs/` that are licence-clean: US government
    documents, arXiv CC-BY papers, RFCs. Cover headings, lists, tables, links,
    emphasis, code, two columns and footnotes.
  - Write tests in olmOCR-bench's JSONL style:
    - `present`: text present
    - `absent`: e.g. headers, footers, page numbers
    - `order`: text A before text B
    - `table`: a cell value and its right or below neighbour
  - Add three types olmOCR-bench lacks: `heading` (text and level), `link` (text → URL)
    and `emphasis`.
  - For the 21 of 54 corpus PDFs that are tagged, generate draft heading, list and
    table tests from the structure tree. A person reviews each draft before it is
    committed, because tags are often wrong.
  - Write the runner in TypeScript (`test-corpus/reference/run.ts`). Run it from
    vitest as a ratchet: the pass count can only go up.
- **Acceptance criteria:**
  - At least 150 tests across at least 12 pages are committed under
    `test-corpus/reference/`.
  - The runner prints the pass rate by test type, and a vitest fails if the pass
    count drops below the committed baseline.
  - Running the same suite with opendocsg via the head-to-head harness item gives a
    comparable number.
- **Complexity:** med
- **Depends on:** "Commit the head-to-head harness" (for the comparison only)
- **Status:** proposed

### Proposed — olmOCR-bench born-digital subsets runner

- **Problem:** pdf2md needs a public, third-party benchmark that it does not control.
- **Evidence:** olmOCR-bench (allenai, ODC-BY-1.0) has 1,403 PDFs and 7,010 unit
  tests, of these types: present, absent, order, table and math. Four subsets fit a
  text-layer converter:

  | Subset | PDFs | Tests |
  |---|---:|---:|
  | headers_footers | 266 | 753 |
  | multi_column | 231 | 884 |
  | table_tests | 188 | 1,020 |
  | long_tiny_text | 62 | 442 |

  Two parts need more than a text layer:
  - The math tests (3,385) compare rendered KaTeX layouts.
  - old_scans needs OCR.

  OmniDocBench is not a fit: it is page images with Python-only metrics (edit
  distance, TEDS, CDM), so it only becomes relevant after OCR. I have not checked
  whether every PDF in the four subsets has a text layer. The first step measures
  that.
- **Approach:**
  - A download script fetches the dataset into an ignored directory (not
    committed).
  - A TypeScript port of the present, absent, order and table checks, with fuzzy
    matching as olmOCR does it.
  - The runner reports pass rate per subset, per converter (pdf2md and opendocsg), and
    the share of PDFs with no text layer.
  - Math and old_scans are skipped and reported as skipped.
- **Acceptance criteria:**
  - `pnpm bench:olmocr` runs end to end on a local copy and writes JSON results.
  - A unit test checks the ported check functions against 10 hand-made
    test/Markdown pairs, including olmOCR's own examples where available.
  - Results are documented in `docs/quality-testing.md` with the method and the
    skipped subsets.
- **Complexity:** med
- **Depends on:** "Commit the head-to-head harness"
- **Status:** proposed

### Proposed — Commit the head-to-head harness

- **Problem:** The opendocsg comparison lives in a scratch folder: a patched copy of
  `evaluate-blind*.ts` with a `CONV` switch, plus `compare.py`. It cannot be rerun.
- **Approach:**
  - Add a converter adapter (`CONV=pdf2md|opendocsg`) to the evaluate scripts and a
    TypeScript comparison script.
  - Add `@opendocsg/pdf2md` as a devDependency with an exact version.
  - Write output to ignored directories.
  - Use the adapter for the fidelity, reference and olmOCR runners too.
- **Acceptance criteria:**
  - `pnpm compare:opendocsg` produces a per-PDF and per-dimension table for the
    heuristic scorer, the fidelity metrics and the reference tests.
  - It is documented in `docs/quality-testing.md`, with the scorer caveats from
    section 1 of this spec.
- **Complexity:** low
- **Depends on:** none
- **Status:** proposed

### (c) Adoption and integration for agent tools

### Proposed — Accept Node Buffers and load with `require()`

- **Problem:**
  - `convert(fs.readFileSync(p))` fails with `parse_failed: Please provide binary
    data as Uint8Array, rather than Buffer`.
  - `require("@pdf2md/core")` throws `ERR_PACKAGE_PATH_NOT_EXPORTED`, because
    `package.json` `exports` has only `import`.
  - Desktop Commander loads its PDF library with a synchronous `require()` inside a
    lazy loader.
  - `engines` says `>=18`, but Node 18 cannot `require()` ESM at all.
- **Approach:**
  - Accept `ArrayBuffer | Uint8Array` (Buffer included). Always pass PDF.js a fresh
    `Uint8Array` copy, so a Buffer is accepted and the caller's buffer is never
    detached.
  - Build both ESM and CJS (tsc twice, or tsup) and add `require` and `default`
    conditions.
  - Keep top-level code free of `await`.
  - Add a packaging test that runs `npm pack`, installs into a temp directory,
    `require()`s and `import`s, converts a Buffer, and runs `publint` and
    `@arethetypeswrong/cli`.
- **Acceptance criteria:**
  - Packaging test passes on Node 20 and 22 in CI.
  - `convert(Buffer)` and `convert(Uint8Array)` return `success` on a tracked PDF.
  - After `convert`, the caller's `ArrayBuffer` still has its original `byteLength`.
  - `attw` reports no problems.
- **Complexity:** low
- **Depends on:** none
- **Status:** proposed

### Proposed — Page selection and per-page output

- **Problem:** Core only has `maxPages` (`types.ts:61`, `converter.ts:1574`). Agent
  tools read large PDFs in slices. Desktop Commander uses a page list or
  `{offset, length}`, where a negative offset means the last N pages. It needs
  per-page Markdown plus richer metadata, and currently reaches into opendocsg
  internals to get them.
- **Approach:**
  - Add `pages?: number[] | { offset: number; length?: number }` (1-based list,
    0-based offset, negative offset counts from the end, as Desktop Commander does).
  - Add `perPage?: boolean`. It adds
    `result.pages: { pageNumber: number; markdown: string }[]`.
  - Add `pageMarkers?: "none" | "comment"`. `comment` emits `<!-- page N -->`.
  - Compute document-level statistics (font profile, header/footer detection) on the
    selected pages plus up to 10 neighbouring pages, so a one-page read still strips
    headers. Output only the selected pages.
  - Extend `ConversionMetadata` with `creator`, `producer`, `pdfVersion`,
    `modificationDate`, `isEncrypted`, `isTagged` and `hasTextLayer`. `pageCount`
    already exists in stats.
- **Acceptance criteria:**
  - Tests cover:
    - list selection, offset/length, negative offset, an out-of-range selection
      (empty result, no throw), and duplicate pages (deduplicated)
    - `perPage` output whose page markdowns, concatenated, equal the full markdown
    - headers stripped on a single-page read of a tracked multi-page PDF
  - Selecting 1 page of a 300-page PDF parses at most 11 pages (asserted with a spy
    on `getPage`).
- **Complexity:** med
- **Depends on:** none
- **Status:** proposed

### Proposed — opendocsg-compatible entry point

- **Problem:** Switching from opendocsg should be a one-line change. Its public API
  is `pdf2md(pdfBuffer, callbacks?) => Promise<string>`. The callbacks are
  `metadataParsed`, `pageParsed`, `fontParsed` and `documentParsed`. Pages are joined
  with `<!-- PAGE_BREAK -->` (2,010 such markers across its blind output), and some
  downstream code splits on that marker.
- **Approach:**
  - Add a `@pdf2md/core/compat` subpath whose default export has opendocsg's
    signature and TypeScript types.
  - It returns Markdown with pages joined by `<!-- PAGE_BREAK -->\n`.
  - It fires `metadataParsed` and `pageParsed` with documented, close-enough shapes,
    and `fontParsed` and `documentParsed` best-effort.
  - Every difference is listed in the migration doc.
- **Acceptance criteria:**
  - A test runs opendocsg's README usage against the compat entry, and the type test
    compiles opendocsg's `types/pdf2md.d.ts` usage against it.
  - Page break count equals page count − 1.
  - Works with both `require` and `import`.
- **Complexity:** low
- **Depends on:** "Accept Node Buffers and load with require()"; "Page selection and
  per-page output"
- **Status:** proposed

### Proposed — PDF.js version policy and upgrade canary

- **Problem:**
  - `"pdfjs-dist": "^5.2.133"` lets users get PDF.js versions CI never ran (5.7.284
    today, against 5.5.207 tested).
  - Moving to 6.x needs `fontExtraProperties: true` to keep font names.
  - Desktop Commander had to pin unpdf after PDF.js 6.4 broke its reads.
  - PDF.js also prints warnings on every conversion, such as
    `Warning: TT: undefined function: 32`. They go to stderr (`console.warn` in
    5.5), so MCP stdio is safe, but they are noise in CLIs and logs.
- **Approach:**
  - Publish with a tilde range on a tested minor (`~5.5.207`, or the version the
    canary last passed).
  - Add a weekly CI canary that installs the latest 5.x and 6.x, runs the gate,
    fidelity and reference suites, and opens an issue on failure.
  - Set `verbosity: 0` by default, with `verbose` as an option.
  - Add an optional `pdfjs` option so apps that already ship PDF.js can inject their
    own and avoid a second copy.
  - Record the policy in `docs/spec.md`.
- **Acceptance criteria:**
  - The published `package.json` has a tilde or exact range.
  - The canary workflow exists and runs against the latest 6.x (it may fail at first,
    and the failures are listed).
  - No PDF.js warning text appears on stderr for a default CLI conversion of a
    tracked PDF.
  - A test injects a PDF.js instance via the option.
- **Complexity:** med
- **Depends on:** "Text-fidelity checks" and "Hand-checked reference set" (what the
  canary runs)
- **Status:** proposed

### Proposed — Install footprint

- **Problem:** A fresh `npm install @pdf2md/core` is 61 MB, against 2.9 MB for
  opendocsg:
  - pdfjs-dist is 35 MB because it ships both its modern and legacy builds.
  - `@napi-rs/canvas-darwin-arm64` is a 25 MB native binary, pulled in as an
    optional dependency of pdfjs-dist. Text extraction never uses it.

  `@pdf2md/mcp` is 84 MB with 100 packages. Agent tools are installed with `npx`, so
  size and native binaries are paid on every cold start.
- **Approach:**
  - Spike: run the full corpus with unpdf's bundled serverless PDF.js build (unpdf
    2.1.0 installs at 3.6 MB with no required native dependency) and compare outputs
    byte for byte.
  - If they are identical, or the differences are explained, use unpdf's build for
    Node and keep pdfjs-dist (or unpdf) for the browser.
  - The canvas question then moves entirely to `@pdf2md/ocr`.
  - If unpdf is rejected, document `--omit=optional` and keep pdfjs-dist.
- **Acceptance criteria:**
  - A CI job does a fresh install of the packed `@pdf2md/core` and asserts
    `node_modules` ≤ 10 MB with no `.node` binaries on linux-x64.
  - Corpus outputs are unchanged, or a reviewed diff is committed with the change.
  - The MCP package fresh install is ≤ 25 MB.
- **Complexity:** med
- **Depends on:** "PDF.js version policy and upgrade canary"
- **Status:** proposed

### Proposed — Zero-config browser bundling

- **Problem:**
  - pdf2md's own Next.js app needs about 80 lines of webpack workaround
    (`apps/web/next.config.ts:1-80`): static copy of `pdf.min.mjs`, an `externals`
    rewrite, and `canvas` aliases.
  - `pdf-worker.ts:6` uses a bare specifier inside `new URL(…, import.meta.url)`.
    Whether Vite and Turbopack resolve that is unverified.
  - opendocsg's open issues #76 (webpack) and #80 (Next.js production) are this
    problem. Being the converter that drops into any bundler is a real advantage.
- **Approach:**
  - Add `workerSrc` and `workerPort` options, and a documented no-worker mode for
    small files.
  - Add an `@pdf2md/core/browser` entry that ships a pre-bundled PDF.js and starts
    its worker from a Blob URL, so bundlers have nothing to resolve.
  - Add `examples/` apps:
    - Vite
    - Next 15 (webpack)
    - Next with Turbopack
    - a plain `<script type="module">` page

    Each is built in CI and converts a PDF under Playwright.
  - Once the entry works, delete the workaround from `apps/web`.
- **Acceptance criteria:**
  - All 4 example apps build with default config and convert
    `test-corpus/simple-report.pdf` in Playwright, in dev and production builds.
  - `apps/web/next.config.ts` has no PDF.js-specific webpack code.
  - The privacy test (no network requests other than same-origin assets during
    conversion) passes in every example.
- **Complexity:** high
- **Depends on:** "Accept Node Buffers and load with require()"; "Install footprint"
- **Status:** proposed

### Proposed — File-size limit and timeout as options

- **Problem:**
  - `convert()` rejects anything over 15 MB in every environment
    (`converter.ts:1500`), including the CLI and MCP. opendocsg has no limit.
  - The `timeout` code exists (`types.ts:11`) but nothing sets it.
  - Errors after page extraction are not caught, so `convert()` can throw instead of
    returning `failed`, and `doc.destroy()` (`1591`, `1633`, `1747`) is never awaited
    or run in a `finally`.
- **Approach:**
  - Add a `maxFileSize` option. The web app passes 15 MB. Core, CLI and MCP default
    to no limit (or a high limit with a clear message). Note this as a behaviour
    change in the changelog. `CLAUDE.md` records the 15 MB limit as a key decision,
    made to keep browser memory down. This item keeps it for the browser and changes
    it only for Node, which needs Graham's OK and a matching `CLAUDE.md` edit.
  - Add `timeoutMs`, which aborts through the existing signal path and returns
    `timeout`.
  - Wrap the structuring phase so it returns `parse_failed` with a message.
  - Destroy the document in a `finally`.
- **Acceptance criteria:**
  - Tests cover: a 20 MB fixture converts in Node with default options and fails
    with `oversized` when `maxFileSize` is 15 MB; `timeoutMs: 1` returns `timeout`;
    a forced throw in structuring returns `failed` and does not reject; the
    document is destroyed in every path (spy).
- **Complexity:** low
- **Depends on:** none
- **Status:** proposed

### Proposed — Output stability contract

- **Problem:** Agent tools cache, diff and chunk output, so silent output changes
  between patch releases break them. There are no golden-output tests. The smoke
  test checks a few strings.
- **Approach:**
  - Commit golden Markdown for 6 tracked PDFs, chosen to cover tables, code, two
    columns, links, emphasis and a form.
  - A test fails on any byte difference. Updating a golden file requires the commit
    to say why.
  - Add a determinism test: convert twice and require byte-identical output.
  - Add `CHANGELOG.md` with an "Output changes" section.
  - Semver rule: output changes are minor, API changes are major.
- **Acceptance criteria:**
  - The golden and determinism tests are in `pnpm test`.
  - `CHANGELOG.md` exists and the policy is in the core README.
- **Complexity:** low
- **Depends on:** none. Land it after the first quality fixes, so the golden files
  are not regenerated at every step.
- **Status:** proposed

### Proposed — Migration guide and drafted adopter PRs

- **Problem:** Adoption comes from being the PDF library inside agent tools:
  - Desktop Commander: 1.95M npm downloads a month, pins opendocsg 0.3.4
  - easy-dataset
  - ElizaOS
  - about 235 `package.json` files on GitHub

  Nothing tells their maintainers why or how to switch.
- **Approach:**
  - Write `docs/migrating-from-opendocsg.md`: the compat entry, the page API mapping
    for Desktop Commander's `parse` and `transform` usage, and the differences.
  - Draft PR descriptions as files for Desktop Commander, easy-dataset and ElizaOS,
    with numbers from the reference and olmOCR suites only. Do not use heuristic
    scorer numbers.
  - Drafts only, per the plan's autonomy policy for third-party posting.
- **Acceptance criteria:**
  - The migration doc exists, and its code samples are compiled by a test.
  - The 3 draft files exist under `marketing/drafts/`, each with a before/after
    install size, a reference-suite comparison, and the exact code diff.
- **Complexity:** low
- **Depends on:** "Accept Node Buffers and load with require()"; "Page selection and
  per-page output"; "opendocsg-compatible entry point"; "Hand-checked reference set"
- **Status:** proposed

### (d) MCP and CLI

### Proposed — MCP server 0.2

- **Problem:**
  - `@pdf2md/mcp@0.1.0` (March) pins `@pdf2md/core` 0.2.0, so users never got 0.3.0.
  - It has a hardcoded version string (`packages/mcp/src/index.ts:13`).
  - It uses the deprecated `server.tool` API.
  - Its bin list includes a generic `mcp` command, which risks name clashes.
  - It takes only `file_path` and `max_pages`, and inherits the 15 MB cap.
  - It has no tests.
- **Approach:**
  - Use `registerTool` with two tools:
    - `convert_pdf`: inputs `file_path` or `data_base64`, `pages`, `format`
      (`markdown`, `json` or `chunks`), `chunk_by`, `max_chars`. When output is
      truncated, it returns a `next_pages` hint.
    - `pdf_info`: returns page count, metadata, tagged or not, and which pages have
      a text layer, so agents can plan reads before converting.
  - Return `structuredContent` for JSON output and set `readOnlyHint` annotations.
  - Read the version from `package.json`.
  - Drop the `mcp` bin.
  - Depend on core with a caret range and release both packages together
    (changesets).
  - Add tests with the SDK's in-memory client transport.
- **Acceptance criteria:**
  - Tests cover: tool listing, converting a tracked PDF, a page slice, JSON chunks,
    a missing file, a non-PDF, and truncation with a `next_pages` hint.
  - The published package's dependency on core is a range that includes the current
    core.
  - `npx -y @pdf2md/mcp` starts in < 2 s on a warm cache (measured locally).
- **Complexity:** med
- **Depends on:** "Page selection and per-page output"; "File-size limit and
  timeout as options"
- **Status:** proposed

### Proposed — CLI parity

- **Problem:** The CLI (`packages/core/src/bin/pdf2md.ts`) takes one file and
  `--output`, `--chunk-by` and `--max-tokens`. It always sets
  `includeMetadata: true`. It has no page selection, no output file, no stdin, no
  `--version`, and no quiet mode.
- **Approach:**
  - Add:
    - `--pages 1-5,9` (also `-3` for the last 3 pages)
    - `-o/--out <file|dir>`
    - `-` for stdin
    - multiple files or a directory, writing `.md` files to `--out`
    - `--yaml`
    - `--no-metadata`
    - `--max-size`
    - `--quiet`
    - `--version`
  - Exit codes: 0 success, 2 partial, 1 failure.
  - Use the same option names as MCP and `ConvertOptions`.
- **Acceptance criteria:**
  - CLI tests run the built binary on tracked fixtures for each flag, including stdin
    and directory mode.
  - `--help` lists every option.
  - The exit codes are asserted.
- **Complexity:** low
- **Depends on:** "Page selection and per-page output"
- **Status:** proposed

---

## 3. Recommended order

First five:

1. **Text-fidelity checks.** Cheap. It shows the link, number and spacing problems
   in numbers, and it guards every later change.
2. **Page-scoped link matching.** A correctness bug that affects most documents
   with links and accounts for most of the math-paper mess. Small fix.
3. **Restrict header/footer stripping to the header and footer bands.** A
   correctness bug that deletes table numbers and years. Small fix.
4. **Accept Node Buffers and load with `require()`.** Without this, an agent tool's
   first call (`readFile` then `convert`) fails, and Desktop Commander's loader
   cannot load the package.
5. **Inline bold and italic from real font names.** Closes the one visible
   feature gap with opendocsg and unlocks the monospace code signal.

After those:
- Gap-aware joining
- Page selection and per-page output
- opendocsg-compatible entry point
- MCP server 0.2
- Hand-checked reference set
- PDF.js version policy
- Install footprint
- The remaining quality items
- Browser bundling
- OCR

Restore the green gate (`readme.test.ts`) before item 1.

## 4. What not to do

- **Don't claim "better than opendocsg" publicly using the heuristic scorer.** Its
  table and code dimensions reward presence and absence, not correctness. Use the
  reference and olmOCR suites for public claims.
- **Don't tune for the 9-dimension score.** Add fidelity and reference checks to the
  autoresearch acceptance rule instead.
- **Don't add server-side OCR or any upload path.** OCR stays optional, lazy and
  same-origin.
- **Don't take on math or LaTeX recovery.** Fixing the link bug and the dropped
  numbers covers most of the math-paper damage. Equation recovery needs ML that does
  not fit the size budget.
- **Don't promise true streaming output.** Heading levels, header/footer stripping
  and column detection need document-wide statistics. Keep progress callbacks and
  per-page results.
- **Don't add image extraction yet.** Desktop Commander does its own. Revisit after
  the page API ships, as image placeholders plus an optional callback.
- **Don't fork or vendor PDF.js, and don't jump to PDF.js 6.x without the canary.**
- **Don't open PRs on adopters' repositories or post anywhere.** Drafts only, per
  the existing autonomy policy.
- **Don't spend time on naming.** Decided 6 Nov: keep "pdf2md".
