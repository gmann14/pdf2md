# Migrating from @opendocsg/pdf2md

`@pdf2md/core/compat` has the same signature as `@opendocsg/pdf2md`, so the
switch is one line:

```js
// const pdf2md = require("@opendocsg/pdf2md");
const pdf2md = require("@pdf2md/core/compat");

const markdown = await pdf2md(fs.readFileSync("file.pdf"), callbacks);
```

`import pdf2md from "@pdf2md/core/compat"` works too. The TypeScript types
mirror opendocsg's `types/pdf2md.d.ts`, so typed code compiles unchanged.

## What stays the same

- `pdf2md(pdfBuffer, callbacks?) => Promise<string>`.
- Pages are joined with `<!-- PAGE_BREAK -->\n` and each page ends with `\n`,
  so a document of N pages has N − 1 markers and code that splits on the marker
  keeps working.
- `require()` returns the function itself.
- A PDF with no text layer (a scan) resolves to empty pages, not an error.

## Differences

- **Markdown.** The text inside each page is pdf2md's output, not opendocsg's:
  different heading levels, tables as GitHub tables, links, code blocks, list
  markers, and running headers/footers removed. Diff or snapshot tests need new
  baselines.
- **Input.** The PDF bytes only: a `Buffer`, any typed array or `DataView`, an
  `ArrayBuffer`, or `{ data }`. opendocsg passes anything to PDF.js, so it also
  takes a URL or file path; here those reject with a `TypeError`.
- **Errors.** A PDF that cannot be read rejects with a `Pdf2mdError` whose
  `code` is pdf2md's `ConversionCode` (`parse_failed`, `password_protected`,
  …), instead of PDF.js's own error.
- **`metadataParsed`.** Receives PDF.js `getMetadata()` as opendocsg does,
  except that when the PDF has no XMP metadata, `metadata.metadata` is an empty
  stand-in (`get()` returns `null`) instead of `null`.
- **`documentParsed`.** Called once with the real PDF.js document and the page
  list (empty `items`), before any page is converted, as in opendocsg. The
  document is destroyed when the conversion ends; do not keep it.
- **`pageParsed`.** Called once per page, in page order, with every page,
  after the whole document is converted (opendocsg calls it while parsing).
  `items` holds one synthetic `TextItem` per line of that page's Markdown:
  `str` is the line, and position and font fields are zero or empty. opendocsg
  passes its own text items with positions.
- **`fontParsed`.** Never called. pdf2md does not expose PDF.js font objects.
- **No CLI change.** The `pdf2md` CLI is pdf2md's own (see the core README).

For page ranges, per-page output and metadata without the compat layer, use
`convert()` with `pages`, `perPage` and `includeMetadata`.
