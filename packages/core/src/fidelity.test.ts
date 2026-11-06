// @vitest-environment node

import { describe, expect, it } from "vitest";
import {
  computeFidelity,
  countBoldSpans,
  countCodeFences,
  countItalicSpans,
  countSpaceBeforePunct,
  joinRawItems,
  multisetRecall,
  numericTokens,
  ratchetFailures,
  stripMarkdown,
  wordTokens,
  type FidelityRow,
  type TextLayer,
} from "../../../test-corpus/fidelity";

function layer(pages: Array<Partial<TextLayer["pages"][number]>>): TextLayer {
  return {
    pages: pages.map((p) => ({ text: "", bandNumbers: [], annotationUrls: [], ...p })),
  };
}

describe("fidelity tokenisation", () => {
  it("tokenises words case-insensitively and folds ligatures", () => {
    expect(wordTokens("The ﬁrst Word, 2022.")).toEqual(["the", "first", "word", "2022"]);
  });

  it("keeps grouped numbers as one numeric token", () => {
    expect(numericTokens("($46,752) and 3.5% in 2022.")).toEqual(["46,752", "3.5", "2022"]);
  });

  it("computes multiset recall", () => {
    expect(multisetRecall(["a", "a", "b"], ["a", "b"])).toBeCloseTo(2 / 3);
    expect(multisetRecall([], ["a"])).toBe(1);
  });

  it("joins touching raw items without a space and separated ones with a space", () => {
    const text = joinRawItems([
      { str: "services", x: 0, y: 10, width: 40, fontSize: 10, hasEOL: false },
      { str: ".", x: 40, y: 10, width: 2, fontSize: 10, hasEOL: false },
      { str: "Next", x: 46, y: 10, width: 20, fontSize: 10, hasEOL: true },
      { str: "line", x: 0, y: 22, width: 20, fontSize: 10, hasEOL: false },
    ]);
    expect(text).toBe("services. Next\nline");
  });
});

describe("fidelity markdown handling", () => {
  it("strips front matter, link targets and markup", () => {
    const md = "---\ntitle: X\n---\n\n# Head\n\n| a | b |\n| --- | --- |\n\nSee [the docs](https://example.com/a) **now**.";
    const text = stripMarkdown(md);
    expect(text).not.toContain("title");
    expect(text).not.toContain("example.com");
    expect(wordTokens(text)).toEqual(["head", "a", "b", "see", "the", "docs", "now"]);
  });

  it("counts emphasis spans, code fences and stray spaces before punctuation", () => {
    expect(countBoldSpans("a **bold span** and **x** but not ** loose **")).toBe(2);
    expect(countItalicSpans("an *italic* word, _also_ this, **not bold**")).toBe(2);
    expect(countCodeFences("```\ncode\n```\n\n```js\nmore\n```")).toBe(2);
    expect(countSpaceBeforePunct("services . Think ; ok, fine)")).toBe(2);
  });
});

describe("computeFidelity", () => {
  it("measures recall, link precision and stray spaces", () => {
    const source = layer([
      { text: "Revenue rose in 2022 to 46,752 dollars\n3", bandNumbers: ["3"], annotationUrls: ["https://a.example"] },
      { text: "See https://b.example for more" },
    ]);
    const md = "Revenue rose in [2022](https://a.example) to dollars .\n\nSee [https://b.example](https://b.example) for more [x](https://a.example)";
    const m = computeFidelity(source, md);

    // 46,752 is missing; the page number "3" is excluded from the numeric source.
    expect(m.sourceNumbers).toBe(2);
    expect(m.numericRecall).toBeCloseTo(0.5);
    // Second a.example link has no annotation left to pay for it.
    expect(m.outputLinks).toBe(3);
    expect(m.linkAnnotations).toBe(1);
    expect(m.bareUrls).toBe(1);
    expect(m.linkPrecision).toBeCloseTo(2 / 3);
    expect(m.spaceBeforePunct).toBe(1);
    expect(m.wordRecall).toBeLessThan(1);
  });

  it("reports full link precision when there are no links", () => {
    expect(computeFidelity(layer([{ text: "plain" }]), "plain").linkPrecision).toBe(1);
  });
});

describe("fidelity ratchet", () => {
  const row = (over: Partial<FidelityRow>): FidelityRow => ({
    file: "x.pdf",
    status: "success",
    sourceWords: 100,
    wordRecall: 0.95,
    sourceNumbers: 10,
    numericRecall: 0.9,
    linkAnnotations: 0,
    bareUrls: 0,
    outputLinks: 0,
    linkPrecision: 1,
    outputWords: 100,
    spaceBeforePunct: 0,
    spaceBeforePunctPer10k: 0,
    boldSpans: 0,
    italicSpans: 0,
    codeFences: 0,
    ...over,
  });
  const base = { wordRecall: 0.95, numericRecall: 0.9, linkPrecision: 1, spaceBeforePunctPer10k: 0 };

  it("accepts equal or better metrics", () => {
    expect(ratchetFailures(row({ wordRecall: 0.96 }), base)).toEqual([]);
  });

  it("rejects regressions beyond tolerance", () => {
    const failures = ratchetFailures(
      row({ wordRecall: 0.94, numericRecall: 0.89, linkPrecision: 0.5, spaceBeforePunctPer10k: 3 }),
      base,
    );
    expect(failures).toHaveLength(4);
  });
});
