export interface ZipEntry {
  name: string;
  content: string;
}

const textEncoder = new TextEncoder();
const DOS_EPOCH = new Date("1980-01-01T00:00:00Z");

interface PreparedEntry {
  name: string;
  nameBytes: Uint8Array;
  contentBytes: Uint8Array;
  crc32: number;
  localHeaderOffset: number;
}

export function markdownFileNameFromPdf(fileName: string): string {
  const base = fileName.replace(/\.pdf$/i, "") || "document";
  const sanitized = base
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/\.{2,}/g, ".")
    .replace(/^[.-]+|[.-]+$/g, "");

  return `${sanitized || "document"}.md`;
}

export function uniqueZipEntryName(fileName: string, usedNames: Set<string>): string {
  const markdownName = markdownFileNameFromPdf(fileName);
  const dot = markdownName.lastIndexOf(".");
  const stem = dot === -1 ? markdownName : markdownName.slice(0, dot);
  const ext = dot === -1 ? "" : markdownName.slice(dot);
  let candidate = markdownName;
  let index = 2;

  while (usedNames.has(candidate.toLowerCase())) {
    candidate = `${stem}-${index}${ext}`;
    index += 1;
  }

  usedNames.add(candidate.toLowerCase());
  return candidate;
}

export function createMarkdownZip(entries: ZipEntry[]): Blob {
  if (entries.length === 0) {
    throw new Error("Cannot create a ZIP without entries.");
  }

  const prepared: PreparedEntry[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = textEncoder.encode(entry.name);
    const contentBytes = textEncoder.encode(entry.content);
    const crc32 = calculateCrc32(contentBytes);
    prepared.push({
      name: entry.name,
      nameBytes,
      contentBytes,
      crc32,
      localHeaderOffset: offset,
    });
    offset += 30 + nameBytes.byteLength + contentBytes.byteLength;
  }

  const centralDirectoryOffset = offset;
  for (const entry of prepared) {
    offset += 46 + entry.nameBytes.byteLength;
  }

  const zipBytes = new Uint8Array(offset + 22);
  let cursor = 0;

  for (const entry of prepared) {
    cursor = writeLocalFileHeader(zipBytes, cursor, entry);
    zipBytes.set(entry.nameBytes, cursor);
    cursor += entry.nameBytes.byteLength;
    zipBytes.set(entry.contentBytes, cursor);
    cursor += entry.contentBytes.byteLength;
  }

  for (const entry of prepared) {
    cursor = writeCentralDirectoryHeader(zipBytes, cursor, entry);
    zipBytes.set(entry.nameBytes, cursor);
    cursor += entry.nameBytes.byteLength;
  }

  writeEndOfCentralDirectory(
    zipBytes,
    cursor,
    prepared.length,
    cursor - centralDirectoryOffset,
    centralDirectoryOffset,
  );

  return new Blob([zipBytes], { type: "application/zip" });
}

function writeLocalFileHeader(bytes: Uint8Array, offset: number, entry: PreparedEntry): number {
  const view = new DataView(bytes.buffer);
  view.setUint32(offset, 0x04034b50, true);
  view.setUint16(offset + 4, 20, true);
  view.setUint16(offset + 6, 0x0800, true);
  view.setUint16(offset + 8, 0, true);
  writeDosTimestamp(view, offset + 10);
  view.setUint32(offset + 14, entry.crc32, true);
  view.setUint32(offset + 18, entry.contentBytes.byteLength, true);
  view.setUint32(offset + 22, entry.contentBytes.byteLength, true);
  view.setUint16(offset + 26, entry.nameBytes.byteLength, true);
  view.setUint16(offset + 28, 0, true);
  return offset + 30;
}

function writeCentralDirectoryHeader(bytes: Uint8Array, offset: number, entry: PreparedEntry): number {
  const view = new DataView(bytes.buffer);
  view.setUint32(offset, 0x02014b50, true);
  view.setUint16(offset + 4, 20, true);
  view.setUint16(offset + 6, 20, true);
  view.setUint16(offset + 8, 0x0800, true);
  view.setUint16(offset + 10, 0, true);
  writeDosTimestamp(view, offset + 12);
  view.setUint32(offset + 16, entry.crc32, true);
  view.setUint32(offset + 20, entry.contentBytes.byteLength, true);
  view.setUint32(offset + 24, entry.contentBytes.byteLength, true);
  view.setUint16(offset + 28, entry.nameBytes.byteLength, true);
  view.setUint16(offset + 30, 0, true);
  view.setUint16(offset + 32, 0, true);
  view.setUint16(offset + 34, 0, true);
  view.setUint16(offset + 36, 0, true);
  view.setUint32(offset + 38, 0, true);
  view.setUint32(offset + 42, entry.localHeaderOffset, true);
  return offset + 46;
}

function writeEndOfCentralDirectory(
  bytes: Uint8Array,
  offset: number,
  entryCount: number,
  centralDirectorySize: number,
  centralDirectoryOffset: number,
): void {
  const view = new DataView(bytes.buffer);
  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, entryCount, true);
  view.setUint16(offset + 10, entryCount, true);
  view.setUint32(offset + 12, centralDirectorySize, true);
  view.setUint32(offset + 16, centralDirectoryOffset, true);
  view.setUint16(offset + 20, 0, true);
}

function writeDosTimestamp(view: DataView, offset: number): void {
  const date = DOS_EPOCH;
  const dosTime =
    (date.getUTCHours() << 11) |
    (date.getUTCMinutes() << 5) |
    Math.floor(date.getUTCSeconds() / 2);
  const dosDate =
    ((date.getUTCFullYear() - 1980) << 9) |
    ((date.getUTCMonth() + 1) << 5) |
    date.getUTCDate();
  view.setUint16(offset, dosTime, true);
  view.setUint16(offset + 2, dosDate, true);
}

function calculateCrc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
