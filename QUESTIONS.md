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

## q-2026-06-30-001  [blocking]  item: pdf2md#8
Launch readiness requires an actual production domain and Google Search Console verification method before the repo can be updated correctly. Which domain should be canonical, and how should verification be handled?
1. Use the current Vercel preview domain as canonical for now and provide a Search Console HTML/meta verification token to add.
2. Use a custom production domain; provide the exact domain and either a Search Console HTML/meta verification token or confirm DNS verification will be handled outside the repo.
- type: blocking
- status: open

## q-2026-06-18-001  [default]  item: pdf2md#1
pdf2md#1 shipped observability using a hand-rolled Sentry *envelope* POST (gated by `NEXT_PUBLIC_SENTRY_DSN`) instead of the official `@sentry/nextjs` SDK — chosen to keep the bundle small and protect the <1s LCP target. Keep the lightweight approach or switch to the SDK (breadcrumbs/release tracking, but heavier)?
1. Keep the hand-rolled lightweight envelope
2. Switch to @sentry/nextjs SDK
- type: default
- default: keep hand-rolled
- deadline: 48h
- status: answered
- answer: your call
