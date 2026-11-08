/**
 * Test-only builder for small, valid PDFs (Helvetica text, one content stream
 * per page), so tests can make a 300-page or 20 MB PDF without committing one.
 * Not part of the published package (excluded in tsconfig.json and build-cjs).
 */

export interface TestPdfLine {
  text: string;
  x: number;
  /** PDF y (bottom-up), on a 612 x 792 page. */
  y: number;
  size?: number;
  /** A standard-14 base font, default Helvetica (e.g. "Helvetica-Bold", "Times-Roman"). */
  font?: string;
}

export interface TestPdfOptions {
  /** Lines per page; one array entry per page. */
  pages: TestPdfLine[][];
  /** Extra unreferenced stream bytes, to make a large file. */
  paddingBytes?: number;
  /** 1-based pages whose page object is not a dictionary: PDF.js fails to read them (a "partial" result). */
  brokenPages?: number[];
}

function escapePdfText(text: string): string {
  return text.replace(/[\\()]/g, (ch) => `\\${ch}`);
}

/** Pages with a running header, a page-number footer and two body lines. */
export function reportPages(pageCount: number): TestPdfLine[][] {
  return Array.from({ length: pageCount }, (_, i) => {
    const n = i + 1;
    return [
      { text: "Quarterly Widget Review", x: 72, y: 750, size: 9 },
      { text: `Chapter ${n} summary`, x: 72, y: 690, size: 16 },
      { text: `Body text for page ${n} explains the widgets in plain words.`, x: 72, y: 660, size: 11 },
      { text: `A second line on page ${n} keeps this a real paragraph of text.`, x: 72, y: 645, size: 11 },
      { text: String(n), x: 302, y: 40, size: 9 },
    ];
  });
}

export function makePdf({ pages, paddingBytes = 0, brokenPages = [] }: TestPdfOptions): Uint8Array {
  const chunks: Buffer[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (data: string | Buffer) => {
    const buf = typeof data === "string" ? Buffer.from(data, "latin1") : data;
    chunks.push(buf);
    length += buf.length;
  };
  const object = (id: number, body: string | Buffer[]) => {
    offsets[id] = length;
    push(`${id} 0 obj\n`);
    if (typeof body === "string") push(body);
    else for (const part of body) push(part);
    push("\nendobj\n");
  };

  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  const pageIds = pages.map((_, i) => 4 + i * 2);
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  // Helvetica is object 3 (F1); other base fonts follow the pages (F2, F3, ...).
  const fonts = ["Helvetica", ...new Set(pages.flat().map((l) => l.font ?? "Helvetica").filter((f) => f !== "Helvetica"))];
  const fontId = (i: number) => (i === 0 ? 3 : 3 + pages.length * 2 + i);
  const fontResources = fonts.map((_, i) => `/F${i + 1} ${fontId(i)} 0 R`).join(" ");
  const fontObject = (name: string) => `<< /Type /Font /Subtype /Type1 /BaseFont /${name} /Encoding /WinAnsiEncoding >>`;
  object(3, fontObject("Helvetica"));
  pages.forEach((lines, i) => {
    const pageId = pageIds[i];
    const content = lines
      .map(
        (l) =>
          `BT /F${fonts.indexOf(l.font ?? "Helvetica") + 1} ${l.size ?? 11} Tf ${l.x} ${l.y} Td (${escapePdfText(l.text)}) Tj ET`,
      )
      .join("\n");
    object(
      pageId,
      brokenPages.includes(i + 1)
        ? "42"
        : `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << ${fontResources} >> >> /Contents ${pageId + 1} 0 R >>`,
    );
    object(pageId + 1, `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`);
  });
  for (let i = 1; i < fonts.length; i++) object(fontId(i), fontObject(fonts[i]));
  let lastId = 3 + pages.length * 2 + fonts.length - 1;
  if (paddingBytes > 0) {
    lastId++;
    object(lastId, [
      Buffer.from(`<< /Length ${paddingBytes} >>\nstream\n`, "latin1"),
      Buffer.alloc(paddingBytes, 0x20),
      Buffer.from("\nendstream", "latin1"),
    ]);
  }

  const xrefOffset = length;
  push(`xref\n0 ${lastId + 1}\n0000000000 65535 f \n`);
  for (let id = 1; id <= lastId; id++) {
    push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }
  push(`trailer\n<< /Size ${lastId + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);
  return new Uint8Array(Buffer.concat(chunks));
}
