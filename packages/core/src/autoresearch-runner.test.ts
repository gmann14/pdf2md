import { describe, expect, it } from "vitest";
import { compareSnapshots, computeCombined, parseQualityReport, type QualitySnapshot } from "../../../autoresearch/compare-results";

const trainingReport = `
**Overall Average Score:** 9.2/10

## Score Summary
| PDF | Category | Pages | Words | Time | Score | Status |
| --- | -------- | ----: | ----: | ---: | ----: | ------ |
| alpha.pdf | Report | 1 | 100 | 10ms | **9.4** | Good |
| beta.pdf | Report | 1 | 100 | 10ms | **9.0** | Good |

## Average Score by Dimension
| Dimension | Average Score |
| --------- | -----------: |
| codeBlockDetection | 8.9/10 |
| linkExtraction | 8.4/10 |
`;

const blind3Report = `
**Set 3 Average Score:** 9.1/10

## Score Summary
| PDF | Category | Pages | Words | Time | Score |
| --- | -------- | ----: | ----: | ---: | ----: |
| stress.pdf | Stress | 1 | 100 | 10ms | **8.8** |

## Dimension Averages
| Dimension | Set 3 Avg | Training Avg | Blind Set 1 Avg |
| --------- | --------: | -----------: | --------------: |
| codeBlockDetection | 7.3/10 | 8.9/10 | 8.7/10 |
| linkExtraction | 7.8/10 | 8.4/10 | 8.3/10 |
`;

function snapshot(overrides: Partial<QualitySnapshot> = {}): QualitySnapshot {
  const datasets = {
    training: {
      average: 9.2,
      documentScores: { "alpha.pdf": 9.4, "beta.pdf": 9.0 },
      dimensions: { codeBlockDetection: 8.9, linkExtraction: 8.4 },
    },
    blind1: {
      average: 9.2,
      documentScores: { "blind.pdf": 9.2 },
      dimensions: { codeBlockDetection: 8.7, linkExtraction: 8.3 },
    },
    blind2: {
      average: 9.0,
      documentScores: { "blind2.pdf": 9.0 },
      dimensions: { codeBlockDetection: 8.2, linkExtraction: 8.8 },
    },
    blind3: {
      average: 9.1,
      documentScores: { "stress.pdf": 8.8 },
      dimensions: { codeBlockDetection: 7.3, linkExtraction: 7.8 },
    },
  };

  return {
    timestamp: "2026-06-30T00:00:00.000Z",
    gitSha: "test",
    branch: "test",
    diffSummary: "test",
    datasets,
    combined: computeCombined(datasets),
    ...overrides,
  };
}

describe("autoresearch quality report parsing", () => {
  it("parses training reports so the runner can compare committed baseline metrics without rerunning private PDFs", () => {
    const metrics = parseQualityReport(trainingReport, "training");

    expect(metrics.average).toBe(9.2);
    expect(metrics.documentScores).toEqual({ "alpha.pdf": 9.4, "beta.pdf": 9.0 });
    expect(metrics.dimensions.codeBlockDetection).toBe(8.9);
  });

  it("parses blind stress reports with dimension comparison columns because the stress set drives H1/H2 experiments", () => {
    const metrics = parseQualityReport(blind3Report, "blind3");

    expect(metrics.average).toBe(9.1);
    expect(metrics.documentScores).toEqual({ "stress.pdf": 8.8 });
    expect(metrics.dimensions.linkExtraction).toBe(7.8);
  });
});

describe("autoresearch acceptance comparison", () => {
  it("passes a dimension-focused experiment only when document-level regressions stay within the guardrail", () => {
    const baseline = snapshot();
    const current = snapshot({
      datasets: {
        ...baseline.datasets,
        blind3: {
          average: 9.1,
          documentScores: { "stress.pdf": 8.7 },
          dimensions: { codeBlockDetection: 7.6, linkExtraction: 7.8 },
        },
      },
    });
    current.combined = computeCombined(current.datasets);

    const result = compareSnapshots(current, baseline);

    expect(result.status).toBe("PASS");
    expect(result.dimensionDeltas["blind3.codeBlockDetection"]).toBeCloseTo(0.3);
    expect(result.maxDocumentDrop).toBeCloseTo(0.1);
  });

  it("fails when a broad score improvement hides a document drop above 0.3 because overnight runs must not sacrifice outliers", () => {
    const baseline = snapshot();
    const current = snapshot({
      datasets: {
        ...baseline.datasets,
        training: {
          ...baseline.datasets.training,
          average: 9.5,
          documentScores: { "alpha.pdf": 9.6, "beta.pdf": 8.5 },
        },
      },
    });
    current.combined = computeCombined(current.datasets);

    const result = compareSnapshots(current, baseline);

    expect(result.status).toBe("FAIL");
    expect(result.combinedDelta).toBeGreaterThanOrEqual(0.05);
    expect(result.maxDocumentDrop).toBeCloseTo(0.5);
  });
});
