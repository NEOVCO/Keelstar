export const POLICY_WORKFLOW_TYPE = "policy_acknowledgement";
export const POLICY_DOCUMENT_TYPE = "policy";
export const POLICY_MAGIC_LINK_PURPOSE = "policy_acknowledgement";
export const POLICY_ENTITLEMENT = "policy_acknowledgement";

export const POLICY_REQUEST_STATUSES = [
  "draft",
  "sent",
  "opened",
  "submitted",
  "completed",
  "overdue",
  "cancelled",
] as const;

export const ACTIVE_POLICY_STATUSES = ["draft", "sent", "opened", "overdue"] as const;

export const TERMINAL_POLICY_STATUSES = ["completed", "cancelled"] as const;

export const POLICY_ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const POLICY_MAX_FILE_SIZE = 25 * 1024 * 1024;
export const POLICY_DEFAULT_DUE_DAYS = 14;
export const POLICY_MAGIC_LINK_EXPIRY_DAYS = 30;

export const POLICY_FIELD_KEYS = [
  "policy_title",
  "policy_version",
  "acknowledged_name",
  "acknowledged_at",
] as const;

export function defaultPolicyDueDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + POLICY_DEFAULT_DUE_DAYS);
  d.setHours(23, 59, 59, 999);
  return d;
}
