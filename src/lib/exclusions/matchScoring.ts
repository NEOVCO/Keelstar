export function normalizeName(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function namesMatch(a: string, b: string): boolean {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return false;
  return na === nb;
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
