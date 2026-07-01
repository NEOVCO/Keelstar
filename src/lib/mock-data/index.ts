import type {
  DocumentStatus,
  MonitorStatus,
  TaskStatus,
  WorkflowStatus,
} from "@/lib/statuses";

export type MockOwner = { id: string; name: string; initials: string };

export const MOCK_OWNERS: MockOwner[] = [
  { id: "u1", name: "Alex Morgan", initials: "AM" },
  { id: "u2", name: "Jordan Lee", initials: "JL" },
];

export type MockWorkflow = {
  id: string;
  title: string;
  module: string;
  moduleSlug: string;
  status: WorkflowStatus | string;
  owner: MockOwner;
  dueDate: string;
  externalParticipant?: string;
  updatedAt: string;
};

export type MockDocument = {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus | string;
  workflowId?: string;
  workflowTitle?: string;
  owner: MockOwner;
  uploadedAt: string;
  updatedAt: string;
};

export type MockTask = {
  id: string;
  title: string;
  status: TaskStatus | string;
  assignee: MockOwner;
  dueDate: string;
  workflowId: string;
  workflowTitle: string;
  assigneeType: "internal" | "external";
};

export type MockMonitor = {
  id: string;
  objectName: string;
  rule: string;
  status: MonitorStatus;
  nextReminder: string;
  owner: MockOwner;
  lastRun: string;
  module: string;
};

export type MockVendor = {
  id: string;
  name: string;
  email: string;
  status: "active" | "archived";
  missingDocuments: string[];
  activeWorkflows: number;
  expiringSoon: number;
  owner: MockOwner;
};

export type MockPerson = {
  id: string;
  name: string;
  email: string;
  type: "employee" | "contractor";
  pendingTasks: number;
  owner: MockOwner;
};

export type MockAuditEvent = {
  id: string;
  actor: string;
  actorType: "user" | "external" | "system";
  action: string;
  object: string;
  module: string;
  timestamp: string;
};

export type AttentionItem = {
  id: string;
  objectName: string;
  status: string;
  owner: MockOwner;
  dueDate: string;
  action: string;
  href: string;
};

export const MOCK_WORKFLOWS: MockWorkflow[] = [
  {
    id: "wf-1",
    title: "W-9 — Acme Cleaning Co.",
    module: "W-9 Collector",
    moduleSlug: "w9",
    status: "in_review",
    owner: MOCK_OWNERS[0],
    dueDate: "2026-07-05",
    externalParticipant: "billing@acmecleaning.com",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "wf-2",
    title: "COI — Summit Landscaping",
    module: "COI Tracker",
    moduleSlug: "coi",
    status: "waiting_on_external",
    owner: MOCK_OWNERS[1],
    dueDate: "2026-07-12",
    externalParticipant: "ops@summitland.com",
    updatedAt: "2026-06-27T09:10:00Z",
  },
  {
    id: "wf-3",
    title: "MSA Renewal — Northwind Supplies",
    module: "Contracts",
    moduleSlug: "contracts",
    status: "active_monitoring",
    owner: MOCK_OWNERS[0],
    dueDate: "2026-09-01",
    updatedAt: "2026-06-20T11:00:00Z",
  },
  {
    id: "wf-4",
    title: "Invoice #1042 — Brightline IT",
    module: "Invoices",
    moduleSlug: "invoices",
    status: "waiting_on_internal",
    owner: MOCK_OWNERS[1],
    dueDate: "2026-06-30",
    updatedAt: "2026-06-29T08:45:00Z",
  },
];

export const MOCK_DOCUMENTS: MockDocument[] = [
  {
    id: "doc-1",
    name: "W-9 — Acme Cleaning Co.",
    type: "W-9",
    status: "review_needed",
    workflowId: "wf-1",
    workflowTitle: "W-9 — Acme Cleaning Co.",
    owner: MOCK_OWNERS[0],
    uploadedAt: "2026-06-28T14:20:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "doc-2",
    name: "COI — Summit Landscaping",
    type: "COI",
    status: "processing",
    workflowId: "wf-2",
    workflowTitle: "COI — Summit Landscaping",
    owner: MOCK_OWNERS[1],
    uploadedAt: "2026-06-26T16:00:00Z",
    updatedAt: "2026-06-26T16:01:00Z",
  },
  {
    id: "doc-3",
    name: "MSA — Northwind Supplies",
    type: "Contract",
    status: "approved",
    workflowId: "wf-3",
    workflowTitle: "MSA Renewal — Northwind Supplies",
    owner: MOCK_OWNERS[0],
    uploadedAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-20T11:00:00Z",
  },
];

export const MOCK_TASKS: MockTask[] = [
  {
    id: "task-1",
    title: "Review W-9 submission",
    status: "in_progress",
    assignee: MOCK_OWNERS[0],
    dueDate: "2026-07-01",
    workflowId: "wf-1",
    workflowTitle: "W-9 — Acme Cleaning Co.",
    assigneeType: "internal",
  },
  {
    id: "task-2",
    title: "Approve invoice #1042",
    status: "overdue",
    assignee: MOCK_OWNERS[1],
    dueDate: "2026-06-28",
    workflowId: "wf-4",
    workflowTitle: "Invoice #1042 — Brightline IT",
    assigneeType: "internal",
  },
  {
    id: "task-3",
    title: "Upload COI certificate",
    status: "waiting",
    assignee: MOCK_OWNERS[0],
    dueDate: "2026-07-12",
    workflowId: "wf-2",
    workflowTitle: "COI — Summit Landscaping",
    assigneeType: "external",
  },
];

export const MOCK_MONITORS: MockMonitor[] = [
  {
    id: "mon-1",
    objectName: "COI — Summit Landscaping",
    rule: "Expires 30 days before policy end",
    status: "active",
    nextReminder: "2026-07-15",
    owner: MOCK_OWNERS[1],
    lastRun: "2026-06-01T12:00:00Z",
    module: "COI Tracker",
  },
  {
    id: "mon-2",
    objectName: "MSA — Northwind Supplies",
    rule: "Renewal notice 90 days before term end",
    status: "active",
    nextReminder: "2026-08-01",
    owner: MOCK_OWNERS[0],
    lastRun: "2026-06-20T11:00:00Z",
    module: "Contracts",
  },
];

export const MOCK_VENDORS: MockVendor[] = [
  {
    id: "ven-1",
    name: "Acme Cleaning Co.",
    email: "billing@acmecleaning.com",
    status: "active",
    missingDocuments: ["COI"],
    activeWorkflows: 1,
    expiringSoon: 0,
    owner: MOCK_OWNERS[0],
  },
  {
    id: "ven-2",
    name: "Summit Landscaping",
    email: "ops@summitland.com",
    status: "active",
    missingDocuments: ["W-9"],
    activeWorkflows: 2,
    expiringSoon: 1,
    owner: MOCK_OWNERS[1],
  },
  {
    id: "ven-3",
    name: "Northwind Supplies",
    email: "ap@northwind.com",
    status: "active",
    missingDocuments: [],
    activeWorkflows: 1,
    expiringSoon: 1,
    owner: MOCK_OWNERS[0],
  },
];

export const MOCK_PEOPLE: MockPerson[] = [
  {
    id: "per-1",
    name: "Sam Rivera",
    email: "sam@acmeops.com",
    type: "employee",
    pendingTasks: 1,
    owner: MOCK_OWNERS[0],
  },
  {
    id: "per-2",
    name: "Taylor Brooks",
    email: "taylor@acmeops.com",
    type: "contractor",
    pendingTasks: 0,
    owner: MOCK_OWNERS[1],
  },
];

export const MOCK_AUDIT: MockAuditEvent[] = [
  {
    id: "aud-1",
    actor: "Alex Morgan",
    actorType: "user",
    action: "W-9 submitted",
    object: "W-9 — Acme Cleaning Co.",
    module: "W-9",
    timestamp: "2026-06-28T14:20:00Z",
  },
  {
    id: "aud-2",
    actor: "billing@acmecleaning.com",
    actorType: "external",
    action: "Document uploaded",
    object: "W-9 — Acme Cleaning Co.",
    module: "W-9",
    timestamp: "2026-06-28T14:18:00Z",
  },
  {
    id: "aud-3",
    actor: "System",
    actorType: "system",
    action: "Reminder sent",
    object: "COI — Summit Landscaping",
    module: "COI",
    timestamp: "2026-06-27T09:00:00Z",
  },
];

export const MOCK_ATTENTION: AttentionItem[] = [
  {
    id: "att-1",
    objectName: "W-9 — Acme Cleaning Co.",
    status: "review_needed",
    owner: MOCK_OWNERS[0],
    dueDate: "2026-07-01",
    action: "Review",
    href: "/app/workflows/wf-1",
  },
  {
    id: "att-2",
    objectName: "Invoice #1042 — Brightline IT",
    status: "overdue",
    owner: MOCK_OWNERS[1],
    dueDate: "2026-06-28",
    action: "Approve",
    href: "/app/workflows/wf-4",
  },
];

export function getWorkflowById(id: string) {
  return MOCK_WORKFLOWS.find((w) => w.id === id);
}

export function getDocumentById(id: string) {
  return MOCK_DOCUMENTS.find((d) => d.id === id);
}

export function getVendorById(id: string) {
  return MOCK_VENDORS.find((v) => v.id === id);
}

export function getMonitorById(id: string) {
  return MOCK_MONITORS.find((m) => m.id === id);
}
