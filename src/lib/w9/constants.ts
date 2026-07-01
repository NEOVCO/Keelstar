export const W9_WORKFLOW_TYPE = "w9_collection";
export const W9_DOCUMENT_TYPE = "w9";
export const W9_MAGIC_LINK_PURPOSE = "w9_upload";

export const W9_REQUEST_STATUSES = [
  "draft",
  "sent",
  "opened",
  "submitted",
  "review_needed",
  "approved",
  "rejected",
  "needs_correction",
  "completed",
  "cancelled",
  "overdue",
] as const;

export const ACTIVE_W9_STATUSES = [
  "draft",
  "sent",
  "opened",
  "submitted",
  "review_needed",
  "needs_correction",
  "overdue",
] as const;

export const W9_ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const;

export const W9_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const W9_DEFAULT_DUE_DAYS = 14;
export const W9_MAGIC_LINK_EXPIRY_DAYS = 7;

export function defaultDueDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + W9_DEFAULT_DUE_DAYS);
  d.setHours(23, 59, 59, 999);
  return d;
}
