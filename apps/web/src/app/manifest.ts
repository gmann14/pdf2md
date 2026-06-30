import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "pdf2md",
    short_name: "pdf2md",
    description:
      "Free, private PDF-to-Markdown conversion that runs in your browser.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#2563eb",
    categories: ["productivity", "utilities"],
  };
}
