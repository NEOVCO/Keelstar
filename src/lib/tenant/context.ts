import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { ACTIVE_ORG_COOKIE } from "@/lib/utils";
import {
  type AuthContext,
  type Organization,
  type OrganizationMember,
  AuthenticationError,
  AuthorizationError,
} from "@/lib/rbac/types";
import { type PermissionKey } from "@/lib/rbac/permissions";

async function getUserOrganizations(userId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("organization_members")
    .select(
      `
      id,
      organization_id,
      user_id,
      status,
      organizations (id, name, slug, stripe_customer_id, settings)
    `
    )
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) throw error;
  return data ?? [];
}

async function getMemberPermissions(memberId: string): Promise<PermissionKey[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("member_roles")
    .select("roles (key, role_permissions (permissions (key)))")
    .eq("member_id", memberId);

  if (error) throw error;

  const permissions = new Set<PermissionKey>();
  for (const mr of data ?? []) {
    const role = mr.roles as unknown as {
      key: string;
      role_permissions: Array<{ permissions: { key: string } }>;
    };
    if (role?.role_permissions) {
      for (const rp of role.role_permissions) {
        permissions.add(rp.permissions.key as PermissionKey);
      }
    }
  }
  return Array.from(permissions);
}

export async function getActiveOrganizationId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_ORG_COOKIE)?.value ?? null;
}

export async function setActiveOrganization(orgId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORG_COOKIE, orgId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function getActiveOrganization(): Promise<Organization | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const orgId = await getActiveOrganizationId();
  if (!orgId) return null;

  const memberships = await getUserOrganizations(user.id);
  const membership = memberships.find((m) => {
    const org = m.organizations as unknown as Organization;
    return org?.id === orgId;
  });

  if (!membership) return null;
  return membership.organizations as unknown as Organization;
}

export async function requireOrganization(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new AuthenticationError();

  const memberships = await getUserOrganizations(user.id);
  if (memberships.length === 0) {
    throw new AuthorizationError("No organization membership found", "NO_ORG");
  }

  let orgId = await getActiveOrganizationId();
  if (!orgId || !memberships.some((m) => (m.organizations as unknown as Organization)?.id === orgId)) {
    orgId = (memberships[0].organizations as unknown as Organization).id;
  }

  const membership = memberships.find(
    (m) => (m.organizations as unknown as Organization)?.id === orgId
  )!;

  const organization = membership.organizations as unknown as Organization;
  const permissions = await getMemberPermissions(membership.id);

  const memberRoles = await createServiceClient()
    .from("member_roles")
    .select("roles (key)")
    .eq("member_id", membership.id);

  const roles = (memberRoles.data ?? []).map(
    (mr) => (mr.roles as unknown as { key: string }).key
  );

  return {
    user: { id: user.id, email: user.email ?? "" },
    organization,
    membership: {
      id: membership.id,
      organization_id: membership.organization_id,
      user_id: membership.user_id,
      status: membership.status,
      roles,
    },
    permissions,
  };
}

export async function requirePermission(permissionKey: PermissionKey): Promise<AuthContext> {
  const ctx = await requireOrganization();
  if (!ctx.permissions.includes(permissionKey)) {
    throw new AuthorizationError(`Missing permission: ${permissionKey}`);
  }
  return ctx;
}

export async function getUserOrganizationsList(userId: string) {
  const memberships = await getUserOrganizations(userId);
  return memberships.map((m) => ({
    membership: {
      id: m.id,
      organization_id: m.organization_id,
      user_id: m.user_id,
      status: m.status,
    } as OrganizationMember,
    organization: m.organizations as unknown as Organization,
  }));
}
