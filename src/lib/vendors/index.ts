import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertUsageLimit, checkUsageLimit } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import { type VendorImportRow } from "@/lib/vendors/importCsv";
import {
  VENDOR_RECORD_TYPES,
  buildVendorMetadata,
  type VendorRecordType,
} from "@/lib/vendors/types";
import { registerVendorForScreening, vendorRowToMetadata } from "@/lib/vendors/screeningSubject";

const createVendorSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
  recordType: z.enum(VENDOR_RECORD_TYPES).optional().default("company"),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  npi: z.string().max(20).optional(),
  registerForScreening: z.boolean().optional(),
});

const updateVendorSchema = createVendorSchema.partial().extend({
  status: z.enum(["active", "inactive", "archived"]).optional(),
});

const bulkImportSchema = z.object({
  vendors: z.array(createVendorSchema).min(1).max(200),
  registerForScreening: z.boolean().optional(),
});

export async function createVendor(input: z.infer<typeof createVendorSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = createVendorSchema.parse(input);

  await assertUsageLimit(ctx.organization.id, "vendors", ctx.user.id);

  const metadata = buildVendorMetadata(data.recordType, {
    firstName: data.firstName,
    lastName: data.lastName,
    npi: data.npi,
  });

  const supabase = createServiceClient();
  const { data: vendor, error } = await supabase
    .from("vendors")
    .insert({
      organization_id: ctx.organization.id,
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      metadata,
      created_by: ctx.user.id,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  if (data.registerForScreening) {
    await registerVendorForScreening({
      organizationId: ctx.organization.id,
      userId: ctx.user.id,
      userEmail: ctx.user.email,
      vendorId: vendor.id,
      name: data.name,
      recordType: data.recordType,
      firstName: data.firstName,
      lastName: data.lastName,
      npi: data.npi,
    });
  }

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "vendor.created",
    targetType: "vendor",
    targetId: vendor.id,
    metadata: { name: vendor.name, recordType: data.recordType },
  });

  trackEvent("vendor_created", { organizationId: ctx.organization.id });

  return vendor;
}

export async function bulkCreateVendors(
  vendors: VendorImportRow[],
  options?: { registerForScreening?: boolean }
) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = bulkImportSchema.parse({ vendors, registerForScreening: options?.registerForScreening });

  const limit = await checkUsageLimit(ctx.organization.id, "vendors");
  if (!limit.allowed && limit.current + data.vendors.length > limit.max) {
    const remaining = Math.max(0, limit.max - limit.current);
    throw new Error(
      remaining === 0
        ? `Usage limit reached: directory records (${limit.current}/${limit.max}). Upgrade to continue.`
        : `Can import at most ${remaining} directory ${remaining === 1 ? "entry" : "entries"} on your current plan (${limit.current}/${limit.max} used).`
    );
  }

  const supabase = createServiceClient();
  const rows = data.vendors.map((vendor) => ({
    organization_id: ctx.organization.id,
    name: vendor.name,
    email: vendor.email || null,
    phone: vendor.phone || null,
    metadata: vendorRowToMetadata(vendor),
    created_by: ctx.user.id,
  }));

  const { data: created, error } = await supabase.from("vendors").insert(rows).select("id, name, metadata");

  if (error) throw new Error(error.message);

  let screeningRegistered = 0;
  if (data.registerForScreening) {
    for (let i = 0; i < created.length; i++) {
      const vendor = created[i];
      const source = data.vendors[i];
      const recordType = (source.recordType ?? "company") as VendorRecordType;
      const subjectId = await registerVendorForScreening({
        organizationId: ctx.organization.id,
        userId: ctx.user.id,
        userEmail: ctx.user.email,
        vendorId: vendor.id,
        name: vendor.name,
        recordType,
        firstName: source.firstName,
        lastName: source.lastName,
        npi: source.npi,
      });
      if (subjectId) screeningRegistered++;
    }
  }

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "vendor.bulk_imported",
    targetType: "organization",
    targetId: ctx.organization.id,
    metadata: {
      count: created.length,
      names: created.map((v) => v.name).slice(0, 10),
      screeningRegistered,
    },
  });

  trackEvent("vendors_bulk_imported", {
    organizationId: ctx.organization.id,
    count: created.length,
  });

  return { vendors: created, screeningRegistered };
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
