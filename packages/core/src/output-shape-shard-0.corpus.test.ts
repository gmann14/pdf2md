// @vitest-environment node

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { outputShapeShard } from "../../../test-corpus/output-shape";

// Output-shape checks over tracked real-pdfs, shard 1 of 2 (see test-corpus/output-shape.ts).
// Runs with `pnpm test:fidelity`, not `pnpm test`.
const corpusDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../../test-corpus/real-pdfs");

describe("output shape on the tracked corpus (shard 1/2)", () => {
  it("has none of the known structural defects", async () => {
    const { checked, problems } = await outputShapeShard(corpusDir, 0, 2);
    expect(checked).toBeGreaterThan(0);
    expect(problems).toEqual([]);
  });
});
