---
title: "How to Convert PDF to Markdown"
description: "A practical guide to turning text-based PDFs into clean Markdown with the pdf2md web app, CLI, and npm package."
publishedAt: "2026-06-30"
tags: "pdf to markdown, tutorial, markdown"
---

## The fastest way to convert a PDF

Use the [PDF to Markdown converter](/) when you want a quick, private conversion without installing anything. Drop a PDF onto the upload area, wait for the progress bar to finish, then copy or download the Markdown result.

The conversion runs in your browser. pdf2md does not upload the PDF file, the filename, extracted text, generated Markdown, or PDF metadata to a server.

## Step-by-step web workflow

1. Open the [pdf2md converter](/).
2. Drag a PDF into the drop zone, click to browse, or paste a PDF from the clipboard with `Ctrl+V` or `Cmd+V`.
3. Review the Markdown output and any warnings from the conversion.
4. Use **Copy Markdown**, **Copy for AI**, or **Download .md** depending on where the text is going next.

For multiple files, drop up to five PDFs at once. Successful conversions appear in tabs, and you can download all successful Markdown outputs as one ZIP file. Failed files stay visible so you can see which documents need a different approach.

## What pdf2md preserves

PDF files do not store text like a Markdown document does. They store positioned glyphs, fonts, annotations, and drawing instructions. That means a converter has to infer structure from layout instead of reading a clean document tree.

pdf2md uses PDF.js to extract text and metadata, then rebuilds Markdown structure from the document layout:

- Headings from font-size and style patterns
- Paragraphs from nearby text blocks
- Bullet and numbered lists from text patterns and indentation
- Tables from aligned columns
- Code blocks from monospace and subset-font signals
- Links from PDF annotations matched back to visible text
- Repeated headers and footers removed from page output
- Multi-column pages reordered into a more natural reading flow

The result is intended to be useful Markdown, not a pixel-perfect recreation of the PDF.

## When conversion works best

pdf2md works best with text-based PDFs: reports, whitepapers, documentation, academic articles, resumes, invoices, and slide handouts that contain selectable text.

Before converting a large document, try selecting text in your PDF viewer. If you can highlight real words, the file is usually a good candidate. If the page behaves like one big image, it probably needs OCR first.

## Known limitations

- Scanned PDFs and image-only documents need OCR, which pdf2md does not run in the browser.
- Complex tables with merged cells, nested rows, or heavy visual styling may need manual cleanup.
- Equations and formulas are extracted as text where possible, but pdf2md does not reconstruct LaTeX.
- Dense multi-column pages can still have ambiguous reading order.
- Decorative page numbers, captions, and footnotes may require review in documents with unusual layouts.

These limits are why the app shows conversion warnings instead of pretending every PDF can become perfect Markdown automatically.

## Use the CLI

For local files or repeatable scripts, use the published npm package as a command-line tool:

```bash
npx @pdf2md/core document.pdf > document.md
```

The CLI is useful when you want Markdown in a shell pipeline, a documentation migration, or a batch workflow you can rerun later.

## Use the npm library

For TypeScript or JavaScript projects, install the core package and call `convert()` directly:

```ts
import { readFile } from "node:fs/promises";
import { convert } from "@pdf2md/core";

const pdf = await readFile("document.pdf");
const result = await convert(pdf);

if (result.status === "success" || result.status === "partial") {
  console.log(result.markdown);
}
```

The library returns Markdown plus structured status, warnings, errors, metadata, and conversion stats so your app can decide whether to accept, retry, or flag the output for review.

## A good cleanup pass

After conversion, scan the output before publishing or feeding it into an AI workflow:

1. Check the heading hierarchy.
2. Look for table rows that need manual alignment.
3. Confirm links point to the right text.
4. Remove repeated boilerplate that belongs outside the Markdown document.
5. Split very long documents into sections if your destination tool has context limits.

Markdown is easy to edit, diff, and review, so even imperfect conversion is usually a better starting point than copying text out of a PDF by hand.

