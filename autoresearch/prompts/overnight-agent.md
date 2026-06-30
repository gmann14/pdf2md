You are running an overnight Autoresearch loop for PDF2MD.

Codebase: /Users/grahammann/Coding/pdf2md
Goal: improve real PDF-to-Markdown conversion quality without gaming the scoring harness.

Context:
- Existing quality methodology: docs/quality-testing.md
- Current autoresearch plan: docs/autoresearch-plan.md
- Current runner: autoresearch/run-quality-suite.ts
- Baseline snapshot: autoresearch/baseline.json

Rules:
- Work on a branch named autoresearch/pdf-quality-YYYY-MM-DD.
- Make narrow experiments only.
- Do not publish npm packages.
- Do not deploy.
- Do not delete PDFs or generated results.
- Do not change scoring weights to make results look better.
- Prefer converter improvements in packages/core/src/**.
- Log each accepted or rejected experiment in autoresearch/experiments.jsonl.

Loop:
1. Capture baseline or confirm autoresearch/baseline.json is current.
2. Inspect latest reports and choose one weak dimension or document cluster.
3. Implement one minimal converter change.
4. Run core tests and the relevant quality evaluation.
5. If promising, run all four quality evaluations and `pnpm typecheck`.
6. Run `npx tsx autoresearch/run-quality-suite.ts --skip-run`.
7. Keep only if the runner prints PASS and no individual document drops by more than 0.3.
8. Revert rejected diffs, but keep a concise rejected-experiment log entry.
