# Autoresearch Runner

This directory contains the PDF quality autoresearch scaffold described in
`docs/autoresearch-plan.md`.

## Commands

Capture a fresh quality snapshot by running all four evaluation suites:

```bash
npx tsx autoresearch/run-quality-suite.ts
```

Refresh the baseline from the current reports:

```bash
npx tsx autoresearch/run-quality-suite.ts --skip-run --update-baseline
```

Compare a captured snapshot against the baseline:

```bash
npx tsx autoresearch/compare-results.ts autoresearch/baseline.json autoresearch/latest-summary.json
```

The runner records git SHA, branch, worktree diff summary, dataset averages,
per-document scores, per-dimension averages, and the acceptance PASS/FAIL result.

## Acceptance Rule

An experiment passes only when it improves the combined score by at least `0.05`,
or improves a target dimension by at least `0.3` without combined-score
regression. In both cases, no individual document may drop by more than `0.3`.

The four datasets are weighted equally:

```text
combined = 0.25 * training + 0.25 * blind1 + 0.25 * blind2 + 0.25 * blind3
```
