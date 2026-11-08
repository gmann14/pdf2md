// @vitest-environment node

import { describe, expect, it } from "vitest";
import { diffHeadings, extractHeadings, headingIssues, summarize } from "../../../test-corpus/headings";

describe("corpus heading check", () => {
  it("extracts ATX and Setext headings with normalised text", () => {
    const md = "# Title\n\ntext\n\nSection “One”\n---\n\n### Sub—part\n";
    expect(extractHeadings(md)).toEqual([
      { level: 1, text: "Title" },
      { level: 2, text: 'Section "One"' },
      { level: 3, text: "Sub-part" },
    ]);
  });

  it("flags level skips, glued body text, sentences, numbers and repeats", () => {
    const issues = headingIssues([
      { level: 1, text: "Title" },
      { level: 3, text: "Skipped a level" },
      { level: 3, text: "Discussion This analysis of publicly available data found that many prescriptions were written in the United States in 2021" },
      { level: 3, text: "continued from the line above," },
      { level: 2, text: "42" },
      { level: 2, text: "Running Head" },
      { level: 2, text: "Running Head" },
      { level: 2, text: "Running Head" },
      { level: 2, text: "Smith et al." },
    ]);
    expect(issues).toEqual([
      [],
      ["level-skip"],
      ["long"],
      ["sentence"],
      ["no-letters"],
      ["repeated"],
      ["repeated"],
      ["repeated"],
      [],
    ]);
  });

  it("summarises headings by level and issue", () => {
    const s = summarize([
      { level: 1, text: "A" },
      { level: 4, text: "B" },
    ]);
    expect(s.total).toBe(2);
    expect(s.byLevel).toEqual([1, 0, 0, 1, 0, 0]);
    expect(s.issues["level-skip"]).toBe(1);
  });

  it("diffs two runs into added, removed and relevelled headings", () => {
    const before = [
      { level: 3, text: "Methods" },
      { level: 3, text: "Results" },
      { level: 2, text: "Masthead" },
    ];
    const after = [
      { level: 2, text: "Methods" },
      { level: 3, text: "Results" },
      { level: 3, text: "Data Source" },
    ];
    expect(diffHeadings(before, after)).toEqual({
      added: [{ level: 3, text: "Data Source" }],
      removed: [{ level: 2, text: "Masthead" }],
      relevelled: [{ text: "Methods", from: 3, to: 2 }],
    });
  });

  it("matches repeated text in order and reports no change for identical runs", () => {
    const run = [
      { level: 2, text: "Notes" },
      { level: 3, text: "Notes" },
    ];
    expect(diffHeadings(run, run)).toEqual({ added: [], removed: [], relevelled: [] });
  });
});
