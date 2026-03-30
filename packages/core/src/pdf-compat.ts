/**
 * Compatibility layer for pdfjs-dist: use the legacy build in Node.js (no DOMMatrix),
 * and the standard build in browser environments.
 */

const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pdfjs: any;

export async function getPdfjs(): Promise<typeof import("pdfjs-dist")> {
  if (_pdfjs) return _pdfjs;

  if (isNode) {
    _pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  } else {
    _pdfjs = await import("pdfjs-dist");
  }

  return _pdfjs;
}
