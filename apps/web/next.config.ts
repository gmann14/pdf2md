import type { NextConfig } from "next";
import { createRequire } from "node:module";
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dir = dirname(fileURLToPath(import.meta.url));

// pdf2md#10 — Serve PDF.js's main module as a static asset that the browser
// imports natively, instead of letting webpack bundle it.
//
// Why: pdfjs-dist's `pdf.mjs` is a large ESM module containing a Node-only
// `require("@napi-rs/canvas")`. Next 15 bundles webpack 5.98.0, whose ESM/CJS
// interop is broken for this shape (webpack#20095, fixed only in webpack
// 5.103.0). In `next dev` (each module evaluated separately, no scope hoisting)
// webpack invokes `__webpack_require__.r(undefined)` while evaluating `pdf.mjs`,
// throwing "Object.defineProperty called on non-object" before conversion can
// start. The production build escaped the bug purely because module
// concatenation merges `pdf.mjs` into its importer — which is exactly why the
// static export converted fine while `pnpm dev` did not.
//
// Fix: copy `pdf.min.mjs` into `public/pdfjs/` and externalize the
// `import("pdfjs-dist")` call to a native `import("/pdfjs/pdf.min.mjs")`. The
// browser loads it directly, so webpack never evaluates the module and the bug
// can't fire — identically in dev and prod. Conversion stays 100% client-side
// (the file is served from our own origin), so the privacy guarantee is intact.
// The copy runs here, at config load, so it tracks the installed pdfjs-dist
// version automatically and runs for every `next dev`/`next build` invocation.
const PDFJS_PUBLIC_DIR = join(__dir, "public", "pdfjs");
const PDFJS_PUBLIC_FILE = join(PDFJS_PUBLIC_DIR, "pdf.min.mjs");
try {
  mkdirSync(PDFJS_PUBLIC_DIR, { recursive: true });
  copyFileSync(require.resolve("pdfjs-dist/build/pdf.min.mjs"), PDFJS_PUBLIC_FILE);
} catch (err) {
  // Surface clearly: a missing PDF.js asset would silently break conversion.
  throw new Error(
    `pdf2md: failed to stage PDF.js worker asset into public/pdfjs — ${
      err instanceof Error ? err.message : String(err)
    }`,
  );
}

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    // Ensure pdf.js worker can be loaded; drop the Node-only native-canvas
    // bindings the browser never needs (kept for the worker bundle, which
    // webpack still processes via `new URL(...)`).
    config.resolve.alias.canvas = false;
    config.resolve.alias["@napi-rs/canvas"] = false;

    if (!isServer) {
      // Allow webpack to emit a native `import()` for the externalized PDF.js
      // module (Next disables this by default for the client target).
      config.output = config.output || {};
      config.output.environment = {
        ...config.output.environment,
        dynamicImport: true,
      };

      // Redirect `import("pdfjs-dist")` to the public static asset instead of
      // bundling it. See the comment block above for the full rationale.
      const previous = config.externals;
      const inherited = Array.isArray(previous)
        ? previous
        : previous
          ? [previous]
          : [];
      config.externals = [
        (
          { request }: { request?: string },
          callback: (err?: unknown, result?: string) => void,
        ) => {
          if (request === "pdfjs-dist") {
            return callback(undefined, "import /pdfjs/pdf.min.mjs");
          }
          return callback();
        },
        ...inherited,
      ];
    }

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
