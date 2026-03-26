import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — pdf2md",
  description:
    "pdf2md privacy policy. 100% client-side processing. Your files never leave your browser.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-blue-600 hover:text-blue-800"
      >
        &larr; Back to converter
      </Link>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: March 2026</p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            The Short Version
          </h2>
          <p className="mt-2">
            <strong>Your files never leave your browser.</strong> pdf2md runs
            entirely client-side. When you convert a PDF to Markdown, the file is
            processed locally on your device using JavaScript and Web Workers. No
            file data is sent to any server, ever.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            No File Uploads
          </h2>
          <p className="mt-2">
            pdf2md does not upload, transmit, or store your PDF files. The
            conversion happens in your browser&apos;s memory. Once you close the
            tab, your data is gone. There is no server-side processing, no cloud
            storage, and no file retention.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            No Tracking or Cookies
          </h2>
          <p className="mt-2">
            pdf2md does not use cookies, tracking pixels, fingerprinting, or any
            form of user tracking. We do not use Google Analytics or any
            third-party analytics service that tracks individual users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            No Accounts or Personal Data
          </h2>
          <p className="mt-2">
            There is no signup, login, or user account system. pdf2md does not
            collect names, email addresses, or any other personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            What We May Collect
          </h2>
          <p className="mt-2">
            If we add privacy-friendly analytics in the future (such as
            Plausible or Fathom), we will only collect anonymous, aggregate page
            view data — never file contents, filenames, or extracted text. Any
            analytics will be cookie-free and fully compliant with GDPR and CCPA
            without requiring consent banners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Open Source
          </h2>
          <p className="mt-2">
            pdf2md is open source under the MIT license. You can verify all of
            the above by inspecting the{" "}
            <a
              href="https://github.com/gmann14/pdf2md"
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              source code on GitHub
            </a>
            . The conversion pipeline runs entirely in the browser — there is no
            backend to send data to.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            Third-Party Services
          </h2>
          <p className="mt-2">
            This site is hosted on Vercel. Vercel may collect standard web
            server logs (IP address, user agent, request URL) as part of their
            hosting infrastructure. This data is subject to{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel&apos;s privacy policy
            </a>
            . No PDF file data is ever transmitted to Vercel or any other third
            party.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
          <p className="mt-2">
            If you have questions about this privacy policy, please{" "}
            <a
              href="https://github.com/gmann14/pdf2md/issues"
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              open an issue on GitHub
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
