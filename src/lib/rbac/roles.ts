import { PERMISSIONS, type PermissionKey } from "./permissions";

export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MANAGER: "manager",
  MEMBER: "member",
  VIEWER: "viewer",
} as const;

export type RoleKey = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_DEFINITIONS: Record<
  RoleKey,
  { name: string; description: string; permissions: PermissionKey[] }
> = {
  owner: {
    name: "Owner",
    description: "Full control including billing and ownership transfer",
    permissions: Object.values(PERMISSIONS),
  },
  admin: {
    name: "Admin",
    description: "Manage members, settings, and all modules",
    permissions: Object.values(PERMISSIONS).filter((p) => p !== PERMISSIONS.BILLING_MANAGE),
  },
  manager: {
    name: "Manager",
    description: "Create and manage workflows, approve tasks, view audit logs",
    permissions: [
      PERMISSIONS.DOCUMENTS_VIEW,
      PERMISSIONS.DOCUMENTS_CREATE,
      PERMISSIONS.DOCUMENTS_UPDATE,
      PERMISSIONS.DOCUMENTS_DELETE,
      PERMISSIONS.WORKFLOWS_VIEW,
      PERMISSIONS.WORKFLOWS_CREATE,
      PERMISSIONS.WORKFLOWS_UPDATE,
      PERMISSIONS.WORKFLOWS_APPROVE,
      PERMISSIONS.MONITORS_VIEW,
      PERMISSIONS.MONITORS_MANAGE,
      PERMISSIONS.NOTIFICATIONS_VIEW,
      PERMISSIONS.AUDIT_VIEW,
    ],
  },
  member: {
    name: "Member",
    description: "Create documents and participate in workflows",
    permissions: [
      PERMISSIONS.DOCUMENTS_VIEW,
      PERMISSIONS.DOCUMENTS_CREATE,
      PERMISSIONS.DOCUMENTS_UPDATE,
      PERMISSIONS.WORKFLOWS_VIEW,
      PERMISSIONS.WORKFLOWS_CREATE,
      PERMISSIONS.WORKFLOWS_UPDATE,
      PERMISSIONS.MONITORS_VIEW,
      PERMISSIONS.NOTIFICATIONS_VIEW,
    ],
  },
  viewer: {
    name: "Viewer",
    description: "Read-only access to documents, workflows, and monitors",
    permissions: [
      PERMISSIONS.DOCUMENTS_VIEW,
      PERMISSIONS.WORKFLOWS_VIEW,
      PERMISSIONS.MONITORS_VIEW,
      PERMISSIONS.NOTIFICATIONS_VIEW,
    ],
  },
};

export function roleHasPermission(roleKey: RoleKey, permission: PermissionKey): boolean {
  return ROLE_DEFINITIONS[roleKey]?.permissions.includes(permission) ?? false;
}
