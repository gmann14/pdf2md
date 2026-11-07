import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    testTimeout: 60_000,
  },
  resolve: {
    alias: {
      // Test against core's sources, so no core build is needed.
      "@pdf2md/core": path.resolve(here, "../core/src/index.ts"),
    },
  },
});
