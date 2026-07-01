import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertUsageLimit, incrementUsage } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import {
  W9_WORKFLOW_TYPE,
  W9_DOCUMENT_TYPE,
  defaultDueDate,
  ACTIVE_W9_STATUSES,
} from "./constants";

const createW9RequestSchema = z.object({
  vendorId: z.string().uuid(),
  dueDate: z.string().datetime().optional(),
  message: z.string().max(2000).optional(),
  requesterName: z.string().max(200).optional(),
  recipientEmail: z.string().email().optional(),
  replaceExisting: z.boolean().optional(),
});

export async function createW9Request(input: z.infer<typeof createW9RequestSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = createW9RequestSchema.parse(input);
  const supabase = createServiceClient();

  await assertUsageLimit(ctx.organization.id, "w9_requests", ctx.user.id);

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
    .eq("type", W9_WORKFLOW_TYPE)
    .in("status", ACTIVE_W9_STATUSES as unknown as string[])
    .maybeSingle();

  if (existing && !data.replaceExisting) {
    throw new Error("An active W-9 request already exists for this vendor");
  }

  const dueDate = data.dueDate ? new Date(data.dueDate) : defaultDueDate();

  const { data: workflow, error: wfError } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: ctx.organization.id,
      type: W9_WORKFLOW_TYPE,
      title: `W-9 — ${vendor.name}`,
      status: "draft",
      vendor_id: data.vendorId,
      owner_id: ctx.user.id,
      created_by: ctx.user.id,
      due_date: dueDate.toISOString(),
      metadata: {
        message: data.message ?? null,
        requester_name: data.requesterName ?? ctx.user.email,
        recipient_email: recipientEmail,
      },
    })
    .select("*")
    .single();

  if (wfError) throw new Error(wfError.message);

  const { data: document, error: docError } = await supabase
    .from("documents")
    .insert({
      organization_id: ctx.organization.id,
      title: `W-9 — ${vendor.name}`,
      document_type: W9_DOCUMENT_TYPE,
      status: "pending",
      workflow_instance_id: workflow.id,
      vendor_id: data.vendorId,
      created_by: ctx.user.id,
    })
    .select("id")
    .single();

  if (docError) throw new Error(docError.message);

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      organization_id: ctx.organization.id,
      workflow_instance_id: workflow.id,
      title: "Upload W-9",
      description: data.message ?? `Please upload your completed W-9 form for ${ctx.organization.name}.`,
      status: "pending",
      assignee_type: "external",
      due_date: dueDate.toISOString(),
    })
    .select("id")
    .single();

  if (taskError) throw new Error(taskError.message);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "w9_request.created",
    targetType: "workflow_instance",
    targetId: workflow.id,
    metadata: { vendorId: data.vendorId, documentId: document.id },
  });

  trackEvent("w9_request_created", { workflowId: workflow.id });

  return { workflow, document, task, vendor, recipientEmail };
}

export async function sendW9Request(workflowId: string) {
  const { sendW9RequestEmail } = await import("./sendRequest");
  return sendW9RequestEmail(workflowId);
}

export { createW9RequestSchema };
