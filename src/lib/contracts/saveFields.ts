import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { CONTRACT_FIELD_KEYS } from "./constants";
import {
  computeLatestNoticeDate,
  parseNoticePeriodDays,
  parseAutoRenews,
} from "./noticeDate";
import { rescheduleContractReminders } from "./scheduleReminders";

const saveContractFieldsSchema = z.object({
  workflowId: z.string().uuid(),
  fields: z.record(z.string().max(5000).nullable()),
});

function fieldTypeForKey(key: string): string {
  if (key.includes("date")) return "date";
  if (key === "auto_renewal") return "boolean";
  if (key === "notice_period_days" || key === "termination_notice_days") return "number";
  if (key === "contract_value" || key === "currency") return "currency";
  return "text";
}

export async function saveContractFields(input: z.infer<typeof saveContractFieldsSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const data = saveContractFieldsSchema.parse(input);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, status, owner_id, created_by, metadata, title")
    .eq("id", data.workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Contract not found");

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", data.workflowId)
    .eq("document_type", "contract")
    .maybeSingle();

  if (!document?.current_version_id) throw new Error("Upload a contract document first");

  const normalizedFields = { ...data.fields };
  if (normalizedFields.notice_period_days == null && normalizedFields.termination_notice_days) {
    normalizedFields.notice_period_days = normalizedFields.termination_notice_days;
  }

  for (const key of Object.keys(normalizedFields)) {
    if (!CONTRACT_FIELD_KEYS.includes(key as (typeof CONTRACT_FIELD_KEYS)[number])) continue;
    const value = normalizedFields[key];

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
    Object.entries(normalizedFields).map(([k, v]) => [k, v ?? ""])
  ) as Record<string, string>;
  const renewalRaw = fieldMap.renewal_date;
  let latestNoticeDate: string | null = null;

  if (renewalRaw) {
    const renewalDate = new Date(renewalRaw);
    const noticeDays = parseNoticePeriodDays(fieldMap);
    if (!Number.isNaN(renewalDate.getTime()) && noticeDays != null) {
      latestNoticeDate = computeLatestNoticeDate(renewalDate, noticeDays).toISOString();
      await createAuditLog({
        organizationId: ctx.organization.id,
        actorType: "user",
        actorId: ctx.user.id,
        actorEmail: ctx.user.email,
        action: "contract.latest_notice_date_calculated",
        targetType: "workflow_instance",
        targetId: data.workflowId,
        metadata: { latestNoticeDate, noticePeriodDays: noticeDays },
      });
    }
  }

  const meta = (workflow.metadata ?? {}) as Record<string, unknown>;
  const updatedMeta = {
    ...meta,
    contract_name: fieldMap.contract_name ?? workflow.title,
    counterparty: fieldMap.counterparty ?? null,
    renewal_date: fieldMap.renewal_date ?? null,
    notice_period_days: fieldMap.notice_period_days ?? fieldMap.termination_notice_days ?? null,
    latest_notice_date: latestNoticeDate,
    auto_renewal: parseAutoRenews(fieldMap.auto_renewal),
    contract_type: fieldMap.contract_type ?? null,
    renewal_term: fieldMap.renewal_term ?? null,
    contract_value: fieldMap.contract_value ?? null,
    currency: fieldMap.currency ?? null,
  };

  await supabase
    .from("workflow_instances")
    .update({ metadata: updatedMeta, title: fieldMap.contract_name ?? workflow.title })
    .eq("id", data.workflowId);

  const monitoredStatuses = [
    "renewal_monitoring",
    "notice_window_open",
    "renewal_approaching",
    "auto_renew_risk",
    "expired",
    "active_monitoring",
    "expiring_soon",
  ];

  if (monitoredStatuses.includes(workflow.status) && fieldMap.renewal_date) {
    const renewalDate = new Date(fieldMap.renewal_date);
    const noticeDays = parseNoticePeriodDays(fieldMap);
    const noticeDate =
      noticeDays != null ? computeLatestNoticeDate(renewalDate, noticeDays) : null;
    await rescheduleContractReminders({
      workflowInstanceId: data.workflowId,
      organizationId: ctx.organization.id,
      renewalDate,
      latestNoticeDate: noticeDate,
      ownerId: workflow.owner_id,
      createdBy: workflow.created_by,
      contractName: fieldMap.contract_name ?? workflow.title,
      documentId: document.id,
    });
  }

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract.renewal_fields_updated",
    targetType: "document",
    targetId: document.id,
    metadata: { fields: Object.keys(normalizedFields) },
  });

  trackEvent("contract_renewal_fields_saved", { workflowId: data.workflowId });
  return { success: true, latestNoticeDate };
}

export async function getContractFieldsForWorkflow(workflowId: string, organizationId: string) {
  const supabase = createServiceClient();
  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "contract")
    .maybeSingle();

  if (!document?.current_version_id) return [];

  const { data: fields } = await supabase
    .from("document_parsed_fields")
    .select("field_key, field_value, confidence, extraction_source")
    .eq("document_version_id", document.current_version_id);

  return fields ?? [];
}

export { saveContractFieldsSchema };
