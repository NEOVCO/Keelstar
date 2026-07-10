import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { createMonitorSchema } from "@/lib/validation/schemas";
import { DEFAULT_MONITOR_INTERVAL_DAYS } from "./constants";

export async function createMonitor(input: unknown) {
  const ctx = await requirePermission(PERMISSIONS.MONITORS_MANAGE);
  const data = createMonitorSchema.parse(input);
  const supabase = createServiceClient();

  const config = {
    ...(data.config ?? {}),
    owner_id: ctx.user.id,
    interval_days: (data.config as { intervalDays?: number })?.intervalDays ?? DEFAULT_MONITOR_INTERVAL_DAYS,
  };

  let workflowInstanceId: string | null = null;
  let documentId: string | null = null;
  let vendorId: string | null = null;
  let monitoredDate: string | null = null;

  if (data.targetType === "workflow_instance" && data.targetId) {
    const { data: wf } = await supabase
      .from("workflow_instances")
      .select("id, due_date, vendor_id")
      .eq("id", data.targetId)
      .eq("organization_id", ctx.organization.id)
      .single();
    if (!wf) throw new Error("Workflow not found");
    workflowInstanceId = wf.id;
    vendorId = wf.vendor_id;
    if (data.monitorType === "workflow_due_date" && wf.due_date) {
      monitoredDate = wf.due_date;
    }
  }

  if (data.targetType === "document" && data.targetId) {
    const { data: doc } = await supabase
      .from("documents")
      .select("id, vendor_id, workflow_instance_id")
      .eq("id", data.targetId)
      .eq("organization_id", ctx.organization.id)
      .single();
    if (!doc) throw new Error("Document not found");
    documentId = doc.id;
    vendorId = doc.vendor_id;
    workflowInstanceId = doc.workflow_instance_id;
    const exp = (data.config as { expirationDate?: string })?.expirationDate;
    if (exp) monitoredDate = exp;
  }

  const nextRun = new Date();
  const intervalDays = (config.interval_days as number) ?? DEFAULT_MONITOR_INTERVAL_DAYS;
  nextRun.setDate(nextRun.getDate() + intervalDays);
  nextRun.setHours(6, 0, 0, 0);

  const { data: monitor, error } = await supabase
    .from("monitors")
    .insert({
      organization_id: ctx.organization.id,
      name: data.name,
      monitor_type: data.monitorType,
      target_type: data.targetType ?? null,
      target_id: data.targetId ?? null,
      workflow_instance_id: workflowInstanceId,
      document_id: documentId,
      vendor_id: vendorId,
      monitored_date: monitoredDate,
      status: "active",
      config,
      next_run_at: nextRun.toISOString(),
      created_by: ctx.user.id,
    })
    .select("id, name, monitor_type, status, next_run_at")
    .single();

  if (error) throw new Error(error.message);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    action: "monitor.created",
    targetType: "monitor",
    targetId: monitor.id,
    metadata: { monitorType: data.monitorType },
  });

  return monitor;
}

export async function listMonitors(organizationId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("monitors")
    .select("id, name, monitor_type, status, next_run_at, last_run_at, created_at")
    .eq("organization_id", organizationId)
    .order("next_run_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
