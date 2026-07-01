export const EXCLUSION_WORKFLOW_TYPE = "exclusion_screening";
export const EXCLUSION_MONITOR_TYPE = "exclusion_monitoring";
export const EXCLUSION_ENTITLEMENT = "exclusion_monitor";

export const EXCLUSION_SOURCES = ["oig", "sam"] as const;
export type ExclusionSource = (typeof EXCLUSION_SOURCES)[number];

export const SUBJECT_TYPES = [
  "vendor",
  "person",
  "organization",
  "contractor",
  "employee",
  "other",
] as const;

export const SUBJECT_STATUSES = [
  "active",
  "inactive",
  "archived",
  "monitoring",
  "review_needed",
  "matched",
  "cleared",
] as const;

export const RUN_TYPES = ["ad_hoc", "scheduled", "manual_rerun"] as const;

export const RUN_STATUSES = ["pending", "running", "completed", "failed", "cancelled"] as const;

export const RESULT_STATUSES = [
  "no_match",
  "potential_match",
  "confirmed_match",
  "failed",
  "not_configured",
] as const;

export const REVIEW_STATUSES = [
  "not_required",
  "review_needed",
  "cleared",
  "confirmed",
  "false_positive",
] as const;

export const EXCLUSION_MONITOR_INTERVAL_DAYS = 30;

/** Official HHS OIG LEIE full database — updated monthly, no API key required */
export const OIG_LEIE_CSV_URL = "https://oig.hhs.gov/exclusions/downloadables/UPDATED.csv";
export const OIG_LEIE_DOWNLOAD_PAGE =
  "https://oig.hhs.gov/exclusions/leie-database-supplement-downloads/";
export const OIG_LEIE_ONLINE_SEARCH_URL = "https://exclusions.oig.hhs.gov/";

export function getOigDataSourceUrl(): string {
  return process.env.OIG_DATA_SOURCE_URL?.trim() || OIG_LEIE_CSV_URL;
}

export function getExclusionDataMode(): "live" | "demo" {
  const mode = process.env.EXCLUSION_DATA_MODE?.toLowerCase();
  if (mode === "demo") return "demo";
  return "live";
}

export function isSamConfigured(): boolean {
  return Boolean(process.env.SAM_API_KEY?.trim());
}
