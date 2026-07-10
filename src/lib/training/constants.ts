export const TRAINING_WORKFLOW_TYPE = "training_record";
export const TRAINING_DOCUMENT_TYPE = "training_certificate";
export const TRAINING_MONITOR_TYPE = "training_expiration";
export const TRAINING_ENTITLEMENT = "training_record";

export const TRAINING_STATUSES = [
  "draft",
  "review_needed",
  "active_monitoring",
  "expiring_soon",
  "expired",
  "renewed",
  "cancelled",
  "completed",
] as const;

export const ACTIVE_TRAINING_STATUSES = ["draft", "review_needed"] as const;

export const MONITORED_TRAINING_STATUSES = [
  "active_monitoring",
  "expiring_soon",
  "expired",
] as const;

export const TERMINAL_TRAINING_STATUSES = ["renewed", "cancelled", "completed"] as const;

export const TRAINING_ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const TRAINING_MAX_FILE_SIZE = 25 * 1024 * 1024;
export const TRAINING_EXPIRING_SOON_DAYS = 30;

export const TRAINING_REQUIRED_FIELDS = [
  "course_name",
  "completion_date",
  "expiration_date",
] as const;

export const TRAINING_FIELD_KEYS = [
  "course_name",
  "provider",
  "certification_number",
  "completion_date",
  "expiration_date",
  "notes",
] as const;

export const TRAINING_EXPIRATION_REMINDER_WINDOWS = [
  { window: "exp_30d", daysBefore: 30, type: "training_expiration_internal" },
  { window: "exp_14d", daysBefore: 14, type: "training_expiration_internal" },
  { window: "exp_7d", daysBefore: 7, type: "training_expiration_internal" },
  { window: "exp_0d", daysBefore: 0, type: "training_expiration_internal" },
] as const;
