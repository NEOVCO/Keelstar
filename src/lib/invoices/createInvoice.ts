import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertUsageLimit } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import {
  INVOICE_WORKFLOW_TYPE,
  INVOICE_DOCUMENT_TYPE,
  defaultInvoiceApprovalDueDate,
} from "./constants";

const createInvoiceSchema = z.object({
  vendorId: z.string().uuid().optional(),
  vendorName: z.string().max(300).optional(),
  invoiceNumber: z.string().max(100).optional(),
  approverMemberId: z.string().uuid(),
  approvalDueDate: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
});

export async function createInvoice(input: z.infer<typeof createInvoiceSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = createInvoiceSchema.parse(input);
  const supabase = createServiceClient();

  await assertUsageLimit(ctx.organization.id, "invoice_active_records", ctx.user.id);

  let vendorName = data.vendorName?.trim() ?? "";
  if (data.vendorId) {
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id, name")
      .eq("id", data.vendorId)
      .eq("organization_id", ctx.organization.id)
      .maybeSingle();
    if (!vendor) throw new Error("Vendor not found");
    vendorName = vendor.name;
  }

  if (!vendorName) throw new Error("Vendor name or directory entry is required");

  const { data: approver } = await supabase
    .from("organization_members")
    .select("id, status")
    .eq("id", data.approverMemberId)
    .eq("organization_id", ctx.organization.id)
    .eq("status", "active")
    .maybeSingle();

  if (!approver) throw new Error("Approver not found");

  const approvalDue = data.approvalDueDate
    ? new Date(data.approvalDueDate)
    : defaultInvoiceApprovalDueDate();

  const label = data.invoiceNumber
    ? `Invoice ${data.invoiceNumber} — ${vendorName}`
    : `Invoice — ${vendorName}`;

  const { data: workflow, error: wfError } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: ctx.organization.id,
      type: INVOICE_WORKFLOW_TYPE,
      title: label,
      status: "draft",
      vendor_id: data.vendorId ?? null,
      owner_id: ctx.user.id,
      created_by: ctx.user.id,
      due_date: approvalDue.toISOString(),
      metadata: {
        vendor_name: vendorName,
        invoice_number: data.invoiceNumber ?? null,
        approver_member_id: data.approverMemberId,
        notes: data.notes ?? null,
        submitted_by: ctx.user.email,
      },
    })
    .select("*")
    .single();

  if (wfError) throw new Error(wfError.message);

  const { data: document, error: docError } = await supabase
    .from("documents")
    .insert({
      organization_id: ctx.organization.id,
      title: label,
      document_type: INVOICE_DOCUMENT_TYPE,
      status: "pending",
      workflow_instance_id: workflow.id,
      vendor_id: data.vendorId ?? null,
      created_by: ctx.user.id,
    })
    .select("id")
    .single();

  if (docError) throw new Error(docError.message);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "invoice.created",
    targetType: "workflow_instance",
    targetId: workflow.id,
    metadata: {
      vendorName,
      invoiceNumber: data.invoiceNumber,
      approverMemberId: data.approverMemberId,
    },
  });

  trackEvent("invoice_created", { workflowId: workflow.id });

  return { workflow, document };
}

export { createInvoiceSchema };
