import type { ParsedField } from "./extraction";

const TIN_REGEX = /\b(\d{2}-\d{7}|\d{3}-\d{2}-\d{4})\b/g;
const DATE_REGEX =
  /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})\b/gi;
const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_REGEX = /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const CURRENCY_REGEX = /\$\s?[\d,]+(?:\.\d{2})?/g;
const POLICY_REGEX = /(?:policy|certificate|cert\.?)\s*(?:#|no\.?|number)?\s*:?\s*([A-Z0-9][\w\-\/]{4,})/gi;

function firstMatch(text: string, regex: RegExp): string | null {
  const m = text.match(regex);
  return m?.[0] ?? null;
}

function uniqueMatches(text: string, regex: RegExp, limit = 3): string[] {
  const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
  const re = new RegExp(regex.source, flags);
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null && out.length < limit) {
    const v = m[1] ?? m[0];
    if (!out.includes(v)) out.push(v);
  }
  return out;
}

export function extractFieldsFromText(
  text: string,
  documentType?: string | null
): ParsedField[] {
  const fields: ParsedField[] = [];
  const normalized = text.trim();
  if (!normalized) return fields;

  const tin = firstMatch(normalized, TIN_REGEX);
  if (tin) {
    fields.push({
      fieldKey: documentType === "w9" ? "tax_id" : "tin",
      fieldValue: tin,
      fieldType: "text",
      confidence: 0.82,
      extractionSource: "regex",
    });
  }

  const dates = uniqueMatches(normalized, DATE_REGEX, 5);
  dates.forEach((d, i) => {
    const key =
      documentType === "coi" && i === 0
        ? "expiration_date"
        : documentType === "contract" && i === 0
          ? "effective_date"
          : i === 0
            ? "date"
            : `date_${i + 1}`;
    fields.push({
      fieldKey: key,
      fieldValue: d,
      fieldType: "date",
      confidence: 0.7,
      extractionSource: "regex",
    });
  });

  const email = firstMatch(normalized, EMAIL_REGEX);
  if (email) {
    fields.push({
      fieldKey: "email",
      fieldValue: email,
      fieldType: "text",
      confidence: 0.88,
      extractionSource: "regex",
    });
  }

  const phone = firstMatch(normalized, PHONE_REGEX);
  if (phone) {
    fields.push({
      fieldKey: "phone",
      fieldValue: phone,
      fieldType: "text",
      confidence: 0.75,
      extractionSource: "regex",
    });
  }

  const amounts = uniqueMatches(normalized, CURRENCY_REGEX, 2);
  amounts.forEach((a, i) => {
    fields.push({
      fieldKey: i === 0 ? "amount" : `amount_${i + 1}`,
      fieldValue: a.replace(/^\$/, ""),
      fieldType: "currency",
      confidence: 0.65,
      extractionSource: "regex",
    });
  });

  const policies = uniqueMatches(normalized, POLICY_REGEX, 2);
  policies.forEach((p, i) => {
    fields.push({
      fieldKey: i === 0 ? "policy_number" : `policy_number_${i + 1}`,
      fieldValue: p,
      fieldType: "text",
      confidence: 0.72,
      extractionSource: "regex",
    });
  });

  if (documentType === "coi") {
    const carrierMatch = normalized.match(
      /(?:insurer|carrier|company)\s*:?\s*([A-Z][A-Za-z0-9\s&.,'-]{2,40})/i
    );
    if (carrierMatch?.[1]) {
      fields.push({
        fieldKey: "carrier",
        fieldValue: carrierMatch[1].trim(),
        fieldType: "text",
        confidence: 0.68,
        extractionSource: "regex",
      });
    }
  }

  if (documentType === "w9") {
    const nameMatch = normalized.match(/(?:name|payee)\s*:?\s*([A-Z][A-Za-z0-9\s.'-]{2,60})/i);
    if (nameMatch?.[1]) {
      fields.push({
        fieldKey: "legal_name",
        fieldValue: nameMatch[1].trim().slice(0, 80),
        fieldType: "text",
        confidence: 0.6,
        extractionSource: "regex",
      });
    }
  }

  return fields;
}
