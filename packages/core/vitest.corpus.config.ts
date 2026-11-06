import { defineConfig } from "vitest/config";

// Text-fidelity ratchet over test-corpus/real-pdfs (see test-corpus/fidelity.ts).
// Sharded into several files so vitest spreads the corpus over worker threads.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.corpus.test.ts"],
    testTimeout: 600_000,
  },
});
