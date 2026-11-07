// @vitest-environment node

import { describe, expect, it } from "vitest";
import { convert } from "./converter.js";
import { makePdf } from "./testing/make-pdf.js";

describe("list labels", () => {
  it("keeps the bracketed number of each bibliography entry", async () => {
    // In-text citations ("see [2]") point at these labels, so dropping them
    // for a plain bullet loses the only key to the reference list.
    const pdf = makePdf({
      pages: [[
        { text: "References", x: 72, y: 720, size: 14 },
        { text: "[1] W. Dai, b-money, published online in 1998.", x: 72, y: 690, size: 10 },
        { text: "[2] H. Massias, Design of a secure timestamping service, May 1999.", x: 72, y: 672, size: 10 },
        { text: "[12] S. Haber, How to time-stamp a digital document, 1991.", x: 72, y: 654, size: 10 },
      ]],
    });
    const result = await convert(pdf);
    expect(result.markdown).toContain("- [1] W. Dai, b-money, published online in 1998.");
    expect(result.markdown).toContain("- [2] H. Massias, Design of a secure timestamping service, May 1999.");
    expect(result.markdown).toContain("- [12] S. Haber, How to time-stamp a digital document, 1991.");
  });
});
