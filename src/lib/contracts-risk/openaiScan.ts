import {
  CONTRACT_RISK_MAX_TEXT_CHARS,
  CONTRACT_RISK_OPENAI_MAX_TOKENS,
  CONTRACT_RISK_OPENAI_MODEL,
  RISK_CATEGORIES,
  type RiskFlag,
} from "./constants";

type OpenAiResponse = {
  flags?: Array<{
    category?: string;
    severity?: string;
    excerpt?: string;
    recommendation?: string;
  }>;
  summary?: string;
};

function normalizeSeverity(value: string | undefined): RiskFlag["severity"] {
  if (value === "high" || value === "medium" || value === "low") return value;
  return "medium";
}

function normalizeCategory(value: string | undefined): string {
  if (!value) return "other";
  const normalized = value.toLowerCase().replace(/\s+/g, "_");
  return (RISK_CATEGORIES as readonly string[]).includes(normalized) ? normalized : "other";
}

export async function scanWithOpenAi(text: string): Promise<{ flags: RiskFlag[]; summary: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const excerpt = text.slice(0, CONTRACT_RISK_MAX_TEXT_CHARS);

  const systemPrompt =
    "You review commercial contracts for operational risk flags. Return JSON only. " +
    "Flag clauses that carry commercial risk — not legal advice. " +
    `Categories: ${RISK_CATEGORIES.join(", ")}. ` +
    "Severity: low, medium, or high. Max 8 flags. Keep excerpts under 200 chars.";

  const userPrompt = `Review this contract excerpt and return JSON:
{
  "summary": "one sentence overall risk read",
  "flags": [{ "category": "...", "severity": "low|medium|high", "excerpt": "...", "recommendation": "..." }]
}

Contract text:
${excerpt}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CONTRACT_RISK_OPENAI_MODEL,
      max_tokens: CONTRACT_RISK_OPENAI_MAX_TOKENS,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI scan failed: ${res.status} ${errText.slice(0, 200)}`);
  }

  const payload = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned empty response");

  const parsed = JSON.parse(content) as OpenAiResponse;
  const flags: RiskFlag[] = (parsed.flags ?? [])
    .slice(0, 8)
    .map((f) => ({
      category: normalizeCategory(f.category),
      severity: normalizeSeverity(f.severity),
      excerpt: (f.excerpt ?? "").slice(0, 300),
      recommendation: (f.recommendation ?? "Review with counsel if unsure.").slice(0, 500),
      source: "ai" as const,
    }))
    .filter((f) => f.excerpt.length > 0);

  return {
    flags,
    summary: (parsed.summary ?? "Contract risk scan complete.").slice(0, 500),
  };
}

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}
