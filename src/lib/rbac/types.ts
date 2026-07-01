import { type PermissionKey } from "./permissions";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  stripe_customer_id: string | null;
  settings: Record<string, unknown>;
};

export type OrganizationMember = {
  id: string;
  organization_id: string;
  user_id: string;
  status: string;
  roles: string[];
};

export type AuthContext = {
  user: { id: string; email: string };
  organization: Organization;
  membership: OrganizationMember;
  permissions: PermissionKey[];
};

export class AuthorizationError extends Error {
  constructor(message: string, public code: string = "FORBIDDEN") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export function can(
  permissions: PermissionKey[],
  permissionKey: PermissionKey
): boolean {
  return permissions.includes(permissionKey);
}

export function canAny(
  permissions: PermissionKey[],
  required: PermissionKey[]
): boolean {
  return required.some((p) => permissions.includes(p));
}

export function canAll(
  permissions: PermissionKey[],
  required: PermissionKey[]
): boolean {
  return required.every((p) => permissions.includes(p));
}
