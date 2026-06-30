# PWA/offline app-shell feasibility

Status: implemented as a narrow progressive enhancement.

## Decision

Offline caching is worth implementing now, but only for the app shell and
same-origin PDF.js assets. It is not a broader offline document store and does
not cache uploads, generated Markdown, filenames, extracted text, PDF metadata,
or telemetry requests.

## Implementation

- `apps/web/public/sw.js` precaches `/`, `/privacy/`, and
  `/pdfjs/pdf.min.mjs`.
- Runtime caching is limited to same-origin static assets: `/_next/static/*`,
  `/pdfjs/*`, scripts, styles, fonts, images, and workers. This catches the
  hashed Next assets and emitted PDF.js worker bundle without hardcoding build
  hashes.
- Document navigations use network-first behavior with cached fallback, so an
  updated deployment wins when the network is available.
- Registration is production-only and secure-context-only via
  `apps/web/src/lib/pwa.ts`, keeping `next dev` and the dev E2E gate free from
  stale service-worker state.
- `apps/web/src/app/manifest.ts` provides the installable app metadata.

## Cache size

The initial fixed cache is small: the app shell pages plus
`/pdfjs/pdf.min.mjs`, currently about 450 KB minified in this repository. The
PDF.js worker and hashed Next chunks are cached on first use, so the first
conversion may add roughly another 1-2 MB depending on the emitted worker build.
This is acceptable for the current 15 MB PDF limit and does not change the
runtime memory budget for conversion.

## Update and stale-worker risks

The service worker uses a versioned cache name (`pdf2md-app-shell-v1`) and
deletes older app-shell caches on activation. It does not call `skipWaiting()`,
so an already-open tab keeps its current app code until the normal browser
service-worker lifecycle advances. That avoids mid-conversion code swaps; the
tradeoff is that a user may need a tab close/reopen before receiving a changed
service worker. The runtime network-first navigation strategy limits stale app
HTML when users are online.

## Revisit triggers

- Add an in-app update prompt if users report stale UI after deployments.
- Reconsider Workbox only if manual cache routing grows beyond app shell,
  PDF.js assets, and immutable Next assets.
- Do not add document-result persistence unless the privacy spec explicitly
  changes to allow local-only generated-output storage.
