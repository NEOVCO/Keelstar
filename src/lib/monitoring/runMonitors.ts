import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { queueEmail } from "@/lib/email/sendEmail";

export async function runDueMonitors(): Promise<{ processed: number; failed: number }> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: dueMonitors } = await supabase
    .from("monitors")
    .select("*, organizations(name)")
    .eq("status", "active")
    .lte("next_run_at", now);

  let processed = 0;
  let failed = 0;

  for (const monitor of dueMonitors ?? []) {
    const idempotencyKey = `monitor-run-${monitor.id}-${now.slice(0, 10)}`;

    const { data: existingRun } = await supabase
      .from("monitor_runs")
      .select("id")
      .eq("monitor_id", monitor.id)
      .gte("started_at", now.slice(0, 10))
      .limit(1);

    if (existingRun?.length) continue;

    const startedAt = new Date().toISOString();

    try {
      const { data: run } = await supabase
        .from("monitor_runs")
        .insert({
          organization_id: monitor.organization_id,
          monitor_id: monitor.id,
          status: "success",
          started_at: startedAt,
          completed_at: new Date().toISOString(),
          result: { monitorType: monitor.monitor_type },
        })
        .select("id")
        .single();

      const orgName = (monitor.organizations as { name?: string })?.name ?? "Your organization";

      const { data: reminderRules } = await supabase
        .from("reminder_rules")
        .select("*")
        .eq("monitor_id", monitor.id)
        .eq("is_active", true);

      if (reminderRules?.length) {
        const config = monitor.config as Record<string, unknown>;
        const recipientEmail = config.recipientEmail as string | undefined;

        if (recipientEmail) {
          await queueEmail({
            organizationId: monitor.organization_id,
            to: recipientEmail,
            templateKey: "monitor_alert",
            subject: `Monitor alert: ${monitor.name}`,
            variables: {
              organizationName: orgName,
              monitorName: monitor.name,
              message: `Your ${monitor.name} monitor has run. Please review.`,
            },
          });
        }
      }

      const nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + 1);

      await supabase
        .from("monitors")
        .update({
          last_run_at: startedAt,
          next_run_at: nextRun.toISOString(),
        })
        .eq("id", monitor.id);

      await createAuditLog({
        organizationId: monitor.organization_id,
        actorType: "system",
        action: "monitor.run",
        targetType: "monitor",
        targetId: monitor.id,
        metadata: { runId: run?.id, idempotencyKey },
      });

      processed++;
    } catch {
      await supabase.from("monitor_runs").insert({
        organization_id: monitor.organization_id,
        monitor_id: monitor.id,
        status: "failure",
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        error_message: "Monitor run failed",
      });
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
