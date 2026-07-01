export const CONTRACT_WORKFLOW_TYPE = "contract_renewal";
export const CONTRACT_DOCUMENT_TYPE = "contract";
export const CONTRACT_MONITOR_TYPE = "contract_renewal";
export const CONTRACT_ENTITLEMENT = "contract_renewal";

export const CONTRACT_RENEWAL_STATUSES = [
  "draft",
  "uploaded",
  "metadata_needed",
  "review_needed",
  "active",
  "renewal_monitoring",
  "notice_window_open",
  "renewal_approaching",
  "auto_renew_risk",
  "expired",
  "renewed",
  "terminated",
  "cancelled",
  "archived",
  "failed",
  // Legacy aliases normalized by worker
  "active_monitoring",
  "expiring_soon",
  "completed",
] as const;

export type ContractWorkflowStatus = (typeof CONTRACT_RENEWAL_STATUSES)[number];

export const ACTIVE_CONTRACT_STATUSES = [
  "draft",
  "uploaded",
  "metadata_needed",
  "review_needed",
  "active",
] as const;

export const MONITORED_CONTRACT_STATUSES = [
  "renewal_monitoring",
  "notice_window_open",
  "renewal_approaching",
  "auto_renew_risk",
  "expired",
  "active_monitoring",
  "expiring_soon",
] as const;

export const TERMINAL_CONTRACT_STATUSES = [
  "renewed",
  "terminated",
  "cancelled",
  "archived",
  "completed",
] as const;

export const CONTRACT_ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const CONTRACT_MAX_FILE_SIZE = 25 * 1024 * 1024;
export const CONTRACT_NOTICE_WINDOW_DAYS = 30;
export const CONTRACT_RENEWAL_APPROACHING_DAYS = 30;

/** @deprecated use CONTRACT_RENEWAL_APPROACHING_DAYS */
export const CONTRACT_RENEWING_SOON_DAYS = CONTRACT_RENEWAL_APPROACHING_DAYS;

export const CONTRACT_REQUIRED_FIELDS = ["contract_name", "renewal_date"] as const;

export const CONTRACT_TYPES = [
  "vendor_agreement",
  "msa",
  "sow",
  "lease",
  "subscription",
  "service_agreement",
  "nda",
  "employment",
  "insurance",
  "other",
] as const;

export const CONTRACT_FIELD_KEYS = [
  "contract_name",
  "counterparty",
  "contract_type",
  "effective_date",
  "start_date",
  "end_date",
  "renewal_date",
  "notice_period_days",
  "termination_notice_days",
  "auto_renewal",
  "renewal_term",
  "contract_value",
  "currency",
  "notes",
] as const;

export const REMINDER_WINDOW_DAYS = [90, 60, 30, 14, 7, 0] as const;

export const CONTRACT_RENEWAL_REMINDER_WINDOWS = REMINDER_WINDOW_DAYS.map((daysBefore) => ({
  window: `renew_${daysBefore}d` as const,
  daysBefore,
  type: "contract_renewal_internal" as const,
  category: "contract_renewal" as const,
}));

export const CONTRACT_NOTICE_REMINDER_WINDOWS = REMINDER_WINDOW_DAYS.map((daysBefore) => ({
  window: `notice_${daysBefore}d` as const,
  daysBefore,
  type: "contract_notice_internal" as const,
  category: "contract_notice" as const,
}));

export const CONTRACT_REMINDER_TYPES = [
  "contract_renewal_internal",
  "contract_notice_internal",
] as const;
