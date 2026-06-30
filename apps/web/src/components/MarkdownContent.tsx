import type { MarkdownBlock } from "@/lib/blog";

type InlineToken =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong"; value: string }
  | { type: "link"; value: string; href: string };

const INLINE_RE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function inlineTokens(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_RE)) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }

    const value = match[0];
    if (value.startsWith("`")) {
      tokens.push({ type: "code", value: value.slice(1, -1) });
    } else if (value.startsWith("**")) {
      tokens.push({ type: "strong", value: value.slice(2, -2) });
    } else {
      const link = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        tokens.push({ type: "link", value: link[1], href: link[2] });
      }
    }

    lastIndex = match.index + value.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return tokens;
}

function InlineText({ text }: { text: string }) {
  return inlineTokens(text).map((token, index) => {
    if (token.type === "code") {
      return (
        <code
          className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.92em] text-gray-900 dark:bg-slate-800 dark:text-slate-100"
          key={index}
        >
          {token.value}
        </code>
      );
    }

    if (token.type === "strong") {
      return <strong key={index}>{token.value}</strong>;
    }

    if (token.type === "link") {
      const isExternal = /^https?:\/\//.test(token.href);
      return (
        <a
          className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900 dark:text-blue-300 dark:decoration-blue-700 dark:hover:text-blue-200"
          href={token.href}
          key={index}
          rel={isExternal ? "noopener noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          {token.value}
        </a>
      );
    }

    return token.value;
  });
}

export function MarkdownContent({ blocks }: { blocks: MarkdownBlock[] }) {
  return (
    <div className="space-y-6 text-gray-700 leading-8 dark:text-slate-300">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const className =
            block.depth === 2
              ? "pt-5 text-2xl font-bold tracking-tight text-gray-950 dark:text-slate-50"
              : "pt-3 text-xl font-semibold tracking-tight text-gray-950 dark:text-slate-50";
          const Heading = `h${block.depth}` as "h2" | "h3" | "h4";
          return (
            <Heading className={className} key={index}>
              {block.text}
            </Heading>
          );
        }

        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List
              className={`space-y-2 pl-6 ${
                block.ordered ? "list-decimal" : "list-disc"
              }`}
              key={index}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <InlineText text={item} />
                </li>
              ))}
            </List>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm leading-6 text-gray-100 dark:bg-black"
              key={index}
            >
              <code>{block.code}</code>
            </pre>
          );
        }

        return (
          <p key={index}>
            <InlineText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

