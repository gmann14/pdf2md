# PDF2MD Autoresearch Plan

Status: proposed
Owner: Alfred / overnight coding agent
Project: `/Users/grahammann/Coding/pdf2md`
Primary goal: improve PDF conversion quality through an automated experiment loop without overfitting or destabilizing the published packages.

## 1. Why PDF2MD Is a Good First Autoresearch Target

PDF2MD has the ingredients Autoresearch needs:

- A real codebase with localized heuristic improvements.
- A stable, deterministic evaluation harness.
- 53 real-world PDFs across training + blind/stress sets.
- Existing quality score baseline around 9.1/10 combined.
- Clear weak dimensions: code block detection, link extraction, metadata extraction, table detection on some sets, math/garbled fonts/multicolumn edge cases.
- Reversible changes: agent can work on a branch and only keep diffs that improve score and pass tests.

The output should be PR-ready code changes plus a machine-readable experiment log, not a vague research report.

## 2. Core Autoresearch Loop

Each iteration follows this loop:

1. Inspect latest score report and failing/weak PDFs.
2. Choose one narrow hypothesis.
3. Modify converter/scoring code minimally.
4. Run fast tests.
5. Run quality evaluation.
6. Compare against baseline.
7. Keep the change only if it improves the acceptance score and does not create unacceptable regressions.
8. Commit or checkpoint the winning experiment.
9. Log hypothesis, diff summary, metrics, regressions, and next idea.

Important: one iteration should change one class of heuristic only. No giant mixed changes.

## 3. What the Agent May Change

Allowed:

- `packages/core/src/**`
- `packages/core/test/**`
- `test-corpus/*.ts` only if adding better diagnostics, not gaming scores
- `docs/quality-testing.md` if results change materially
- `test-corpus/*REPORT*.md` regenerated reports
- new files under `autoresearch/` for logs/results

Avoid unless explicitly approved:

- UI changes in `apps/web/**`
- package publishing
- npm version bumps
- changing public API shape
- changing scoring weights to make results look better
- editing test expectations without a clear converter-side reason

Never:

- publish to npm
- deploy to Vercel
- delete PDFs/results
- rewrite large docs unnecessarily

## 4. Acceptance Criteria

A change is kept only if all are true:

- `pnpm --filter @pdf2md/core test` passes.
- `pnpm typecheck` passes.
- Training evaluation does not regress meaningfully.
- At least one blind/stress set improves, or a known weakness improves without broad regressions.
- No individual document drops by more than 0.3 unless explained and accepted.
- Combined weighted score improves by at least 0.05, OR a strategically important dimension improves by at least 0.3 with no combined-score regression.
- Diff is understandable and isolated.

Suggested baseline score formula:

```text
combined = 0.25 * training + 0.25 * blind1 + 0.25 * blind2 + 0.25 * blind3
```

Because the training set has already been optimized, blind/stress improvements should matter more than training improvements.

Optional stricter formula for overnight runs:

```text
combined = 0.15 * training + 0.25 * blind1 + 0.30 * blind2 + 0.30 * blind3
```

## 5. Initial Hypothesis Backlog

Start with the most likely quality wins:

### H1: Code block false positives / false negatives

Observed weakness: Blind Set 3 code block detection is the weakest dimension at ~7.3.

Experiment ideas:

- Improve distinction between actual code, monospace labels, equations, citations, and tabular data.
- Require syntax-like tokens or repeated indentation patterns before opening code fences.
- Special-case legal/government/math documents where monospace does not imply code.
- Add diagnostics that list every code fence with source page and triggering features.

Acceptance focus: improve Blind 3 codeBlockDetection without hurting technical-spec/code-heavy PDFs.

### H2: Link extraction and bare URL cleanup

Observed weakness: link extraction is ~7.8 on Blind 3 and ~8.3-8.8 elsewhere.

Experiment ideas:

- Better bbox overlap scoring for annotations split across wrapped text.
- Preserve footnote URLs without over-linking body prose.
- Normalize broken/kerned URL text before auto-linking.
- Avoid duplicate Markdown links when annotation + bare URL both trigger.

Acceptance focus: improve linkExtraction and noGarbage together.

### H3: Metadata extraction fallback

Observed weakness: metadata extraction is stable but low ceiling (~8.0) because many PDFs lack embedded metadata.

Experiment ideas:

- Better title fallback from first strong heading / first page large text.
- Reject noisy titles like page headers, publication boilerplate, form IDs.
- Extract likely author/org from first-page bylines when clear.

Acceptance focus: improve metadataExtraction without adding junk YAML.

### H4: Complex table detection

Observed weakness: Blind Set 2 table detection around ~7.9.

Experiment ideas:

- Improve row grouping for datasheets, agendas, timetables, census-like tables.
- Detect table-like alignment over multiple rows, not isolated lines.
- Avoid confusing 2-column prose with tables.

Acceptance focus: improve tableDetection on Blind 2 without false tables in academic/legal prose.

### H5: Multi-column edge cases

Known limitation: narrow/inconsistent gutters can interleave columns.

Experiment ideas:

- Page-level column confidence score.
- Better handling of full-width headings above two-column body text.
- Detect column transitions within a page.

Acceptance focus: paragraphIntegrity and readability on multicolumn docs.

## 6. Implementation Shape

### 6.1 Add an Autoresearch runner

Create:

```text
autoresearch/
  README.md
  baseline.json
  experiments.jsonl
  latest-summary.md
  run-quality-suite.ts
  compare-results.ts
  prompts/
    overnight-agent.md
```

Runner responsibilities:

- Run all four evaluation commands.
- Parse average and per-dimension scores from generated reports or direct script output.
- Persist JSON snapshots with timestamp, git SHA, branch name, and diff summary.
- Compare current run against baseline.
- Print PASS/FAIL according to acceptance criteria.

If parsing current reports is awkward, first implementation can wrap the existing scripts and require the coding agent to summarize manually in `experiments.jsonl`. The runner can be hardened later.

### 6.2 Suggested commands

Baseline:

```bash
cd /Users/grahammann/Coding/pdf2md
pnpm --filter @pdf2md/core test
pnpm typecheck
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate.ts
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate-blind.ts
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate-blind-2.ts
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/evaluate-blind-3.ts
```

Full gate:

```bash
pnpm test
pnpm typecheck
pnpm build
```

### 6.3 Git/branch workflow

Use a dedicated branch:

```bash
git checkout -b autoresearch/pdf-quality-YYYY-MM-DD
```

Each accepted experiment gets a small commit:

```text
autoresearch: improve code block detection for stress PDFs
```

Rejected experiments are reverted and logged, not committed.

If multiple improvements are found, the final state should be a clean branch with 1-4 coherent commits and a summary doc.

## 7. Overnight Agent Prompt

Use this prompt for the implementation agent:

```text
You are running an overnight Autoresearch loop for PDF2MD.

Codebase: /Users/grahammann/Coding/pdf2md
Goal: improve real PDF-to-Markdown conversion quality without gaming the scoring harness.

Context:
- PDF2MD already scores about 9.1/10 across 53 real-world PDFs.
- Existing quality methodology: docs/quality-testing.md
- Task source of truth: .claude/tasks.md
- Current plan: docs/autoresearch-plan.md

Rules:
- Work on a branch named autoresearch/pdf-quality-YYYY-MM-DD.
- Make narrow experiments only.
- Do not publish npm packages.
- Do not deploy.
- Do not delete PDFs or results.
- Do not change scoring weights to make results look better.
- Do not rewrite unrelated docs.
- Prefer converter improvements in packages/core/src/**.
- After changes, update .claude/tasks.md and changelog/autoresearch summary if appropriate.
- Run tests before committing.
- Use optional chaining/null guards on any new data parsing.

Loop:
1. Capture baseline: core tests, typecheck, four quality evaluations.
2. Identify weakest dimensions / specific PDFs.
3. Choose one hypothesis from docs/autoresearch-plan.md or a better one discovered from evidence.
4. Implement minimal change.
5. Run core tests + relevant quality eval.
6. If promising, run all quality evals + typecheck.
7. Keep only if acceptance criteria pass.
8. Commit winning change.
9. Log experiment to autoresearch/experiments.jsonl with: timestamp, hypothesis, files changed, commands run, before/after scores, regressions, decision.
10. Repeat until time expires or no safe improvement remains.

Final output:
- Branch name
- Commits made
- Before/after score table
- Rejected experiments summary
- Remaining best hypotheses
- Exact commands run
- Any blockers
```

## 8. Tonight's Proposed Run

Recommended scope for first overnight run:

- Duration: 3-5 hours max.
- Target: H1 code block detection first, then H2 link extraction if time remains.
- Max accepted commits: 3.
- Stop early if two consecutive experiments fail to improve metrics.
- No UI, deploy, npm publish, or public launch work.

Expected good outcome:

- One real converter improvement.
- Combined score +0.05 to +0.15, or Blind 3 codeBlockDetection +0.3+ without regressions.
- Experiment logs that make future loops faster.

Expected acceptable outcome:

- No code improvement, but we get a reusable Autoresearch runner/log structure and a clear failure analysis.

## 9. Future Extensions

Once the PDF2MD loop works, reuse the pattern for:

- SEOTakeoff content quality prompts.
- Blog draft improvement and link validation.
- WaveScout scoring heuristics.
- OpenClaw eval harness and cron reliability.

PDF2MD is the pilot because the feedback loop is already deterministic and low-risk.
