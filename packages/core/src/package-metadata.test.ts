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
    keywords?: string[];
    types?: string;
    exports?: Record<string, { types?: string }>;
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
    expect(pkg.exports?.["."]).toEqual(
      expect.objectContaining({
        types: "./dist/index.d.ts",
      }),
    );
  });

  it("keeps @pdf2md/mcp aligned with the shared pdf2md discovery keywords", async () => {
    // The MCP package is a separate npm entry point, so it should inherit the
    // same PDF/Markdown search terms while keeping its agent-specific keywords.
    const pkg = await readPackageJson("packages/mcp");

    expect(pkg.name).toBe("@pdf2md/mcp");
    expect(pkg.keywords).toEqual(expect.arrayContaining(launchKeywords));
    expect(pkg.keywords).toEqual(expect.arrayContaining(["mcp", "claude", "ai-agent"]));
    expect(pkg.types).toBe("./dist/index.d.ts");
    expect(pkg.exports?.["."]).toEqual(
      expect.objectContaining({
        types: "./dist/index.d.ts",
      }),
    );
  });
});
