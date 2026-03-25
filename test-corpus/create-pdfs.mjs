import { PDFDocument, StandardFonts } from "pdf-lib";
import { writeFileSync } from "fs";

async function createSimpleReport() {
  const doc = await PDFDocument.create();
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helveticaItalic = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Page 1
  let page = doc.addPage([612, 792]);
  let y = 720;

  page.drawText("Annual Report 2025", { x: 72, y, size: 24, font: helveticaBold });
  y -= 36;
  page.drawText("Acme Corporation", { x: 72, y, size: 14, font: helveticaItalic });
  y -= 60;

  page.drawText("Executive Summary", { x: 72, y, size: 16, font: helveticaBold });
  y -= 28;

  const bodyLines = [
    "This report summarizes the key achievements and financial performance",
    "of Acme Corporation during the fiscal year 2025. Revenue grew by 23%",
    "year-over-year, reaching a record $4.2 billion in total revenue.",
    "",
    "Key highlights include:",
  ];
  for (const line of bodyLines) {
    if (line) page.drawText(line, { x: 72, y, size: 11, font: helvetica });
    y -= 16;
  }

  const bullets = [
    "\u2022  Revenue increased 23% to $4.2 billion",
    "\u2022  Operating margin improved to 18.5%",
    "\u2022  Customer base grew to 2.3 million active users",
    "\u2022  Launched 3 new product lines",
  ];
  for (const b of bullets) {
    page.drawText(b, { x: 90, y, size: 11, font: helvetica });
    y -= 16;
  }

  y -= 16;
  page.drawText("Financial Overview", { x: 72, y, size: 16, font: helveticaBold });
  y -= 28;

  const body2 = [
    "The company achieved strong financial results across all business",
    "segments. The technology division contributed 45% of total revenue,",
    "while the services division grew by 31% compared to the prior year.",
  ];
  for (const line of body2) {
    page.drawText(line, { x: 72, y, size: 11, font: helvetica });
    y -= 16;
  }

  y -= 16;
  page.drawText("Important:", { x: 72, y, size: 11, font: helveticaBold });
  page.drawText("All figures are audited and comply with GAAP standards.", { x: 142, y, size: 11, font: helvetica });

  // Page 2
  page = doc.addPage([612, 792]);
  y = 720;
  page.drawText("Outlook for 2026", { x: 72, y, size: 16, font: helveticaBold });
  y -= 28;

  const body3 = [
    "Looking ahead, we expect continued growth driven by our expanding",
    "product portfolio and increasing market penetration in Asia-Pacific.",
    "We project revenue growth of 15-20% for fiscal year 2026.",
  ];
  for (const line of body3) {
    page.drawText(line, { x: 72, y, size: 11, font: helvetica });
    y -= 16;
  }
  y -= 8;
  page.drawText("1. First priority: expand into Japan and South Korea", { x: 72, y, size: 11, font: helvetica });
  y -= 16;
  page.drawText("2. Second priority: launch enterprise tier", { x: 72, y, size: 11, font: helvetica });
  y -= 16;
  page.drawText("3. Third priority: achieve profitability by Q4", { x: 72, y, size: 11, font: helvetica });

  const bytes = await doc.save();
  writeFileSync("simple-report.pdf", bytes);
  console.log("Created simple-report.pdf (" + bytes.length + " bytes)");
}

await createSimpleReport();
