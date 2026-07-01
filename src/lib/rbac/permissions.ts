export const PERMISSIONS = {
  ORGANIZATION_MANAGE: "organization.manage",
  SETTINGS_MANAGE: "settings.manage",
  MEMBERS_INVITE: "members.invite",
  MEMBERS_MANAGE: "members.manage",
  DOCUMENTS_VIEW: "documents.view",
  DOCUMENTS_CREATE: "documents.create",
  DOCUMENTS_UPDATE: "documents.update",
  DOCUMENTS_DELETE: "documents.delete",
  WORKFLOWS_VIEW: "workflows.view",
  WORKFLOWS_CREATE: "workflows.create",
  WORKFLOWS_UPDATE: "workflows.update",
  WORKFLOWS_APPROVE: "workflows.approve",
  MONITORS_VIEW: "monitors.view",
  MONITORS_MANAGE: "monitors.manage",
  NOTIFICATIONS_VIEW: "notifications.view",
  AUDIT_VIEW: "audit.view",
  BILLING_MANAGE: "billing.manage",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_GROUPS = {
  organization: {
    label: "Organization",
    permissions: [PERMISSIONS.ORGANIZATION_MANAGE, PERMISSIONS.SETTINGS_MANAGE],
  },
  members: {
    label: "Members",
    permissions: [PERMISSIONS.MEMBERS_INVITE, PERMISSIONS.MEMBERS_MANAGE],
  },
  documents: {
    label: "Documents",
    permissions: [
      PERMISSIONS.DOCUMENTS_VIEW,
      PERMISSIONS.DOCUMENTS_CREATE,
      PERMISSIONS.DOCUMENTS_UPDATE,
      PERMISSIONS.DOCUMENTS_DELETE,
    ],
  },
  workflows: {
    label: "Workflows",
    permissions: [
      PERMISSIONS.WORKFLOWS_VIEW,
      PERMISSIONS.WORKFLOWS_CREATE,
      PERMISSIONS.WORKFLOWS_UPDATE,
      PERMISSIONS.WORKFLOWS_APPROVE,
    ],
  },
  monitors: {
    label: "Monitors",
    permissions: [PERMISSIONS.MONITORS_VIEW, PERMISSIONS.MONITORS_MANAGE],
  },
  notifications: {
    label: "Notifications",
    permissions: [PERMISSIONS.NOTIFICATIONS_VIEW],
  },
  audit: {
    label: "Audit",
    permissions: [PERMISSIONS.AUDIT_VIEW],
  },
  billing: {
    label: "Billing",
    permissions: [PERMISSIONS.BILLING_MANAGE],
  },
} as const;

export const ALL_PERMISSIONS: PermissionKey[] = Object.values(PERMISSIONS);
