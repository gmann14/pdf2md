#!/usr/bin/env npx tsx
/**
 * PDF-to-Markdown Quality Evaluation Framework
 *
 * Runs every PDF in real-pdfs/ through @pdf2md/core, saves output to results/,
 * and scores each conversion on multiple quality dimensions.
 *
 * Usage: npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate.ts
 */

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { resolve, basename, join } from "node:path";
import { convert } from "../packages/core/src/converter";
import { initPdfWorker } from "../packages/core/src/pdf-worker";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScoreBreakdown {
  headingDetection: number; // 0-10: Are headings properly detected?
  paragraphIntegrity: number; // 0-10: No broken mid-sentence splits?
  listDetection: number; // 0-10: Bullets/numbers preserved?
  tableDetection: number; // 0-10: Tables found and formatted?
  codeBlockDetection: number; // 0-10: Monospace blocks wrapped?
  linkExtraction: number; // 0-10: URLs preserved?
  metadataExtraction: number; // 0-10: Title/author in front matter?
  noGarbage: number; // 0-10: No binary junk, encoding issues?
  overallReadability: number; // 0-10: Is the output useful markdown?
}

interface PdfEvaluation {
  filename: string;
  category: string;
  fileSize: number;
  status: string;
  pageCount: number;
  wordCount: number;
  processingMs: number;
  scores: ScoreBreakdown;
  overallScore: number;
  warnings: string[];
  notes: string[];
  failureMode?: string;
}

// ---------------------------------------------------------------------------
// Category mapping
// ---------------------------------------------------------------------------

function getCategory(filename: string): string {
  const categories: Record<string, string> = {
    "academic-attention-paper": "Academic Paper",
    "code-book-think-python": "Programming Book",
    "code-git-cheatsheet": "Code Cheatsheet",
    "code-haskell-report": "Programming Language Spec",
    "financial-berkshire-letter": "Financial Report",
    "government-irs-w4": "Government Form",
    "government-irs-w9": "Government Form",
    "government-nist-cybersecurity": "Government Technical Report",
    "legal-us-copyright-circular": "Legal Document",
    "manual-arduino-guide": "Technical Manual",
    "multicolumn-gan-paper": "Multi-Column Layout",
    "multicolumn-ieee-paper": "Multi-Column Layout",
    "newsletter-imf-weo": "Newsletter/Report",
    "resume-sample": "Resume/CV",
    "scanned-declaration": "Scanned Document",
    "scientific-bert-paper": "Scientific Paper (Tables)",
    "scientific-resnet": "Scientific Paper (Tables)",
    "scientific-rl-survey": "Survey Paper (Long)",
    "slides-stanford-ml": "Slide Deck",
    "tables-cdc-report": "Data-Heavy Report",
    "whitepaper-bitcoin": "Whitepaper",
    "legal-contract-clauses": "Legal Contract",
    "tables-census-poverty": "Statistical Report",
    "infographic-cdc-diseases": "Infographic",
    "landscape-gantt-chart": "Landscape Document",
    "academic-footnotes-philosophy": "Academic (Footnotes)",
    "multilingual-udhr-chinese": "CJK / Multilingual",
    "form-filled-1040": "Filled Form",
  };
  const stem = filename.replace(/\.pdf$/, "");
  return categories[stem] ?? "Unknown";
}

// ---------------------------------------------------------------------------
// Scoring functions
// ---------------------------------------------------------------------------

function scoreHeadingDetection(md: string, category: string): number {
  const headingLines = md.split("\n").filter((l) => /^#{1,6}\s/.test(l));
  const h1Count = headingLines.filter((l) => l.startsWith("# ")).length;
  const h2Count = headingLines.filter((l) => l.startsWith("## ")).length;
  const h3Count = headingLines.filter((l) => l.startsWith("### ")).length;
  const totalHeadings = headingLines.length;

  // Some categories may legitimately have few headings
  if (
    category === "Code Cheatsheet" ||
    category === "Government Form" ||
    category === "Landscape Document" ||
    category === "Filled Form" ||
    category === "Scanned Document" ||
    category === "Infographic"
  ) {
    return totalHeadings >= 1 ? 8 : 5;
  }

  if (totalHeadings === 0) return 1;
  if (totalHeadings === 1) return 4;

  // Penalize if ALL headings are the same level (no hierarchy)
  const levels = new Set(headingLines.map((l) => l.match(/^(#+)/)?.[1]?.length));
  if (levels.size === 1 && totalHeadings > 3) return 5;

  // Good hierarchy with multiple levels
  let score = 6;
  if (h1Count >= 1) score += 1;
  if (h2Count >= 1) score += 1;
  if (h3Count >= 1) score += 1;
  if (totalHeadings >= 5) score += 1;

  return Math.min(10, score);
}

function scoreParagraphIntegrity(md: string): number {
  const paragraphs = md
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0 && !p.startsWith("#") && !p.startsWith("|") && !p.startsWith("```"));

  if (paragraphs.length === 0) return 5;

  let brokenCount = 0;
  let veryShortParas = 0;
  let totalParas = 0;

  for (const para of paragraphs) {
    totalParas++;
    const trimmed = para.trim();

    // Paragraphs that end mid-word or have very few words
    if (trimmed.length > 0 && trimmed.length < 20 && !trimmed.startsWith("-") && !trimmed.startsWith("*")) {
      veryShortParas++;
    }

    // Check for broken words (hyphenated line breaks not resolved)
    if (/[a-z]-\s*$/.test(trimmed) && !trimmed.endsWith("---")) {
      brokenCount++;
    }
  }

  const brokenRatio = totalParas > 0 ? brokenCount / totalParas : 0;
  const shortRatio = totalParas > 0 ? veryShortParas / totalParas : 0;

  let score = 10;
  if (brokenRatio > 0.1) score -= 3;
  else if (brokenRatio > 0.05) score -= 1;

  if (shortRatio > 0.5) score -= 3;
  else if (shortRatio > 0.3) score -= 2;
  else if (shortRatio > 0.15) score -= 1;

  return Math.max(1, score);
}

function scoreListDetection(md: string, category: string): number {
  const lines = md.split("\n");
  const bulletLines = lines.filter((l) => /^\s*[-*]\s/.test(l));
  const numberedLines = lines.filter((l) => /^\s*\d+\.\s/.test(l));
  const totalLists = bulletLines.length + numberedLines.length;

  // Some docs legitimately have no lists
  if (
    category === "Scanned Document" ||
    category === "Whitepaper" ||
    category === "Resume/CV" ||
    category === "Landscape Document" ||
    category === "Infographic" ||
    category === "CJK / Multilingual" ||
    category === "Filled Form" ||
    category === "Financial Report"
  ) {
    return totalLists >= 0 ? 7 : 5;
  }

  if (totalLists === 0) return 4; // Might be fine, or might be missing lists
  if (totalLists >= 3) return 9;
  if (totalLists >= 1) return 7;
  return 5;
}

function scoreTableDetection(md: string, category: string): number {
  const tableLines = md.split("\n").filter((l) => l.trim().startsWith("|"));
  const hasTables = tableLines.length >= 3; // header + separator + at least 1 row

  // Categories where we expect tables
  const expectTables = [
    "Scientific Paper (Tables)",
    "Data-Heavy Report",
    "Financial Report",
    "Survey Paper (Long)",
  ];

  if (expectTables.includes(category)) {
    if (hasTables) return 9;
    return 3; // Expected tables but none found
  }

  // Other categories
  if (hasTables) return 9;
  return 6; // No tables, but may not need them
}

function scoreCodeBlockDetection(md: string, category: string): number {
  const codeBlocks = md.match(/```[\s\S]*?```/g) ?? [];
  const hasCode = codeBlocks.length > 0;

  // Categories where we expect code blocks
  const expectCode = [
    "Programming Book",
    "Code Cheatsheet",
    "Programming Language Spec",
  ];

  if (expectCode.includes(category)) {
    if (hasCode && codeBlocks.length >= 3) return 9;
    if (hasCode) return 7;
    return 2; // Expected code but none found
  }

  // Categories where code blocks are very unlikely — penalize false positives
  const noCodeExpected = [
    "Financial Report",
    "Legal Document",
    "Legal Contract",
    "Government Form",
    "Filled Form",
    "Scanned Document",
    "Resume/CV",
    "Infographic",
    "Landscape Document",
    "CJK / Multilingual",
  ];
  if (noCodeExpected.includes(category)) {
    if (!hasCode) return 9; // Correct: no false code blocks
    // Penalize: code blocks in a non-code document are likely false positives
    if (codeBlocks.length > 5) return 3;
    if (codeBlocks.length > 2) return 5;
    return 6;
  }

  // Other categories: mild bonus for detecting code, but penalize excessive
  if (hasCode) {
    // Check for suspiciously tiny code blocks (likely false positives)
    const tinyBlocks = codeBlocks.filter((b) => {
      const content = b.replace(/```/g, "").trim();
      return content.length < 10;
    });
    if (tinyBlocks.length > codeBlocks.length * 0.5 && tinyBlocks.length > 3) return 6;
    return 9;
  }
  return 6; // N/A
}

function scoreLinkExtraction(md: string): number {
  const links = md.match(/\[([^\]]+)\]\(([^)]+)\)/g) ?? [];
  const bareUrls = md.match(/https?:\/\/[^\s)]+/g) ?? [];
  const totalLinks = links.length + bareUrls.length;

  if (totalLinks === 0) return 5; // Many PDFs have no links
  if (totalLinks >= 5) return 9;
  if (totalLinks >= 1) return 7;
  return 5;
}

function scoreMetadataExtraction(
  md: string,
  metadata: { title?: string; author?: string } | undefined,
): number {
  let score = 5;

  if (metadata?.title && metadata.title.trim().length > 0) score += 2;
  if (metadata?.author && metadata.author.trim().length > 0) score += 2;

  // Check for YAML front matter
  if (md.startsWith("---\n")) score += 1;

  return Math.min(10, score);
}

function scoreNoGarbage(md: string): number {
  let score = 10;

  // Check for binary/encoding junk
  const controlChars = (md.match(/[\x00-\x08\x0E-\x1F\x7F]/g) ?? []).length;
  if (controlChars > 10) score -= 4;
  else if (controlChars > 0) score -= 1;

  // Check for excessive special characters that suggest encoding issues
  const weirdChars = (md.match(/[^\x20-\x7E\n\r\t\u00A0-\u024F\u2000-\u206F\u2190-\u27FF\u2900-\u2BFF]/g) ?? []).length;
  const charRatio = md.length > 0 ? weirdChars / md.length : 0;
  if (charRatio > 0.1) score -= 3;
  else if (charRatio > 0.05) score -= 1;

  // Check for runs of repeated characters (garbled output)
  if (/(.)\1{20,}/.test(md)) score -= 3;

  // Check for extremely long "words" (possible binary data)
  const longWords = md.split(/\s+/).filter((w) => w.length > 100);
  if (longWords.length > 3) score -= 2;

  return Math.max(1, score);
}

function scoreOverallReadability(md: string, wordCount: number): number {
  let score = 5;

  // Good word count
  if (wordCount > 100) score += 1;
  if (wordCount > 500) score += 1;

  // Has structure (headings, lists, etc.)
  const hasHeadings = /^#{1,6}\s/m.test(md);
  const hasLists = /^\s*[-*]\s/m.test(md) || /^\s*\d+\.\s/m.test(md);
  const hasParagraphs = md.split(/\n\n+/).filter((p) => p.trim().length > 50).length >= 2;

  if (hasHeadings) score += 1;
  if (hasLists) score += 1;
  if (hasParagraphs) score += 1;

  return Math.min(10, score);
}

// ---------------------------------------------------------------------------
// Main evaluation
// ---------------------------------------------------------------------------

function evaluatePdf(
  filename: string,
  md: string,
  result: Awaited<ReturnType<typeof convert>>,
): PdfEvaluation {
  const category = getCategory(filename);
  const warnings: string[] = [];
  const notes: string[] = [];

  // Collect warnings from conversion
  for (const msg of result.messages) {
    warnings.push(`[${msg.severity}] ${msg.message}`);
  }

  const scores: ScoreBreakdown = {
    headingDetection: scoreHeadingDetection(md, category),
    paragraphIntegrity: scoreParagraphIntegrity(md),
    listDetection: scoreListDetection(md, category),
    tableDetection: scoreTableDetection(md, category),
    codeBlockDetection: scoreCodeBlockDetection(md, category),
    linkExtraction: scoreLinkExtraction(md),
    metadataExtraction: scoreMetadataExtraction(md, result.metadata),
    noGarbage: scoreNoGarbage(md),
    overallReadability: scoreOverallReadability(md, result.stats.wordCount),
  };

  // Add notes about what was detected
  const headingCount = md.split("\n").filter((l) => /^#{1,6}\s/.test(l)).length;
  notes.push(`${headingCount} headings detected`);

  const listCount = md.split("\n").filter((l) => /^\s*[-*]\s/.test(l) || /^\s*\d+\.\s/.test(l)).length;
  notes.push(`${listCount} list items detected`);

  const tableLines = md.split("\n").filter((l) => l.trim().startsWith("|")).length;
  notes.push(`${tableLines} table lines detected`);

  const codeBlocks = (md.match(/```[\s\S]*?```/g) ?? []).length;
  notes.push(`${codeBlocks} code blocks detected`);

  const links = (md.match(/\[([^\]]+)\]\(([^)]+)\)/g) ?? []).length;
  notes.push(`${links} markdown links detected`);

  // Calculate overall score (weighted average)
  const weights = {
    headingDetection: 1.5,
    paragraphIntegrity: 2.0,
    listDetection: 1.0,
    tableDetection: 1.0,
    codeBlockDetection: 0.8,
    linkExtraction: 0.8,
    metadataExtraction: 0.5,
    noGarbage: 1.5,
    overallReadability: 1.5,
  };

  let weightedSum = 0;
  let totalWeight = 0;
  for (const [key, weight] of Object.entries(weights)) {
    weightedSum += scores[key as keyof ScoreBreakdown] * weight;
    totalWeight += weight;
  }
  const overallScore = Math.round((weightedSum / totalWeight) * 10) / 10;

  // Determine failure mode
  let failureMode: string | undefined;
  if (result.status === "failed") {
    failureMode = result.messages[0]?.message ?? "Unknown failure";
  } else if (overallScore < 5) {
    const lowestKey = (Object.entries(scores) as [keyof ScoreBreakdown, number][])
      .sort((a, b) => a[1] - b[1])[0][0];
    failureMode = `Low ${lowestKey} score`;
  }

  return {
    filename,
    category,
    fileSize: 0, // Set by caller
    status: result.status,
    pageCount: result.stats.pageCount,
    wordCount: result.stats.wordCount,
    processingMs: Math.round(result.stats.processingMs),
    scores,
    overallScore,
    warnings,
    notes,
    failureMode,
  };
}

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

function generateReport(evaluations: PdfEvaluation[]): string {
  const lines: string[] = [];

  lines.push("# PDF-to-Markdown Quality Report");
  lines.push("");
  lines.push(`**Generated:** ${new Date().toISOString().split("T")[0]}`);
  lines.push(`**PDFs Tested:** ${evaluations.length}`);

  const successful = evaluations.filter((e) => e.status !== "failed");
  const failed = evaluations.filter((e) => e.status === "failed");

  const avgScore =
    successful.length > 0
      ? Math.round(
          (successful.reduce((sum, e) => sum + e.overallScore, 0) /
            successful.length) *
            10,
        ) / 10
      : 0;

  lines.push(`**Successful Conversions:** ${successful.length}/${evaluations.length}`);
  lines.push(`**Overall Average Score:** ${avgScore}/10`);
  lines.push("");

  // Score summary table
  lines.push("## Score Summary");
  lines.push("");
  lines.push(
    "| PDF | Category | Pages | Words | Time | Score | Status |",
  );
  lines.push(
    "| --- | -------- | ----: | ----: | ---: | ----: | ------ |",
  );

  for (const e of evaluations.sort((a, b) => b.overallScore - a.overallScore)) {
    const scoreEmoji =
      e.overallScore >= 7 ? "Good" : e.overallScore >= 5 ? "OK" : "Poor";
    lines.push(
      `| ${e.filename} | ${e.category} | ${e.pageCount} | ${e.wordCount} | ${e.processingMs}ms | **${e.overallScore}** | ${scoreEmoji} |`,
    );
  }
  lines.push("");

  // Detailed breakdown
  lines.push("## Detailed Score Breakdown");
  lines.push("");
  lines.push(
    "| PDF | Headings | Paragraphs | Lists | Tables | Code | Links | Metadata | No Garbage | Readability |",
  );
  lines.push(
    "| --- | -------: | ---------: | ----: | -----: | ---: | ----: | -------: | ---------: | ----------: |",
  );

  for (const e of evaluations.sort((a, b) => b.overallScore - a.overallScore)) {
    const s = e.scores;
    lines.push(
      `| ${e.filename} | ${s.headingDetection} | ${s.paragraphIntegrity} | ${s.listDetection} | ${s.tableDetection} | ${s.codeBlockDetection} | ${s.linkExtraction} | ${s.metadataExtraction} | ${s.noGarbage} | ${s.overallReadability} |`,
    );
  }
  lines.push("");

  // Failed conversions
  if (failed.length > 0) {
    lines.push("## Failed Conversions");
    lines.push("");
    for (const e of failed) {
      lines.push(`### ${e.filename}`);
      lines.push(`- **Category:** ${e.category}`);
      lines.push(`- **Failure:** ${e.failureMode ?? "Unknown"}`);
      for (const w of e.warnings) {
        lines.push(`- ${w}`);
      }
      lines.push("");
    }
  }

  // Top failure modes
  lines.push("## Top Failure Modes");
  lines.push("");

  const failureModes = new Map<string, number>();
  for (const e of evaluations) {
    // Identify weak areas (score < 5)
    for (const [key, val] of Object.entries(e.scores)) {
      if (val <= 4) {
        const mode = `Low ${key}`;
        failureModes.set(mode, (failureModes.get(mode) ?? 0) + 1);
      }
    }
    if (e.status === "failed") {
      const mode = e.failureMode ?? "Conversion failure";
      failureModes.set(mode, (failureModes.get(mode) ?? 0) + 1);
    }
  }

  const sortedModes = [...failureModes.entries()].sort((a, b) => b[1] - a[1]);
  if (sortedModes.length === 0) {
    lines.push("No major failure modes identified.");
  } else {
    for (let i = 0; i < Math.min(5, sortedModes.length); i++) {
      lines.push(`${i + 1}. **${sortedModes[i][0]}** — affects ${sortedModes[i][1]} PDF(s)`);
    }
  }
  lines.push("");

  // Category analysis
  lines.push("## Performance by Category");
  lines.push("");

  const byCategory = new Map<string, PdfEvaluation[]>();
  for (const e of evaluations) {
    const arr = byCategory.get(e.category) ?? [];
    arr.push(e);
    byCategory.set(e.category, arr);
  }

  for (const [cat, evals] of [...byCategory.entries()].sort()) {
    const catSuccessful = evals.filter((e) => e.status !== "failed");
    const catAvg =
      catSuccessful.length > 0
        ? Math.round(
            (catSuccessful.reduce((s, e) => s + e.overallScore, 0) /
              catSuccessful.length) *
              10,
          ) / 10
        : 0;
    const catStatus = evals.some((e) => e.status === "failed") ? " (has failures)" : "";
    lines.push(`- **${cat}**: ${catAvg}/10 avg${catStatus}`);
  }
  lines.push("");

  // Good vs bad examples
  lines.push("## Examples: Best and Worst Output");
  lines.push("");

  const bestResults = successful
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3);
  const worstResults = successful
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 3);

  lines.push("### Best Conversions");
  lines.push("");
  for (const e of bestResults) {
    lines.push(`**${e.filename}** (${e.overallScore}/10)`);
    lines.push(`- Category: ${e.category}`);
    lines.push(`- ${e.notes.join(", ")}`);
    lines.push("");
  }

  lines.push("### Worst Conversions (excluding failures)");
  lines.push("");
  for (const e of worstResults) {
    lines.push(`**${e.filename}** (${e.overallScore}/10)`);
    lines.push(`- Category: ${e.category}`);
    lines.push(`- Weaknesses: ${Object.entries(e.scores).filter(([, v]) => v <= 4).map(([k, v]) => `${k}=${v}`).join(", ") || "none below 5"}`);
    lines.push(`- ${e.notes.join(", ")}`);
    lines.push("");
  }

  // Recommendations
  lines.push("## Recommendations for Improvement");
  lines.push("");

  // Analyze the data to produce actionable recommendations
  const avgScores: Record<string, number> = {};
  const scoreKeys = Object.keys(successful[0]?.scores ?? {}) as (keyof ScoreBreakdown)[];
  for (const key of scoreKeys) {
    const vals = successful.map((e) => e.scores[key]);
    avgScores[key] = vals.length > 0 ? Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10 : 0;
  }

  const weakAreas = Object.entries(avgScores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);

  for (let i = 0; i < weakAreas.length; i++) {
    const [area, score] = weakAreas[i];
    let recommendation = "";
    switch (area) {
      case "headingDetection":
        recommendation =
          "Improve heading detection — consider using bold/font-weight heuristics in addition to font size. Multi-column layouts often confuse the heading hierarchy.";
        break;
      case "paragraphIntegrity":
        recommendation =
          "Fix paragraph splitting — investigate mid-sentence breaks, especially across page boundaries. Consider joining hyphenated words at line breaks.";
        break;
      case "listDetection":
        recommendation =
          "Enhance list detection — look for consistent indentation patterns and custom bullet characters beyond standard Unicode bullets.";
        break;
      case "tableDetection":
        recommendation =
          "Strengthen table detection — many academic papers and reports have tables that aren't being detected. Consider using line/border detection in addition to column alignment.";
        break;
      case "codeBlockDetection":
        recommendation =
          "Improve code block detection — look for indentation patterns, syntax-like characters, and consistent line spacing in addition to monospace font detection.";
        break;
      case "linkExtraction":
        recommendation =
          "Enhance link extraction — ensure annotation rect matching accounts for different PDF coordinate systems and scaled viewports.";
        break;
      case "metadataExtraction":
        recommendation =
          "Metadata extraction is limited by what PDFs embed. Consider extracting title from first large-font text if metadata is missing.";
        break;
      case "noGarbage":
        recommendation =
          "Investigate encoding issues — ensure proper Unicode handling and filter out common PDF artifacts (ligatures, special spaces).";
        break;
      case "overallReadability":
        recommendation =
          "Improve overall output structure — ensure consistent spacing, proper paragraph separation, and clean formatting.";
        break;
    }
    lines.push(`${i + 1}. **${area}** (avg: ${score}/10): ${recommendation}`);
    lines.push("");
  }

  // Dimension averages
  lines.push("## Average Score by Dimension");
  lines.push("");
  lines.push("| Dimension | Average Score |");
  lines.push("| --------- | -----------: |");
  for (const [key, val] of Object.entries(avgScores).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${key} | ${val}/10 |`);
  }
  lines.push("");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const scriptDir = new URL(".", import.meta.url).pathname;
  const corpusDir = resolve(scriptDir, "real-pdfs");
  const resultsDir = resolve(scriptDir, "results");

  await mkdir(resultsDir, { recursive: true });

  const files = (await readdir(corpusDir)).filter((f) => f.endsWith(".pdf")).sort();

  console.log(`Found ${files.length} PDFs to evaluate\n`);

  // Initialize PDF.js
  initPdfWorker();

  const evaluations: PdfEvaluation[] = [];

  for (const file of files) {
    const filePath = join(corpusDir, file);
    console.log(`Processing: ${file}...`);

    let buffer: ArrayBuffer;
    try {
      const nodeBuffer = await readFile(filePath);
      buffer = nodeBuffer.buffer.slice(
        nodeBuffer.byteOffset,
        nodeBuffer.byteOffset + nodeBuffer.byteLength,
      );
    } catch (err) {
      console.error(`  ERROR reading file: ${err}`);
      evaluations.push({
        filename: file,
        category: getCategory(file),
        fileSize: 0,
        status: "failed",
        pageCount: 0,
        wordCount: 0,
        processingMs: 0,
        scores: {
          headingDetection: 0,
          paragraphIntegrity: 0,
          listDetection: 0,
          tableDetection: 0,
          codeBlockDetection: 0,
          linkExtraction: 0,
          metadataExtraction: 0,
          noGarbage: 0,
          overallReadability: 0,
        },
        overallScore: 0,
        warnings: [`Failed to read file: ${err}`],
        notes: [],
        failureMode: "File read error",
      });
      continue;
    }

    try {
      const result = await convert(buffer, {
        includeMetadata: true,
        yamlFrontMatter: true,
      });

      // Save markdown output
      const outputPath = join(resultsDir, file.replace(/\.pdf$/, ".md"));
      await writeFile(outputPath, result.markdown || "(empty output)", "utf-8");

      const evaluation = evaluatePdf(file, result.markdown, result);
      evaluation.fileSize = buffer.byteLength;

      console.log(`  Status: ${result.status} | Score: ${evaluation.overallScore}/10 | ${result.stats.wordCount} words | ${Math.round(result.stats.processingMs)}ms`);

      if (result.messages.length > 0) {
        for (const msg of result.messages) {
          console.log(`  [${msg.severity}] ${msg.message}`);
        }
      }

      evaluations.push(evaluation);
    } catch (err) {
      console.error(`  ERROR converting: ${err}`);
      evaluations.push({
        filename: file,
        category: getCategory(file),
        fileSize: buffer.byteLength,
        status: "failed",
        pageCount: 0,
        wordCount: 0,
        processingMs: 0,
        scores: {
          headingDetection: 0,
          paragraphIntegrity: 0,
          listDetection: 0,
          tableDetection: 0,
          codeBlockDetection: 0,
          linkExtraction: 0,
          metadataExtraction: 0,
          noGarbage: 0,
          overallReadability: 0,
        },
        overallScore: 0,
        warnings: [`Conversion threw: ${err}`],
        notes: [],
        failureMode: `Exception: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  // Generate and save report
  const report = generateReport(evaluations);
  const reportPath = resolve(scriptDir, "QUALITY-REPORT.md");
  await writeFile(reportPath, report, "utf-8");

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Quality report saved to: ${reportPath}`);
  console.log(`Results saved to: ${resultsDir}/`);

  const successful = evaluations.filter((e) => e.status !== "failed");
  const avgScore =
    successful.length > 0
      ? Math.round(
          (successful.reduce((s, e) => s + e.overallScore, 0) /
            successful.length) *
            10,
        ) / 10
      : 0;
  console.log(`\nOverall average: ${avgScore}/10 (${successful.length} successful, ${evaluations.length - successful.length} failed)`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
