import { defineConfig, devices } from "@playwright/test";

// Dev-mode E2E gate. The prod config (playwright.config.ts) tests the static
// export; THIS one tests `next dev` — where the PDF.js worker bug (pdf2md#10)
// actually lives. A fix that only satisfies the prod gate is a false green, so
// dev gets its own gate. Runs on a separate port so the two gates don't collide.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev -p 3001",
    url: "http://localhost:3001",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [{ name: "chromium-dev", use: { ...devices["Desktop Chrome"] } }],
});
