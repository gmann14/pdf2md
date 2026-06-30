import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "pdf2md Blog — PDF to Markdown Guides",
  description:
    "Practical guides and technical notes for converting PDFs to Markdown, preparing documents for AI workflows, and understanding PDF extraction.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "pdf2md Blog — PDF to Markdown Guides",
    description:
      "Practical guides and technical notes for PDF to Markdown conversion and AI document workflows.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <Link
          className="text-sm font-medium text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
          href="/"
        >
          &larr; Back to converter
        </Link>
        <ThemeToggle />
      </div>

      <header className="border-b border-gray-200 pb-8 dark:border-slate-800">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
          pdf2md field notes
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl dark:text-slate-50">
          PDF to Markdown guides
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-slate-300">
          Practical notes on PDF extraction, Markdown cleanup, and document
          workflows for AI, docs, and developer tooling.
        </p>
      </header>

      <section aria-label="Blog posts" className="mt-10 grid gap-5 sm:grid-cols-2">
        {posts.map((post) => (
          <article
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
            key={post.slug}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-slate-400">
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(`${post.publishedAt}T00:00:00Z`))}
              </time>
              <span aria-hidden="true">/</span>
              <span>{post.readingTimeMinutes} min read</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-950 dark:text-slate-50">
              <Link className="hover:text-blue-700 dark:hover:text-blue-300" href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 leading-7 text-gray-600 dark:text-slate-300">
              {post.description}
            </p>
            {post.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    className="rounded border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 dark:border-slate-700 dark:text-slate-300"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
