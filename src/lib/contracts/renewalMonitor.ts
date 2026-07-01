import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import {
  CONTRACT_MONITOR_TYPE,
  CONTRACT_NOTICE_WINDOW_DAYS,
  CONTRACT_RENEWAL_APPROACHING_DAYS,
} from "./constants";
import {
  daysUntilDate,
  parseAutoRenews,
  parseNoticePeriodDays,
  computeLatestNoticeDate,
} from "./noticeDate";
import { scheduleContractReminders } from "./scheduleReminders";

export function daysUntilRenewal(renewalDate: Date, from = new Date()): number {
  return daysUntilDate(renewalDate, from);
}

export type ContractMonitoringStatus =
  | "renewal_monitoring"
  | "notice_window_open"
  | "renewal_approaching"
  | "auto_renew_risk"
  | "expired";

export function computeContractMonitoringStatus(
  renewalDate: Date,
  latestNoticeDate: Date | null,
  autoRenews: boolean,
  from = new Date()
): ContractMonitoringStatus {
  const daysToRenewal = daysUntilRenewal(renewalDate, from);
  if (daysToRenewal < 0) return "expired";

  if (latestNoticeDate && autoRenews) {
    const daysToNotice = daysUntilDate(latestNoticeDate, from);
    if (daysToNotice < 0) return "auto_renew_risk";
  }

  if (latestNoticeDate) {
    const daysToNotice = daysUntilDate(latestNoticeDate, from);
    if (daysToNotice <= CONTRACT_NOTICE_WINDOW_DAYS) return "notice_window_open";
  }

  if (daysToRenewal <= CONTRACT_RENEWAL_APPROACHING_DAYS) return "renewal_approaching";

  return "renewal_monitoring";
}

/** Normalize legacy DB statuses to current model */
export function normalizeContractStatus(status: string): string {
  if (status === "active_monitoring") return "renewal_monitoring";
  if (status === "expiring_soon") return "renewal_approaching";
  if (status === "completed") return "renewed";
  return status;
}

export async function createContractRenewalMonitor(
  workflowId: string,
  organizationId: string,
  documentId: string,
  renewalDate: Date,
  ownerId: string,
  contractName: string,
  config: {
    latestNoticeDate: Date | null;
    noticePeriodDays: number | null;
    autoRenews: boolean;
    createdBy: string | null;
  }
): Promise<string> {
  const supabase = createServiceClient();
  const monitoringStatus = computeContractMonitoringStatus(
    renewalDate,
    config.latestNoticeDate,
    config.autoRenews
  );
  const nextRun = new Date();
  nextRun.setHours(6, 0, 0, 0);
  if (nextRun <= new Date()) nextRun.setDate(nextRun.getDate() + 1);

  await supabase
    .from("monitors")
    .update({ status: "completed" })
    .eq("workflow_instance_id", workflowId)
    .eq("monitor_type", CONTRACT_MONITOR_TYPE)
    .eq("status", "active");

  const { data: monitor, error } = await supabase
    .from("monitors")
    .insert({
      organization_id: organizationId,
      name: `Contract renewal — ${contractName}`,
      monitor_type: CONTRACT_MONITOR_TYPE,
      target_type: "document",
      target_id: documentId,
      workflow_instance_id: workflowId,
      document_id: documentId,
      monitored_date: renewalDate.toISOString(),
      status: "active",
      next_run_at: nextRun.toISOString(),
      created_by: ownerId,
      config: {
        renewalDate: renewalDate.toISOString(),
        noticePeriodDays: config.noticePeriodDays,
        latestNoticeDate: config.latestNoticeDate?.toISOString() ?? null,
        autoRenews: config.autoRenews,
      },
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const { data: existingWf } = await supabase
    .from("workflow_instances")
    .select("metadata")
    .eq("id", workflowId)
    .single();

  await supabase
    .from("workflow_instances")
    .update({
      status: monitoringStatus,
      due_date: renewalDate.toISOString(),
      metadata: {
        ...((existingWf?.metadata as object) ?? {}),
        renewal_date: renewalDate.toISOString(),
        latest_notice_date: config.latestNoticeDate?.toISOString() ?? null,
        notice_period_days: config.noticePeriodDays,
        auto_renewal: config.autoRenews,
        monitoring_activated_at: new Date().toISOString(),
      },
    })
    .eq("id", workflowId);

  await supabase.from("documents").update({ status: monitoringStatus }).eq("id", documentId);

  await scheduleContractReminders({
    workflowInstanceId: workflowId,
    organizationId,
    renewalDate,
    latestNoticeDate: config.latestNoticeDate,
    ownerId,
    createdBy: config.createdBy,
    contractName,
    documentId,
  });

  await createAuditLog({
    organizationId,
    actorType: "system",
    action: "contract.monitor_created",
    targetType: "monitor",
    targetId: monitor.id,
    metadata: { workflowId, renewalDate: renewalDate.toISOString() },
  });

  trackEvent("contract_monitor_created", { workflowId, monitorId: monitor.id });
  return monitor.id;
}

export async function runContractRenewalMonitor(): Promise<{
  updated: number;
  remindersSent: number;
  errors: number;
}> {
  const supabase = createServiceClient();
  const now = new Date();
  let updated = 0;
  let remindersSent = 0;
  let errors = 0;

  const { data: monitors } = await supabase
    .from("monitors")
    .select("*, workflow_instances(id, status, owner_id, created_by, organization_id, metadata)")
    .eq("monitor_type", CONTRACT_MONITOR_TYPE)
    .eq("status", "active")
    .limit(200);

  for (const monitor of monitors ?? []) {
    try {
      if (!monitor.monitored_date || !monitor.workflow_instance_id) continue;

      const renewalDate = new Date(monitor.monitored_date);
      const workflow = monitor.workflow_instances as {
        id: string;
        status: string;
        organization_id: string;
        owner_id: string | null;
        created_by: string | null;
        metadata: Record<string, string | null | boolean>;
      } | null;

      if (!workflow) continue;
      if (["cancelled", "renewed", "terminated", "archived", "completed"].includes(workflow.status)) {
        continue;
      }

      const meta = workflow.metadata ?? {};
      const noticeDays = parseNoticePeriodDays(meta as Record<string, string>);
      const latestNoticeDate =
        meta.latest_notice_date != null
          ? new Date(String(meta.latest_notice_date))
          : noticeDays != null
            ? computeLatestNoticeDate(renewalDate, noticeDays)
            : null;
      const autoRenews = parseAutoRenews(String(meta.auto_renewal ?? ""));

      const newStatus = computeContractMonitoringStatus(
        renewalDate,
        latestNoticeDate,
        autoRenews,
        now
      );
      const normalizedCurrent = normalizeContractStatus(workflow.status);

      if (normalizedCurrent !== newStatus) {
        await supabase.from("workflow_instances").update({ status: newStatus }).eq("id", workflow.id);
        if (monitor.document_id) {
          await supabase.from("documents").update({ status: newStatus }).eq("id", monitor.document_id);
        }

        const auditActions: Record<ContractMonitoringStatus, string> = {
          expired: "contract.expired",
          renewal_approaching: "contract.renewal_approaching",
          notice_window_open: "contract.notice_window_opened",
          auto_renew_risk: "contract.auto_renew_risk_detected",
          renewal_monitoring: "contract.monitor_updated",
        };

        await createAuditLog({
          organizationId: monitor.organization_id,
          actorType: "system",
          action: auditActions[newStatus],
          targetType: "workflow_instance",
          targetId: workflow.id,
          metadata: { renewalDate: monitor.monitored_date },
        });

        if (newStatus === "renewal_approaching") {
          trackEvent("contract_renewal_approaching", { workflowId: workflow.id });
        }
        if (newStatus === "notice_window_open") {
          trackEvent("contract_notice_window_opened", { workflowId: workflow.id });
        }
        if (newStatus === "auto_renew_risk") {
          trackEvent("contract_auto_renew_risk_detected", { workflowId: workflow.id });
        }
        if (newStatus === "expired") {
          trackEvent("contract_renewal_passed", { workflowId: workflow.id });
          await supabase.from("monitors").update({ status: "expired" }).eq("id", monitor.id);
        }
        updated++;
      }

      await supabase
        .from("monitors")
        .update({ last_run_at: now.toISOString(), next_run_at: getNextDailyRun().toISOString() })
        .eq("id", monitor.id);

      await createAuditLog({
        organizationId: monitor.organization_id,
        actorType: "system",
        action: "monitor.run",
        targetType: "monitor",
        targetId: monitor.id,
        metadata: { monitorType: CONTRACT_MONITOR_TYPE },
      });
    } catch {
      errors++;
      await supabase.from("monitors").update({ status: "failed" }).eq("id", monitor.id);
    }
  }

  const { data: dueReminders } = await supabase
    .from("reminders")
    .select("*")
    .eq("status", "scheduled")
    .in("type", ["contract_renewal_internal", "contract_notice_internal"])
    .lte("scheduled_at", now.toISOString())
    .limit(100);

  const templates = await import("@/lib/email/templates/contracts");
  const { sendEmail } = await import("@/lib/email/sendEmail");

  for (const reminder of dueReminders ?? []) {
    try {
      const { data: workflow } = await supabase
        .from("workflow_instances")
        .select("id, organization_id, metadata, status, title, owner_id, created_by")
        .eq("id", reminder.workflow_instance_id)
        .single();

      if (
        !workflow ||
        ["cancelled", "renewed", "terminated", "archived", "completed"].includes(workflow.status)
      ) {
        await supabase.from("reminders").update({ status: "cancelled" }).eq("id", reminder.id);
        continue;
      }

      const metadata = workflow.metadata as Record<string, string | null>;
      const renewalDate = metadata.renewal_date ?? "";
      const latestNoticeDate = metadata.latest_notice_date ?? "";
      const counterparty = metadata.counterparty ?? "";
      const autoRenews = String(metadata.auto_renewal ?? "");

      const { data: org } = await supabase
        .from("organizations")
        .select("name")
        .eq("id", reminder.organization_id)
        .single();

      const workflowUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/app/workflows/${workflow.id}`;

      if (reminder.recipient_email) {
        let email;
        if (reminder.type === "contract_notice_internal") {
          email = templates.contractNoticeDeadlineReminderEmail({
            organizationName: org?.name ?? "",
            contractName: workflow.title,
            counterparty,
            noticeDeadline: latestNoticeDate
              ? new Date(latestNoticeDate).toLocaleDateString()
              : "—",
            workflowUrl,
          });
        } else if (workflow.status === "auto_renew_risk" || parseAutoRenews(autoRenews)) {
          email = templates.contractAutoRenewRiskEmail({
            organizationName: org?.name ?? "",
            contractName: workflow.title,
            counterparty,
            renewalDate: renewalDate ? new Date(renewalDate).toLocaleDateString() : "—",
            workflowUrl,
          });
        } else if (workflow.status === "expired") {
          email = templates.contractExpiredAlertEmail({
            organizationName: org?.name ?? "",
            contractName: workflow.title,
            counterparty,
            renewalDate: renewalDate ? new Date(renewalDate).toLocaleDateString() : "—",
            workflowUrl,
          });
        } else {
          email = templates.contractRenewalReminderEmail({
            organizationName: org?.name ?? "",
            contractName: workflow.title,
            counterparty,
            renewalDate: renewalDate ? new Date(renewalDate).toLocaleDateString() : "—",
            workflowUrl,
          });
        }

        await sendEmail({
          organizationId: reminder.organization_id,
          to: reminder.recipient_email,
          templateKey: email.templateKey,
          subject: email.subject,
          variables: {
            organizationName: org?.name ?? "",
            contractName: workflow.title,
            counterparty,
            renewalDate,
            noticeDeadline: latestNoticeDate,
            workflowUrl,
          },
        });
      }

      await supabase
        .from("reminders")
        .update({ status: "sent", sent_at: now.toISOString() })
        .eq("id", reminder.id);

      const reminderAudit =
        reminder.type === "contract_notice_internal"
          ? "contract.notice_deadline_reminder_sent"
          : "contract.reminder_sent";

      await createAuditLog({
        organizationId: reminder.organization_id,
        actorType: "system",
        action: reminderAudit,
        targetType: "reminder",
        targetId: reminder.id,
        metadata: { window: reminder.reminder_window },
      });

      trackEvent(
        reminder.type === "contract_notice_internal"
          ? "contract_notice_deadline_reminder_sent"
          : "contract_renewal_reminder_sent",
        { workflowId: workflow.id }
      );
      remindersSent++;
    } catch {
      await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id);
      errors++;
    }
  }

  return { updated, remindersSent, errors };
}

function getNextDailyRun(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(6, 0, 0, 0);
  return d;
}

/** @deprecated use scheduleContractReminders from scheduleReminders.ts */
export const scheduleContractRenewalReminders = scheduleContractReminders;
