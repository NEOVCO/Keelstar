import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertUsageLimit } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import {
  VENDOR_PACKET_WORKFLOW_TYPE,
  PACKET_CHECKLIST_ITEMS,
  defaultPacketDueDate,
  ACTIVE_VENDOR_PACKET_STATUSES,
  type PacketChecklistKey,
} from "./constants";

const createVendorPacketSchema = z.object({
  vendorId: z.string().uuid(),
  dueDate: z.string().datetime().optional(),
  message: z.string().max(2000).optional(),
  requesterName: z.string().max(200).optional(),
  recipientEmail: z.string().email().optional(),
  checklistKeys: z.array(z.enum(["w9", "coi", "msa", "banking"])).min(1).optional(),
  replaceExisting: z.boolean().optional(),
});

export async function createVendorPacket(input: z.infer<typeof createVendorPacketSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = createVendorPacketSchema.parse(input);
  const supabase = createServiceClient();

  await assertUsageLimit(ctx.organization.id, "vendor_packet_requests", ctx.user.id);
  await assertUsageLimit(ctx.organization.id, "vendor_packet_active", ctx.user.id);

  const { data: vendor, error: vendorError } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", data.vendorId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (vendorError || !vendor) throw new Error("Vendor not found");

  const recipientEmail = data.recipientEmail ?? vendor.email;
  if (!recipientEmail) throw new Error("Vendor email is required");

  const { data: existing } = await supabase
    .from("workflow_instances")
    .select("id, status")
    .eq("organization_id", ctx.organization.id)
    .eq("vendor_id", data.vendorId)
    .eq("type", VENDOR_PACKET_WORKFLOW_TYPE)
    .in("status", ACTIVE_VENDOR_PACKET_STATUSES as unknown as string[])
    .maybeSingle();

  if (existing && !data.replaceExisting) {
    throw new Error("An active vendor packet already exists for this vendor");
  }

  const checklistKeys = data.checklistKeys ?? (["w9", "coi"] as PacketChecklistKey[]);
  const checklist = PACKET_CHECKLIST_ITEMS.filter((i) => checklistKeys.includes(i.key));
  const dueDate = data.dueDate ? new Date(data.dueDate) : defaultPacketDueDate();

  const { data: workflow, error: wfError } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: ctx.organization.id,
      type: VENDOR_PACKET_WORKFLOW_TYPE,
      title: `Vendor packet — ${vendor.name}`,
      status: "draft",
      vendor_id: data.vendorId,
      owner_id: ctx.user.id,
      created_by: ctx.user.id,
      due_date: dueDate.toISOString(),
      metadata: {
        message: data.message ?? null,
        requester_name: data.requesterName ?? ctx.user.email,
        recipient_email: recipientEmail,
        checklist: checklist.map((i) => ({
          key: i.key,
          label: i.label,
          documentType: i.documentType,
          required: i.required,
        })),
        completions: {},
      },
    })
    .select("*")
    .single();

  if (wfError) throw new Error(wfError.message);

  const { data: portalTask, error: portalTaskError } = await supabase
    .from("tasks")
    .insert({
      organization_id: ctx.organization.id,
      workflow_instance_id: workflow.id,
      title: "Vendor onboarding portal",
      description: "Access the vendor document portal",
      status: "pending",
      assignee_type: "external",
      due_date: dueDate.toISOString(),
      metadata: { portal_task: true },
    })
    .select("id")
    .single();

  if (portalTaskError) throw new Error(portalTaskError.message);

  for (const item of checklist) {
    const { data: document, error: docError } = await supabase
      .from("documents")
      .insert({
        organization_id: ctx.organization.id,
        title: `${item.label} — ${vendor.name}`,
        document_type: item.documentType,
        status: "pending",
        workflow_instance_id: workflow.id,
        vendor_id: data.vendorId,
        created_by: ctx.user.id,
        metadata: { packet_item_key: item.key },
      })
      .select("id")
      .single();

    if (docError) throw new Error(docError.message);

    const { error: taskError } = await supabase.from("tasks").insert({
      organization_id: ctx.organization.id,
      workflow_instance_id: workflow.id,
      title: `Upload ${item.label}`,
      description: item.description,
      status: "pending",
      assignee_type: "external",
      due_date: dueDate.toISOString(),
      metadata: {
        packet_item_key: item.key,
        document_type: item.documentType,
        required: item.required,
        document_id: document.id,
      },
    });

    if (taskError) throw new Error(taskError.message);
  }

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "vendor_packet.created",
    targetType: "workflow_instance",
    targetId: workflow.id,
    metadata: { vendorId: data.vendorId, checklist: checklistKeys },
  });

  trackEvent("vendor_packet_created", { workflowId: workflow.id });
  return { workflow, portalTask, vendor, recipientEmail, checklist };
}

export async function sendVendorPacket(workflowId: string, options?: { ccMe?: boolean }) {
  const { sendVendorPacketEmail } = await import("./sendPacket");
  return sendVendorPacketEmail(workflowId, options);
}

export { createVendorPacketSchema };
