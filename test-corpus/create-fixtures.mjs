/**
 * Small pdf-lib fixtures for converter unit tests. The generated PDFs are
 * committed under test-corpus/fixtures/ so CI does not need pdf-lib.
 *
 * Usage (from test-corpus/, after `npm ci`): node create-fixtures.mjs
 */
import { PDFDocument, PDFName, PDFString, StandardFonts } from "pdf-lib";
import { mkdirSync, writeFileSync } from "fs";

const OUT_DIR = new URL("./fixtures/", import.meta.url);

/** pdf-lib output is otherwise timestamped; fix the dates so reruns are byte-stable. */
function fixDates(doc) {
  const date = new Date("2026-11-06T00:00:00Z");
  doc.setCreationDate(date);
  doc.setModificationDate(date);
}

function addLink(doc, page, rect, url) {
  const annot = doc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: rect,
    Border: [0, 0, 0],
    A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
  });
  const ref = doc.context.register(annot);
  const existing = page.node.lookup(PDFName.of("Annots"));
  if (existing) existing.push(ref);
  else page.node.set(PDFName.of("Annots"), doc.context.obj([ref]));
}

/**
 * Three pages with the same text at the same position. Only page 2 has a link
 * annotation over it, so only page 2's text may become a link. Page 2 also has
 * a link drawn as two runs in different fonts (must come out as one link) and a
 * wide link over a lone "(" glyph (must not wrap the bracket).
 */
async function linksSamePosition() {
  const doc = await PDFDocument.create();
  fixDates(doc);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const times = await doc.embedFont(StandardFonts.TimesRoman);

  for (let p = 1; p <= 3; p++) {
    const page = doc.addPage([612, 792]);
    page.drawText(`Page ${p} introduction paragraph with ordinary body text.`, {
      x: 72, y: 720, size: 11, font: helvetica,
    });
    page.drawText("Project homepage", { x: 72, y: 690, size: 11, font: helvetica });
    page.drawText("More body text follows here on every page.", {
      x: 72, y: 660, size: 11, font: helvetica,
    });

    if (p === 2) {
      const w = helvetica.widthOfTextAtSize("Project homepage", 11);
      addLink(doc, page, [70, 684, 74 + w, 706], "https://example.com/home");

      // Link text drawn as two runs (font change splits PDF.js items).
      const first = "Read the";
      const firstW = bold.widthOfTextAtSize(first, 11);
      page.drawText(first, { x: 72, y: 630, size: 11, font: bold });
      page.drawText(" docs", { x: 72 + firstW, y: 630, size: 11, font: helvetica });
      const secondW = helvetica.widthOfTextAtSize(" docs", 11);
      addLink(doc, page, [70, 624, 74 + firstW + secondW, 646], "https://example.com/docs");

      // A lone bracket inside a wide link rectangle.
      page.drawText("(", { x: 72, y: 600, size: 11, font: times });
      page.drawText("see appendix", { x: 80, y: 600, size: 11, font: helvetica });
      addLink(doc, page, [70, 594, 300, 616], "https://example.com/appendix");
    }
  }
  return doc.save({ useObjectStreams: false });
}

/**
 * Five pages with a running header and footer page numbers 1–5. Page 1 has a
 * table-of-contents line ending in "17"; page 2 has a table whose cells include
 * "2022" and "17". The footer numbers must go; every body number must stay.
 */
async function headerFooterNumbers() {
  const doc = await PDFDocument.create();
  fixDates(doc);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  for (let p = 1; p <= 5; p++) {
    const page = doc.addPage([612, 792]);
    page.drawText("Example Annual Report", { x: 72, y: 750, size: 9, font: helvetica });
    page.drawText(String(p), { x: 302, y: 40, size: 9, font: helvetica });

    page.drawText(`Section ${p} overview`, { x: 72, y: 690, size: 16, font: bold });
    page.drawText("This page has ordinary body text so the layout looks like a real report.", {
      x: 72, y: 660, size: 11, font: helvetica,
    });
    page.drawText("A second body line keeps the paragraph long enough to be a paragraph.", {
      x: 72, y: 645, size: 11, font: helvetica,
    });

    if (p === 1) {
      page.drawText("Contents", { x: 72, y: 600, size: 13, font: bold });
      page.drawText("Introduction", { x: 72, y: 580, size: 11, font: helvetica });
      page.drawText("17", { x: 500, y: 580, size: 11, font: helvetica });
      page.drawText("Methods", { x: 72, y: 565, size: 11, font: helvetica });
      page.drawText("23", { x: 500, y: 565, size: 11, font: helvetica });
    }

    if (p === 2) {
      const rows = [
        ["Metric", "2022", "2023"],
        ["Stores", "17", "19"],
        ["Countries", "4", "5"],
      ];
      rows.forEach((row, r) => {
        row.forEach((cell, c) => {
          page.drawText(cell, { x: 72 + c * 150, y: 600 - r * 16, size: 11, font: r === 0 ? bold : helvetica });
        });
      });
    }
  }
  return doc.save({ useObjectStreams: false });
}

mkdirSync(OUT_DIR, { recursive: true });
const fixtures = {
  "links-same-position.pdf": linksSamePosition,
  "header-footer-numbers.pdf": headerFooterNumbers,
};
for (const [name, build] of Object.entries(fixtures)) {
  writeFileSync(new URL(name, OUT_DIR), await build());
  console.log(`wrote fixtures/${name}`);
}
