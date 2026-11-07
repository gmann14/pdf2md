import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const launchKeywords = [
  "pdf",
  "markdown",
  "pdf-to-markdown",
  "converter",
  "typescript",
  "pdf-parser",
  "cli",
  "npm-package",
  "parser",
  "text-extraction",
];

async function readPackageJson(packageDir: string) {
  const packageJson = await readFile(path.join(rootDir, packageDir, "package.json"), "utf8");
  return JSON.parse(packageJson) as {
    name: string;
    version: string;
    keywords?: string[];
    types?: string;
    exports?: Record<string, Record<string, unknown>>;
  };
}

describe("npm package metadata", () => {
  it("keeps @pdf2md/core discoverable with TypeScript types on npm", async () => {
    // pdf2md#14 is about npm search/discovery, so this protects the exact
    // launch keywords and TS type entry points that make the package useful.
    const pkg = await readPackageJson("packages/core");

    expect(pkg.name).toBe("@pdf2md/core");
    expect(pkg.keywords).toEqual(expect.arrayContaining(launchKeywords));
    expect(pkg.types).toBe("./dist/index.d.ts");
    // ESM and CommonJS each get their own types so `require()` and `import`
    // both type-check (agent tools load the package with a sync require()).
    expect(pkg.exports?.["."]).toEqual({
      import: { types: "./dist/index.d.ts", default: "./dist/index.js" },
      require: { types: "./dist/cjs/index.d.ts", default: "./dist/cjs/index.js" },
    });
  });

  it("has a changelog entry for the current @pdf2md/core version", async () => {
    // Inline bold/italic changed the default Markdown output, so the version
    // moved to 0.4.0. Every version bump must come with a changelog section
    // that tells users what changed in their output.
    const pkg = await readPackageJson("packages/core");
    const changelog = await readFile(path.join(rootDir, "packages/core/CHANGELOG.md"), "utf8");

    expect(pkg.version).toBe("0.4.0");
    expect(changelog).toMatch(new RegExp(`^## ${pkg.version.replace(/\./g, "\\.")}\\b`, "m"));
  });

  it("keeps @pdf2md/mcp aligned with the shared pdf2md discovery keywords", async () => {
    // The MCP package is a separate npm entry point, so it should inherit the
    // same PDF/Markdown search terms while keeping its agent-specific keywords.
    const pkg = await readPackageJson("packages/mcp");

    expect(pkg.name).toBe("@pdf2md/mcp");
    expect(pkg.keywords).toEqual(expect.arrayContaining(launchKeywords));
    expect(pkg.keywords).toEqual(expect.arrayContaining(["mcp", "claude", "ai-agent"]));
    // 0.2: the package entry exports createServer() (dist/server.js); only
    // the bin (dist/index.js) starts the stdio server.
    expect(pkg.types).toBe("./dist/server.d.ts");
    expect(pkg.exports?.["."]).toEqual(
      expect.objectContaining({
        types: "./dist/server.d.ts",
      }),
    );
  });
});
