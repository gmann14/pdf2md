# Hand-checked reference tests

Known-answer tests for pdf2md's Markdown, in the style of olmOCR-bench unit tests.
Each line of `cases/<pdf>.jsonl` is one test against the whole-document Markdown of a
PDF in `../real-pdfs/`.

## How "hand-checked" these are

Read this before quoting the numbers.

- **Claude wrote and checked every expectation (7 Nov 2026). Graham has not reviewed them.**
- They were checked against the **PDF.js text layer**: every text item with its x/y
  position, font name and size, plus the page's link annotations. Reading order,
  columns, table rows and heading levels were worked out from those coordinates and
  fonts. In a few places item widths were used to see which word a superscript belongs to.
- The pages were **not looked at as rendered images**. Rendering worked, but the image
  viewer was unavailable in that session, so layout was never checked by eye.
- Heading levels are set only where the fonts give a clear hierarchy (for example
  16 pt title, 12 pt sections, 10 pt subsections in the MMWR report). Elsewhere the
  test checks only that the text is a heading.
- An expectation describes what a correct conversion should contain, not what pdf2md
  outputs today. Many tests fail now (see `baseline.json`).

Treat a failing test as "pdf2md or the test is wrong". If you find a wrong test, fix
or delete it and say why in the commit message.

## Sources and licences

Only tracked PDFs whose licence allows committing excerpts are used. All three are
US federal government works (public domain, 17 U.S.C. 105). `sources.json` records
each one, and a unit test fails if a case uses a PDF missing from it.

| PDF | Pages used |
| --- | --- |
| `tables-cdc-report.pdf` (CDC MMWR) | 1–4: two columns, tables, footnotes, links, headings |
| `legal-us-copyright-circular.pdf` (Copyright Office Circular 1) | 1–2: sidebar, bulleted lists, headings, links, emphasis |
| `government-nist-cybersecurity.pdf` (NIST CSF 1.1) | 12, 30: list, footnotes, running header/footer, table |

Not used, because the licence is unclear or restrictive: the arXiv papers (default arXiv
licence), Think Python (CC BY-NC), the Maritain text (all rights reserved), the IMF,
Berkshire and Arduino documents, and the Haskell report (copying allowed only in its
entirety). The blind sets are never used here: their licences are unknown and they are
not tracked.

## Test types

| Type | Fields | Passes when |
| --- | --- | --- |
| `present` | `text` | the text appears in the visible output |
| `absent` | `text`, `maxCount` (default 0) | the text appears at most `maxCount` times (running headers, footers) |
| `order` | `before`, `after` | the first `before` comes before the first `after` |
| `table` | `cell`, and one or more of `right`, `left`, `below`, `above` | a Markdown table cell equals `cell` and its neighbours match |
| `heading` | `text`, optional `level` | an ATX/Setext heading has exactly this text (and level) |
| `link` | `text`, `url` | a link to `url` has link text containing `text` |
| `emphasis` | `text`, `style` (`bold`/`italic`) | a CommonMark bold/italic span contains `text` |
| `list` | `text`, optional `ordered` | a list item contains `text` (in a numbered or bulleted list) |

The Markdown is parsed with markdown-it, so markers a renderer would show literally do
not count. Text is normalised first: NFKC, curly quotes to straight, dash variants to
`-`, soft hyphens removed, whitespace collapsed. Matching is case-sensitive. Blocks are
joined with a space, so `present` text may run across a paragraph break that should not
be there; use `order` or a narrower test to catch broken paragraphs.

## Running

```bash
pnpm test:reference                 # pdf2md, with the failing ids
CONV=opendocsg pnpm test:reference  # the same tests on @opendocsg/pdf2md
pnpm compare:opendocsg              # includes a reference-test section
```

`pnpm test:fidelity` (a CI step) runs `packages/core/src/reference.corpus.test.ts`: the
pass count may not drop below `baseline.json`. After an intended improvement:

```bash
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/reference/run.ts --update-baseline
```

## Adding cases

1. Use a tracked PDF in `test-corpus/real-pdfs/` whose licence allows it, and add it to
   `sources.json` (publisher, licence, basis).
2. Dump the page's text layer with positions and fonts, and render the page and look at it
   if you can.
3. Write tests from the PDF, not from pdf2md's output. Pick strings that occur once in the
   document. Avoid words split by a line-end hyphen unless the test is about rejoining them,
   and avoid spans that contain superscript footnote markers.
4. Ids are `<short pdf name>-p<page>-<slug>` and must be unique. Add a `note` when the
   reason for the test is not obvious.
5. Run `pnpm test:reference`, read each new failure against the PDF to make sure the test
   is right, then refresh the baseline if the pass count went up.
