import { readFile } from "node:fs/promises";

export const DATASET_KEYS = ["training", "blind1", "blind2", "blind3"] as const;

export type DatasetKey = (typeof DATASET_KEYS)[number];

export interface DocumentFidelity {
  /** Percent (0–100) of text-layer word tokens present in the output. */
  wordRecall: number;
  /** Percent (0–100) of text-layer numeric tokens present in the output. */
  numericRecall: number;
  /** Percent (0–100) of output links backed by an annotation or bare URL. */
  linkPrecision: number;
}

export interface DatasetMetrics {
  average: number;
  documentScores: Record<string, number>;
  dimensions: Record<string, number>;
  /** Per-document text-fidelity metrics, when the report has a "Text Fidelity" section. */
  fidelity?: Record<string, DocumentFidelity>;
}

export interface QualitySnapshot {
  timestamp: string;
  gitSha: string;
  branch: string;
  diffSummary: string;
  datasets: Record<DatasetKey, DatasetMetrics>;
  combined: number;
}

export interface AcceptanceResult {
  status: "PASS" | "FAIL";
  combinedDelta: number;
  dimensionDeltas: Record<string, number>;
  maxDocumentDrop: number;
  reasons: string[];
}

const DATASET_WEIGHTS: Record<DatasetKey, number> = {
  training: 0.25,
  blind1: 0.25,
  blind2: 0.25,
  blind3: 0.25,
};

export const REPORT_PATHS: Record<DatasetKey, string> = {
  training: "test-corpus/QUALITY-REPORT.md",
  blind1: "test-corpus/BLIND-TEST-REPORT.md",
  blind2: "test-corpus/BLIND-TEST-2-REPORT.md",
  blind3: "test-corpus/BLIND-TEST-3-REPORT.md",
};

function roundScore(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function requireMatch(content: string, pattern: RegExp, label: string): RegExpMatchArray {
  const match = content.match(pattern);
  if (!match) {
    throw new Error(`Could not parse ${label}`);
  }
  return match;
}

export function computeCombined(datasets: Record<DatasetKey, DatasetMetrics>): number {
  return roundScore(
    DATASET_KEYS.reduce((sum, key) => sum + datasets[key].average * DATASET_WEIGHTS[key], 0),
  );
}

export function parseQualityReport(content: string, dataset: DatasetKey): DatasetMetrics {
  const averagePatterns: Record<DatasetKey, RegExp> = {
    training: /\*\*Overall Average Score:\*\*\s*([\d.]+)\/10/,
    blind1: /\*\*Blind Average Score:\*\*\s*([\d.]+)\/10/,
    blind2: /\*\*Set 2 Average Score:\*\*\s*([\d.]+)\/10/,
    blind3: /\*\*Set 3 Average Score:\*\*\s*([\d.]+)\/10/,
  };
  const average = Number(requireMatch(content, averagePatterns[dataset], `${dataset} average`)[1]);

  const documentScores: Record<string, number> = {};
  const scoreRowPattern = /^\|\s*([^|\s][^|]*?\.pdf)\s*\|(?:[^|]*\|){4}\s*\*\*([\d.]+)\*\*\s*\|/gm;
  for (const match of content.matchAll(scoreRowPattern)) {
    documentScores[match[1].trim()] = Number(match[2]);
  }

  const dimensions: Record<string, number> = {};
  const dimensionRowPattern = /^\|\s*([a-zA-Z][A-Za-z]+)\s*\|\s*([\d.]+)\/10\s*\|/gm;
  for (const match of content.matchAll(dimensionRowPattern)) {
    dimensions[match[1]] = Number(match[2]);
  }

  if (Object.keys(documentScores).length === 0) {
    throw new Error(`Could not parse ${dataset} document score table`);
  }

  const fidelity = parseFidelitySection(content);
  if (Object.keys(dimensions).length === 0) {
    throw new Error(`Could not parse ${dataset} dimension averages`);
  }

  return fidelity ? { average, documentScores, dimensions, fidelity } : { average, documentScores, dimensions };
}

/** Parse the "## Text Fidelity" table written by test-corpus/fidelity.ts. */
export function parseFidelitySection(content: string): Record<string, DocumentFidelity> | undefined {
  const start = content.indexOf("## Text Fidelity");
  if (start === -1) return undefined;
  const section = content.slice(start);
  const rows: Record<string, DocumentFidelity> = {};
  const rowPattern = /^\|\s*([^|\s][^|]*?\.pdf)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|[^|]*\|\s*([\d.]+)\s*\|/gm;
  for (const match of section.matchAll(rowPattern)) {
    rows[match[1].trim()] = {
      wordRecall: Number(match[2]),
      numericRecall: Number(match[3]),
      linkPrecision: Number(match[4]),
    };
  }
  return Object.keys(rows).length > 0 ? rows : undefined;
}

/** Fidelity acceptance limits (percentage points). */
export const FIDELITY_RULES = {
  maxWordRecallDrop: 0.5,
  maxNumericRecallDrop: 0,
  minLinkPrecision: 95,
} as const;

/**
 * Fidelity part of the acceptance rule: a document fails if its word recall
 * drops by more than 0.5 points, its numeric recall drops at all, or its link
 * precision falls below 95% (or below its baseline, if that is already lower).
 */
export function fidelityFailures(current: QualitySnapshot, baseline: QualitySnapshot): string[] {
  const failures: string[] = [];
  for (const dataset of DATASET_KEYS) {
    const before = baseline.datasets[dataset]?.fidelity;
    const after = current.datasets[dataset]?.fidelity;
    if (!before || !after) continue;
    for (const [doc, base] of Object.entries(before)) {
      const now = after[doc];
      if (!now) continue;
      const wordDrop = roundScore(base.wordRecall - now.wordRecall);
      if (wordDrop > FIDELITY_RULES.maxWordRecallDrop) {
        failures.push(`${dataset}.${doc} word recall dropped ${wordDrop.toFixed(1)} points`);
      }
      const numericDrop = roundScore(base.numericRecall - now.numericRecall);
      if (numericDrop > FIDELITY_RULES.maxNumericRecallDrop) {
        failures.push(`${dataset}.${doc} numeric recall dropped ${numericDrop.toFixed(1)} points`);
      }
      const floor = Math.min(FIDELITY_RULES.minLinkPrecision, base.linkPrecision);
      if (now.linkPrecision < floor) {
        failures.push(`${dataset}.${doc} link precision ${now.linkPrecision.toFixed(1)}% is below ${floor.toFixed(1)}%`);
      }
    }
  }
  return failures;
}

export async function loadSnapshotFromReports(
  rootDir: string,
  metadata: Omit<QualitySnapshot, "datasets" | "combined">,
): Promise<QualitySnapshot> {
  const datasets = {} as Record<DatasetKey, DatasetMetrics>;
  for (const key of DATASET_KEYS) {
    const report = await readFile(`${rootDir}/${REPORT_PATHS[key]}`, "utf-8");
    datasets[key] = parseQualityReport(report, key);
  }

  return {
    ...metadata,
    datasets,
    combined: computeCombined(datasets),
  };
}

export function compareSnapshots(current: QualitySnapshot, baseline: QualitySnapshot): AcceptanceResult {
  const reasons: string[] = [];
  const combinedDelta = roundScore(current.combined - baseline.combined);

  if (combinedDelta >= 0.05) {
    reasons.push(`combined score improved by ${combinedDelta.toFixed(3)}`);
  } else if (combinedDelta < 0) {
    reasons.push(`combined score regressed by ${Math.abs(combinedDelta).toFixed(3)}`);
  }

  const dimensionDeltas: Record<string, number> = {};
  for (const dataset of DATASET_KEYS) {
    const baselineDimensions = baseline.datasets[dataset].dimensions;
    const currentDimensions = current.datasets[dataset].dimensions;
    for (const dimension of new Set([...Object.keys(baselineDimensions), ...Object.keys(currentDimensions)])) {
      const key = `${dataset}.${dimension}`;
      dimensionDeltas[key] = roundScore((currentDimensions[dimension] ?? 0) - (baselineDimensions[dimension] ?? 0));
    }
  }

  const bestDimensionDelta = Math.max(0, ...Object.values(dimensionDeltas));
  if (bestDimensionDelta >= 0.3 && combinedDelta >= 0) {
    reasons.push(`best target dimension improved by ${bestDimensionDelta.toFixed(3)} with no combined regression`);
  }

  let maxDocumentDrop = 0;
  for (const dataset of DATASET_KEYS) {
    const baselineDocs = baseline.datasets[dataset].documentScores;
    const currentDocs = current.datasets[dataset].documentScores;
    for (const [filename, baselineScore] of Object.entries(baselineDocs)) {
      if (currentDocs[filename] === undefined) {
        maxDocumentDrop = Math.max(maxDocumentDrop, 10);
        reasons.push(`${dataset}.${filename} is missing from current results`);
        continue;
      }
      maxDocumentDrop = Math.max(maxDocumentDrop, roundScore(baselineScore - currentDocs[filename]));
    }
  }

  if (maxDocumentDrop > 0.3) {
    reasons.push(`largest individual document drop is ${maxDocumentDrop.toFixed(3)}`);
  }

  const fidelityProblems = fidelityFailures(current, baseline);
  reasons.push(...fidelityProblems);

  const improvedEnough = combinedDelta >= 0.05 || (bestDimensionDelta >= 0.3 && combinedDelta >= 0);
  const status = improvedEnough && maxDocumentDrop <= 0.3 && fidelityProblems.length === 0 ? "PASS" : "FAIL";

  if (status === "FAIL" && reasons.length === 0) {
    reasons.push("no acceptance threshold was met");
  }

  return {
    status,
    combinedDelta,
    dimensionDeltas,
    maxDocumentDrop,
    reasons,
  };
}

export function formatAcceptance(result: AcceptanceResult): string {
  const lines = [
    `${result.status}: combined delta ${result.combinedDelta.toFixed(3)}, max document drop ${result.maxDocumentDrop.toFixed(3)}`,
  ];
  for (const reason of result.reasons) {
    lines.push(`- ${reason}`);
  }
  return lines.join("\n");
}

async function main(): Promise<void> {
  const [baselinePath = "autoresearch/baseline.json", currentPath = "autoresearch/latest-summary.json"] =
    process.argv.slice(2);
  const [baselineRaw, currentRaw] = await Promise.all([
    readFile(baselinePath, "utf-8"),
    readFile(currentPath, "utf-8"),
  ]);
  const result = compareSnapshots(JSON.parse(currentRaw) as QualitySnapshot, JSON.parse(baselineRaw) as QualitySnapshot);
  console.log(formatAcceptance(result));
  process.exitCode = result.status === "PASS" ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
