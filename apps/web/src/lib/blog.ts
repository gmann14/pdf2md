import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  readingTimeMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  blocks: MarkdownBlock[];
};

export type MarkdownBlock =
  | { type: "heading"; depth: 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; language?: string; code: string };

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;
const WORD_RE = /[\w'-]+/g;

function parseFrontMatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error("Blog post is missing front matter");
  }

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = value;
  }

  return { data, content: raw.slice(match[0].length).trim() };
}

function requireMeta(data: Record<string, string>, key: string, slug: string): string {
  const value = data[key]?.trim();
  if (!value) {
    throw new Error(`Blog post "${slug}" is missing required "${key}" front matter`);
  }
  return value;
}

function parseTags(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function readingTimeMinutes(content: string): number {
  const words = content.match(WORD_RE)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 220));
}

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const fence = trimmed.match(/^```(\w+)?$/);
    if (fence) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: "code", language: fence[1], code: codeLines.join("\n") });
      continue;
    }

    const heading = trimmed.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        depth: heading[1].length as 2 | 3 | 4,
        text: heading[2].trim(),
      });
      index += 1;
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const items: string[] = [];
      const isOrdered = Boolean(ordered);
      while (index < lines.length) {
        const item = lines[index].trim().match(isOrdered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/);
        if (!item) {
          break;
        }
        items.push(item[1].trim());
        index += 1;
      }
      blocks.push({ type: "list", ordered: isOrdered, items });
      continue;
    }

    const paragraphLines = [trimmed];
    index += 1;
    while (index < lines.length) {
      const next = lines[index].trim();
      if (
        !next ||
        next.startsWith("```") ||
        /^#{2,4}\s+/.test(next) ||
        /^[-*]\s+/.test(next) ||
        /^\d+\.\s+/.test(next)
      ) {
        break;
      }
      paragraphLines.push(next);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

export function parseBlogPost(raw: string, slug: string): BlogPost {
  const { data, content } = parseFrontMatter(raw);
  return {
    slug,
    title: requireMeta(data, "title", slug),
    description: requireMeta(data, "description", slug),
    publishedAt: requireMeta(data, "publishedAt", slug),
    updatedAt: data.updatedAt,
    tags: parseTags(data.tags),
    readingTimeMinutes: readingTimeMinutes(content),
    content,
    blocks: parseMarkdownBlocks(content),
  };
}

export function getBlogSlugs(): string[] {
  return readdirSync(BLOG_DIR)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""))
    .sort();
}

export function getBlogPost(slug: string): BlogPost | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  try {
    return parseBlogPost(readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8"), slug);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export function getAllBlogPosts(): BlogPostMeta[] {
  return getBlogSlugs()
    .map((slug) => {
      const post = getBlogPost(slug);
      if (!post) {
        throw new Error(`Blog post "${slug}" disappeared while reading posts`);
      }
      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        tags: post.tags,
        readingTimeMinutes: post.readingTimeMinutes,
      };
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
