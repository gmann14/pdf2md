import { Converter } from "@/components/Converter";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Convert PDF to Markdown
        </h1>
        <p className="mt-2 text-gray-600">
          Free, fast, and private. File contents never leave your browser.
        </p>
      </div>
      <Converter />

      {/* SEO content section */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          How to Convert PDF to Markdown
        </h2>

        <div className="mt-6 space-y-6 text-gray-700 leading-relaxed">
          <p>
            Converting PDF files to Markdown is straightforward with pdf2md. Drop your PDF onto the
            converter above (or click to browse), and get clean Markdown output in seconds. The
            entire conversion happens in your browser — your files are never uploaded to a server.
          </p>

          <h3 className="text-xl font-semibold text-gray-900">
            Three Steps to Convert Any PDF
          </h3>
          <ol className="list-decimal space-y-2 pl-6">
            <li>
              <strong>Upload your PDF</strong> — Drag and drop up to 5 PDF files onto the drop zone,
              or click to open the file picker. Maximum file size is 15 MB per file.
            </li>
            <li>
              <strong>Wait for conversion</strong> — pdf2md parses your document, detects headings,
              lists, tables, links, code blocks, and formatting. A progress bar shows page-by-page
              status.
            </li>
            <li>
              <strong>Copy or download</strong> — Copy the Markdown to your clipboard with one
              click, download it as a <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">.md</code> file,
              or use the &ldquo;Copy for AI&rdquo; button to paste directly into ChatGPT, Claude,
              or other LLM tools.
            </li>
          </ol>

          <h3 className="text-xl font-semibold text-gray-900">
            What Gets Converted
          </h3>
          <p>
            pdf2md uses PDF.js to extract text with full position and font metadata from your PDF.
            The conversion pipeline then analyzes the document structure to produce well-formatted
            Markdown:
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>
              <strong>Headings (H1–H6)</strong> — Detected from font size analysis across the entire
              document
            </li>
            <li>
              <strong>Tables</strong> — Grid-aligned and bordered tables are converted to Markdown
              table syntax
            </li>
            <li>
              <strong>Lists</strong> — Bulleted and numbered lists are preserved with proper
              indentation
            </li>
            <li>
              <strong>Links</strong> — Hyperlinks are extracted from PDF annotations and matched to
              the corresponding text
            </li>
            <li>
              <strong>Code blocks</strong> — Monospace/code font regions are wrapped in fenced code
              blocks
            </li>
            <li>
              <strong>Bold and italic</strong> — Formatting is inferred from font name heuristics
            </li>
            <li>
              <strong>Headers and footers</strong> — Repeated page elements are automatically
              stripped
            </li>
            <li>
              <strong>Metadata</strong> — Title, author, and dates can be extracted as YAML front
              matter
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900">
            Why Convert PDF to Markdown?
          </h3>
          <p>
            Markdown is the universal format for structured text. Converting PDFs to Markdown
            unlocks a range of workflows:
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>
              <strong>AI and LLM workflows</strong> — Feed converted documents into ChatGPT,
              Claude, Gemini, or your RAG pipeline. Markdown preserves structure without the binary
              overhead of PDF.
            </li>
            <li>
              <strong>Documentation systems</strong> — Import into Notion, Obsidian, Docusaurus,
              MkDocs, or any Markdown-based platform.
            </li>
            <li>
              <strong>Static site generators</strong> — Use converted content in Jekyll, Hugo,
              Astro, or Next.js projects.
            </li>
            <li>
              <strong>Version control</strong> — Markdown works natively with Git, making documents
              diffable and reviewable.
            </li>
            <li>
              <strong>Study notes</strong> — Convert textbook PDFs or lecture slides into editable
              notes.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900">
            Privacy First
          </h3>
          <p>
            Unlike most online converters, pdf2md processes everything locally in your browser using
            Web Workers. Your PDF files are never sent to a server. There are no accounts, no usage
            limits, and no data collection. Read
            our <Link href="/privacy" className="text-blue-600 underline hover:text-blue-800">privacy policy</Link> for
            details.
          </p>

          <h3 className="text-xl font-semibold text-gray-900">
            Use the npm Package
          </h3>
          <p>
            The conversion engine is also available as a standalone npm package for use in your own
            projects:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
            <code>{`npm install @pdf2md/core

import { convert } from "@pdf2md/core";
const result = await convert(pdfBuffer);
console.log(result.markdown);`}</code>
          </pre>
          <p>
            Or use the CLI to convert files from the command line:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
            <code>{`npx @pdf2md/core document.pdf > output.md`}</code>
          </pre>

          <h3 className="text-xl font-semibold text-gray-900">
            Limitations
          </h3>
          <p>
            pdf2md works best with text-based PDFs — reports, articles, whitepapers, documentation,
            and similar documents. Some content types have limited support:
          </p>
          <ul className="list-disc space-y-1.5 pl-6">
            <li>
              <strong>Scanned PDFs</strong> — Image-only PDFs require OCR, which is not supported
              client-side. pdf2md will detect this and show a clear warning.
            </li>
            <li>
              <strong>Complex tables</strong> — Merged cells, nested tables, and multi-page tables
              may not convert accurately.
            </li>
            <li>
              <strong>Multi-column layouts</strong> — Reading order can be ambiguous without
              machine learning, so some reordering may occur.
            </li>
            <li>
              <strong>Math and formulas</strong> — LaTeX recovery from PDF is not supported
              client-side.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900">
            Open Source
          </h3>
          <p>
            pdf2md is open source under the MIT license. View the source code, report issues, or
            contribute on{" "}
            <a
              href="https://github.com/gmann14/pdf2md"
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="mt-12 border-t border-gray-200 pt-6 pb-8 text-center text-sm text-gray-500">
        <p>
          <Link href="/privacy" className="hover:text-gray-700 underline">
            Privacy Policy
          </Link>
          {" · "}
          <a
            href="https://github.com/gmann14/pdf2md"
            className="hover:text-gray-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          {" · "}
          <a
            href="https://www.npmjs.com/package/@pdf2md/core"
            className="hover:text-gray-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            npm
          </a>
        </p>
        <p className="mt-1">
          Built with Next.js and PDF.js. Files never leave your browser.
        </p>
      </footer>
    </main>
  );
}
