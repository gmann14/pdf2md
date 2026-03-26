# PDF-to-Markdown Quality Report

**Generated:** 2026-03-26
**PDFs Tested:** 21 real-world PDFs across 15+ categories
**Successful Conversions:** 21/21 (100% — no crashes)
**Overall Average Score:** 8.0/10 (automated) — **6.5/10 (manual honest assessment)**

> The automated scoring gives us an 8.0, but manual review reveals significant issues
> the heuristics don't fully capture — particularly multi-column layout confusion,
> link misattribution, and code block detection failures. This report is brutally honest.

---

## Score Summary

| PDF | Category | Pages | Words | Time | Auto Score | Manual | Status |
| --- | -------- | ----: | ----: | ---: | ---------: | -----: | ------ |
| whitepaper-bitcoin.pdf | Whitepaper | 9 | 3,760 | 42ms | 7.8 | **8.5** | Excellent |
| resume-sample.pdf | Resume/CV | 1 | 218 | 12ms | 8.0 | **8.0** | Good |
| scanned-declaration.pdf | Scanned Document | 6 | 1,546 | 10ms | 7.4 | **8.0** | Good (has text layer) |
| financial-berkshire-letter.pdf | Financial Letter | 16 | 11,527 | 37ms | 7.6 | **7.5** | Good |
| government-nist-cybersecurity.pdf | Gov Technical | 55 | 16,254 | 308ms | 8.3 | **7.5** | Good |
| legal-us-copyright-circular.pdf | Legal | 10 | 4,042 | 59ms | 8.1 | **7.0** | Decent |
| manual-arduino-guide.pdf | Manual | 26 | 5,141 | 233ms | 8.4 | **7.0** | Decent |
| newsletter-imf-weo.pdf | Newsletter | 11 | 7,056 | 159ms | 8.2 | **7.0** | Decent |
| tables-cdc-report.pdf | Data Report | 5 | 3,352 | 68ms | 8.0 | **6.5** | Mixed |
| multicolumn-gan-paper.pdf | Multi-Column | 9 | 5,172 | 55ms | 8.7 | **6.0** | Overrated |
| academic-attention-paper.pdf | Academic | 15 | 6,346 | 787ms | 8.3 | **6.0** | Mixed |
| slides-stanford-ml.pdf | Slide Deck | 216 | 82,282 | 1,129ms | 7.6 | **6.0** | Messy |
| government-irs-w4.pdf | Gov Form | 5 | 2,209 | 90ms | 8.0 | **6.0** | Partial extraction |
| government-irs-w9.pdf | Gov Form | 6 | 5,337 | 30ms | 8.2 | **6.0** | Partial extraction |
| scientific-resnet.pdf | Scientific | 12 | 10,082 | 172ms | 7.8 | **5.5** | Column mixing |
| multicolumn-ieee-paper.pdf | Multi-Column | 100 | 45,119 | 397ms | 7.9 | **5.5** | Column mixing |
| scientific-bert-paper.pdf | Scientific | 16 | 10,553 | 262ms | 7.3 | **5.0** | Column mixing |
| scientific-rl-survey.pdf | Survey | 16 | 16,062 | 175ms | 7.2 | **5.0** | Column mixing |
| code-book-think-python.pdf | Programming Book | 244 | 86,706 | 697ms | 8.5 | **5.0** | Link misattribution |
| code-haskell-report.pdf | Language Spec | 329 | 102,175 | 773ms | 8.3 | **5.0** | No code blocks |
| code-git-cheatsheet.pdf | Cheatsheet | 2 | 743 | 12ms | 7.4 | **4.5** | Layout destroyed |

## Top 5 Failure Modes (Honest Assessment)

### 1. Multi-Column Text Interleaving (CRITICAL)
**Affects:** 6+ PDFs (all academic papers, most scientific docs)

The converter reads text items left-to-right, top-to-bottom across the full page width. For two-column papers (most academic/scientific PDFs), this means text from the LEFT column gets interleaved with text from the RIGHT column when they share the same Y-coordinate.

**Example from BERT paper:**
```
Abstract There are two existing strategies for apply-
ing pre-trained language representations to down- We introduce a new language representa-
tion model called BERT...
```
The abstract from the left column is mixed with introductory text from the right column. This makes the output nearly unreadable for two-column papers.

**Impact:** This is the #1 issue. Two-column PDFs are extremely common in academia, and our output for them is borderline unusable.

### 2. Link Misattribution (MAJOR)
**Affects:** Think Python, attention paper, and other link-heavy PDFs

The link-to-text matching via bounding box overlap produces wrong associations. In Think Python, nearly every paragraph has links attributed to it that belong to a completely different part of the page (e.g., code examples get linked to exercise URLs).

**Example from Think Python:**
```markdown
[In January 1999 I was preparing to teach an introductory
programming class in Java.](https://thinkpython.com/code/Circle.py)
```
A prose paragraph about the book's history is linked to Circle.py — completely wrong.

### 3. Code Block Detection Failure (MAJOR)
**Affects:** Think Python, Haskell Report, Git Cheatsheet

Despite being programming books full of code, ZERO code blocks are detected. The Haskell Report (329 pages of a programming language spec) has no code fences. Think Python (244 pages about programming) has none either.

The issue: Many PDFs use slightly different monospace fonts or embed code with font names that don't match our `isMonospace()` patterns. The code detection relies entirely on font name matching.

### 4. Two-Column Layout Destruction (MAJOR)
**Affects:** Git Cheatsheet, multi-column layouts

The Git Cheatsheet has a clean two-column layout with commands on the left and descriptions on the right. Our output mashes them together into incoherent paragraphs:
```
git status
show modified files in working directory, staged for your next commit
git add [file]
add a file as it looks now to your next commit (stage)
```
This is somewhat readable, but the two-column structure (SETUP on left, STAGE on right) is completely lost.

### 5. Heading Detection Over-Sensitivity (MODERATE)
**Affects:** Several scientific papers, legal documents

Headings are detected based solely on font size relative to body text. This means:
- Section numbers like "2.1" get separated from their heading text
- Subtitles and author names sometimes become headings
- In some papers, only 1 heading is detected despite having clear section structure (BERT: only 1 heading)

---

## Detailed Score Breakdown (Automated)

| PDF | Headings | Paragraphs | Lists | Tables | Code | Links | Metadata | No Garbage | Readability |
| --- | -------: | ---------: | ----: | -----: | ---: | ----: | -------: | ---------: | ----------: |
| multicolumn-gan-paper.pdf | 10 | 8 | 9 | 9 | 6 | 7 | 5 | 10 | 10 |
| code-book-think-python.pdf | 10 | 10 | 9 | 9 | 2 | 9 | 5 | 7 | 10 |
| manual-arduino-guide.pdf | 10 | 9 | 9 | 6 | 6 | 9 | 5 | 8 | 10 |
| academic-attention-paper.pdf | 10 | 9 | 7 | 9 | 6 | 9 | 5 | 6 | 10 |
| code-haskell-report.pdf | 10 | 10 | 9 | 9 | 2 | 9 | 5 | 6 | 10 |
| government-nist-cybersecurity.pdf | 9 | 10 | 9 | 9 | 6 | 9 | 5 | 5 | 10 |
| government-irs-w9.pdf | 8 | 10 | 9 | 9 | 6 | 5 | 5 | 7 | 10 |
| newsletter-imf-weo.pdf | 8 | 10 | 9 | 9 | 6 | 5 | 5 | 7 | 10 |
| legal-us-copyright-circular.pdf | 4 | 10 | 9 | 6 | 6 | 9 | 5 | 10 | 10 |
| government-irs-w4.pdf | 8 | 10 | 4 | 9 | 6 | 5 | 5 | 10 | 9 |
| resume-sample.pdf | 9 | 10 | 7 | 9 | 6 | 5 | 5 | 7 | 9 |
| tables-cdc-report.pdf | 8 | 9 | 9 | 9 | 6 | 9 | 5 | 5 | 10 |
| multicolumn-ieee-paper.pdf | 10 | 10 | 9 | 9 | 6 | 9 | 5 | 1 | 10 |
| scientific-resnet.pdf | 9 | 9 | 7 | 9 | 6 | 9 | 5 | 4 | 10 |
| whitepaper-bitcoin.pdf | 8 | 8 | 7 | 9 | 6 | 7 | 5 | 7 | 10 |
| financial-berkshire-letter.pdf | 4 | 10 | 9 | 9 | 6 | 5 | 5 | 7 | 10 |
| slides-stanford-ml.pdf | 10 | 7 | 9 | 9 | 6 | 9 | 5 | 3 | 10 |
| code-git-cheatsheet.pdf | 8 | 10 | 4 | 6 | 2 | 5 | 5 | 10 | 9 |
| scanned-declaration.pdf | 4 | 10 | 7 | 6 | 6 | 5 | 5 | 10 | 9 |
| scientific-bert-paper.pdf | 4 | 8 | 9 | 9 | 6 | 9 | 5 | 5 | 10 |
| scientific-rl-survey.pdf | 4 | 8 | 9 | 9 | 6 | 5 | 5 | 7 | 10 |

## Average Score by Dimension

| Dimension | Average | Verdict |
| --------- | ------: | ------- |
| overallReadability | 9.8 | Excellent — output is always somewhat useful |
| paragraphIntegrity | 9.3 | Very good — paragraphs mostly stay together |
| tableDetection | 8.4 | Good — detects simple aligned tables well |
| listDetection | 8.0 | Good — standard bullets/numbers work |
| headingDetection | 7.9 | OK — font-size heuristic works but misses some |
| linkExtraction | 7.3 | Mixed — finds links but often misattributes them |
| noGarbage | 6.8 | Concerning — unicode artifacts in some outputs |
| codeBlockDetection | 5.4 | Poor — fails on most real code-containing PDFs |
| metadataExtraction | 5.0 | Limited — depends entirely on embedded PDF metadata |

## Performance by Category

| Category | Avg Score | Verdict |
| -------- | --------: | ------- |
| Programming Book | 5.0 | Bad — no code blocks, link misattribution |
| Programming Language Spec | 5.0 | Bad — no code blocks detected |
| Multi-Column Layout | 5.8 | Bad — text interleaving destroys readability |
| Scientific Paper | 5.3 | Bad — column mixing, heading issues |
| Survey Paper | 5.0 | Bad — column mixing |
| Government Form | 6.0 | Mixed — partial page extraction failures |
| Code Cheatsheet | 4.5 | Bad — layout destroyed |
| Slide Deck | 6.0 | Mixed — chaotic fragment assembly |
| Data-Heavy Report | 6.5 | OK — some tables detected |
| Newsletter/Report | 7.0 | Decent — single-column portions work |
| Financial Report | 7.5 | Good — mostly single-column text |
| Whitepaper | 8.5 | Great — clean single-column works perfectly |
| Resume/CV | 8.0 | Good — structured content preserved |
| Legal Document | 7.0 | Decent — text is clean |
| Technical Manual | 7.0 | Decent — headings and text work |
| Scanned Document | 8.0 | Good (but had embedded text layer) |

## Examples: Best Output

### Bitcoin Whitepaper (8.5/10)
This is pdf2md at its best. The Bitcoin paper is clean single-column text with numbered sections and the output is excellent:
- Section numbering preserved as headings ("1. Introduction", "2. Transactions")
- Paragraphs intact with no mid-sentence breaks
- Diagrams gracefully degraded to text labels
- Mathematical content readable

### Resume Sample (8.0/10)
Clean structured output with proper heading hierarchy, job history detected as a table, and bullet points preserved. The resume category is a strong use case for pdf2md.

## Examples: Worst Output

### BERT Paper (5.0/10)
Two-column layout causes severe text interleaving. The abstract is unreadable — left column abstract text mixes with right column introduction text. Only 1 heading detected despite the paper having clear sections (Introduction, Related Work, BERT, Experiments, etc.).

### Code Git Cheatsheet (4.5/10)
The two-column cheatsheet layout is completely destroyed. Commands and descriptions from left and right columns merge into incoherent paragraphs. No code blocks detected despite the entire document being git commands. This is a document specifically about code, and we produce zero code fences.

### Think Python (5.0/10)
Despite being a 244-page programming textbook:
- **Zero code blocks detected** in a book that's ~40% code
- Links are massively misattributed (prose paragraphs link to random code files)
- Title appears twice due to header/footer detection issues
- The automated score of 8.5 is extremely misleading

---

## Competitor Comparison

### Landscape Overview

The PDF-to-Markdown space splits into **server-side AI tools** (Marker, MinerU, Docling, Mathpix) that excel at complex documents, and **client-side browser tools** (pdf2md.net, LightPDF) that prioritize privacy. pdf2md competes in the client-side space.

### Head-to-Head Comparison

| Feature | **pdf2md** | **Marker** | **MinerU** | **Docling** | **Mathpix** |
| ------- | ---------- | ---------- | ---------- | ----------- | ----------- |
| Multi-column | No | Strong | Excellent | Good | Excellent |
| Code blocks | Weak | Yes | Yes | Yes | Unknown |
| Tables | Good | Good | Good | Excellent | Excellent |
| OCR | No | Yes (Surya) | Yes (109 langs) | Limited | Yes (scientific) |
| Math/LaTeX | No | Partial | Partial | No | Best-in-class |
| Client-side | Yes | No | No | No | No |
| Privacy | Best | Self-host | Self-host | Self-host | Cloud only |
| Speed | 25 pg/s | 25 pg/s (H100) | Medium | Fast | 0.16 pg/s |
| Price | Free | Free (GPL) | Free (Apache) | Free (MIT) | $4.99/mo+ |
| Benchmark accuracy | ~65%* | 95.67% | Not tested | Good | 86.43% |

\* Estimated from our test corpus results; no standard benchmark available for client-side tools.

### What pdf2md does well vs competitors:
1. **Privacy** — 100% client-side, zero data uploads. Marker/MinerU/Docling require self-hosting; Mathpix sends data to cloud.
2. **Accessibility** — No installation, no CLI, no Python, no GPU. Just a web page.
3. **Speed for simple docs** — Instant processing in-browser vs API latency + upload time.
4. **Cost** — Completely free, no API credits, no infrastructure costs.
5. **Reliability** — 100% success rate on all 21 test PDFs, no crashes.
6. **Clean paragraph assembly** — For single-column text, paragraph joining is excellent.

### What competitors do better:
1. **Multi-column handling** — Marker (95.67% accuracy) and MinerU properly detect column boundaries and read columns sequentially. This is our biggest gap — it affects every academic paper.
2. **Code block detection** — Marker, MinerU, and Docling all detect code blocks via layout analysis + font analysis. We rely solely on font name matching which fails on embedded/subset fonts.
3. **OCR** — MinerU supports 109 languages, Marker uses Surya OCR, Mathpix has scientific OCR. We correctly identify scanned PDFs but can't convert them.
4. **Table parsing** — Docling handles complex table structures including multi-level headers. Our table detection works for simple aligned tables but misses complex ones.
5. **Mathematical notation** — Mathpix converts equations to LaTeX. We output equation fragments as plain text.
6. **Image extraction** — Some tools extract and embed images. We skip them entirely.

### Our Strategic Position
**Niche:** "The privacy-first, instant PDF-to-Markdown converter for everyday documents."
- Best for: reports, letters, whitepapers, legal text, resumes, invoices
- Weak for: academic papers, scientific publications, programming books, scanned docs
- Fixing multi-column detection (achievable client-side) would significantly close the gap.

---

## Recommendations for Improvement (Priority Order)

### P0: Multi-Column Detection
**Impact: Would fix 6+ PDFs, the single biggest quality issue**

Implement column detection before text grouping:
1. Build X-position histogram across all items
2. Look for a vertical gap (gutter) that splits items into 2+ groups
3. If found, process each column independently (left-to-right, then next column)
4. Fall back to current single-column processing when no gutter detected

### P1: Code Block Detection Enhancement
**Impact: Would fix 3+ PDFs**

Current approach (font name matching) is too fragile. Improvements:
1. Detect subset font names (e.g., `ABCDEF+CourierNew` → strip prefix)
2. Add indentation-based detection: consistent left indent + short lines + special characters
3. Look for syntax patterns: `{`, `}`, `()`, `=>`, `import`, `def`, `class`
4. Consider line spacing: code blocks often have tighter line spacing than prose

### P2: Link Annotation Matching
**Impact: Would fix 2+ PDFs**

Current bounding box overlap matching is too aggressive. Improvements:
1. Only match links when text item center point falls within annotation rect
2. Filter out links with suspiciously large annotation rects (page-wide)
3. Verify link URL relevance to nearby text content

### P3: Heading Detection Refinement
**Impact: Moderate — affects several papers**

Current font-size-only approach misses headings in papers where section titles use the same size as body but are bold. Improvements:
1. Consider boldness as a heading indicator (bold + short line = likely heading)
2. Look for section numbering patterns ("1.", "1.1", "A.", etc.) as heading markers
3. Handle the case where headings span multiple text items better

### P4: Metadata Fallback
**Impact: Low — cosmetic improvement**

When PDF metadata is empty (most PDFs), try to extract:
1. Title from the first large-font text block
2. Author from text near the title
3. Date from text patterns

---

## Raw Performance Data

| PDF | File Size | Pages | Words | Processing Time | Words/sec |
| --- | --------: | ----: | ----: | --------------: | --------: |
| academic-attention-paper.pdf | 2.1 MB | 15 | 6,346 | 787ms | 8,063 |
| code-book-think-python.pdf | 900 KB | 244 | 86,706 | 697ms | 124,399 |
| code-git-cheatsheet.pdf | 100 KB | 2 | 743 | 12ms | 61,917 |
| code-haskell-report.pdf | 1.4 MB | 329 | 102,175 | 773ms | 132,180 |
| financial-berkshire-letter.pdf | 120 KB | 16 | 11,527 | 37ms | 311,541 |
| government-irs-w4.pdf | 204 KB | 5 | 2,209 | 90ms | 24,544 |
| government-irs-w9.pdf | 140 KB | 6 | 5,337 | 30ms | 177,900 |
| government-nist-cybersecurity.pdf | 1.0 MB | 55 | 16,254 | 308ms | 52,773 |
| legal-us-copyright-circular.pdf | 112 KB | 10 | 4,042 | 59ms | 68,508 |
| manual-arduino-guide.pdf | 1.9 MB | 26 | 5,141 | 233ms | 22,073 |
| multicolumn-gan-paper.pdf | 520 KB | 9 | 5,172 | 55ms | 94,036 |
| multicolumn-ieee-paper.pdf | 5.2 MB | 100 | 45,119 | 397ms | 113,650 |
| newsletter-imf-weo.pdf | 608 KB | 11 | 7,056 | 159ms | 44,377 |
| resume-sample.pdf | 100 KB | 1 | 218 | 12ms | 18,167 |
| scanned-declaration.pdf | 20 KB | 6 | 1,546 | 10ms | 154,600 |
| scientific-bert-paper.pdf | 760 KB | 16 | 10,553 | 262ms | 40,279 |
| scientific-resnet.pdf | 804 KB | 12 | 10,082 | 172ms | 58,616 |
| scientific-rl-survey.pdf | 7.0 MB | 16 | 16,062 | 175ms | 91,783 |
| slides-stanford-ml.pdf | 4.0 MB | 216 | 82,282 | 1,129ms | 72,881 |
| tables-cdc-report.pdf | 176 KB | 5 | 3,352 | 68ms | 49,294 |
| whitepaper-bitcoin.pdf | 180 KB | 9 | 3,760 | 42ms | 89,524 |

**Total corpus:** 27 MB across 21 PDFs, 935 pages, 423,302 words
**Total processing time:** ~5.5 seconds
**Average throughput:** ~77,000 words/sec

---

## Conclusion

pdf2md is **fast, reliable, and privacy-first** — it never crashes and processes PDFs at remarkable speed. For single-column documents (letters, reports, whitepapers, legal text, resumes), the output quality is genuinely good.

However, for the most common PDF types that users will throw at it — **academic papers, scientific publications, and multi-column layouts** — the output quality drops significantly due to column interleaving. This is the single most impactful issue to fix.

**Honest overall grade: C+**
- Great for simple PDFs (would be B+ for that subset)
- Poor for academic/scientific PDFs (D for that subset)
- The multi-column issue alone prevents us from claiming "best converter"
