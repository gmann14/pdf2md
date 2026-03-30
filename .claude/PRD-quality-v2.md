# PRD: Quality V2 — Column Regression Fix, Code Blocks, Links, Headings

**Author:** Alfred (architect)  
**Date:** 2026-03-26  
**Status:** Ready for implementation  
**Target implementer:** Sonnet-class coding agent  
**Repo:** `~/Coding/pdf2md`

---

## Overview

Multi-column detection (commit `00efefb`) lifted multi-column PDFs from 5.0-6.0 → 7.3-8.7/10, but introduced a regression on single-column PDFs and left three other quality issues unresolved. This PRD specifies fixes for all four, with pseudocode-level detail.

**Current overall quality:** ~7.5/10 automated (honest manual ~6.5-7.0)  
**Target after this PRD:** 8.0+/10 honest manual assessment

---

## P0: Column Detection Regression on Single-Column PDFs

### Root Cause Analysis

**Affected PDF:** `whitepaper-bitcoin.pdf` — regressed from estimated 8.5 → 7.8 after multi-column was added.

**Investigation results** (debug script analysis of all 9 pages):

| Page | Detection Result | Correct? |
|------|-----------------|----------|
| 1 | single-column | ✅ |
| 2 | **TWO-COLUMN** | ❌ FALSE POSITIVE |
| 3-9 | single-column | ✅ |

**Root cause:** Page 2 contains a **transaction chain diagram** with three groups of labels at x≈200, x≈290, x≈380. The labels ("Transaction", "Owner's Public Key", "Hash", "Verify", "Signature", "Sign", "Private Key") are repeated at 7pt font size in three visual columns within the diagram.

The gap between the leftmost label group (~x=240 right edge) and the middle group (~x=290 left edge) is ~50pt wide and falls within the search zone (35%-65% of page width). This gap appears on enough "lines" to exceed the 30% threshold.

**Specific numbers from debug output:**
- `maxRight = 504.1`, so `searchMin = 176.4`, `searchMax = 327.7`
- `gapCenter = 271.8`, `gapStart = 241.3`, `gapEnd = 297.6`
- Left items: 44, Right items: 25

**Damage in output:** The column reordering splits diagram labels incorrectly. The three-column diagram labels get separated: one set appears as paragraph text, others get detected as markdown tables (`| Owner 2's | Owner 3's |`). This corrupts the diagram representation and adds spurious table markup.

### Algorithm Spec: Hardened Column Detection

Modify `detectColumnLayout()` in `packages/core/src/detection.ts`:

#### Change 1: Raise minimum line threshold from 30% to 40%

```
// BEFORE:
if (lineCenters.length < lines.length * 0.3) return { type: "single" };
// ...
if (consistent.length < lines.length * 0.2) return { type: "single" };

// AFTER:
if (lineCenters.length < lines.length * 0.4) return { type: "single" };
// ...
if (consistent.length < lines.length * 0.3) return { type: "single" };
```

**Rationale:** The Bitcoin diagram has ~15 label lines out of ~40 total lines on page 2 (37.5%). Raising to 40% filters this out. True two-column papers (GAN, IEEE, Attention) have 60-90% of lines with the gap.

#### Change 2: Require minimum column width (substantial text on both sides)

After the `gapCenter` is computed, measure actual text extent in each column:

```pseudocode
function detectColumnLayout(items):
  // ... existing code up to computing gapCenter ...

  // NEW: Require each column to have substantial text width
  // Left column: items where x + width < gapStart
  // Right column: items where x > gapEnd
  leftWidths = []
  rightWidths = []
  for item in items:
    if item.x + item.width < gapStart:
      leftWidths.push(item.width)
    elif item.x > gapEnd:
      rightWidths.push(item.width)
  
  // Median width of items in each column
  leftMedian = median(leftWidths) or 0
  rightMedian = median(rightWidths) or 0
  
  // Each column must have items with median width > 100pt
  // (full lines of text, not just short labels)
  MIN_COLUMN_TEXT_WIDTH = 100  // ~15-20 characters at 10pt
  if leftMedian < MIN_COLUMN_TEXT_WIDTH or rightMedian < MIN_COLUMN_TEXT_WIDTH:
    return { type: "single" }
```

**Rationale:** In the Bitcoin diagram, the label items are 14-36pt wide (short words like "Hash", "Sign", "Verify"). True two-column text has lines ~180-250pt wide per column. A 100pt threshold catches diagram labels while allowing real columns.

#### Change 3: Page consistency check (cross-page voting)

Add a new function `detectColumnLayoutForDocument()` that runs column detection per-page and applies consistency logic. This replaces the current per-page-independent detection in `applyColumnReordering()`:

```pseudocode
function applyColumnReordering(items):
  pageMap = groupByPage(items)
  
  // Phase 1: Detect layout for each page independently
  pageLayouts = Map<pageNum, ColumnLayout>
  for (pageNum, pageItems) in pageMap:
    pageLayouts.set(pageNum, detectColumnLayout(pageItems))
  
  // Phase 2: Cross-page consistency check
  twoColPages = count pages where layout.type == "two-column"
  totalPages = pageMap.size
  twoColRatio = twoColPages / totalPages
  
  // If fewer than 30% of pages are two-column, likely false positives
  // Exception: short documents (< 5 pages) — allow individual page detection
  if totalPages >= 5 and twoColRatio < 0.3:
    // Override all to single-column
    for all pages: set layout to { type: "single" }
  
  // Phase 3: Apply reordering using final layouts
  // (rest unchanged)
```

**Rationale:** The Bitcoin whitepaper has 1/9 pages (11%) detected as two-column. A true two-column paper like IEEE has 90%+ pages as two-column. For documents with 5+ pages, requiring at least 30% two-column pages prevents sporadic false positives. Short documents (1-4 pages) keep per-page detection since a 2-page paper might legitimately have 1 column page and 1 two-column page.

#### Change 4: Filter out small-font items from column detection

```pseudocode
function detectColumnLayout(items):
  if items.length < 8: return { type: "single" }
  
  // NEW: Compute body font size and filter out items < 70% of body size
  // These are typically diagram labels, footnotes, superscripts
  sizeCharCount = Map<fontSize, charCount>
  for item in items:
    rounded = round(item.fontSize * 10) / 10
    sizeCharCount[rounded] += item.str.length
  
  bodySize = key with max value in sizeCharCount
  minSize = bodySize * 0.7
  
  filteredItems = items.filter(item => item.fontSize >= minSize)
  
  // Continue with filteredItems instead of items for gap analysis
  // (the rest of the function operates on filteredItems)
```

**Rationale:** The Bitcoin diagram labels are 5.6-7.2pt while body text is 10.1pt. Filtering at 70% of body size (7.07pt) removes most diagram labels while keeping all body text. This alone would fix the Bitcoin regression since the diagram labels are what create the false gap.

### Implementation Order for P0

Apply all four changes. They're defense-in-depth — each alone would likely fix Bitcoin, but together they prevent future false positives on other PDFs with different characteristics.

**Files to modify:** `packages/core/src/detection.ts` (detectColumnLayout function + new helper), `packages/core/src/converter.ts` (applyColumnReordering function for cross-page logic).

---

## P1: Code Block Detection Enhancement

### Problem

Three PDFs have zero code blocks detected despite containing extensive code:

| PDF | Category | Pages | Code Score | Font Names |
|-----|----------|-------|-----------|------------|
| code-book-think-python.pdf | Programming Book | 244 | 2/10 | g_d0_f1 through g_d0_f5 |
| code-haskell-report.pdf | Language Spec | 329 | 2/10 | g_d0_f1 through g_d0_f10 |
| code-git-cheatsheet.pdf | Cheatsheet | 2 | 2/10 | g_d0_f1 through g_d0_f4 |

**Root cause:** PDF font subsetting strips original font names. Instead of "Courier" or "DejaVuSansMono", we get `g_d0_f3`, `g_d0_f5`, etc. The current `isMonospace()` function relies entirely on font name pattern matching, which returns `false` for all subset fonts.

### Algorithm Spec: Multi-Signal Code Block Detection

#### Step 1: Identify the "code font" via indentation + width analysis

Instead of relying on font names, identify the code font empirically by looking for a font that's consistently used in indented, short-line blocks.

Add a new function `detectCodeFont()` that runs once per document:

```pseudocode
function detectCodeFont(allItems: ExtractedItem[], bodyFontSize: number): Set<string> {
  // Candidate code fonts: NOT the dominant font, and at similar or smaller size
  // Group items by fontName
  fontGroups = Map<fontName, items[]>
  for item in allItems:
    fontGroups[item.fontName].push(item)
  
  // Find the dominant font (most characters)
  dominantFont = fontName with most total characters
  
  codeFonts = new Set<string>()
  
  for (fontName, items) in fontGroups:
    if fontName == dominantFont: continue
    if items.length < 10: continue  // need enough samples
    
    // Check: does this font appear in consistently-indented blocks?
    // Group items into runs (consecutive items with same font, same page, close Y)
    runs = groupIntoRuns(items)  // each run = sequence of items on consecutive lines
    
    indentedRunCount = 0
    totalRuns = 0
    
    for run in runs:
      if run.length < 2: continue  // need multi-line blocks
      totalRuns++
      
      // Check indentation: items should start further right than body text
      // OR all have consistent left-alignment that differs from body
      avgX = average(run.map(item => item.x))
      
      // Check line lengths: code lines tend to be shorter than body text
      avgWidth = average(run.map(item => item.width))
      
      // Heuristic: indented (x > body left margin + 20pt) OR short lines (width < 70% of body width)
      bodyLeftMargin = estimate from dominant font items  // typically ~72-108pt
      bodyAvgWidth = average width of dominant font items
      
      if avgX > bodyLeftMargin + 20 or avgWidth < bodyAvgWidth * 0.7:
        indentedRunCount++
    
    // If >50% of multi-line runs of this font are indented/short → code font
    if totalRuns >= 3 and indentedRunCount / totalRuns > 0.5:
      codeFonts.add(fontName)
  
  return codeFonts
}
```

**Implementation detail for `groupIntoRuns`:**
```pseudocode
function groupIntoRuns(items: ExtractedItem[]): ExtractedItem[][] {
  // Sort by page, then Y
  sorted = items.sort((a, b) => a.page - b.page || a.y - b.y)
  runs = []
  currentRun = [sorted[0]]
  
  for i = 1 to sorted.length - 1:
    prev = sorted[i-1]
    curr = sorted[i]
    
    // Same page and Y gap < 2x font height → same run
    if curr.page == prev.page and abs(curr.y - prev.y) < prev.fontSize * 2:
      currentRun.push(curr)
    else:
      runs.push(currentRun)
      currentRun = [curr]
  
  runs.push(currentRun)
  return runs
}
```

#### Step 2: Enhanced `isCodeBlock()` function

Replace the current `isCodeBlock()` with a multi-signal version:

```pseudocode
function isCodeBlock(items: ExtractedItem[], codeFonts: Set<string>): boolean {
  if items.length == 0: return false
  
  // Signal 1: Font-name match (existing, still works for non-subset fonts)
  monoChars = 0
  totalChars = 0
  for item in items:
    totalChars += item.str.length
    if isMonospace(item.fontName):
      monoChars += item.str.length
  
  if totalChars > 0 and monoChars / totalChars >= 0.8:
    return true
  
  // Signal 2: Detected code font match
  codeFontChars = 0
  for item in items:
    if codeFonts.has(item.fontName):
      codeFontChars += item.str.length
  
  if totalChars > 0 and codeFontChars / totalChars >= 0.8:
    return true
  
  // Signal 3: Syntax pattern detection (catches code even without font signal)
  text = assembleBlockText(items)  // join items into text
  syntaxScore = 0
  
  // Check for common code patterns
  if text.match(/[{}()[\]];/): syntaxScore += 1
  if text.match(/\b(def|class|import|return|if|else|for|while|print|function|var|let|const)\b/): syntaxScore += 2
  if text.match(/[=<>!]+/): syntaxScore += 1
  if text.match(/\.\w+\(/): syntaxScore += 1  // method calls
  if text.match(/^\s{2,}/m): syntaxScore += 1  // indented lines
  
  // Structural signals
  lines = splitIntoLines(items)
  if lines.length >= 2:
    avgLineWidth = average(lines.map(line => sum(item.width for item in line)))
    // Code blocks typically have shorter, variable-length lines
    widthVariance = variance of line widths
    if widthVariance > 100: syntaxScore += 1  // high variance = not prose
  
  // Need both syntax patterns AND consistent indentation/short lines
  if syntaxScore >= 3 and allItemsSameFont(items):
    return true
  
  return false
}
```

#### Step 3: Integration into converter pipeline

In `converter.ts`, after `buildFontProfile()`, call `detectCodeFont()`:

```pseudocode
// In convert() function, after buildFontProfile:
const profile = buildFontProfile(reordered);
const codeFonts = detectCodeFont(reordered, profile.bodySize);  // NEW

// Pass codeFonts through to detectTablesAndCode:
const enrichedBlocks = detectTablesAndCode(blocks, codeFonts);  // MODIFIED

// In detectTablesAndCode, pass codeFonts to isCodeBlock:
function detectTablesAndCode(blocks: Block[], codeFonts: Set<string>): Block[] {
  return blocks.map(block => {
    if (block.type !== "paragraph") return block;
    const tableRows = detectTable(block.items);
    if (tableRows) return { ...block, type: "table", tableRows };
    if (isCodeBlock(block.items, codeFonts)) {  // MODIFIED
      return { ...block, type: "code-block" };
    }
    return block;
  });
}
```

### Expected Impact

| PDF | Current Code Score | Expected After |
|-----|-------------------|---------------|
| code-book-think-python.pdf | 2/10 | 7-8/10 |
| code-haskell-report.pdf | 2/10 | 7-8/10 |
| code-git-cheatsheet.pdf | 2/10 | 6-7/10 |

**Overall score lift:** These three PDFs should each gain 1.5-2.0 points overall.

---

## P2: Link Annotation Matching Fix

### Problem

PDF link annotations are rectangular regions on the page. Current matching: if an item's bounding box overlaps a link rectangle at all (even 1px), the item gets that link. This causes prose text to inherit URLs from nearby annotations.

**Example from Think Python output:**
```
[In January 1999 I was preparing to teach...](https://thinkpython.com/code/Circle.py)
```
This prose paragraph has zero connection to `Circle.py`. The link annotation for `Circle.py` is in the margin or a different section, but its rectangle slightly overlaps with the body text line.

### Algorithm Spec: Center-Point + Minimum Overlap Matching

Replace the current `matchLinksToText()` in `converter.ts`:

```pseudocode
function matchLinksToText(items: ExtractedItem[], links: AnnotationLink[]): Map<ExtractedItem, string> {
  const linkMap = new Map<ExtractedItem, string>();
  if (links.length === 0) return linkMap;

  for (const item of items) {
    for (const link of links) {
      const [lx1, ly1, lx2, ly2] = link.rect;
      
      // Method 1: Center-point containment
      // Item's center must be INSIDE the link rectangle
      const itemCenterX = item.x + item.width / 2;
      const itemCenterY = item.y + item.height / 2;
      
      const centerInside = (
        itemCenterX >= lx1 && itemCenterX <= lx2 &&
        itemCenterY >= ly1 && itemCenterY <= ly2
      );
      
      if (centerInside) {
        linkMap.set(item, link.url);
        break;
      }
      
      // Method 2: High overlap (>50% of item width must be inside link rect)
      // This catches items that are mostly inside but whose center is just outside
      const overlapLeft = Math.max(item.x, lx1);
      const overlapRight = Math.min(item.x + item.width, lx2);
      const overlapWidth = Math.max(0, overlapRight - overlapLeft);
      
      const overlapTop = Math.max(item.y, ly1);
      const overlapBottom = Math.min(item.y + item.height, ly2);
      const overlapHeight = Math.max(0, overlapBottom - overlapTop);
      
      if (item.width > 0 && item.height > 0) {
        const overlapRatioX = overlapWidth / item.width;
        const overlapRatioY = overlapHeight / item.height;
        
        // Require >50% overlap in BOTH dimensions
        if (overlapRatioX > 0.5 && overlapRatioY > 0.5) {
          linkMap.set(item, link.url);
          break;
        }
      }
    }
  }

  return linkMap;
}
```

### Expected Impact

| PDF | Current Link Score | Expected After | Notes |
|-----|-------------------|---------------|-------|
| code-book-think-python.pdf | 9/10 (misleading — links exist but wrong) | 8-9/10 (correct links) | 15,756 links → probably ~500-1000 correct |
| scientific-bert-paper.pdf | 9/10 | 9/10 | Fewer spurious links on prose |
| academic-attention-paper.pdf | 9/10 | 9/10 | Cleaner output |

The automated score may not change much (it measures link presence, not correctness), but manual quality will improve significantly. The link count on Think Python should drop from ~15,756 to a more reasonable number.

---

## P3: Heading Detection Refinement

### Problem

Five PDFs score 4/10 on heading detection:
- `legal-us-copyright-circular.pdf` — headings are bold, same font size as body
- `financial-berkshire-letter.pdf` — headings are bold, same font size
- `scientific-rl-survey.pdf` — section numbers (1., 2.1, etc.) not leveraged
- `scientific-bert-paper.pdf` — numbered sections ("1 Introduction") detected as body
- `scanned-declaration.pdf` — limited text, heading detection not applicable

Current algorithm: `buildFontProfile()` finds the most common font size (body) and considers anything >15% larger as a heading. This misses:
1. **Bold-only headings** (same size as body, distinguished only by bold weight)
2. **Section-numbered headings** (e.g., "1.1 Background") at body font size

### Algorithm Spec: Multi-Signal Heading Detection

#### Change 1: Bold + standalone line = heading candidate

Modify `classifyBlock()` in `converter.ts`:

```pseudocode
function classifyBlock(items: ExtractedItem[], profile: FontProfile): Block {
  const firstItem = items[0];

  // Check 1: Font size (existing) — largest font sizes are headings
  const headingLevel = getHeadingLevel(firstItem.fontSize, profile);
  if (headingLevel !== undefined) {
    return { items, type: "heading", headingLevel };
  }

  // Check 2 (NEW): Bold text on a short standalone line → heading
  const text = items.map(i => i.str).join(" ").trim();
  const allBold = items.every(i => isBold(i.fontName));
  const isShortLine = text.length < 120;  // headings are rarely > 120 chars
  const hasNoTrailingPunctuation = !/[.,:;]$/.test(text);  // headings don't end with period
  
  if (allBold && isShortLine && hasNoTrailingPunctuation && items.length <= 5) {
    // Determine heading level based on context:
    // - ALL CAPS bold → H2
    // - Bold at body size → H3
    // - Bold at smaller size → H4
    const isAllCaps = text === text.toUpperCase() && text !== text.toLowerCase();
    
    if (isAllCaps) {
      return { items, type: "heading", headingLevel: 2 };
    } else {
      return { items, type: "heading", headingLevel: 3 };
    }
  }

  // Check 3 (NEW): Section numbering pattern → heading
  const sectionMatch = text.match(/^(\d+\.(?:\d+\.?)*)\s+\S/);
  if (sectionMatch && isShortLine && hasNoTrailingPunctuation) {
    // Count dots to determine depth: "1." → H2, "1.1" → H3, "1.1.1" → H4
    const dots = (sectionMatch[1].match(/\./g) || []).length;
    const level = Math.min(dots + 1, 6);  // 1. → H2, 1.1 → H3, etc. (start at H2, H1 reserved for title)
    return { items, type: "heading", headingLevel: level };
  }

  // Check for list item (existing)
  // ... rest of existing logic unchanged ...
}
```

#### Change 2: Prevent false positives

Add guards to avoid classifying random bold text as headings:

```pseudocode
// In Check 2, additional guards:
// - Must be the only block-level element on its visual "line" 
//   (i.e., not a bold word within a paragraph — that's handled by groupIntoBlocks 
//   which already separates by font size changes)
// - Must have text length >= 2 (avoid single characters)
// - Must not look like a list item (no bullet/number prefix)
const looksLikeListItem = BULLET_PATTERN.test(text) || NUMBERED_PATTERN.test(text);
if (allBold && isShortLine && hasNoTrailingPunctuation && !looksLikeListItem && text.length >= 2 && items.length <= 5) {
  // ... heading classification ...
}
```

#### Change 3: Section number pattern should override list detection

Currently, "1. Introduction" matches `NUMBERED_PATTERN` (`/^(\d{1,3})[.)]\s+/`) and gets classified as a list item. Fix the ordering:

```pseudocode
function classifyBlock(items, profile):
  // ... font-size heading check ...
  
  // NEW: Section numbering check BEFORE list check
  const text = firstItem.str.trimStart();
  const sectionMatch = text.match(/^(\d+\.(?:\d+\.?)*)\s+[A-Z]/);
  // Key: section numbers are followed by a capital letter (heading text)
  // while list items like "1. first item" often start lowercase
  if (sectionMatch) {
    const allItemsText = items.map(i => i.str).join(" ").trim();
    if (allItemsText.length < 120 && !/[.,:;]$/.test(allItemsText)) {
      const dots = (sectionMatch[1].match(/\./g) || []).length;
      return { items, type: "heading", headingLevel: Math.min(dots + 1, 6) };
    }
  }
  
  // Existing list detection...
  const bulletMatch = text.match(BULLET_PATTERN);
  // ... etc
```

### Expected Impact

| PDF | Current Heading Score | Expected After |
|-----|----------------------|---------------|
| legal-us-copyright-circular.pdf | 4/10 | 7-8/10 |
| financial-berkshire-letter.pdf | 4/10 | 6-7/10 |
| scientific-rl-survey.pdf | 4/10 | 7-8/10 |
| scientific-bert-paper.pdf | 4/10 | 7-8/10 |
| scanned-declaration.pdf | 4/10 | 4-5/10 (limited improvement — scanned) |

---

## Test Strategy

### Regression Tests (must not break)

After each fix, run the full evaluation suite and verify:

```bash
cd ~/Coding/pdf2md
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate.ts
```

**Regression gates (scores must not decrease for these):**
- `multicolumn-gan-paper.pdf` ≥ 8.5 (currently 8.7)
- `multicolumn-ieee-paper.pdf` ≥ 7.5 (currently 7.9)
- `academic-attention-paper.pdf` ≥ 8.0 (currently 8.3)
- `government-irs-w4.pdf` ≥ 8.5 (currently 8.6)
- `code-book-think-python.pdf` ≥ 8.0 (currently 8.5 — must not regress)

### Per-Fix Test PDFs

| Fix | Primary Test PDF | Secondary Test PDFs | What to Check |
|-----|-----------------|---------------------|---------------|
| P0 (columns) | whitepaper-bitcoin.pdf | slides-stanford-ml.pdf, financial-berkshire-letter.pdf | Score ≥ 8.3; no false two-column pages; diagram text preserved as-is |
| P1 (code blocks) | code-book-think-python.pdf | code-haskell-report.pdf, code-git-cheatsheet.pdf | Code blocks detected (count > 0); code wrapped in triple backticks |
| P2 (links) | code-book-think-python.pdf | scientific-bert-paper.pdf, academic-attention-paper.pdf | Link count drops significantly; prose lines no longer wrapped in link markdown |
| P3 (headings) | scientific-bert-paper.pdf | legal-us-copyright-circular.pdf, financial-berkshire-letter.pdf, scientific-rl-survey.pdf | Heading count increases; section numbers become headings |

### Unit Tests to Add

Add to `packages/core/src/converter.test.ts`:

**P0 tests:**
```
- detectColumnLayout returns "single" when items have short labels creating false gap
- detectColumnLayout returns "single" when small-font items are filtered
- Cross-page consistency: 1/9 two-column pages → all override to single
- Cross-page: 7/9 two-column pages → keep two-column
```

**P1 tests:**
```
- detectCodeFont identifies font used in indented short-line blocks
- isCodeBlock with codeFonts returns true for subset font code blocks
- isCodeBlock syntax detection catches Python code patterns
- isCodeBlock does not false-positive on regular prose
```

**P2 tests:**
```
- matchLinksToText: item centered inside link rect → matched
- matchLinksToText: item barely overlapping edge (< 50%) → NOT matched
- matchLinksToText: item with 60% overlap → matched
```

**P3 tests:**
```
- classifyBlock: all-bold short line → heading
- classifyBlock: "1.1 Background" → heading level 3
- classifyBlock: "1. first item in a list" → list item (not heading)
- classifyBlock: bold line ending with period → NOT heading
```

---

## Implementation Order

| Order | Fix | Estimated Effort | Dependencies |
|-------|-----|-----------------|--------------|
| 1 | P0: Column detection hardening | 1-2 hours | None |
| 2 | P2: Link matching fix | 30 min | None |
| 3 | P3: Heading detection | 1 hour | None (but test after P0 to avoid score conflicts) |
| 4 | P1: Code block detection | 2-3 hours | None (most complex, highest impact on programming PDFs) |

**Rationale:** P0 first because it's a regression (fix bugs before adding features). P2 is the simplest change. P3 is straightforward. P1 is the most complex (new detection pipeline) but also the highest-impact improvement.

All four fixes are independent — they modify different functions and can be implemented in any order. The recommended order minimizes risk (regression fix first, then simple changes, then complex ones).

---

## Edge Cases

### Column Detection (P0)

| Edge Case | Expected Behavior | How Algorithm Handles It |
|-----------|-------------------|-------------------------|
| 3-column layout (rare) | Detect as single-column (acceptable) | Only looks for one gap in 35-65% zone; 3-column gaps would be at 33% and 66%, possibly outside search zone |
| Sidebar + main column | Detect as two-column if sidebar has substantial text | Min column width check: sidebar needs >100pt median width |
| Landscape pages | Same algorithm works | maxRight adjusts automatically to wider page |
| Mixed layout (title + 2-col body) | Detect two-column, splitY separates header | Existing splitY logic handles this |
| Tables spanning full width in 2-col paper | Table rows may trigger false single-column | Table lines don't have a gap → reduce the line ratio, but 40% threshold should still pass |
| Single-column PDF with centered equations | Single-column | Equations are short centered text; not enough lines with consistent gap |
| PDF with page-margin annotations/watermarks | Should not trigger false column detection | Small font filter + min column width filter |

### Code Block Detection (P1)

| Edge Case | Expected Behavior | How Algorithm Handles It |
|-----------|-------------------|-------------------------|
| Inline code (single monospace word in prose) | NOT a code block | Block-level detection only; inline code is a separate concern |
| Indented quote blocks (not code) | Should NOT be detected as code | Syntax score check: quotes lack `{}();` patterns, need score ≥ 3 |
| Mixed font code blocks (bold keywords) | Detected if majority is code font | 80% threshold on code font chars |
| PDF with no code at all | No false positives | codeFonts will be empty; no detection fires |
| Pseudocode in academic papers | Ideally detected | Syntax patterns help; indentation helps |
| Output/terminal dumps | Detected if using code font | Font match works for terminal output |

### Link Matching (P2)

| Edge Case | Expected Behavior | How Algorithm Handles It |
|-----------|-------------------|-------------------------|
| Link spanning multiple text items | All items inside the rect get linked | Center-point check works per-item |
| Very small link annotations | May miss some items | 50% overlap fallback catches most |
| Overlapping link annotations | First match wins (existing behavior) | Break after first match |
| Link annotation with zero-width rect | Ignored (no overlap possible) | Math.max(0, ...) handles gracefully |

### Heading Detection (P3)

| Edge Case | Expected Behavior | How Algorithm Handles It |
|-----------|-------------------|-------------------------|
| Bold-only heading that ends with "." (e.g., "Note.") | NOT a heading | Trailing punctuation check filters it |
| ALL CAPS body text (legal docs) | Could false-positive | Only triggers if short (<120 chars) + no trailing punctuation + bold |
| "Figure 1. Caption" | NOT a heading | Trailing period filters it; also "Figure" pattern could be added as exclusion |
| Section "A. Appendix" (letter numbering) | Currently not detected | Only matches `\d+\.` pattern; letter sections could be added as follow-up |
| Bold author names | NOT a heading | Usually appears in running text, not standalone block; if standalone, length check helps |

---

## Success Criteria

### Per-PDF Target Scores

| PDF | Current Score | Target Score | Key Improvement |
|-----|--------------|-------------|-----------------|
| whitepaper-bitcoin.pdf | 7.8 | **8.5+** | P0: No false column detection |
| code-book-think-python.pdf | 8.5 | **9.0+** | P1: Code blocks + P2: correct links |
| code-haskell-report.pdf | 8.3 | **8.8+** | P1: Code blocks detected |
| code-git-cheatsheet.pdf | 7.2 | **8.0+** | P1: Code blocks detected |
| scientific-bert-paper.pdf | 7.3 | **8.0+** | P3: Section headings |
| scientific-rl-survey.pdf | 7.4 | **8.0+** | P3: Section headings |
| legal-us-copyright-circular.pdf | 8.1 | **8.5+** | P3: Bold headings |
| financial-berkshire-letter.pdf | 7.6 | **8.0+** | P3: Bold headings |
| multicolumn-gan-paper.pdf | 8.7 | **8.7+** | No regression |
| multicolumn-ieee-paper.pdf | 7.9 | **7.9+** | No regression |

### Aggregate Targets

| Metric | Current | Target |
|--------|---------|--------|
| Overall average (automated) | 8.0/10 | **8.4+/10** |
| Honest manual assessment | ~6.5-7.0/10 | **8.0+/10** |
| PDFs scoring < 7.5 | 6 PDFs | **≤ 2 PDFs** |
| Code block detection average | 5.4/10 | **7.5+/10** |
| Heading detection average | 7.9/10 | **8.5+/10** |

### Definition of Done

1. All four fixes implemented and passing unit tests
2. Full evaluation suite run with no regressions on any existing PDF
3. Bitcoin whitepaper score ≥ 8.3 (confirming P0 fix)
4. At least one code block detected in each of the three programming PDFs
5. Think Python link count reduced by >50% (confirms P2 fix)
6. BERT paper heading count increased from 1 to ≥ 10 (confirms P3 fix)
7. `tasks.md` updated with completion status
8. All changes committed with descriptive message

---

## Appendix: Debug Scripts

Debug scripts used for investigation are at:
- `packages/core/debug-columns.ts` — column detection per-page analysis
- `packages/core/debug-page2.ts` — detailed item dump for specific page
- `packages/core/debug-fonts.ts` — font name enumeration per PDF

These can be deleted after implementation or kept for future debugging. They require the pdfjs-dist legacy build:
```bash
cd ~/Coding/pdf2md/packages/core
npx tsx debug-columns.ts ../../test-corpus/real-pdfs/whitepaper-bitcoin.pdf
```
