import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertUsageLimit } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";

const createVendorSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
});

const updateVendorSchema = createVendorSchema.partial().extend({
  status: z.enum(["active", "inactive", "archived"]).optional(),
});

export async function createVendor(input: z.infer<typeof createVendorSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = createVendorSchema.parse(input);

  await assertUsageLimit(ctx.organization.id, "vendors", ctx.user.id);

  const supabase = createServiceClient();
  const { data: vendor, error } = await supabase
    .from("vendors")
    .insert({
      organization_id: ctx.organization.id,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      created_by: ctx.user.id,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "vendor.created",
    targetType: "vendor",
    targetId: vendor.id,
    metadata: { name: vendor.name },
  });

  trackEvent("vendor_created", { organizationId: ctx.organization.id });

  return vendor;
}

export async function updateVendor(vendorId: string, input: z.infer<typeof updateVendorSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const data = updateVendorSchema.parse(input);
  const supabase = createServiceClient();

  const { data: vendor, error } = await supabase
    .from("vendors")
    .update({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email || null }),
      ...(data.phone !== undefined && { phone: data.phone || null }),
      ...(data.status !== undefined && { status: data.status }),
    })
    .eq("id", vendorId)
    .eq("organization_id", ctx.organization.id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "vendor.updated",
    targetType: "vendor",
    targetId: vendorId,
    metadata: data,
  });

  return vendor;
}

export async function archiveVendor(vendorId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  const { data: vendor, error } = await supabase
    .from("vendors")
    .update({ status: "archived" })
    .eq("id", vendorId)
    .eq("organization_id", ctx.organization.id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "vendor.archived",
    targetType: "vendor",
    targetId: vendorId,
  });

  return vendor;
}

export async function listVendors() {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_VIEW);
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("organization_id", ctx.organization.id)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getVendor(vendorId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_VIEW);
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", vendorId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
