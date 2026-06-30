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

async function uploadManyAs(
  page: Page,
  files: Array<{ fileName: string; mimeType: string; srcPath?: string }>,
) {
  await page.locator('input[type="file"]').setInputFiles(
    files.map(({ fileName, mimeType, srcPath }) => ({
      name: fileName,
      mimeType,
      buffer: fs.readFileSync(srcPath ?? path.join(CORPUS, fileName)),
    })),
  );
}

async function pasteAs(page: Page, fileName: string, mimeType: string, srcPath?: string) {
  const buffer = fs.readFileSync(srcPath ?? path.join(CORPUS, fileName));
  await page.locator("[aria-label='Upload PDF files']").evaluate(
    (element, payload) => {
      const file = new File([new Uint8Array(payload.bytes)], payload.fileName, {
        type: payload.mimeType,
      });
      const event = new Event("paste", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "clipboardData", {
        value: {
          files: [file],
        },
      });
      element.dispatchEvent(event);
    },
    { fileName, mimeType, bytes: Array.from(buffer) },
  );
}

function readStoredZip(filePath: string): Record<string, string> {
  const bytes = fs.readFileSync(filePath);
  const entries: Record<string, string> = {};
  let offset = 0;

  while (bytes.readUInt32LE(offset) === 0x04034b50) {
    const compressionMethod = bytes.readUInt16LE(offset + 8);
    const compressedSize = bytes.readUInt32LE(offset + 18);
    const fileNameLength = bytes.readUInt16LE(offset + 26);
    const extraLength = bytes.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const contentStart = nameStart + fileNameLength + extraLength;
    const contentEnd = contentStart + compressedSize;

    expect(compressionMethod).toBe(0);
    entries[bytes.subarray(nameStart, nameStart + fileNameLength).toString("utf8")] =
      bytes.subarray(contentStart, contentEnd).toString("utf8");

    offset = contentEnd;
  }

  expect(bytes.readUInt32LE(offset)).toBe(0x02014b50);
  return entries;
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

  // Pasting a PDF is a keyboard-first intake path. It must enter the same
  // conversion workflow as drag/drop and file picker uploads, then leave the
  // existing output copy action intact.
  test("happy path: paste a PDF from the clipboard → markdown output → copy", async ({ page }) => {
    await pasteAs(page, "simple-report.pdf", "application/pdf");

    await expect(page.getByRole("status").filter({ hasText: /pasted 1 pdf/i })).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: "Converted" })).toBeVisible({ timeout: 30_000 });

    const output = page.locator("pre code").first();
    await expect(output).toBeVisible();
    expect((await output.innerText()).trim().length).toBeGreaterThan(20);

    await page.getByRole("button", { name: /copy markdown/i }).click();
    await expect(page.getByText("Copied!")).toBeVisible();
  });

  // The Phase 2 multi-file workflow is incomplete unless users can collect the
  // converted Markdown files as one archive instead of downloading each tab.
  test("happy path: multiple PDFs download as one ZIP of Markdown files", async ({ page }) => {
    await uploadManyAs(page, [
      { fileName: "simple-report.pdf", mimeType: "application/pdf" },
      {
        fileName: "multicolumn-ieee-paper.pdf",
        mimeType: "application/pdf",
        srcPath: path.join(CORPUS, "real-pdfs/multicolumn-ieee-paper.pdf"),
      },
    ]);

    await expect(page.getByText(/2 of 2 converted files ready for bulk download/i)).toBeVisible({ timeout: 60_000 });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download all converted markdown files as a zip/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("pdf2md-markdown.zip");

    const zipPath = await download.path();
    expect(zipPath).toBeTruthy();
    const entries = readStoredZip(zipPath!);
    expect(Object.keys(entries).sort()).toEqual(["multicolumn-ieee-paper.md", "simple-report.md"]);
    expect(entries["simple-report.md"].trim().length).toBeGreaterThan(20);
    expect(entries["multicolumn-ieee-paper.md"].trim().length).toBeGreaterThan(20);
  });

  // Edge: failed tabs must stay visible for diagnosis, but their empty/error
  // outputs should not be silently packaged into the bulk ZIP.
  test("edge: ZIP excludes failed files while keeping their tab visible", async ({ page }) => {
    await uploadManyAs(page, [
      { fileName: "simple-report.pdf", mimeType: "application/pdf" },
      { fileName: "invalid-not-a-pdf.pdf", mimeType: "application/pdf" },
    ]);

    await expect(page.getByText(/1 of 2 converted files ready for bulk download/i)).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole("tab", { name: /invalid-not-a-pdf/i })).toBeVisible();
    await expect(page.getByText(/failed files are excluded/i)).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download all converted markdown files as a zip/i }).click();
    const download = await downloadPromise;
    const zipPath = await download.path();
    expect(zipPath).toBeTruthy();
    const entries = readStoredZip(zipPath!);
    expect(Object.keys(entries)).toEqual(["simple-report.md"]);
  });

  // The comparison view is the Phase 2 spot-check workflow: users need the
  // original PDF rendered beside Markdown, without re-uploading or losing output
  // actions after conversion has already succeeded.
  test("happy path: comparison view renders the source PDF beside Markdown", async ({ page }) => {
    await uploadAs(page, "simple-report.pdf", "application/pdf");
    await expect(page.getByRole("status").filter({ hasText: "Converted" })).toBeVisible({ timeout: 30_000 });

    await page.getByRole("button", { name: "Compare" }).click();

    await expect(page.getByRole("region", { name: /original pdf preview/i })).toBeVisible();
    await expect(page.getByRole("region", { name: /markdown output/i })).toBeVisible();
    const canvas = page.locator("canvas[aria-label^='Rendered PDF page']").first();
    await expect(canvas).toBeVisible({ timeout: 30_000 });
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(100);
    expect(box?.height).toBeGreaterThan(100);

    await expect(page.getByText(/page 1 of \d+/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /copy markdown/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible();
  });

  // Edge: PDF rendering is an aid for visual QA, not the conversion result. A
  // canvas/rendering failure must leave Markdown, copy, and download available.
  test("edge: preview failure does not block Markdown actions", async ({ page }) => {
    await uploadAs(page, "simple-report.pdf", "application/pdf");
    await expect(page.getByRole("status").filter({ hasText: "Converted" })).toBeVisible({ timeout: 30_000 });

    await page.evaluate(() => {
      HTMLCanvasElement.prototype.getContext = () => {
        throw new Error("forced canvas failure");
      };
    });
    await page.getByRole("button", { name: "Compare" }).click();

    await expect(page.getByText(/pdf preview unavailable/i)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("region", { name: /markdown output/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /copy markdown/i })).toBeVisible();
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

  // Clipboard paste often contains text or images from unrelated apps. Those
  // should be ignored without alert loops or accidental parser work.
  test("edge: non-PDF clipboard contents are ignored without repeated error spam", async ({ page }) => {
    let dialogCount = 0;
    page.on("dialog", async (d) => {
      dialogCount += 1;
      await d.dismiss();
    });

    await pasteAs(page, "notes.txt", "text/plain", path.join(CORPUS, "invalid-not-a-pdf.pdf"));
    await expect(page.getByRole("status").filter({ hasText: /clipboard did not contain a pdf/i })).toBeVisible();
    await expect(page.getByText(/drag & drop pdfs/i)).toBeVisible();
    expect(dialogCount).toBe(0);
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
