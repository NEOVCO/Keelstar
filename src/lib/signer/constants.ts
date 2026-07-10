export const SIGNER_WORKFLOW_TYPE = "simple_signer";
export const SIGNER_DOCUMENT_TYPE = "signature_request";
export const SIGNER_MAGIC_LINK_PURPOSE = "document_signature";
export const SIGNER_ENTITLEMENT = "simple_signer";

export const SIGNER_STATUSES = [
  "draft",
  "sent",
  "opened",
  "completed",
  "overdue",
  "cancelled",
] as const;

export const ACTIVE_SIGNER_STATUSES = ["draft", "sent", "opened", "overdue"] as const;

export const TERMINAL_SIGNER_STATUSES = ["completed", "cancelled"] as const;

export const SIGNER_ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const;

export const SIGNER_MAX_FILE_SIZE = 25 * 1024 * 1024;
export const SIGNER_DEFAULT_DUE_DAYS = 7;
export const SIGNER_MAGIC_LINK_EXPIRY_DAYS = 30;

export const SIGNER_FIELD_KEYS = [
  "document_title",
  "signed_name",
  "signed_at",
  "signer_email",
] as const;

export const SIGNER_REMINDER_WINDOWS = [
  { window: "before_3d", daysOffset: -3, type: "signer_reminder" },
  { window: "on_due", daysOffset: 0, type: "signer_reminder" },
  { window: "after_3d", daysOffset: 3, type: "signer_overdue" },
] as const;

export function defaultSignerDueDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + SIGNER_DEFAULT_DUE_DAYS);
  d.setHours(23, 59, 59, 999);
  return d;
}
