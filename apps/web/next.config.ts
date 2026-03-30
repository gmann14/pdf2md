import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  webpack: (config) => {
    // Ensure pdf.js worker can be loaded
    config.resolve.alias.canvas = false;

    // Support .js extensions in imports that resolve to .ts source files
    // (needed because @pdf2md/core uses .js extensions for Node.js ESM compat)
    config.resolve.extensionAlias = {
      ".js": [".ts", ".js"],
      ".mjs": [".mts", ".mjs"],
    };

    return config;
  },
};

export default nextConfig;
