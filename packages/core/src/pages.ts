import type { PageSelection } from "./types.js";

/** Neighbouring pages read (but not output) for document-level statistics. */
export const CONTEXT_PAGES = 10;

/**
 * Resolve a page selection to sorted, unique, 1-based page numbers that exist
 * in a document of `totalPages` pages. Pages out of range are dropped, so an
 * out-of-range selection resolves to `[]`.
 *
 * - `number[]`: 1-based page numbers.
 * - `{ offset, length }`: 0-based `offset`; a negative `offset` counts from the
 *   end (`-3` starts at the third-last page). `length` defaults to the rest of
 *   the document.
 */
export function resolvePageSelection(
  selection: PageSelection | undefined,
  totalPages: number,
): number[] {
  const total = Number.isFinite(totalPages) ? Math.max(0, Math.floor(totalPages)) : 0;
  if (selection === undefined) return range(1, total);

  if (Array.isArray(selection)) {
    const pages = new Set<number>();
    for (const page of selection) {
      if (Number.isInteger(page) && page >= 1 && page <= total) pages.add(page);
    }
    return [...pages].sort((a, b) => a - b);
  }

  const offset = Number.isFinite(selection?.offset) ? Math.trunc(selection.offset) : 0;
  const start = offset < 0 ? Math.max(0, total + offset) : offset;
  const length = selection?.length;
  const end =
    length === undefined || !Number.isFinite(length)
      ? total
      : Math.min(total, start + Math.max(0, Math.trunc(length)));
  return range(start + 1, end);
}

/**
 * The selected pages plus up to `extra` neighbouring pages, nearest first, in
 * document order. Header/footer detection and the font profile need several
 * pages, so a one-page read still strips running headers.
 */
export function withContextPages(
  selected: number[],
  totalPages: number,
  extra = CONTEXT_PAGES,
): number[] {
  const pages = new Set(selected);
  if (selected.length === 0) return [];
  let added = 0;
  for (let distance = 1; added < extra && distance < totalPages; distance++) {
    for (const page of selected) {
      for (const candidate of [page - distance, page + distance]) {
        if (added >= extra) break;
        if (candidate < 1 || candidate > totalPages || pages.has(candidate)) continue;
        pages.add(candidate);
        added++;
      }
    }
  }
  return [...pages].sort((a, b) => a - b);
}

/**
 * Parse a page-range string such as `"1-5,9"` (1-based, inclusive) or `"-3"`
 * (the last 3 pages) into a `PageSelection`. Throws on malformed input.
 */
export function parsePageRange(spec: string): PageSelection {
  const text = spec.trim();
  const last = /^-(\d+)$/.exec(text);
  if (last) {
    const count = Number(last[1]);
    if (count < 1) throw new Error(`Invalid page range "${spec}": the last-pages count must be at least 1`);
    return { offset: -count };
  }

  const pages: number[] = [];
  for (const part of text.split(",")) {
    const token = part.trim();
    const match = /^(\d+)(?:-(\d+))?$/.exec(token);
    if (!match) throw new Error(`Invalid page range "${spec}": expected e.g. "1-5,9" or "-3"`);
    const from = Number(match[1]);
    const to = match[2] === undefined ? from : Number(match[2]);
    if (from < 1 || to < from) throw new Error(`Invalid page range "${spec}": "${token}" is not an ascending 1-based range`);
    // Cap a single range so "1-999999999" cannot allocate a huge array.
    for (let page = from; page <= Math.min(to, from + 100_000); page++) pages.push(page);
  }
  return pages;
}

function range(from: number, to: number): number[] {
  const pages: number[] = [];
  for (let page = from; page <= to; page++) pages.push(page);
  return pages;
}
