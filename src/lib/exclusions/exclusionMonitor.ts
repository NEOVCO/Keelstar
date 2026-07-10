import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { EXCLUSION_MONITOR_TYPE, EXCLUSION_MONITOR_INTERVAL_DAYS } from "./constants";
import { runExclusionScreening } from "./runScreening";

export async function runExclusionMonitor(): Promise<{
  processed: number;
  errors: number;
}> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: monitors } = await supabase
    .from("monitors")
    .select("*, screening_subjects:target_id")
    .eq("monitor_type", EXCLUSION_MONITOR_TYPE)
    .eq("status", "active")
    .lte("next_run_at", now);

  let processed = 0;
  let errors = 0;

  for (const monitor of monitors ?? []) {
    try {
      const config = monitor.config as {
        screening_subject_id?: string;
        sources?: string[];
        owner_id?: string;
      };

      const subjectId = config.screening_subject_id ?? monitor.target_id;
      if (!subjectId) continue;

      const today = new Date().toISOString().slice(0, 10);
      const { data: existingRun } = await supabase
        .from("screening_runs")
        .select("id")
        .eq("monitor_id", monitor.id)
        .eq("status", "completed")
        .gte("completed_at", `${today}T00:00:00Z`)
        .maybeSingle();

      if (existingRun) {
        const nextRun = new Date();
        nextRun.setDate(nextRun.getDate() + EXCLUSION_MONITOR_INTERVAL_DAYS);
        nextRun.setHours(6, 0, 0, 0);
        await supabase
          .from("monitors")
          .update({ next_run_at: nextRun.toISOString(), last_run_at: now })
          .eq("id", monitor.id);
        continue;
      }

      const { data: subject } = await supabase
        .from("screening_subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      if (!subject) continue;

      await runExclusionScreening({
        subjectType: subject.subject_type,
        vendorId: subject.vendor_id ?? undefined,
        displayName: subject.display_name,
        firstName: subject.first_name ?? undefined,
        lastName: subject.last_name ?? undefined,
        organizationName: subject.organization_name ?? undefined,
        dateOfBirth: subject.date_of_birth ?? undefined,
        npi: subject.npi ?? undefined,
        sources: (config.sources ?? ["oig"]).filter((s): s is "oig" => s === "oig"),
        saveSubject: false,
        createMonthlyMonitor: false,
        screeningSubjectId: subject.id,
        runType: "scheduled",
        monitorId: monitor.id,
        skipAuth: true,
        organizationId: monitor.organization_id,
        userId: config.owner_id ?? null,
      });

      const nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + EXCLUSION_MONITOR_INTERVAL_DAYS);
      nextRun.setHours(6, 0, 0, 0);

      await supabase
        .from("monitors")
        .update({ next_run_at: nextRun.toISOString(), last_run_at: now })
        .eq("id", monitor.id);

      await createAuditLog({
        organizationId: monitor.organization_id,
        actorType: "system",
        action: "exclusion_monitor.run",
        targetType: "monitor",
        targetId: monitor.id,
      });

      processed += 1;
    } catch (err) {
      errors += 1;
      await createAuditLog({
        organizationId: monitor.organization_id,
        actorType: "system",
        action: "exclusion_monitor.failed",
        targetType: "monitor",
        targetId: monitor.id,
        metadata: { error: String(err) },
      });
    }
  }

  return { processed, errors };
}
