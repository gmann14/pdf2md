# Questions — pdf2md-forge

Open decision requests from the loop. Mirrored to Discord #pdf2md;
answer there (option number or freeform) or edit this file directly.

Format (forge specs/05):

```markdown
## q-YYYY-MM-DD-NNN  [blocking|default]  item: pdf2md-forge#N
The question, with enough context to answer from a phone.
1. Option one
2. Option two
- type: blocking | default
- default: (answer assumed at deadline, type=default only)
- deadline: (e.g. 24h, type=default only)
- status: open | answered | defaulted
```

(no open questions)

## q-2026-06-18-001  [default]  item: pdf2md#1
pdf2md#1 shipped observability using a hand-rolled Sentry *envelope* POST (gated by `NEXT_PUBLIC_SENTRY_DSN`) instead of the official `@sentry/nextjs` SDK — chosen to keep the bundle small and protect the <1s LCP target. Keep the lightweight approach or switch to the SDK (breadcrumbs/release tracking, but heavier)?
1. Keep the hand-rolled lightweight envelope
2. Switch to @sentry/nextjs SDK
- type: default
- default: keep hand-rolled
- deadline: 48h
- status: answered
- answer: your call
