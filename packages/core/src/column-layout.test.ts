// @vitest-environment node

import { describe, expect, it } from "vitest";
import { convert } from "./converter.js";
import { makePdf, reportPages, type TestPdfLine } from "./testing/make-pdf.js";

/**
 * Page 1 of a Copyright Office circular: an 11pt summary sidebar on the left
 * beside the 10.5pt main text, under a large title. PDF y is bottom-up.
 */
function sidebarPage(): TestPdfLine[] {
  const sidebar = [
    "Copyright is a form of protection",
    "provided by U.S. law to authors of",
    "original works of authorship from",
    "the time the works are created in a",
    "fixed form. This circular provides an",
    "overview of basic facts about copyright",
    "and copyright registration with the",
    "U.S. Copyright Office. It covers",
    "works eligible for protection,",
    "rights of copyright owners,",
    "who can claim copyright, and",
    "the duration of copyright.",
  ].map((text, i) => ({ text, x: 60, y: 547 - i * 18, size: 11 }));
  const main = [
    "Copyright is a form of protection provided by the laws of the",
    "United States to the authors of original works of authorship",
    "that are fixed in a tangible form of expression. An original",
    "work of authorship is a work that is independently created by",
    "a human author and possesses at least some minimal degree",
    "of creativity. A work is fixed when it is captured (either",
    "by or under the authority of an author) in a sufficiently",
    "permanent medium such that the work can be perceived,",
    "reproduced, or communicated for more than a short time.",
    "Copyright protection in the United States exists automatically",
    "from the moment the original work of authorship is fixed.",
    "These categories should be viewed broadly for the purpose",
    "of registering your work. For example, computer programs",
    "and certain compilations can be registered as literary",
    "works; maps and technical drawings can be registered as",
    "pictorial, graphic, and sculptural works. A work that is",
    "created is protected by copyright from the moment it is",
    "fixed in a tangible form, and registration is voluntary.",
    "You will have to register, however, if you wish to bring",
    "a lawsuit for infringement of a United States work. The",
    "owner of a copyright has the exclusive right to reproduce",
    "the work, to prepare derivative works, to distribute copies",
    "of the work to the public by sale or other transfer, and to",
    "perform the work publicly in the case of most works. The",
    "law also provides for the right to display the work, and",
    "these rights may be transferred in whole or in part, and",
    "the owner may give permission to others to use the work.",
    "Only the author or those deriving their rights through the",
  ].map((text, i) => ({ text, x: 270, y: 547 - i * 13, size: 10.5 }));
  return [{ text: "Copyright Basics", x: 61, y: 600, size: 36 }, ...sidebar, ...main];
}

describe("two-column reading order (end to end)", () => {
  it("reads a sidebar page as two columns when the rest of the document is single-column", async () => {
    // Without the sidebar exemption, one two-column page in six falls under
    // the cross-page check and is read across both columns line by line. As in
    // the circular, the main column runs on well past the sidebar.
    const pages = [sidebarPage(), ...reportPages(5)];
    const result = await convert(makePdf({ pages }));
    const text = result.markdown.replace(/\s+/g, " ");
    expect(text).toContain(
      "Copyright protection in the United States exists automatically from the moment the original work of authorship is fixed.",
    );
    expect(text).toContain("This circular provides an overview of basic facts about copyright");
  });
});
