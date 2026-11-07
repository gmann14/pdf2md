/** True in Node.js (and other runtimes that expose `process.versions.node`). */
export const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;
