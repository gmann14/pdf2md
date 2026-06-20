import { test, expect, type Page } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

// Repo test-corpus, from apps/web/e2e → repo root.
const CORPUS = path.resolve(__dirname, "../../../test-corpus");

// Upload through the hidden <input type="file">. We force the MIME type so the
// DropZone's `file.type !== "application/pdf"` check is exercised deterministically
// (Playwright's extension inference is not relied upon).
async function uploadAs(page: Page, fileName: string, mimeType: string, srcPath?: string) {
  const buffer = fs.readFileSync(srcPath ?? path.join(CORPUS, fileName));
  await page.locator('input[type="file"]').setInputFiles({ name: fileName, mimeType, buffer });
}

test.describe("pdf2md — core conversion workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // DropZone is interactive immediately (SSG); no hydration wait needed.
    await expect(page.getByText(/drag & drop pdfs/i)).toBeVisible();
  });

  // The happy path is the whole product: a real PDF must become copyable markdown.
  test("happy path: upload a PDF → markdown output → copy", async ({ page }) => {
    await uploadAs(page, "simple-report.pdf", "application/pdf");

    // conversion finishes → "Converted" status badge (scope to role=status so the
    // landing-page "What Gets Converted" copy doesn't match)
    await expect(page.getByRole("status").filter({ hasText: "Converted" })).toBeVisible({ timeout: 30_000 });

    // stats prove real output (the landing copy has example code blocks, so the
    // output's markdown is the FIRST pre>code, above the static how-to section)
    await expect(page.getByText(/\d+\s+words/)).toBeVisible();
    const output = page.locator("pre code").first();
    await expect(output).toBeVisible();
    expect((await output.innerText()).trim().length).toBeGreaterThan(20);

    // copy action gives feedback
    await page.getByRole("button", { name: /copy markdown/i }).click();
    await expect(page.getByText("Copied!")).toBeVisible();

    // download button is offered
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible();
  });

  // Edge: a non-PDF must be rejected up front (MIME check), not sent to the parser.
  test("edge: non-PDF file is rejected with a clear message", async ({ page }) => {
    let dialogMessage = "";
    page.on("dialog", async (d) => {
      dialogMessage = d.message();
      await d.dismiss();
    });
    await page.locator('input[type="file"]').setInputFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("this is not a pdf"),
    });
    await expect.poll(() => dialogMessage, { timeout: 10_000 }).toContain("is not a PDF file");
  });

  // Edge: a corrupt file that passes the MIME gate must surface an explicit error
  // state — never a blank screen, a crash, or a frozen UI (a spec acceptance rule).
  test("edge: corrupt PDF surfaces an explicit error, not a crash", async ({ page }) => {
    await uploadAs(page, "invalid-not-a-pdf.pdf", "application/pdf");

    const errorState = page
      .getByRole("alert")
      .or(page.getByText(/parsing failed|no text found|conversion failed|failed/i));
    await expect(errorState.first()).toBeVisible({ timeout: 30_000 });

    // and the user can recover
    await expect(page.getByRole("button", { name: /try another file|convert another/i })).toBeVisible();
  });
});
