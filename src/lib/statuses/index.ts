export type StatusCategory = "default" | "success" | "warning" | "error" | "accent";

export type WorkflowStatus =
  | "draft"
  | "waiting_on_internal"
  | "waiting_on_external"
  | "in_review"
  | "active_monitoring"
  | "completed"
  | "cancelled"
  | "overdue"
  | "failed";

export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "parsed"
  | "review_needed"
  | "approved"
  | "rejected"
  | "expired"
  | "archived";

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "waiting"
  | "completed"
  | "overdue"
  | "cancelled";

export type MonitorStatus = "active" | "paused" | "completed" | "failed";

const workflowLabels: Record<WorkflowStatus, string> = {
  draft: "Draft",
  waiting_on_internal: "Waiting on team",
  waiting_on_external: "Waiting on vendor",
  in_review: "Needs review",
  active_monitoring: "Monitoring",
  completed: "Completed",
  cancelled: "Cancelled",
  overdue: "Overdue",
  failed: "Failed",
};

const documentLabels: Record<DocumentStatus, string> = {
  uploaded: "Uploaded",
  processing: "Processing",
  parsed: "Parsed",
  review_needed: "Needs review",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
  archived: "Archived",
};

const taskLabels: Record<TaskStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  waiting: "Waiting",
  completed: "Completed",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

const monitorLabels: Record<MonitorStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  failed: "Failed",
};

const variantMap: Record<string, StatusCategory> = {
  draft: "default",
  waiting_on_internal: "accent",
  waiting_on_external: "accent",
  in_review: "warning",
  active_monitoring: "success",
  completed: "success",
  cancelled: "default",
  overdue: "error",
  failed: "error",
  uploaded: "default",
  processing: "warning",
  parsed: "accent",
  in_progress: "accent",
  review_needed: "warning",
  approved: "success",
  rejected: "error",
  expired: "error",
  archived: "default",
  not_started: "default",
  in_progress: "accent",
  waiting: "accent",
  active: "success",
  paused: "default",
  sent: "accent",
  submitted: "warning",
  opened: "accent",
  needs_correction: "warning",
  pending: "warning",
  uploaded: "default",
  metadata_needed: "warning",
  renewal_monitoring: "success",
  active_monitoring: "success",
  notice_window_open: "warning",
  renewal_approaching: "warning",
  expiring_soon: "warning",
  auto_renew_risk: "error",
  renewed: "success",
  terminated: "default",
};

/** Map module-specific statuses to shared workflow categories */
export const moduleToWorkflowStatus: Record<string, WorkflowStatus> = {
  draft: "draft",
  sent: "waiting_on_external",
  opened: "waiting_on_external",
  submitted: "in_review",
  review_needed: "in_review",
  approved: "active_monitoring",
  rejected: "in_review",
  needs_correction: "waiting_on_external",
  completed: "completed",
  cancelled: "cancelled",
  overdue: "overdue",
  failed: "failed",
  active: "active_monitoring",
};

export function getStatusLabel(status: string): string {
  return (
    workflowLabels[status as WorkflowStatus] ??
    documentLabels[status as DocumentStatus] ??
    taskLabels[status as TaskStatus] ??
    monitorLabels[status as MonitorStatus] ??
    status.replace(/_/g, " ")
  );
}

export function getStatusVariant(status: string): StatusCategory {
  return variantMap[status] ?? "default";
}
