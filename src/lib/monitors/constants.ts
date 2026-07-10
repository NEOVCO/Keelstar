export const GENERIC_MONITOR_TYPES = [
  {
    value: "document_expiration",
    label: "Document expiration",
    description: "Alert before a document or certificate expires",
  },
  {
    value: "workflow_due_date",
    label: "Workflow due date",
    description: "Remind when a workflow due date approaches",
  },
  {
    value: "custom_reminder",
    label: "Custom reminder",
    description: "Recurring reminder on a fixed interval",
  },
] as const;

export const DEFAULT_MONITOR_INTERVAL_DAYS = 7;
