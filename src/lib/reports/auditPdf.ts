import PDFDocument from "pdfkit";
import type PDFKit from "pdfkit";
import {
  type AuditLogEntry,
  fetchAuditLogEntries,
  fetchOrganizationName,
  formatActor,
  formatAuditTimestamp,
  humanizeAction,
  shortenId,
} from "./auditData";

const COLORS = {
  accent: "#1f3a5f",
  ink: "#15171a",
  text: "#1a1c1e",
  muted: "#5b6068",
  border: "#e8e4dc",
  stripe: "#f5f3ef",
  white: "#ffffff",
};

const MARGIN = 48;
const ROW_HEIGHT = 26;
const HEADER_ROW_HEIGHT = 30;
const FOOTER_HEIGHT = 32;

type Column = { key: string; label: string; width: number; align?: "left" | "right" };

function pageContentWidth(doc: PDFKit.PDFDocument): number {
  return doc.page.width - MARGIN * 2;
}

function columnsForWidth(width: number): Column[] {
  return [
    { key: "time", label: "Timestamp", width: width * 0.2 },
    { key: "action", label: "Action", width: width * 0.28 },
    { key: "actor", label: "Actor", width: width * 0.22 },
    { key: "object", label: "Object", width: width * 0.14 },
    { key: "id", label: "Reference", width: width * 0.16 },
  ];
}

function drawCoverPage(
  doc: PDFKit.PDFDocument,
  input: {
    organizationName: string;
    generatedAt: string;
    entryCount: number;
    periodLabel: string;
  }
) {
  const { organizationName, generatedAt, entryCount, periodLabel } = input;
  const contentWidth = pageContentWidth(doc);

  doc.rect(MARGIN, MARGIN, contentWidth, 4).fill(COLORS.accent);

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLORS.accent)
    .text("KEELSTAR", MARGIN, MARGIN + 20);

  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor(COLORS.ink)
    .text("Audit Trail Export", MARGIN, MARGIN + 52);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(COLORS.muted)
    .text(
      "Immutable record of actions performed in your workspace. Suitable for compliance reviews and internal audits.",
      MARGIN,
      MARGIN + 92,
      { width: contentWidth, lineGap: 4 }
    );

  const metaY = MARGIN + 148;
  const metaRows: [string, string][] = [
    ["Organization", organizationName],
    ["Generated", generatedAt],
    ["Total events", String(entryCount)],
    ["Period covered", periodLabel],
  ];

  metaRows.forEach(([label, value], i) => {
    const y = metaY + i * 28;
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(label.toUpperCase(), MARGIN, y, { width: 120 });
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLORS.text)
      .text(value, MARGIN + 130, y - 1, { width: contentWidth - 130 });
  });

  doc
    .moveTo(MARGIN, metaY + metaRows.length * 28 + 16)
    .lineTo(MARGIN + contentWidth, metaY + metaRows.length * 28 + 16)
    .strokeColor(COLORS.border)
    .lineWidth(1)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      "This export was generated from Keelstar audit logs. Entries are listed newest first. " +
        "Retain this document according to your organization's records policy.",
      MARGIN,
      metaY + metaRows.length * 28 + 32,
      { width: contentWidth, lineGap: 3 }
    );
}

function drawTableHeader(doc: PDFKit.PDFDocument, y: number, columns: Column[]): number {
  const tableWidth = columns.reduce((s, c) => s + c.width, 0);
  doc.rect(MARGIN, y, tableWidth, HEADER_ROW_HEIGHT).fill(COLORS.accent);

  let x = MARGIN;
  for (const col of columns) {
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(COLORS.white)
      .text(col.label.toUpperCase(), x + 8, y + 10, { width: col.width - 12 });
    x += col.width;
  }

  return y + HEADER_ROW_HEIGHT;
}

function drawTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  columns: Column[],
  cells: string[],
  stripe: boolean
): number {
  const tableWidth = columns.reduce((s, c) => s + c.width, 0);

  if (stripe) {
    doc.rect(MARGIN, y, tableWidth, ROW_HEIGHT).fill(COLORS.stripe);
  }

  let x = MARGIN;
  columns.forEach((col, i) => {
    const isMono = col.key === "id";
    doc
      .font(isMono ? "Courier" : "Helvetica")
      .fontSize(isMono ? 7.5 : 8.5)
      .fillColor(COLORS.text)
      .text(cells[i] ?? "—", x + 8, y + 8, {
        width: col.width - 12,
        height: ROW_HEIGHT - 6,
        ellipsis: true,
        lineBreak: false,
      });
    x += col.width;
  });

  doc
    .moveTo(MARGIN, y + ROW_HEIGHT)
    .lineTo(MARGIN + tableWidth, y + ROW_HEIGHT)
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .stroke();

  return y + ROW_HEIGHT;
}

function drawPageFooter(doc: PDFKit.PDFDocument, pageIndex: number, pageCount: number) {
  const y = doc.page.height - MARGIN + 8;
  const contentWidth = pageContentWidth(doc);

  doc
    .moveTo(MARGIN, y - 10)
    .lineTo(MARGIN + contentWidth, y - 10)
    .strokeColor(COLORS.border)
    .lineWidth(0.5)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text("Keelstar · Confidential", MARGIN, y);

  doc.text(`Page ${pageIndex} of ${pageCount}`, MARGIN, y, {
    width: contentWidth,
    align: "right",
  });
}

function periodLabel(entries: AuditLogEntry[]): string {
  if (!entries.length) return "No events";
  const oldest = entries[entries.length - 1]!.created_at;
  const newest = entries[0]!.created_at;
  if (oldest === newest) return formatAuditTimestamp(newest);
  return `${formatAuditTimestamp(oldest)} – ${formatAuditTimestamp(newest)}`;
}

function rowCells(entry: AuditLogEntry): string[] {
  return [
    formatAuditTimestamp(entry.created_at),
    humanizeAction(entry.action),
    formatActor(entry),
    entry.target_type?.replace(/_/g, " ") ?? "—",
    shortenId(entry.target_id),
  ];
}

export async function buildAuditExportPdf(
  organizationId: string,
  options?: { from?: string; to?: string }
): Promise<Buffer> {
  const [entries, organizationName] = await Promise.all([
    fetchAuditLogEntries(organizationId, options),
    fetchOrganizationName(organizationId),
  ]);

  const generatedAt = formatAuditTimestamp(new Date().toISOString());

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      layout: "landscape",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      bufferPages: true,
      info: {
        Title: `Audit Trail — ${organizationName}`,
        Author: "Keelstar",
        Subject: "Workspace audit log export",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawCoverPage(doc, {
      organizationName,
      generatedAt,
      entryCount: entries.length,
      periodLabel: periodLabel(entries),
    });

    if (entries.length > 0) {
      doc.addPage({ layout: "landscape" });

      const contentWidth = pageContentWidth(doc);
      const columns = columnsForWidth(contentWidth);
      const bottomLimit = doc.page.height - MARGIN - FOOTER_HEIGHT;

      let y = MARGIN;

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(COLORS.ink)
        .text("Event log", MARGIN, y);
      y += 28;

      y = drawTableHeader(doc, y, columns);

      for (let i = 0; i < entries.length; i++) {
        if (y + ROW_HEIGHT > bottomLimit) {
          doc.addPage({ layout: "landscape" });
          y = MARGIN;
          y = drawTableHeader(doc, y, columns);
        }
        y = drawTableRow(doc, y, columns, rowCells(entries[i]!), i % 2 === 1);
      }
    }

    const range = doc.bufferedPageRange();
    const pageCount = range.count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      drawPageFooter(doc, i + 1, pageCount);
    }

    doc.end();
  });
}
