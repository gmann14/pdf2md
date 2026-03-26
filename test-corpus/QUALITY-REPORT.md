# PDF-to-Markdown Quality Report

**Generated:** 2026-03-26
**PDFs Tested:** 21
**Successful Conversions:** 21/21
**Overall Average Score:** 8/10

## Score Summary

| PDF | Category | Pages | Words | Time | Score | Status |
| --- | -------- | ----: | ----: | ---: | ----: | ------ |
| multicolumn-gan-paper.pdf | Multi-Column Layout | 9 | 5172 | 60ms | **8.7** | Good |
| government-irs-w4.pdf | Government Form | 5 | 2210 | 71ms | **8.6** | Good |
| code-book-think-python.pdf | Programming Book | 244 | 85944 | 1423ms | **8.5** | Good |
| academic-attention-paper.pdf | Academic Paper | 15 | 6368 | 823ms | **8.3** | Good |
| code-haskell-report.pdf | Programming Language Spec | 329 | 102987 | 1214ms | **8.3** | Good |
| government-nist-cybersecurity.pdf | Government Technical Report | 55 | 16264 | 438ms | **8.3** | Good |
| manual-arduino-guide.pdf | Technical Manual | 26 | 5143 | 263ms | **8.3** | Good |
| government-irs-w9.pdf | Government Form | 6 | 5362 | 57ms | **8.2** | Good |
| newsletter-imf-weo.pdf | Newsletter/Report | 11 | 6920 | 189ms | **8.2** | Good |
| legal-us-copyright-circular.pdf | Legal Document | 10 | 4042 | 60ms | **8.1** | Good |
| resume-sample.pdf | Resume/CV | 1 | 218 | 8ms | **8** | Good |
| tables-cdc-report.pdf | Data-Heavy Report | 5 | 3503 | 69ms | **8** | Good |
| multicolumn-ieee-paper.pdf | Multi-Column Layout | 100 | 45650 | 443ms | **7.9** | Good |
| whitepaper-bitcoin.pdf | Whitepaper | 9 | 3748 | 53ms | **7.8** | Good |
| financial-berkshire-letter.pdf | Financial Report | 16 | 11527 | 106ms | **7.6** | Good |
| slides-stanford-ml.pdf | Slide Deck | 216 | 82348 | 1501ms | **7.6** | Good |
| scientific-resnet.pdf | Scientific Paper (Tables) | 12 | 10417 | 225ms | **7.5** | Good |
| scanned-declaration.pdf | Scanned Document | 6 | 1546 | 11ms | **7.4** | Good |
| scientific-rl-survey.pdf | Survey Paper (Long) | 16 | 16033 | 241ms | **7.4** | Good |
| scientific-bert-paper.pdf | Scientific Paper (Tables) | 16 | 10874 | 256ms | **7.3** | Good |
| code-git-cheatsheet.pdf | Code Cheatsheet | 2 | 747 | 19ms | **7.2** | Good |

## Detailed Score Breakdown

| PDF | Headings | Paragraphs | Lists | Tables | Code | Links | Metadata | No Garbage | Readability |
| --- | -------: | ---------: | ----: | -----: | ---: | ----: | -------: | ---------: | ----------: |
| multicolumn-gan-paper.pdf | 10 | 8 | 9 | 9 | 6 | 7 | 5 | 10 | 10 |
| government-irs-w4.pdf | 8 | 10 | 9 | 9 | 6 | 5 | 5 | 10 | 10 |
| code-book-think-python.pdf | 10 | 10 | 9 | 9 | 2 | 9 | 5 | 7 | 10 |
| academic-attention-paper.pdf | 10 | 9 | 7 | 9 | 6 | 9 | 5 | 6 | 10 |
| code-haskell-report.pdf | 10 | 10 | 9 | 9 | 2 | 9 | 5 | 6 | 10 |
| government-nist-cybersecurity.pdf | 9 | 10 | 9 | 9 | 6 | 9 | 5 | 5 | 10 |
| manual-arduino-guide.pdf | 10 | 8 | 9 | 6 | 6 | 9 | 5 | 8 | 10 |
| government-irs-w9.pdf | 8 | 10 | 9 | 9 | 6 | 5 | 5 | 7 | 10 |
| newsletter-imf-weo.pdf | 8 | 10 | 9 | 9 | 6 | 5 | 5 | 7 | 10 |
| legal-us-copyright-circular.pdf | 4 | 10 | 9 | 6 | 6 | 9 | 5 | 10 | 10 |
| resume-sample.pdf | 9 | 10 | 7 | 9 | 6 | 5 | 5 | 7 | 9 |
| tables-cdc-report.pdf | 8 | 9 | 9 | 9 | 6 | 9 | 5 | 5 | 10 |
| multicolumn-ieee-paper.pdf | 10 | 10 | 9 | 9 | 6 | 9 | 5 | 1 | 10 |
| whitepaper-bitcoin.pdf | 8 | 8 | 7 | 9 | 6 | 7 | 5 | 7 | 10 |
| financial-berkshire-letter.pdf | 4 | 10 | 9 | 9 | 6 | 5 | 5 | 7 | 10 |
| slides-stanford-ml.pdf | 10 | 7 | 9 | 9 | 6 | 9 | 5 | 3 | 10 |
| scientific-resnet.pdf | 9 | 8 | 4 | 9 | 6 | 9 | 5 | 6 | 9 |
| scanned-declaration.pdf | 4 | 10 | 7 | 6 | 6 | 5 | 5 | 10 | 9 |
| scientific-rl-survey.pdf | 4 | 9 | 9 | 9 | 6 | 5 | 5 | 7 | 10 |
| scientific-bert-paper.pdf | 4 | 8 | 9 | 9 | 6 | 9 | 5 | 5 | 10 |
| code-git-cheatsheet.pdf | 8 | 9 | 4 | 6 | 2 | 5 | 5 | 10 | 9 |

## Top Failure Modes

1. **Low headingDetection** — affects 5 PDF(s)
2. **Low codeBlockDetection** — affects 3 PDF(s)
3. **Low noGarbage** — affects 2 PDF(s)
4. **Low listDetection** — affects 2 PDF(s)

## Performance by Category

- **Academic Paper**: 8.3/10 avg
- **Code Cheatsheet**: 7.2/10 avg
- **Data-Heavy Report**: 8/10 avg
- **Financial Report**: 7.6/10 avg
- **Government Form**: 8.4/10 avg
- **Government Technical Report**: 8.3/10 avg
- **Legal Document**: 8.1/10 avg
- **Multi-Column Layout**: 8.3/10 avg
- **Newsletter/Report**: 8.2/10 avg
- **Programming Book**: 8.5/10 avg
- **Programming Language Spec**: 8.3/10 avg
- **Resume/CV**: 8/10 avg
- **Scanned Document**: 7.4/10 avg
- **Scientific Paper (Tables)**: 7.4/10 avg
- **Slide Deck**: 7.6/10 avg
- **Survey Paper (Long)**: 7.4/10 avg
- **Technical Manual**: 8.3/10 avg
- **Whitepaper**: 7.8/10 avg

## Examples: Best and Worst Output

### Best Conversions

**multicolumn-gan-paper.pdf** (8.7/10)
- Category: Multi-Column Layout
- 12 headings detected, 5 list items detected, 4 table lines detected, 0 code blocks detected, 0 markdown links detected

**government-irs-w4.pdf** (8.6/10)
- Category: Government Form
- 8 headings detected, 5 list items detected, 13 table lines detected, 0 code blocks detected, 0 markdown links detected

**code-book-think-python.pdf** (8.5/10)
- Category: Programming Book
- 286 headings detected, 332 list items detected, 123 table lines detected, 0 code blocks detected, 15756 markdown links detected

### Worst Conversions (excluding failures)

**code-git-cheatsheet.pdf** (7.2/10)
- Category: Code Cheatsheet
- Weaknesses: listDetection=4, codeBlockDetection=2
- 14 headings detected, 0 list items detected, 0 table lines detected, 0 code blocks detected, 0 markdown links detected

**scientific-bert-paper.pdf** (7.3/10)
- Category: Scientific Paper (Tables)
- Weaknesses: headingDetection=4
- 1 headings detected, 14 list items detected, 78 table lines detected, 0 code blocks detected, 696 markdown links detected

**scanned-declaration.pdf** (7.4/10)
- Category: Scanned Document
- Weaknesses: headingDetection=4
- 1 headings detected, 0 list items detected, 0 table lines detected, 0 code blocks detected, 0 markdown links detected

## Recommendations for Improvement

1. **metadataExtraction** (avg: 5/10): Metadata extraction is limited by what PDFs embed. Consider extracting title from first large-font text if metadata is missing.

2. **codeBlockDetection** (avg: 5.4/10): Improve code block detection — look for indentation patterns, syntax-like characters, and consistent line spacing in addition to monospace font detection.

3. **noGarbage** (avg: 6.9/10): Investigate encoding issues — ensure proper Unicode handling and filter out common PDF artifacts (ligatures, special spaces).

## Average Score by Dimension

| Dimension | Average Score |
| --------- | -----------: |
| overallReadability | 9.8/10 |
| paragraphIntegrity | 9.2/10 |
| tableDetection | 8.4/10 |
| listDetection | 8.1/10 |
| headingDetection | 7.9/10 |
| linkExtraction | 7.3/10 |
| noGarbage | 6.9/10 |
| codeBlockDetection | 5.4/10 |
| metadataExtraction | 5/10 |
