import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  webpack: (config) => {
    // Ensure pdf.js worker can be loaded
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
