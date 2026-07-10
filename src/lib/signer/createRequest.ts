import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertUsageLimit } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import {
  SIGNER_WORKFLOW_TYPE,
  SIGNER_DOCUMENT_TYPE,
  defaultSignerDueDate,
  ACTIVE_SIGNER_STATUSES,
} from "./constants";

const createSignerRequestSchema = z.object({
  vendorId: z.string().uuid().optional(),
  signerName: z.string().max(300).optional(),
  signerEmail: z.string().email(),
  documentTitle: z.string().min(1).max(300),
  dueDate: z.string().datetime().optional(),
  message: z.string().max(2000).optional(),
  requesterName: z.string().max(200).optional(),
  replaceExisting: z.boolean().optional(),
});

export async function createSignerRequest(input: z.infer<typeof createSignerRequestSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = createSignerRequestSchema.parse(input);
  const supabase = createServiceClient();

  await assertUsageLimit(ctx.organization.id, "signer_requests", ctx.user.id);
  await assertUsageLimit(ctx.organization.id, "signer_active_records", ctx.user.id);

  let signerName = data.signerName?.trim() ?? "";
  let vendorId = data.vendorId ?? null;

  if (data.vendorId) {
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id, name, email")
      .eq("id", data.vendorId)
      .eq("organization_id", ctx.organization.id)
      .maybeSingle();
    if (!vendor) throw new Error("Vendor not found");
    signerName = vendor.name;
    vendorId = vendor.id;
  }

  if (!signerName) signerName = data.signerEmail.split("@")[0];

  if (vendorId) {
    const { data: existing } = await supabase
      .from("workflow_instances")
      .select("id, status")
      .eq("organization_id", ctx.organization.id)
      .eq("vendor_id", vendorId)
      .eq("type", SIGNER_WORKFLOW_TYPE)
      .in("status", ACTIVE_SIGNER_STATUSES as unknown as string[])
      .maybeSingle();

    if (existing && !data.replaceExisting) {
      throw new Error("An active signature request already exists for this contact");
    }
  }

  const dueDate = data.dueDate ? new Date(data.dueDate) : defaultSignerDueDate();

  const { data: workflow, error: wfError } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: ctx.organization.id,
      type: SIGNER_WORKFLOW_TYPE,
      title: `Signature: ${data.documentTitle}`,
      status: "draft",
      vendor_id: vendorId,
      owner_id: ctx.user.id,
      created_by: ctx.user.id,
      due_date: dueDate.toISOString(),
      metadata: {
        document_title: data.documentTitle,
        signer_name: signerName,
        signer_email: data.signerEmail,
        message: data.message ?? null,
        requester_name: data.requesterName ?? ctx.user.email,
        recipient_email: data.signerEmail,
      },
    })
    .select("*")
    .single();

  if (wfError) throw new Error(wfError.message);

  const { data: document, error: docError } = await supabase
    .from("documents")
    .insert({
      organization_id: ctx.organization.id,
      title: data.documentTitle,
      document_type: SIGNER_DOCUMENT_TYPE,
      status: "pending",
      workflow_instance_id: workflow.id,
      vendor_id: vendorId,
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
      title: `Sign: ${data.documentTitle}`,
      description:
        data.message ??
        `Please review and sign "${data.documentTitle}" for ${ctx.organization.name}.`,
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
    action: "signer_request.created",
    targetType: "workflow_instance",
    targetId: workflow.id,
    metadata: {
      vendorId,
      documentId: document.id,
      documentTitle: data.documentTitle,
      signerEmail: data.signerEmail,
    },
  });

  trackEvent("signer_request_created", { workflowId: workflow.id });

  return { workflow, document, task, signerName, signerEmail: data.signerEmail };
}

export { createSignerRequestSchema };
