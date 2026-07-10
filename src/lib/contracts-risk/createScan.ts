import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertUsageLimit } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import {
  CONTRACT_RISK_WORKFLOW_TYPE,
  CONTRACT_RISK_DOCUMENT_TYPE,
} from "./constants";

const createRiskScanSchema = z.object({
  contractName: z.string().min(1).max(300),
  counterparty: z.string().max(300).optional(),
  vendorId: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
});

export async function createRiskScan(input: z.infer<typeof createRiskScanSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = createRiskScanSchema.parse(input);
  const supabase = createServiceClient();

  await assertUsageLimit(ctx.organization.id, "contract_risk_active_records", ctx.user.id);

  if (data.vendorId) {
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id, name")
      .eq("id", data.vendorId)
      .eq("organization_id", ctx.organization.id)
      .maybeSingle();
    if (!vendor) throw new Error("Vendor not found");
  }

  const { data: workflow, error: wfError } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: ctx.organization.id,
      type: CONTRACT_RISK_WORKFLOW_TYPE,
      title: `Risk scan: ${data.contractName}`,
      status: "draft",
      vendor_id: data.vendorId ?? null,
      owner_id: ctx.user.id,
      created_by: ctx.user.id,
      metadata: {
        contract_name: data.contractName,
        counterparty: data.counterparty ?? null,
        notes: data.notes ?? null,
      },
    })
    .select("*")
    .single();

  if (wfError) throw new Error(wfError.message);

  const { data: document, error: docError } = await supabase
    .from("documents")
    .insert({
      organization_id: ctx.organization.id,
      title: data.contractName,
      document_type: CONTRACT_RISK_DOCUMENT_TYPE,
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
    action: "contract_risk_scan.created",
    targetType: "workflow_instance",
    targetId: workflow.id,
    metadata: { documentId: document.id, contractName: data.contractName },
  });

  trackEvent("contract_risk_scan_created", { workflowId: workflow.id });

  return { workflow, document };
}

export { createRiskScanSchema };
