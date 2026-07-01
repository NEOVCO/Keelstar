export const COI_WORKFLOW_TYPE = "coi_tracking";
export const COI_DOCUMENT_TYPE = "coi";
export const COI_MAGIC_LINK_PURPOSE = "coi_upload";
export const COI_MONITOR_TYPE = "coi_expiration";
export const COI_ENTITLEMENT = "coi_tracker";

export const COI_REQUEST_STATUSES = [
  "draft",
  "sent",
  "opened",
  "submitted",
  "review_needed",
  "approved",
  "rejected",
  "needs_correction",
  "active_monitoring",
  "expiring_soon",
  "expired",
  "cancelled",
  "overdue",
] as const;

export const ACTIVE_COI_STATUSES = [
  "draft",
  "sent",
  "opened",
  "submitted",
  "review_needed",
  "needs_correction",
  "overdue",
] as const;

export const MONITORED_COI_STATUSES = [
  "active_monitoring",
  "expiring_soon",
  "expired",
] as const;

export const COI_ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const;

export const COI_MAX_FILE_SIZE = 10 * 1024 * 1024;
export const COI_DEFAULT_DUE_DAYS = 14;
export const COI_MAGIC_LINK_EXPIRY_DAYS = 14;
export const COI_EXPIRING_SOON_DAYS = 30;

export const COI_POLICY_TYPES = [
  "general_liability",
  "workers_compensation",
  "auto_liability",
  "professional_liability",
  "umbrella_excess",
  "other",
] as const;

export type CoiPolicyType = (typeof COI_POLICY_TYPES)[number];

export const COI_REQUIRED_FIELDS = [
  "insured_name",
  "policy_type",
  "expiration_date",
] as const;

export const COI_FIELD_KEYS = [
  "insured_name",
  "certificate_holder",
  "insurance_carrier",
  "policy_number",
  "policy_type",
  "effective_date",
  "expiration_date",
  "coverage_limit",
  "notes",
  "additional_insured",
  "waiver_of_subrogation",
  "aggregate_limit",
  "per_occurrence_limit",
] as const;

export const COI_EXPIRATION_REMINDER_WINDOWS = [
  { window: "exp_30d", daysBefore: 30, type: "coi_expiration_internal" },
  { window: "exp_14d", daysBefore: 14, type: "coi_expiration_internal" },
  { window: "exp_7d", daysBefore: 7, type: "coi_expiration_internal" },
  { window: "exp_0d", daysBefore: 0, type: "coi_expiration_internal" },
  { window: "exp_post_7d", daysBefore: -7, type: "coi_expiration_internal" },
] as const;

export function defaultCoiDueDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + COI_DEFAULT_DUE_DAYS);
  d.setHours(23, 59, 59, 999);
  return d;
}
