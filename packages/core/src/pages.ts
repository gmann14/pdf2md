import type { PageSelection } from "./types.js";

/** Neighbouring pages read (but not output) for document-level statistics. */
export const CONTEXT_PAGES = 10;

/** 1-based inclusive page span. */
interface PageSpan {
  from: number;
  to: number;
}

type ParsedRange = { spans: PageSpan[] } | { offset: number };

/**
 * Parse a page-range string: `"1-5,9"` (1-based, inclusive) or `"-3"` (the
 * last 3 pages). Spans are kept as bounds, never expanded, so `"1-999999999"`
 * costs nothing until it is clamped to the document. Throws on bad input.
 */
function parseRangeSpec(spec: string): ParsedRange {
  const text = spec.trim();
  const last = /^-(\d+)$/.exec(text);
  if (last) {
    const count = Number(last[1]);
    if (!Number.isSafeInteger(count) || count < 1) {
      throw new Error(`Invalid page range "${spec}": the last-pages count must be at least 1`);
    }
    return { offset: -count };
  }

  const spans: PageSpan[] = [];
  for (const part of text.split(",")) {
    const token = part.trim();
    const match = /^(\d+)(?:-(\d+))?$/.exec(token);
    if (!match) throw new Error(`Invalid page range "${spec}": expected e.g. "1-5,9" or "-3"`);
    const from = Number(match[1]);
    const to = match[2] === undefined ? from : Number(match[2]);
    if (!Number.isSafeInteger(from) || !Number.isSafeInteger(to) || from < 1 || to < from) {
      throw new Error(`Invalid page range "${spec}": "${token}" is not an ascending 1-based range`);
    }
    spans.push({ from, to });
  }
  return { spans };
}

/**
 * Check a page-range string (`"1-5,9"`, `"-3"`) without a document; throws
 * an `Error` naming the problem. CLIs and tools use it to fail early.
 */
export function validatePageRange(spec: string): void {
  parseRangeSpec(spec);
}

/**
 * Resolve a page selection to sorted, unique, 1-based page numbers that exist
 * in a document of `totalPages` pages, keeping at most `maxPages` (the first
 * ones). Pages out of range are dropped, so an out-of-range selection
 * resolves to `[]`. No array longer than `min(totalPages, maxPages)` is built
 * for range strings or offsets.
 *
 * - `number[]`: 1-based page numbers.
 * - `{ offset, length }`: 0-based `offset`; a negative `offset` counts from the
 *   end (`-3` starts at the third-last page). `length` defaults to the rest.
 * - `string`: `"1-5,9"` or `"-3"` (throws if malformed).
 */
export function resolvePageSelection(
  selection: PageSelection | undefined,
  totalPages: number,
  maxPages?: number,
): number[] {
  const total = Number.isFinite(totalPages) ? Math.max(0, Math.floor(totalPages)) : 0;
  const cap =
    maxPages !== undefined && Number.isFinite(maxPages) && maxPages > 0
      ? Math.min(total, Math.floor(maxPages))
      : total;
  if (cap === 0) return [];

  if (selection === undefined) return range(1, cap);

  if (typeof selection === "string") {
    const parsed = parseRangeSpec(selection);
    return "offset" in parsed
      ? fromOffset(parsed.offset, undefined, total, cap)
      : fromSpans(parsed.spans, total, cap);
  }

  if (Array.isArray(selection)) {
    const pages = new Set<number>();
    for (const page of selection) {
      if (Number.isInteger(page) && page >= 1 && page <= total) pages.add(page);
    }
    return [...pages].sort((a, b) => a - b).slice(0, cap);
  }

  return fromOffset(selection?.offset, selection?.length, total, cap);
}

function fromOffset(
  rawOffset: number | undefined,
  length: number | undefined,
  total: number,
  cap: number,
): number[] {
  const offset = rawOffset !== undefined && Number.isFinite(rawOffset) ? Math.trunc(rawOffset) : 0;
  const start = offset < 0 ? Math.max(0, total + offset) : offset;
  if (start >= total) return [];
  let end = Math.min(total, start + cap);
  if (length !== undefined && Number.isFinite(length)) {
    end = Math.min(end, start + Math.max(0, Math.trunc(length)));
  }
  return range(start + 1, end);
}

function fromSpans(spans: PageSpan[], total: number, cap: number): number[] {
  // Clamp to the document first, then merge, so expansion is bounded by `cap`.
  const clamped = spans
    .map(({ from, to }) => ({ from, to: Math.min(to, total) }))
    .filter(({ from, to }) => from <= to)
    .sort((a, b) => a.from - b.from);
  const pages: number[] = [];
  let next = 1; // smallest page not yet emitted
  for (const { from, to } of clamped) {
    for (let page = Math.max(from, next); page <= to && pages.length < cap; page++) pages.push(page);
    next = Math.max(next, to + 1);
    if (pages.length >= cap) break;
  }
  return pages;
}

/**
 * The selected pages plus up to `extra` neighbouring pages, nearest first, in
 * document order. Header/footer detection and the font profile need several
 * pages, so a one-page read still strips running headers. `selected` must be
 * sorted and unique (as `resolvePageSelection` returns it). The work is
 * bounded by the selection size and `extra`, not by `totalPages`.
 */
export function withContextPages(
  selected: number[],
  totalPages: number,
  extra = CONTEXT_PAGES,
): number[] {
  if (selected.length === 0) return [];
  if (selected.length + extra >= totalPages) return range(1, totalPages);

  const isSelected = (page: number): boolean => {
    let lo = 0;
    let hi = selected.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (selected[mid] === page) return true;
      if (selected[mid] < page) lo = mid + 1;
      else hi = mid - 1;
    }
    return false;
  };

  // Runs of consecutive selected pages; only their edges have free neighbours.
  const runs: PageSpan[] = [];
  for (const page of selected) {
    const run = runs[runs.length - 1];
    if (run && page === run.to + 1) run.to = page;
    else runs.push({ from: page, to: page });
  }

  // Nearest first: every free page at distance 1, then 2, ..., stopping as
  // soon as `extra` pages are chosen.
  const chosen = new Set<number>();
  for (let distance = 1; distance <= extra && chosen.size < extra; distance++) {
    for (const { from, to } of runs) {
      for (const page of [from - distance, to + distance]) {
        if (page < 1 || page > totalPages || chosen.has(page) || isSelected(page)) continue;
        chosen.add(page);
        if (chosen.size >= extra) break;
      }
      if (chosen.size >= extra) break;
    }
  }
  return [...selected, ...chosen].sort((a, b) => a - b);
}

function range(from: number, to: number): number[] {
  const pages: number[] = [];
  for (let page = from; page <= to; page++) pages.push(page);
  return pages;
}
