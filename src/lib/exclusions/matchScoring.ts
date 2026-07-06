export function normalizeName(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const next = Math.min(row[j] + 1, prev + 1, row[j - 1] + cost);
      row[j - 1] = prev;
      prev = next;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

export function cleanLeieNamePart(value: string): string {
  const normalized = normalizeName(value);
  return normalized === "NULL" ? "" : normalized;
}

/** Split a display name into first + last tokens when possible. */
export function splitPersonName(value: string): { first: string; last: string } | null {
  const parts = normalizeName(value).split(" ").filter(Boolean);
  if (parts.length < 2) return null;
  return { first: parts[0], last: parts[parts.length - 1] };
}

export function namesMatch(a: string, b: string): boolean {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return false;
  return na === nb;
}

/**
 * Person-name match: exact, reversed order, or same last name with ≤1 typo in first name.
 */
export function namesMatchFlexible(a: string, b: string): boolean {
  if (namesMatch(a, b)) return true;

  const left = splitPersonName(a);
  const right = splitPersonName(b);
  if (!left || !right) return false;

  const pairs: Array<[string, string, string, string]> = [
    [left.first, right.first, left.last, right.last],
    [left.first, right.last, left.last, right.first],
  ];

  for (const [aFirst, bFirst, aLast, bLast] of pairs) {
    if (aLast !== bLast) continue;
    if (aFirst === bFirst) return true;
    if (levenshtein(aFirst, bFirst) <= 1) return true;
  }

  return false;
}

export function formatLeieDate(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8 || digits === "00000000") return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export function isValidLeieNpi(npi: string | null | undefined): boolean {
  if (!npi) return false;
  const trimmed = npi.trim();
  return trimmed.length > 0 && trimmed !== "0000000000";
}
