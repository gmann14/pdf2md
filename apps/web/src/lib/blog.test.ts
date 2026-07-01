import { describe, expect, test } from "vitest";
import { getAllBlogPosts, getBlogPost, parseBlogPost, parseMarkdownBlocks } from "./blog";

describe("blog content loader", () => {
  // This test protects the markdown-file contract that future launch posts rely
  // on: front matter must become typed metadata, while body markdown remains
  // renderable without a CMS or client-side markdown dependency.
  test("parses front matter, tags, reading time, and markdown blocks", () => {
    const post = parseBlogPost(
      `---
title: "Markdown Post"
description: "A useful description."
publishedAt: "2026-06-30"
tags: "pdf, markdown"
---

## Section

Paragraph with **bold** text.

- First item
- Second item

\`\`\`ts
const value = "ok";
\`\`\`
`,
      "markdown-post",
    );

    expect(post).toMatchObject({
      slug: "markdown-post",
      title: "Markdown Post",
      description: "A useful description.",
      publishedAt: "2026-06-30",
      tags: ["pdf", "markdown"],
      readingTimeMinutes: 1,
    });
    expect(post.blocks).toEqual([
      { type: "heading", depth: 2, text: "Section" },
      { type: "paragraph", text: "Paragraph with **bold** text." },
      { type: "list", ordered: false, items: ["First item", "Second item"] },
      { type: "code", language: "ts", code: 'const value = "ok";' },
    ]);
  });

  // The article template supports ordered and unordered launch guides. Keeping
  // them as separate block types prevents future posts from collapsing steps
  // into paragraphs that are harder to scan.
  test("keeps ordered lists distinct from unordered lists", () => {
    expect(parseMarkdownBlocks("1. Upload\n2. Convert\n\n- Copy\n- Download")).toEqual([
      { type: "list", ordered: true, items: ["Upload", "Convert"] },
      { type: "list", ordered: false, items: ["Copy", "Download"] },
    ]);
  });

  // The seed post is part of the infrastructure acceptance criteria, and the
  // first keyword guide proves launch posts are now real markdown content with
  // metadata, not hard-coded route text.
  test("loads markdown-backed posts and sorts the blog index", () => {
    const post = getBlogPost("introducing-the-pdf2md-blog");
    expect(post?.title).toBe("Introducing the pdf2md Blog");
    expect(post?.blocks.some((block) => block.type === "heading")).toBe(true);

    const guide = getBlogPost("how-to-convert-pdf-to-markdown");
    expect(guide).toMatchObject({
      slug: "how-to-convert-pdf-to-markdown",
      title: "How to Convert PDF to Markdown",
      description:
        "A practical guide to turning text-based PDFs into clean Markdown with the pdf2md web app, CLI, and npm package.",
      tags: ["pdf to markdown", "tutorial", "markdown"],
    });
    expect(
      guide?.blocks.some(
        (block) => block.type === "heading" && block.text === "Step-by-step web workflow",
      ),
    ).toBe(true);
    expect(
      guide?.blocks.some((block) => block.type === "code" && block.language === "ts"),
    ).toBe(true);

    const posts = getAllBlogPosts();
    expect(posts).toHaveLength(2);
    expect(posts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: "introducing-the-pdf2md-blog",
          title: "Introducing the pdf2md Blog",
        }),
        expect.objectContaining({
          slug: "how-to-convert-pdf-to-markdown",
          title: "How to Convert PDF to Markdown",
        }),
      ]),
    );
  });
});
