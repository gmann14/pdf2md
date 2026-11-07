// @vitest-environment node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { convert } from "./converter.js";
import type { ConversionProgress, ConversionResult } from "./types.js";

const fixturesDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../../test-corpus/fixtures");
const STAGES: Array<ConversionProgress["stage"]> = ["loading", "parsing", "structuring", "assembling"];
const SETTLE_MS = 15_000;

/** Resolve with the result, or with "timeout" if convert() has not settled in time. */
async function settleWithin(promise: Promise<ConversionResult>): Promise<ConversionResult | "timeout"> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<"timeout">((res) => {
    timer = setTimeout(() => res("timeout"), SETTLE_MS);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

function expectCancelled(result: ConversionResult | "timeout"): void {
  expect(result).not.toBe("timeout");
  if (result === "timeout") return;
  expect(result.status).toBe("failed");
  expect(result.markdown).toBe("");
  expect(result.messages).toEqual([
    { code: "cancelled", severity: "error", message: "Conversion was cancelled." },
  ]);
}

describe("cancellation settles at every stage", () => {
  // Regression: aborting after the last page was read (e.g. at "assembling")
  // destroyed the PDF.js document while the bold/italic step (and metadata
  // read) still used it, so convert() never settled. Each stage must end in
  // the same cancelled result the page loop has always returned.
  for (const stage of STAGES) {
    for (const includeMetadata of [false, true]) {
      it(`returns the cancelled result when aborted at "${stage}" (metadata: ${includeMetadata})`, async () => {
        const bytes = await readFile(resolve(fixturesDir, "inline-emphasis.pdf"));
        const controller = new AbortController();
        const result = await settleWithin(
          convert(new Uint8Array(bytes), {
            signal: controller.signal,
            includeMetadata,
            onProgress: (p) => {
              if (p.stage === stage) controller.abort();
            },
          }),
        );
        expectCancelled(result);
      });
    }
  }

  // The abort can also land while the font step (real font names for
  // bold/italic and monospace code) is waiting on PDF.js (between its
  // getPage/getOperatorList calls and their replies), not only before it
  // starts; that in-flight call must not keep convert() pending. The font
  // step runs during "structuring", before code detection.
  it("returns the cancelled result when aborted while the font step is in flight", async () => {
    const bytes = await readFile(resolve(fixturesDir, "inline-emphasis.pdf"));
    const controller = new AbortController();
    const result = await settleWithin(
      convert(new Uint8Array(bytes), {
        signal: controller.signal,
        onProgress: (p) => {
          if (p.stage === "structuring") setTimeout(() => controller.abort(), 0);
        },
      }),
    );
    expectCancelled(result);
  });

  // An unaborted run with the same signal wiring must still succeed, so the
  // checks above are not passing because every signalled run fails.
  it("still converts when the signal never fires", async () => {
    const bytes = await readFile(resolve(fixturesDir, "inline-emphasis.pdf"));
    const result = await settleWithin(convert(new Uint8Array(bytes), { signal: new AbortController().signal }));
    expect(result).not.toBe("timeout");
    if (result === "timeout") return;
    expect(result.status).toBe("success");
    expect(result.markdown).toContain("**");
  });
});
