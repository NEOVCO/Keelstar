export const INVOICE_WORKFLOW_TYPE = "invoice_approval";
export const INVOICE_DOCUMENT_TYPE = "invoice";
export const INVOICE_ENTITLEMENT = "invoice_approval";

export const INVOICE_STATUSES = [
  "draft",
  "review_needed",
  "submitted",
  "approved",
  "rejected",
  "overdue",
  "cancelled",
] as const;

export const ACTIVE_INVOICE_STATUSES = ["draft", "review_needed", "submitted", "overdue"] as const;

export const TERMINAL_INVOICE_STATUSES = ["approved", "rejected", "cancelled"] as const;

export const INVOICE_ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
] as const;

export const INVOICE_MAX_FILE_SIZE = 25 * 1024 * 1024;
export const INVOICE_DEFAULT_APPROVAL_DAYS = 7;

export const INVOICE_REQUIRED_FIELDS = [
  "vendor_name",
  "invoice_amount",
  "due_date",
] as const;

export const INVOICE_FIELD_KEYS = [
  "vendor_name",
  "invoice_number",
  "invoice_amount",
  "due_date",
  "notes",
] as const;

export const INVOICE_APPROVAL_REMINDER_WINDOWS = [
  { window: "on_due", daysOffset: 0, type: "invoice_reminder" },
  { window: "after_3d", daysOffset: 3, type: "invoice_overdue" },
  { window: "after_7d", daysOffset: 7, type: "invoice_overdue" },
] as const;

export function defaultInvoiceApprovalDueDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + INVOICE_DEFAULT_APPROVAL_DAYS);
  d.setHours(23, 59, 59, 999);
  return d;
}
