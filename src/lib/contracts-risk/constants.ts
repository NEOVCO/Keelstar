export const CONTRACT_RISK_WORKFLOW_TYPE = "contract_risk_scan";
export const CONTRACT_RISK_DOCUMENT_TYPE = "contract_risk";
export const CONTRACT_RISK_ENTITLEMENT = "contract_risk_scanner";

export const CONTRACT_RISK_STATUSES = [
  "draft",
  "uploaded",
  "processing",
  "review_needed",
  "approved",
  "rejected",
  "cancelled",
] as const;

export const ACTIVE_CONTRACT_RISK_STATUSES = [
  "draft",
  "uploaded",
  "processing",
  "review_needed",
] as const;

export const TERMINAL_CONTRACT_RISK_STATUSES = ["approved", "rejected", "cancelled"] as const;

export const CONTRACT_RISK_ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const CONTRACT_RISK_MAX_FILE_SIZE = 25 * 1024 * 1024;
export const CONTRACT_RISK_MAX_TEXT_CHARS = 12_000;
export const CONTRACT_RISK_OPENAI_MODEL = "gpt-4o-mini";
export const CONTRACT_RISK_OPENAI_MAX_TOKENS = 900;

export const RISK_CATEGORIES = [
  "auto_renewal",
  "termination",
  "indemnification",
  "liability_cap",
  "assignment",
  "governing_law",
  "payment_terms",
  "other",
] as const;

export type RiskCategory = (typeof RISK_CATEGORIES)[number];
export type RiskSeverity = "low" | "medium" | "high";

export type RiskFlag = {
  category: RiskCategory | string;
  severity: RiskSeverity;
  excerpt: string;
  recommendation: string;
  source: "ai" | "regex";
};
