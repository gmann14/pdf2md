import { expect, test } from "@playwright/test";

test.describe("pdf2md blog", () => {
  // The blog index is the SEO entry point for future content items. It must be
  // reachable, keyboard-linkable back to the converter, and populated from the
  // markdown-backed post list instead of hard-coded empty chrome.
  test("happy path: /blog lists markdown-backed posts and links back to the converter", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.getByRole("heading", { name: "PDF to Markdown guides" })).toBeVisible();
    await expect(page.getByRole("link", { name: "How to Convert PDF to Markdown" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Introducing the pdf2md Blog" })).toBeVisible();
    await expect(page.getByRole("link", { name: /back to converter/i })).toHaveAttribute("href", "/");
  });

  // Individual post pages carry the article template, metadata text, and real
  // rendered markdown blocks. This catches broken dynamic params in static
  // export and prevents future posts from shipping as unrendered raw markdown.
  test("happy path: blog post route renders article content from markdown", async ({ page }) => {
    await page.goto("/blog/introducing-the-pdf2md-blog");

    await expect(page).toHaveTitle(/Introducing the pdf2md Blog/);
    await expect(page.getByRole("heading", { name: "Introducing the pdf2md Blog" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Why this exists" })).toBeVisible();
    await expect(page.getByRole("link", { name: "PDF to Markdown converter" })).toHaveAttribute("href", "/");
  });

  // The first SEO guide is the launch-plan happy path: search visitors should
  // land on a useful article, get a direct route back to the converter, and see
  // actual CLI/library usage instead of thin placeholder copy.
  test("happy path: how-to guide renders practical conversion steps", async ({ page }) => {
    await page.goto("/blog/how-to-convert-pdf-to-markdown");

    await expect(page).toHaveTitle(/How to Convert PDF to Markdown/);
    await expect(page.getByRole("heading", { name: "How to Convert PDF to Markdown" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Step-by-step web workflow" })).toBeVisible();
    await expect(page.getByRole("link", { name: "PDF to Markdown converter" }).first()).toHaveAttribute(
      "href",
      "/",
    );
    await expect(page.getByText("npx @pdf2md/core document.pdf > document.md")).toBeVisible();
    await expect(page.getByText('import { convert } from "@pdf2md/core";')).toBeVisible();
  });

  // The launch plan depends on search crawlers finding the on-site content.
  // Checking sitemap output in the browser gate proves /blog and post URLs are
  // emitted in both static export and next-dev modes.
  test("edge: sitemap includes the blog index and markdown post URLs", async ({ page }) => {
    await page.goto("/sitemap.xml");
    const sitemap = await page.locator("body").innerText();

    expect(sitemap).toContain("https://pdf2md-five.vercel.app/blog");
    expect(sitemap).toContain("https://pdf2md-five.vercel.app/blog/introducing-the-pdf2md-blog");
    expect(sitemap).toContain("https://pdf2md-five.vercel.app/blog/how-to-convert-pdf-to-markdown");
  });
});
