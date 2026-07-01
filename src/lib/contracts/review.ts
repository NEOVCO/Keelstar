import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { createContractRenewalMonitor } from "./renewalMonitor";
import { getContractFieldsForWorkflow } from "./saveFields";
import { CONTRACT_REQUIRED_FIELDS } from "./constants";
import {
  computeLatestNoticeDate,
  parseNoticePeriodDays,
  parseAutoRenews,
} from "./noticeDate";

export async function activateContractMonitoring(workflowId: string, notes?: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error || !workflow) throw new Error("Contract not found");
  if (!["review_needed", "metadata_needed", "uploaded"].includes(workflow.status)) {
    throw new Error("Contract must be uploaded and reviewed before activating monitoring");
  }

  const fields = await getContractFieldsForWorkflow(workflowId, ctx.organization.id);
  const fieldMap = Object.fromEntries(fields.map((f) => [f.field_key, f.field_value ?? ""]));

  for (const required of CONTRACT_REQUIRED_FIELDS) {
    if (!fieldMap[required]?.trim()) {
      throw new Error(`Required field missing: ${required.replace(/_/g, " ")}`);
    }
  }

  const renewalDate = new Date(fieldMap.renewal_date);
  if (Number.isNaN(renewalDate.getTime())) {
    throw new Error("Invalid renewal date");
  }

  const noticeDays = parseNoticePeriodDays(fieldMap);
  const autoRenews = parseAutoRenews(fieldMap.auto_renewal);
  if (autoRenews && noticeDays == null) {
    throw new Error("Notice period days required when auto-renewal is enabled");
  }

  const latestNoticeDate =
    noticeDays != null ? computeLatestNoticeDate(renewalDate, noticeDays) : null;

  const { data: document } = await supabase
    .from("documents")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "contract")
    .maybeSingle();

  if (!document) throw new Error("Contract document not found");

  const contractName = fieldMap.contract_name ?? workflow.title;

  await createContractRenewalMonitor(
    workflowId,
    ctx.organization.id,
    document.id,
    renewalDate,
    workflow.owner_id ?? ctx.user.id,
    contractName,
    {
      latestNoticeDate,
      noticePeriodDays: noticeDays,
      autoRenews,
      createdBy: workflow.created_by,
    }
  );

  await supabase
    .from("workflow_instances")
    .update({
      metadata: {
        ...(workflow.metadata as object),
        renewal_date: renewalDate.toISOString(),
        latest_notice_date: latestNoticeDate?.toISOString() ?? null,
        notice_period_days: noticeDays,
        contract_name: contractName,
        counterparty: fieldMap.counterparty ?? null,
        contract_type: fieldMap.contract_type ?? null,
        effective_date: fieldMap.effective_date ?? null,
        auto_renewal: autoRenews,
        renewal_term: fieldMap.renewal_term ?? null,
        contract_value: fieldMap.contract_value ?? null,
        currency: fieldMap.currency ?? null,
        activation_notes: notes ?? null,
        activated_at: new Date().toISOString(),
        activated_by: ctx.user.id,
      },
    })
    .eq("id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract.monitor_created",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { renewalDate: renewalDate.toISOString(), notes },
  });

  trackEvent("contract_tracker_created", { workflowId });
  return { success: true, latestNoticeDate: latestNoticeDate?.toISOString() ?? null };
}

export {
  markContractRenewed,
  markContractTerminated,
  archiveContract,
  cancelContract,
  completeContract,
} from "./lifecycle";
