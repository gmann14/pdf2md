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

### Fixed

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

### Development

- **Text-fidelity eval.** `pnpm test:fidelity` compares the output with the
  PDF.js text layer of each corpus PDF (word and number recall, link precision,
  spacing before punctuation, malformed or unrendered emphasis) and fails if
  any PDF falls below the committed baseline.
