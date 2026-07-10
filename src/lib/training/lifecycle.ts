import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { TRAINING_MONITOR_TYPE } from "./constants";
import { createTrainingExpirationMonitor } from "./expirationMonitor";

async function completeActiveMonitors(workflowId: string, status: "completed" | "cancelled") {
  const supabase = createServiceClient();
  await supabase
    .from("monitors")
    .update({ status })
    .eq("workflow_instance_id", workflowId)
    .eq("monitor_type", TRAINING_MONITOR_TYPE)
    .eq("status", "active");
}

const markRenewedSchema = z.object({
  workflowId: z.string().uuid(),
  newExpirationDate: z.string().min(1),
  newCompletionDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export async function markTrainingRenewed(input: z.infer<typeof markRenewedSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const data = markRenewedSchema.parse(input);
  const supabase = createServiceClient();

  const expirationDate = new Date(data.newExpirationDate);
  if (Number.isNaN(expirationDate.getTime())) throw new Error("Invalid expiration date");

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", data.workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Training record not found");

  const { data: document } = await supabase
    .from("documents")
    .select("id")
    .eq("workflow_instance_id", data.workflowId)
    .eq("document_type", "training_certificate")
    .maybeSingle();

  if (!document) throw new Error("Certificate not found");

  const meta = (workflow.metadata ?? {}) as Record<string, unknown>;
  const courseName = String(meta.course_name ?? workflow.title);

  await completeActiveMonitors(data.workflowId, "completed");

  await createTrainingExpirationMonitor(
    data.workflowId,
    ctx.organization.id,
    document.id,
    workflow.vendor_id,
    expirationDate,
    workflow.owner_id ?? ctx.user.id,
    courseName
  );

  await supabase
    .from("workflow_instances")
    .update({
      due_date: expirationDate.toISOString(),
      metadata: {
        ...meta,
        expiration_date: expirationDate.toISOString(),
        completion_date: data.newCompletionDate ?? meta.completion_date ?? null,
        renewed_at: new Date().toISOString(),
        renewal_notes: data.notes ?? null,
      },
    })
    .eq("id", data.workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "training_record.renewed",
    targetType: "workflow_instance",
    targetId: data.workflowId,
    metadata: { newExpirationDate: expirationDate.toISOString() },
  });

  trackEvent("training_record_renewed", { workflowId: data.workflowId });
  return { success: true };
}

export async function cancelTrainingRecord(workflowId: string, reason?: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, metadata")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Training record not found");

  await supabase
    .from("reminders")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowId)
    .eq("status", "scheduled");

  await completeActiveMonitors(workflowId, "cancelled");

  await supabase
    .from("workflow_instances")
    .update({
      status: "cancelled",
      metadata: {
        ...(workflow.metadata as object),
        cancellation_reason: reason ?? null,
        cancelled_at: new Date().toISOString(),
      },
    })
    .eq("id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "training_record.cancelled",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { reason },
  });

  return { success: true };
}
