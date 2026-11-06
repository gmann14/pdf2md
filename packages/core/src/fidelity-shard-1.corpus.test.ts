// @vitest-environment node

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ratchetShard } from "../../../test-corpus/fidelity";

// Text-fidelity ratchet over tracked real-pdfs, shard 2 of 4 (see test-corpus/fidelity.ts).
// Runs with `pnpm test:fidelity`, not `pnpm test`.
// Refresh the baseline after an intended improvement with
//   npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/fidelity.ts test-corpus/real-pdfs --update-baseline
const corpusDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../../test-corpus/real-pdfs");

describe("text fidelity on the tracked corpus (shard 2/4)", () => {
  it("never falls below the committed baseline", async () => {
    const { checked, problems } = await ratchetShard(corpusDir, 1, 4);
    expect(checked).toBeGreaterThan(0);
    expect(problems).toEqual([]);
  });
});
