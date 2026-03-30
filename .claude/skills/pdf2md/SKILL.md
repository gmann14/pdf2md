---
name: pdf2md
description: Convert PDF files to Markdown. Use when the user has a PDF they want to convert to markdown, extract text from, or prepare for AI/LLM consumption. Triggers on "convert PDF", "PDF to markdown", "extract text from PDF", "read this PDF".
allowed-tools: Bash(npx @pdf2md/core *)
---

Convert the specified PDF file to Markdown using pdf2md.

## How to convert

```bash
npx @pdf2md/core <file-path> > output.md
```

If `$ARGUMENTS` is provided, use it as the file path:

```bash
npx @pdf2md/core $ARGUMENTS
```

## Behavior

- Output goes to stdout — redirect to a file with `> output.md` or pipe to other tools
- Errors and warnings are printed to stderr
- Exit code 0 on success, 1 on failure

## What it handles

- Multi-column layouts (academic papers, newsletters)
- Tables → Markdown table syntax
- Code blocks (monospace font detection + syntax patterns)
- Headings (H1–H6 from font size, bold, section numbers, ALL CAPS)
- Lists (bullets and numbered)
- Links (from PDF annotations)
- Bold and italic (from font name heuristics)
- Header/footer stripping (repeated text removal)
- YAML front matter from PDF metadata (title, author, date)

## Limitations

- Maximum file size: 15MB
- Scanned/image-only PDFs will return an error (no OCR)
- Password-protected PDFs are not supported
- Complex table layouts may fall back to plain text

## Examples

Convert a single PDF:
```bash
npx @pdf2md/core report.pdf > report.md
```

Convert and show in terminal:
```bash
npx @pdf2md/core paper.pdf
```
