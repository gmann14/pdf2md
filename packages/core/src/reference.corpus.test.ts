// @vitest-environment node

import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  BASELINE_PATH,
  compareToBaseline,
  loadCases,
  runReference,
  type ReferenceBaseline,
} from "../../../test-corpus/reference/run";

// Hand-checked reference tests (test-corpus/reference/). Runs with `pnpm test:fidelity`.
// Ratchet: the pass count may only go up. After an intended improvement, refresh with
//   npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/reference/run.ts --update-baseline
describe("hand-checked reference tests", () => {
  it("pass at least as many tests as the committed baseline", async () => {
    const baseline = JSON.parse(await readFile(BASELINE_PATH, "utf-8")) as ReferenceBaseline;
    const result = await runReference("pdf2md", await loadCases());
    expect(result.conversionErrors).toEqual({});
    const { ok, passed, newlyFailing } = compareToBaseline(result, baseline);
    expect({ ok, passed, newlyFailing }).toMatchObject({ ok: true });
    expect(passed).toBeGreaterThanOrEqual(baseline.passed);
  });
});
