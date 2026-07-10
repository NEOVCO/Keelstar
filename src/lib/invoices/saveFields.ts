import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { INVOICE_FIELD_KEYS } from "./constants";

const saveInvoiceFieldsSchema = z.object({
  workflowId: z.string().uuid(),
  fields: z.record(z.string().max(5000).nullable()),
});

function fieldTypeForKey(key: string): string {
  if (key.includes("date")) return "date";
  if (key === "invoice_amount") return "currency";
  return "text";
}

export async function saveInvoiceFields(input: z.infer<typeof saveInvoiceFieldsSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const data = saveInvoiceFieldsSchema.parse(input);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, status, metadata, title, vendor_id")
    .eq("id", data.workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Invoice not found");

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", data.workflowId)
    .eq("document_type", "invoice")
    .maybeSingle();

  if (!document?.current_version_id) throw new Error("Upload an invoice document first");

  for (const key of Object.keys(data.fields)) {
    if (!INVOICE_FIELD_KEYS.includes(key as (typeof INVOICE_FIELD_KEYS)[number])) continue;
    const value = data.fields[key];

    const { data: existing } = await supabase
      .from("document_parsed_fields")
      .select("id")
      .eq("document_version_id", document.current_version_id)
      .eq("field_key", key)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("document_parsed_fields")
        .update({
          field_value: value,
          extraction_source: "manual",
          confidence: 1.0,
          is_override: true,
          overridden_by: ctx.user.id,
          overridden_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("document_parsed_fields").insert({
        organization_id: ctx.organization.id,
        document_version_id: document.current_version_id,
        field_key: key,
        field_value: value,
        field_type: fieldTypeForKey(key),
        confidence: 1.0,
        extraction_source: "manual",
        is_override: true,
        overridden_by: ctx.user.id,
        overridden_at: new Date().toISOString(),
      });
    }
  }

  const fieldMap = Object.fromEntries(
    Object.entries(data.fields).map(([k, v]) => [k, v ?? ""])
  ) as Record<string, string>;

  const meta = (workflow.metadata ?? {}) as Record<string, unknown>;
  const vendorName = fieldMap.vendor_name || String(meta.vendor_name ?? "");
  const invoiceNumber = fieldMap.invoice_number || String(meta.invoice_number ?? "");
  const title = invoiceNumber
    ? `Invoice ${invoiceNumber} — ${vendorName}`
    : `Invoice — ${vendorName}`;

  const paymentDue = fieldMap.due_date ? new Date(fieldMap.due_date).toISOString() : null;

  await supabase
    .from("workflow_instances")
    .update({
      title,
      metadata: {
        ...meta,
        vendor_name: vendorName,
        invoice_number: invoiceNumber || null,
        invoice_amount: fieldMap.invoice_amount ?? null,
        due_date: paymentDue,
        notes: fieldMap.notes ?? null,
      },
    })
    .eq("id", data.workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "invoice_fields.updated",
    targetType: "document",
    targetId: document.id,
    metadata: { fields: Object.keys(data.fields) },
  });

  trackEvent("invoice_fields_saved", { workflowId: data.workflowId });
  return { success: true };
}

export async function getInvoiceFieldsForWorkflow(workflowId: string, organizationId: string) {
  const supabase = createServiceClient();
  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "invoice")
    .maybeSingle();

  if (!document?.current_version_id) return [];

  const { data: fields } = await supabase
    .from("document_parsed_fields")
    .select("field_key, field_value, confidence, extraction_source")
    .eq("document_version_id", document.current_version_id);

  return fields ?? [];
}

export { saveInvoiceFieldsSchema };
