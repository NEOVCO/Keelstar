export const OPERATIONAL_WORKFLOW_TYPE = "operational_workflow";

export const GENERIC_WORKFLOW_STATUSES = [
  "draft",
  "active",
  "completed",
  "cancelled",
] as const;

export const DEFAULT_WORKFLOW_STEPS = [
  { step_order: 1, name: "Collect", step_type: "collect" as const },
  { step_order: 2, name: "Review", step_type: "review" as const },
  { step_order: 3, name: "Complete", step_type: "approve" as const },
];
