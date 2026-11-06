import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const readmePath = path.join(rootDir, "README.md");

describe("root README launch contract", () => {
  it("keeps the README shaped as the GitHub sales page requested by the launch plan", async () => {
    // The README is the public landing surface for GitHub/npm discovery, so this
    // guards the launch-plan checklist instead of relying on memory in future edits.
    const readme = await readFile(readmePath, "utf8");

    expect(readme).toContain("Convert PDF to Markdown - in the browser, on the CLI, or in your code");
    expect(readme).toContain("actions/workflows/ci.yml/badge.svg");
    expect(readme).toContain("img.shields.io/npm/v/@pdf2md/core");
    expect(readme).toContain("img.shields.io/npm/dm/@pdf2md/core");
    expect(readme).toContain("![pdf2md web converter");
    expect(readme).toContain("## Quick Start");
    expect(readme).toContain("## Why pdf2md");
    expect(readme).toContain("## How It Works");
    expect(readme).toContain("## Comparison");
    expect(readme).toContain("[CONTRIBUTING.md](CONTRIBUTING.md)");
  });

  it("links the web app and keeps competitor claims explicit", async () => {
    // c4b11e4 replaced the "Try it online: TODO" placeholder with a plain link to
    // the current deployment. The README links it as "the web app", not as a
    // canonical launch domain, so q-2026-06-30-001 can still change it later.
    const readme = await readFile(readmePath, "utf8");

    expect(readme).toMatch(/\*\*Try the web app:\*\* \[[^\]]+\]\(https:\/\/[^)]+\)/);
    expect(readme).not.toContain("TODO:");
    expect(readme).toContain("pdf2md.morethan.io");
    expect(readme).toContain("jzillmann/pdf-to-markdown");
    expect(readme).toContain("Marker");
    expect(readme).toContain("Docling");
    expect(readme).toContain("Verified on 2026-06-30");
  });
});
