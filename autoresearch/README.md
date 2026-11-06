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

The evaluate reports also carry a "Text Fidelity" section (`test-corpus/fidelity.ts`):
word recall, numeric-token recall and link precision against the raw PDF.js text
layer. When both snapshots have it, an experiment also fails if any document's
word recall drops by more than `0.5` points, its numeric recall drops at all, or
its link precision falls below `95%` (or below its baseline, if that is already
lower). These metrics are not folded into the 9-dimension score.

Run the fidelity checks on their own (all sets, or the dirs given):

```bash
npx tsx --require ./test-corpus/node-polyfills.cjs test-corpus/fidelity.ts [dir ...] [--json out.json] [--save-md outDir]
```

`pnpm test:fidelity` (also a CI step) runs a ratchet over `test-corpus/real-pdfs/`
against `test-corpus/fidelity-baseline.json`. It is kept out of `pnpm test` because it
converts the whole tracked corpus (about a minute). After an intended improvement, refresh it with
`... test-corpus/fidelity.ts test-corpus/real-pdfs --update-baseline`.

The four datasets are weighted equally:

```text
combined = 0.25 * training + 0.25 * blind1 + 0.25 * blind2 + 0.25 * blind3
```
