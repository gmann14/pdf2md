import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return {};
  }

  return {
    title: `${post.title} — pdf2md Blog`,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <Link
          className="text-sm font-medium text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
          href="/blog"
        >
          &larr; Back to blog
        </Link>
        <ThemeToggle />
      </div>

      <article>
        <header className="border-b border-gray-200 pb-8 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-slate-400">
            <time dateTime={post.publishedAt}>
              {new Intl.DateTimeFormat("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(`${post.publishedAt}T00:00:00Z`))}
            </time>
            <span aria-hidden="true">/</span>
            <span>{post.readingTimeMinutes} min read</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl dark:text-slate-50">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-slate-300">
            {post.description}
          </p>
        </header>

        <div className="mt-9">
          <MarkdownContent blocks={post.blocks} />
        </div>
      </article>
    </main>
  );
}
