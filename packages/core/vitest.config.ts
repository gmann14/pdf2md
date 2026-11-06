import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    // The text-fidelity corpus ratchet converts all of test-corpus/real-pdfs;
    // it runs separately via `pnpm test:fidelity` (vitest.corpus.config.ts).
    exclude: [...configDefaults.exclude, "src/**/*.corpus.test.ts"],
    // Real-PDF tests (corpus smoke, fixtures) can exceed the 5 s default on a loaded machine.
    testTimeout: 60_000,
  },
});
