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

/**
 * One page whose body text is drawn as separate runs: a word and the full stop
 * after it with no gap, a bracketed number drawn as three touching runs, and
 * two words drawn as separate runs with a normal word gap and no space glyph.
 */
async function touchingRuns() {
  const doc = await PDFDocument.create();
  fixDates(doc);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const page = doc.addPage([612, 792]);
  const size = 11;

  /** Draw runs left to right; `gap` is the space before each run, in points. */
  const drawRuns = (y, runs) => {
    let x = 72;
    for (const [text, gap] of runs) {
      x += gap;
      page.drawText(text, { x, y, size, font: helvetica });
      x += helvetica.widthOfTextAtSize(text, size);
    }
  };

  const wordGap = helvetica.widthOfTextAtSize(" ", size);
  drawRuns(720, [["The platform offers primitive services", 0], [".", 0]]);
  drawRuns(700, [["Revenue grew to", 0], ["(", wordGap], ["46,752", 0], [")", 0], ["last year.", wordGap]]);
  drawRuns(680, [["separate", 0], ["words", wordGap], ["stay apart.", wordGap]]);
  return doc.save({ useObjectStreams: false });
}

/**
 * Body text in Helvetica with spans in Helvetica-Bold, Helvetica-Oblique and
 * Helvetica-BoldOblique, a bold run that wraps onto the next line, a bold
 * heading, and a line that is bold throughout.
 */
async function inlineEmphasis() {
  const doc = await PDFDocument.create();
  fixDates(doc);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const boldItalic = await doc.embedFont(StandardFonts.HelveticaBoldOblique);
  const page = doc.addPage([612, 792]);
  const size = 11;

  /** Draw runs left to right, each directly after the previous one. */
  const drawRuns = (y, runs) => {
    let x = 72;
    for (const [text, font] of runs) {
      page.drawText(text, { x, y, size, font });
      x += font.widthOfTextAtSize(text, size);
    }
  };

  page.drawText("Results", { x: 72, y: 740, size: 18, font: bold });
  drawRuns(712, [
    ["The platform offers ", regular],
    ["primitive services", bold],
    [". It also has an ", regular],
    ["italic span", italic],
    [", then ", regular],
    ["both styles", boldItalic],
    [" in one line.", regular],
  ]);
  drawRuns(698, [
    ["This sentence has ", regular],
    ["a bold phrase that", bold],
  ]);
  drawRuns(684, [
    ["wraps onto the next line", bold],
    [" and then ends normally here.", regular],
  ]);
  page.drawText("Ordinary body text keeps the paragraph long enough to read as body text.", {
    x: 72, y: 670, size, font: regular,
  });
  drawRuns(656, [
    ["Key ", bold],
    ["term", boldItalic],
    [" and its definition", bold],
    [": explained.", regular],
  ]);
  drawRuns(642, [
    ["See the ", regular],
    ["Rules of Arbitration (", italic],
    ["ICC Rules", boldItalic],
    [")", italic],
    [" for details.", regular],
  ]);
  drawRuns(628, [
    ["Choose the ", regular],
    ["Amount ", italic],
    ["E-file", boldItalic],
    [" options", bold],
    [" that apply.", regular],
  ]);
  page.drawText("Note: this whole line is set in bold type and ends with a full stop.", {
    x: 72, y: 596, size, font: bold,
  });
  page.drawText("A closing paragraph in the regular body font finishes the page.", {
    x: 72, y: 566, size, font: regular,
  });
  return doc.save({ useObjectStreams: false });
}

/**
 * A table of contents: a group of tightly spaced entries (one text block), a
 * group of widely spaced entries (one block each) with a chapter line that has
 * no leader, an entry wrapped over two lines, an unspaced leader with a roman
 * page number, and a prose ellipsis that must stay. Page 2 has a large bold
 * heading broken over two lines at a hyphen.
 */
async function tocLeaders() {
  const doc = await PDFDocument.create();
  fixDates(doc);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const size = 11;
  const page = doc.addPage([612, 792]);

  const entry = (y, title, pageRef, { x = 72, unspaced = false } = {}) => {
    page.drawText(title, { x, y, size, font: regular });
    let lx = x + regular.widthOfTextAtSize(title, size) + 6;
    const dot = unspaced ? "." : ". ";
    const dotW = regular.widthOfTextAtSize(dot, size);
    let leader = "";
    while (lx + dotW < 490) {
      leader += dot;
      lx += dotW;
    }
    page.drawText(leader.trimEnd(), { x: x + regular.widthOfTextAtSize(title, size) + 6, y, size, font: regular });
    page.drawText(pageRef, { x: 500, y, size, font: regular });
  };

  page.drawText("Contents", { x: 72, y: 740, size: 18, font: bold });
  entry(712, "Preface", "v", { unspaced: true });
  entry(698, "1 Introduction", "1");
  entry(684, "1.1 Background", "3");
  entry(670, "1.2 Scope of this report", "4");

  page.drawText("2 Methods", { x: 72, y: 640, size, font: regular });
  page.drawText("7", { x: 500, y: 640, size, font: regular });
  entry(618, "2.1 Data collection", "8");
  page.drawText("2.2 Measuring the effect of seasonal adjustment on", { x: 72, y: 596, size, font: regular });
  entry(582, "regional price indexes", "9", { x: 90 });
  entry(560, "2.3 Limitations", "12");

  page.drawText("The survey ran for three months . . . . and then it stopped for the winter.", {
    x: 72, y: 520, size, font: regular,
  });
  page.drawText("A closing paragraph in the regular body font finishes the page.", {
    x: 72, y: 506, size, font: regular,
  });

  const page2 = doc.addPage([612, 792]);
  page2.drawText("Results for Contrastive Sen-", { x: 72, y: 700, size: 18, font: bold });
  page2.drawText("tence Embeddings", { x: 72, y: 670, size: 18, font: bold });
  page2.drawText("The body text of the results section starts here and runs on for a while.", {
    x: 72, y: 640, size, font: regular,
  });
  page2.drawText("A second body line keeps the paragraph long enough to be a paragraph.", {
    x: 72, y: 626, size, font: regular,
  });
  return doc.save({ useObjectStreams: false });
}

mkdirSync(OUT_DIR, { recursive: true });
const fixtures = {
  "links-same-position.pdf": linksSamePosition,
  "header-footer-numbers.pdf": headerFooterNumbers,
  "touching-runs.pdf": touchingRuns,
  "inline-emphasis.pdf": inlineEmphasis,
  "toc-leaders.pdf": tocLeaders,
};
for (const [name, build] of Object.entries(fixtures)) {
  writeFileSync(new URL(name, OUT_DIR), await build());
  console.log(`wrote fixtures/${name}`);
}
