import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDF to Markdown Converter — Free Online Tool | pdf2md.dev",
  description:
    "Free online PDF to Markdown converter. Handles headings, lists, links, and formatting. No signup. File contents never leave your browser.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
