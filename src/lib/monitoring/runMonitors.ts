import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { queueEmail } from "@/lib/email/sendEmail";
import { DEFAULT_MONITOR_INTERVAL_DAYS } from "@/lib/monitors/constants";

type MonitorRow = {
  id: string;
  organization_id: string;
  name: string;
  monitor_type: string;
  status: string;
  config: Record<string, unknown>;
  workflow_instance_id: string | null;
  document_id: string | null;
  vendor_id: string | null;
  monitored_date: string | null;
  organizations?: { name?: string } | { name?: string }[] | null;
};

export type MonitorEvaluation = {
  status: "ok" | "alert" | "skipped";
  message: string;
  details?: Record<string, unknown>;
};

function intervalDaysFromConfig(config: Record<string, unknown>): number {
  const days = config.interval_days ?? config.intervalDays;
  return typeof days === "number" && days > 0 ? days : DEFAULT_MONITOR_INTERVAL_DAYS;
}

function daysUntil(dateIso: string): number {
  const target = new Date(dateIso);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

async function evaluateMonitor(monitor: MonitorRow): Promise<MonitorEvaluation> {
  const supabase = createServiceClient();
  const config = monitor.config ?? {};
  const leadDays = typeof config.lead_days === "number" ? config.lead_days : 30;

  if (monitor.monitor_type === "workflow_due_date" && monitor.workflow_instance_id) {
    const { data: workflow } = await supabase
      .from("workflow_instances")
      .select("id, title, status, due_date, metadata")
      .eq("id", monitor.workflow_instance_id)
      .single();

    if (!workflow?.due_date) {
      return { status: "skipped", message: "Workflow has no due date" };
    }

    const remaining = daysUntil(workflow.due_date);
    if (["completed", "cancelled", "approved"].includes(workflow.status)) {
      return { status: "skipped", message: `Workflow is ${workflow.status}` };
    }

    if (remaining <= leadDays) {
      return {
        status: "alert",
        message: `Workflow "${workflow.title}" is due in ${remaining} day(s)`,
        details: { dueDate: workflow.due_date, daysRemaining: remaining, workflowStatus: workflow.status },
      };
    }

    return {
      status: "ok",
      message: `Workflow due in ${remaining} day(s)`,
      details: { dueDate: workflow.due_date, daysRemaining: remaining },
    };
  }

  if (monitor.monitor_type === "document_expiration") {
    let expirationDate = monitor.monitored_date;
    const meta = config as { expirationDate?: string };

    if (!expirationDate && meta.expirationDate) expirationDate = meta.expirationDate;

    if (!expirationDate && monitor.document_id) {
      const { data: version } = await supabase
        .from("document_versions")
        .select("id")
        .eq("document_id", monitor.document_id)
        .order("version_number", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (version) {
        const { data: fields } = await supabase
          .from("document_parsed_fields")
          .select("field_value")
          .eq("document_version_id", version.id)
          .in("field_key", ["expiration_date", "coi_expiration_date", "policy_expiration"])
          .order("created_at", { ascending: false })
          .limit(1);
        expirationDate = fields?.[0]?.field_value ?? null;
      }
    }

    if (!expirationDate && monitor.workflow_instance_id) {
      const { data: workflow } = await supabase
        .from("workflow_instances")
        .select("metadata")
        .eq("id", monitor.workflow_instance_id)
        .single();
      const wfMeta = (workflow?.metadata ?? {}) as Record<string, string | null>;
      expirationDate = wfMeta.expiration_date ?? null;
    }

    if (!expirationDate) {
      return { status: "skipped", message: "No expiration date configured for this monitor" };
    }

    const remaining = daysUntil(expirationDate);
    if (remaining <= leadDays) {
      return {
        status: "alert",
        message: `Document or certificate expires in ${remaining} day(s)`,
        details: { expirationDate, daysRemaining: remaining },
      };
    }

    return {
      status: "ok",
      message: `Expiration in ${remaining} day(s)`,
      details: { expirationDate, daysRemaining: remaining },
    };
  }

  if (monitor.monitor_type === "custom_reminder") {
    const customMessage =
      typeof config.message === "string" && config.message.trim()
        ? config.message.trim()
        : `Scheduled reminder: ${monitor.name}`;
    return { status: "alert", message: customMessage, details: { custom: true } };
  }

  return { status: "ok", message: "Monitor checked", details: { monitorType: monitor.monitor_type } };
}

async function scheduleMonitorAlert(monitor: MonitorRow, evaluation: MonitorEvaluation) {
  const orgRow = monitor.organizations;
  const orgName = Array.isArray(orgRow) ? orgRow[0]?.name : orgRow?.name;
  const config = monitor.config ?? {};
  const recipientEmail = config.recipientEmail as string | undefined;

  if (!recipientEmail || evaluation.status !== "alert") return;

  await queueEmail({
    organizationId: monitor.organization_id,
    to: recipientEmail,
    templateKey: "monitor_alert",
    subject: `Monitor alert: ${monitor.name}`,
    variables: {
      organizationName: orgName ?? "Your organization",
      monitorName: monitor.name,
      message: evaluation.message,
    },
  });
}

function scheduleNextMonitorRun(config: Record<string, unknown>): string {
  const next = new Date();
  next.setDate(next.getDate() + intervalDaysFromConfig(config));
  next.setHours(6, 0, 0, 0);
  return next.toISOString();
}

export async function runMonitorById(monitorId: string, organizationId?: string): Promise<{
  runId: string | null;
  evaluation: MonitorEvaluation;
}> {
  const supabase = createServiceClient();

  let query = supabase
    .from("monitors")
    .select("*, organizations(name)")
    .eq("id", monitorId);

  if (organizationId) query = query.eq("organization_id", organizationId);

  const { data: monitor } = await query.single();
  if (!monitor || monitor.status !== "active") {
    throw new Error("Monitor not found or not active");
  }

  const startedAt = new Date().toISOString();
  const evaluation = await evaluateMonitor(monitor as MonitorRow);

  const runStatus = evaluation.status === "skipped" ? "skipped" : "success";

  const { data: run } = await supabase
    .from("monitor_runs")
    .insert({
      organization_id: monitor.organization_id,
      monitor_id: monitor.id,
      status: runStatus,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      result: evaluation,
    })
    .select("id")
    .single();

  await scheduleMonitorAlert(monitor as MonitorRow, evaluation);

  await supabase
    .from("monitors")
    .update({
      last_run_at: startedAt,
      next_run_at: scheduleNextMonitorRun((monitor.config as Record<string, unknown>) ?? {}),
    })
    .eq("id", monitor.id);

  await createAuditLog({
    organizationId: monitor.organization_id,
    actorType: "system",
    action: evaluation.status === "alert" ? "monitor.alert" : "monitor.run",
    targetType: "monitor",
    targetId: monitor.id,
    metadata: { runId: run?.id, evaluation: evaluation.message },
  });

  return { runId: run?.id ?? null, evaluation };
}

export async function runDueMonitors(): Promise<{ processed: number; failed: number }> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: dueMonitors } = await supabase
    .from("monitors")
    .select("id")
    .eq("status", "active")
    .lte("next_run_at", now);

  let processed = 0;
  let failed = 0;

  for (const row of dueMonitors ?? []) {
    try {
      await runMonitorById(row.id);
      processed++;
    } catch {
      failed++;
    }
  }

  return { processed, failed };
}

export function computeNextRunAt(daysFromNow = 1): string {
  const next = new Date();
  next.setDate(next.getDate() + daysFromNow);
  return next.toISOString();
}
