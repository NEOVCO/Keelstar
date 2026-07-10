import { createServiceClient } from "@/lib/supabase/service";

const MIN_USEFUL_TEXT_LENGTH = 40;
const OCR_IMAGE_MIME_PREFIXES = ["image/"];

export type TextExtractionSource = "pdf_text" | "plain_text" | "ocr" | "none";

export type TextExtractionResult = {
  text: string;
  source: TextExtractionSource;
};

/** Legacy regex PDF extraction (fallback). */
export function extractPdfTextLegacy(buffer: Buffer): string {
  const raw = buffer.toString("latin1");
  const parts: string[] = [];
  const parenRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
  let match: RegExpExecArray | null;
  while ((match = parenRegex.exec(raw)) !== null) {
    const t = match[1].replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\\(/g, "(").replace(/\\\)/g, ")");
    if (t.trim().length > 1) parts.push(t.trim());
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText({ partial: [1, 2, 3] });
    await parser.destroy();
    const text = (result.text ?? "").replace(/\s+/g, " ").trim();
    if (text.length >= MIN_USEFUL_TEXT_LENGTH) return text;
  } catch {
    // fall through to legacy parser
  }

  const legacy = extractPdfTextLegacy(buffer);
  if (legacy.length >= MIN_USEFUL_TEXT_LENGTH) return legacy;

  return legacy || "";
}

async function ocrImageBuffer(buffer: Buffer): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(buffer);
    return (data.text ?? "").replace(/\s+/g, " ").trim();
  } finally {
    await worker.terminate();
  }
}

function isImageMime(mimeType: string): boolean {
  return OCR_IMAGE_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix));
}

export async function downloadDocumentVersionBuffer(storagePath: string): Promise<Buffer | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from("documents").download(storagePath);
  if (error || !data) return null;
  return Buffer.from(await data.arrayBuffer());
}

export async function extractTextFromVersion(input: {
  mimeType: string;
  storagePath: string;
  filename: string;
}): Promise<TextExtractionResult> {
  const buffer = await downloadDocumentVersionBuffer(input.storagePath);
  if (!buffer) return { text: "", source: "none" };

  if (input.mimeType === "application/pdf") {
    const pdfText = await extractPdfText(buffer);
    if (pdfText.length >= MIN_USEFUL_TEXT_LENGTH) {
      return { text: pdfText.slice(0, 50_000), source: "pdf_text" };
    }

    // Scanned PDFs often have no text layer — OCR first page bytes as a last resort fails;
    // users should upload photos directly for OCR. Optional vision API hook reserved.
    if (process.env.GOOGLE_VISION_API_KEY) {
      const visionText = await ocrWithGoogleVision(buffer, input.mimeType);
      if (visionText.length >= MIN_USEFUL_TEXT_LENGTH) {
        return { text: visionText.slice(0, 50_000), source: "ocr" };
      }
    }

    return { text: pdfText.slice(0, 50_000), source: pdfText ? "pdf_text" : "none" };
  }

  if (input.mimeType === "text/csv" || input.mimeType.startsWith("text/")) {
    return { text: buffer.toString("utf8").slice(0, 50_000), source: "plain_text" };
  }

  if (isImageMime(input.mimeType)) {
    const ocrText = await ocrImageBuffer(buffer);
    return { text: ocrText.slice(0, 50_000), source: ocrText ? "ocr" : "none" };
  }

  return { text: "", source: "none" };
}

async function ocrWithGoogleVision(buffer: Buffer, mimeType: string): Promise<string> {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) return "";

  const content = buffer.toString("base64");
  const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [
        {
          image: { content },
          features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
        },
      ],
    }),
  });

  if (!response.ok) return "";

  const json = (await response.json()) as {
    responses?: Array<{ fullTextAnnotation?: { text?: string }; error?: { message?: string } }>;
  };

  const text = json.responses?.[0]?.fullTextAnnotation?.text ?? "";
  void mimeType;
  return text.replace(/\s+/g, " ").trim();
}
