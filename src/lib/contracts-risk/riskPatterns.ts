import type { RiskFlag } from "./constants";

type PatternRule = {
  category: RiskFlag["category"];
  severity: RiskFlag["severity"];
  regex: RegExp;
  recommendation: string;
};

const RULES: PatternRule[] = [
  {
    category: "auto_renewal",
    severity: "high",
    regex: /auto(?:matic(?:ally)?)?[\s-]*renew/i,
    recommendation: "Confirm renewal notice period and opt-out deadline before signing.",
  },
  {
    category: "termination",
    severity: "medium",
    regex: /terminat(?:e|ion)\s+for\s+convenience/i,
    recommendation: "Check whether either party can exit without cause and what notice is required.",
  },
  {
    category: "indemnification",
    severity: "high",
    regex: /indemnif(?:y|ication)/i,
    recommendation: "Review scope of indemnity — is it mutual, capped, and limited to third-party claims?",
  },
  {
    category: "liability_cap",
    severity: "medium",
    regex: /limit(?:ation)?\s+of\s+liability/i,
    recommendation: "Compare liability cap to contract value and whether carve-outs apply.",
  },
  {
    category: "liability_cap",
    severity: "high",
    regex: /unlimited\s+liability/i,
    recommendation: "Unlimited liability exposure — escalate before approval.",
  },
  {
    category: "assignment",
    severity: "medium",
    regex: /assign(?:ment|able)|transfer(?:red)?\s+without\s+consent/i,
    recommendation: "Confirm whether the counterparty can assign the agreement without your consent.",
  },
  {
    category: "governing_law",
    severity: "low",
    regex: /govern(?:ing|ed)\s+by\s+the\s+laws?\s+of/i,
    recommendation: "Note the governing law jurisdiction — may affect dispute resolution.",
  },
  {
    category: "payment_terms",
    severity: "medium",
    regex: /net\s+(?:30|45|60|90)|payment\s+within\s+\d+\s+days/i,
    recommendation: "Verify payment terms align with your cash-flow expectations.",
  },
];

function excerptAround(text: string, index: number, radius = 120): string {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  const slice = text.slice(start, end).trim();
  return start > 0 ? `…${slice}` : slice;
}

export function scanWithHeuristics(text: string): RiskFlag[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const flags: RiskFlag[] = [];
  const seen = new Set<string>();

  for (const rule of RULES) {
    const match = rule.regex.exec(normalized);
    if (!match) continue;
    const key = `${rule.category}:${match[0].toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);

    flags.push({
      category: rule.category,
      severity: rule.severity,
      excerpt: excerptAround(normalized, match.index ?? 0),
      recommendation: rule.recommendation,
      source: "regex",
    });
  }

  return flags;
}
