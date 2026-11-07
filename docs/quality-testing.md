# Quality Testing Methodology

pdf2md uses an automated evaluation framework to measure conversion quality across diverse real-world PDFs. This document describes our testing approach, scoring methodology, and results.

## Test Sets

We maintain four independent test sets to guard against overfitting:

| Set | PDFs | Purpose | Average Score |
|-----|-----:|---------|:-------------:|
| Training | 28 | Development feedback loop | 9.2/10 |
| Blind Set 1 | 10 | First unseen validation | 9.2/10 |
| Blind Set 2 | 9 | Category gap coverage | 9.0/10 |
| Blind Set 3 | 6 | Stress tests (long docs, edge cases) | 9.1/10 |

**Combined: 9.1/10 across 53 real-world PDFs.**

Blind test PDFs were selected *after* all development work on the converter was complete. They were never seen during development, and the converter was not tuned against them.

### Categories Tested

Across all sets, we test 35+ document categories including:

- Academic papers (single & multi-column)
- Scientific papers with tables and figures
- Government forms (US IRS, UK tax)
- Legal documents (contracts, Supreme Court opinions, amicus briefs)
- Financial reports (Berkshire Hathaway, Amazon annual report)
- Technical specifications (RFC 9293, Haskell Report)
- Textbooks (math, programming)
- Slide decks, posters, brochures
- Medical/healthcare reports
- EU regulations (AI Act)
- Electronics datasheets (TI MSP430)
- Employee handbooks, city council agendas
- Transit timetables (NJ Transit)
- Math-heavy papers with equations
- Long documents (475-page GPO Style Manual, 300-page IRS Publication 17)
- Cookbooks, newsletters, whitepapers
- CJK/multilingual documents
- Scanned documents

## Scoring Dimensions

Each PDF is scored on 9 dimensions (0-10 scale):

| Dimension | Weight | What it measures |
|-----------|-------:|------------------|
| Paragraph Integrity | 2.0x | No broken mid-sentence splits, proper paragraph boundaries |
| Heading Detection | 1.5x | Headings detected at correct hierarchy (H1-H6) |
| No Garbage | 1.5x | No binary junk, encoding artifacts, or garbled text |
| Overall Readability | 1.5x | Is the output useful, structured markdown? |
| List Detection | 1.0x | Bullet points and numbered lists preserved |
| Table Detection | 1.0x | Tables found and formatted as markdown tables |
| Code Block Detection | 0.8x | Code/monospace blocks wrapped in fences, no false positives |
| Link Extraction | 0.8x | URLs and hyperlinks preserved from PDF annotations |
| Metadata Extraction | 0.5x | Title/author extracted into YAML front matter |

The overall score is a weighted average of all dimensions. Weights reflect importance to end-user experience — paragraph integrity and readability matter most.

### Category-Aware Scoring

Scoring adjusts expectations by document category:
- Code block detection penalizes false positives on non-code documents (cookbooks, legal docs) but expects code blocks in technical specs
- Table detection expects tables in data-heavy reports but is lenient for brochures
- List detection is optional for patents and posters
- Short paragraph blocks are expected in datasheets and forms

## Running the Tests

```bash
# Training set (28 PDFs)
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate.ts

# Blind set 1 (10 PDFs)
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate-blind.ts

# Blind set 2 (9 PDFs)
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate-blind-2.ts

# Blind set 3 (6 PDFs)
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate-blind-3.ts
```

Test PDFs are not included in the repository (too large). The evaluation scripts, scoring logic, and generated markdown results are all committed for transparency.

## Head-to-head comparison with @opendocsg/pdf2md

```bash
pnpm compare:opendocsg                     # all sets whose PDFs are present
pnpm compare:opendocsg --sets training     # tracked real-pdfs only
pnpm compare:opendocsg --pdfs-root ~/Coding/pdf2md/test-corpus   # blind sets from another checkout
pnpm compare:opendocsg --skip-run          # re-read the last reports
```

`test-corpus/converters.ts` is the converter adapter. Every evaluate script takes
`CONV=pdf2md|opendocsg` (default `pdf2md`). With `CONV=opendocsg`, or with
`EVAL_OUT=<dir>`, results and reports go to the git-ignored `test-corpus/.h2h/<converter>/`
instead of the committed `results/` and `*-REPORT.md` files. `EVAL_PDFS_ROOT=<dir>` reads
the PDFs from another checkout's `test-corpus/` (the blind sets are local-only).

`@opendocsg/pdf2md` is a root devDependency pinned to an exact version (0.3.6, about
3 MB with its bundled PDF.js). If it is missing, `pnpm compare:opendocsg` says so and
exits without failing, and the adapter tests skip the opendocsg conversion.

The comparison script runs each set once per converter on the same machine and writes
`test-corpus/.h2h/COMPARISON.md` and `comparison.json`: the 9-dimension score per PDF
and per dimension (with and without metadata), total conversion time, and the text-fidelity
metrics (word recall, numeric recall, link precision) for both converters.

**Read the heuristic score with care.** It counts whether things are present, not whether
they are correct:

- **Tables:** any output with 3 or more `|` lines scores 9. opendocsg never outputs a
  Markdown table, so its lower table score measures that it never tries; pdf2md's higher
  score does not show its tables are right.
- **Code blocks:** in most categories, no code fences scores 9. opendocsg outputs none, so
  it is never penalised for false positives and scores low only where code is expected.
- **Links:** 10 or more links score 9, whatever they point at. Use the link-precision
  column instead.
- **Metadata:** opendocsg does not return metadata, so compare the "metadata excluded" row.
- **Scanned PDFs:** both converters produce no text; pdf2md reports `failed`, opendocsg
  returns page-break comments, and the scorer can rank either one higher.
- The scorer was written while pdf2md was being built, and its categories reward what
  pdf2md does. Do not use it for public "better than" claims; use the fidelity metrics and
  the hand-checked reference tests.

Timings are single runs on one machine: indicative, not a benchmark (see `pnpm bench`).

## Dimension Averages Across All Sets

| Dimension | Training | Blind 1 | Blind 2 | Blind 3 |
|-----------|:--------:|:-------:|:-------:|:-------:|
| Heading Detection | 9.0 | 9.4 | 9.2 | 9.5 |
| Paragraph Integrity | 9.5 | 9.5 | 9.7 | 9.5 |
| List Detection | 8.7 | 8.6 | 8.8 | 8.7 |
| Table Detection | 8.6 | 8.8 | 7.9 | 8.7 |
| Code Block Detection | 8.9 | 8.7 | 8.2 | 7.3 |
| Link Extraction | 8.4 | 8.3 | 8.8 | 7.8 |
| Metadata Extraction | 7.9 | 8.0 | 8.0 | 8.0 |
| No Garbage | 9.9 | 9.7 | 8.6 | 9.7 |
| Overall Readability | 9.8 | 9.7 | 9.9 | 10.0 |

## Known Limitations

1. **Scanned PDFs without OCR text layers** produce empty output (score ~6/10). The converter relies on PDF.js text extraction and does not perform OCR.

2. **Math-heavy papers** score lower (~8.6/10) because PDF equation rendering uses specialized fonts that don't map cleanly to text.

3. **Documents with garbled font encodings** (e.g., some Congressional Record sections) produce mojibake — a PDF.js limitation when fonts lack proper Unicode mapping tables.

4. **Complex multi-column layouts** occasionally interleave text from adjacent columns, particularly when column gutters are narrow or inconsistent.

5. **Very large documents** (400+ pages) may return `partial` status if some pages encounter PDF.js parsing errors, though the successfully parsed pages still produce good output.

## Methodology Notes

- All scoring is automated and deterministic — no manual grading
- Scores are computed from the markdown output using pattern matching (heading counts, list item counts, code block counts, garbage character ratios, etc.)
- The same scoring functions are used identically across all test sets
- Category labels are assigned per-PDF and affect scoring expectations but not the conversion itself
- The converter has zero knowledge of test PDFs or their categories at runtime
