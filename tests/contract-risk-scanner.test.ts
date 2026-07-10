import { describe, expect, it } from "vitest";
import { createRiskScanSchema } from "@/lib/contracts-risk/createScan";
import {
  CONTRACT_RISK_WORKFLOW_TYPE,
  CONTRACT_RISK_ENTITLEMENT,
  CONTRACT_RISK_OPENAI_MODEL,
} from "@/lib/contracts-risk/constants";
import { scanWithHeuristics } from "@/lib/contracts-risk/riskPatterns";
import { isOpenAiConfigured } from "@/lib/contracts-risk/openaiScan";

describe("contract risk scanner module", () => {
  it("exports stable workflow constants", () => {
    expect(CONTRACT_RISK_WORKFLOW_TYPE).toBe("contract_risk_scan");
    expect(CONTRACT_RISK_ENTITLEMENT).toBe("contract_risk_scanner");
    expect(CONTRACT_RISK_OPENAI_MODEL).toBe("gpt-4o-mini");
  });

  it("validates create scan input", () => {
    const parsed = createRiskScanSchema.parse({
      contractName: "Master Services Agreement",
      counterparty: "Acme Corp",
    });
    expect(parsed.contractName).toBe("Master Services Agreement");
  });

  it("detects heuristic risk patterns", () => {
    const text =
      "This agreement shall automatically renew unless either party provides written notice of termination for convenience at least 30 days prior. Party A shall indemnify Party B without limitation of liability.";
    const flags = scanWithHeuristics(text);
    expect(flags.length).toBeGreaterThan(0);
    expect(flags.some((f) => f.category === "auto_renewal")).toBe(true);
  });

  it("reports OpenAI configured when env key present", () => {
    const original = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = "test-key";
    expect(isOpenAiConfigured()).toBe(true);
    process.env.OPENAI_API_KEY = original;
  });
});
