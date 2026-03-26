import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://pdf2md-five.vercel.app";

export const metadata: Metadata = {
  title: "PDF to Markdown Converter — Free Online Tool | pdf2md",
  description:
    "Free online PDF to Markdown converter. Handles headings, tables, lists, links, code blocks, and formatting. No signup required. Files never leave your browser.",
  keywords: [
    "pdf to markdown",
    "convert pdf to markdown",
    "pdf to markdown online",
    "pdf to md",
    "pdf to markdown converter",
    "pdf table to markdown",
    "free pdf converter",
  ],
  authors: [{ name: "pdf2md" }],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PDF to Markdown Converter — Free Online Tool",
    description:
      "Convert PDF files to clean Markdown. Headings, tables, lists, links, code blocks. Free, private, no signup. Files never leave your browser.",
    url: siteUrl,
    siteName: "pdf2md",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "pdf2md — Free PDF to Markdown Converter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Markdown Converter — Free Online Tool",
    description:
      "Convert PDF to clean Markdown. Free, private, no signup. Files never leave your browser.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "pdf2md",
  alternateName: "PDF to Markdown Converter",
  description:
    "Free online PDF to Markdown converter. Handles headings, tables, lists, links, code blocks, and formatting. Files never leave your browser.",
  url: siteUrl,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with JavaScript enabled",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Heading detection (H1-H6)",
    "Table detection",
    "Code block detection",
    "List detection (bullets and numbered)",
    "Link extraction",
    "Bold and italic formatting",
    "YAML front matter metadata",
    "Multi-file batch conversion",
    "Client-side processing (files never uploaded)",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
