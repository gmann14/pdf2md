# Changelog

All notable changes to `@pdf2md/core`. Versions follow [semver](https://semver.org/);
before 1.0, a minor version can change the Markdown output.

## 0.4.0 (unreleased)

The default Markdown output changes in this release: it now contains `**bold**`
and `*italic*`, and several fixes change which text, numbers and links appear.
Pin `0.3.x` if you diff or snapshot pdf2md output.

### Added

- **Inline bold and italic.** Runs set in a bold or italic font (read from the
  PDF's real font names) are wrapped in `**…**` and `*…*`, with punctuation kept
  outside the markers and nested spans for mixed styles. Every marker is placed
  where CommonMark can render it, so no literal `*` shows up. Headings and lines
  that are bold throughout get no markers. Turn it off with `emphasis: false`,
  which is also faster (it skips reading each page's fonts).
- **Node `Buffer` input.** `convert()` accepts an `ArrayBuffer` or any
  `Uint8Array`, including a Node `Buffer` from `fs.readFile`. The bytes are
  copied first, so the caller's buffer is never detached.
- **CommonJS.** `require("@pdf2md/core")` works alongside `import`.
- **Page selection.** `pages` (an array or a range string such as `"1-5,9"`)
  converts only those pages, reading the nearby pages it needs for header and
  footer detection. `perPage` returns one Markdown string per page, and
  `pageMarkers: "comment"` adds a page comment before each page. Metadata gains creator, producer,
  pdfVersion, modificationDate, isEncrypted, isTagged and hasTextLayer.
- **`maxFileSizeBytes` and `timeoutMs` options.** Both return a failed result
  instead of throwing.
- **`getPdfInfo()`, `resolvePageSelection()` and `validatePageRange()`.**
- **`@pdf2md/core/compat`.** A drop-in for `@opendocsg/pdf2md`'s default export.
  See `docs/migrating-from-opendocsg.md`.
- **CLI.** `--pages`, `-o/--out`, stdin (`-`), directory batch mode, `--yaml`,
  `--no-metadata`, `--max-size`, `--quiet`, `--version`, and exit codes 0
  (success), 2 (usage) and 1 (conversion failed). `--max-size` is checked
  before a file is read and while stdin is read.

### Changed

- **No file-size limit in Node.** It was 15 MB everywhere. Browsers still
  default to 15 MB, and the web app passes it explicitly.
- **`convert()` no longer rejects** on errors after the PDF is loaded; it
  returns a failed result.
- **Table-of-contents lines** become `- title — page` list items without dot
  leaders. Long leaders elsewhere collapse to `…`, and headings broken at a
  hyphen are joined back together.
- **Code blocks come from real monospace fonts.** URLs, date-format labels and
  captions or formulas in ordinary fonts are no longer fenced.
- **Table cells.** A lone `$ € £ ¥` joins the number after it and a lone `%`
  the number before it. Rows with fewer cells are kept, tables split by a gap
  are joined, empty columns are dropped, and `|` inside a cell is escaped.
- `--help` prints to stdout.

### Fixed

- **Body-size bold headings.** A line set in a real bold font at about the body
  size (read from the PDF's font names) is a heading, split from the paragraph
  under it, as in CDC and government reports. Bold table rows, small bold
  labels, bold monospace code, numbered list items ending in "or"/"and", and
  loosely spaced bold paragraphs are not. A heading wrapped onto two lines is
  kept as one.
- **Heading levels follow the document.** Levels come from the font sizes a
  document uses for headings and, under them, from the bold styles in use, so a
  report's sections are H2 and subsections H3 instead of one level too deep. A
  masthead above the title takes no level.
- **Pages printed sideways.** A page whose text mostly runs up or down the
  page (a wide table turned to fit a portrait page) is read in its own reading
  frame, so its rows and columns come out as a table and the years down its
  side are kept. A line of four or more numbers in the bottom band is a table
  row, not a page number, and is no longer stripped.
- **Contents entries at a page's edge keep their page number.** A number on
  a page's last (or first) line that sits beside text and lines up with the
  page numbers above it is a contents entry, not a running page number.
- **Footnotes and references keep their numbers.** Bibliography entries keep
  their `[n]` label, footnote labels and contents-page numbers inside the
  header/footer bands are no longer removed as page numbers, raised footnote
  numbers stay on the line they label, and a numbered URL footnote is no longer
  put in a code fence.
- **Header/footer label checks stay near-linear** on crafted PDFs with many
  repeated strings.
- **Tables keep their rows.** A row with one cell more or fewer than the rest
  of a detected table, or with a stray `. .` leader fragment, is kept instead
  of dropped.
- **Tables whose rows are set apart.** Rows padded further apart than lines of
  text, which used to come out as one paragraph per row, are joined into one
  table when their cells line up in columns. A label cell that covers several
  rows and a row label that wraps above and below its values stay in one row.
  Two columns of prose, code, subscripts and lines that carry links stay text.
- **Chapter running heads are not headings.** A body-size line at the top or
  bottom of 3 or more pages that shares its line with the page number
  ("Chapter 3. Functions 25") is text, not a heading on every page. Titles
  that only start alike ("Article 4", "Article 12") stay headings.
- **Table-row joining stays linear** on crafted pages with thousands of
  row-like lines.
- **Bulleted lists are not read as tables.** Symbol and Wingdings bullets map
  to Unicode bullets, and a table whose first column is only bullet markers is
  rejected.
- **Two-column pages read column by column.** Narrow column gaps, sidebars and
  footnotes are handled, and a full-width table under two text columns stays
  one table.
- **Running headers are stripped only where they repeat at the same height**
  across pages, so a one-page read keeps a line that merely opens several
  nearby pages, and body text near the page edge is kept.
- **Links only on their own page.** A link annotation now links text on the
  page that carries it, not text at the same position on other pages.
  Consecutive runs with the same URL form one link.
- **Header and footer stripping stays in the page bands.** Repeated text is
  removed only inside the top and bottom bands of each page, so body numbers
  (table cells, table-of-contents page numbers) are no longer dropped.
- **Run joining.** Text runs that touch on the same line (a word split by a
  font change, punctuation drawn separately) are joined without a stray space,
  so `services .` becomes `services.`.
- **Cancellation always settles.** Aborting the `signal` at any stage, even
  after the last page is read, returns the `cancelled` result instead of
  leaving `convert()` pending.
- **Linear-time text handling.** Long runs of punctuation or `[` in the text
  no longer make conversion take quadratic time.
- PDF.js logs errors only, so its warnings no longer reach the CLI's stdout.
- **Faster emphasis detection.** Bold and italic fonts are found in one pass
  over the text items instead of one pass per font; output is unchanged.

### Development

- **Text-fidelity eval.** `pnpm test:fidelity` compares the output with the
  PDF.js text layer of each corpus PDF (word and number recall, link precision,
  spacing before punctuation, malformed or unrendered emphasis) and fails if
  any PDF falls below the committed baseline.
- **Head-to-head harness.** `pnpm compare:opendocsg` scores pdf2md and
  `@opendocsg/pdf2md` on the same PDFs.
- **Benchmark.** `pnpm bench` reports per-file median time and peak memory.
- **Reference tests.** `pnpm test:reference` runs hand-written checks on pages
  of public-domain PDFs.
- **Heading check.** `pnpm check:headings` lists every heading for the whole
  corpus with counts of likely-wrong ones (level skips, long, sentence-like,
  repeated), and `--diff` compares two snapshots.
