import { defineConfig, devices } from "@playwright/test";

// E2E config for the Forge gate. Boots `pnpm dev` and runs the browser specs in
// e2e/. Headless Chromium (installed as a dev dep) so it survives cron — no MCP.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  // Test the production static export (what actually ships on Vercel), not the
  // dev server — dev-mode bundling mishandles the PDF.js worker. Serve out/ with
  // a stdlib static server (no extra dep, survives cron).
  webServer: {
    command: "pnpm build && python3 -m http.server 3000 --directory out",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
