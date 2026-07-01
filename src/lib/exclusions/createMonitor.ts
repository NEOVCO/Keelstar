import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertExclusionMonitorLimit } from "@/lib/billing/exclusionLimits";
import { trackEvent } from "@/lib/analytics/track";
import { EXCLUSION_MONITOR_TYPE, EXCLUSION_MONITOR_INTERVAL_DAYS } from "./constants";

export async function createExclusionMonitor(input: {
  screeningSubjectId: string;
  ownerId?: string;
}) {
  const ctx = await requirePermission(PERMISSIONS.MONITORS_MANAGE);
  const supabase = createServiceClient();
  const ownerId = input.ownerId ?? ctx.user.id;

  await assertExclusionMonitorLimit(ctx.organization.id, ctx.user.id);

  const { data: subject } = await supabase
    .from("screening_subjects")
    .select("*")
    .eq("id", input.screeningSubjectId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!subject) throw new Error("Subject not found");

  const nextRun = new Date();
  nextRun.setDate(nextRun.getDate() + EXCLUSION_MONITOR_INTERVAL_DAYS);
  nextRun.setHours(6, 0, 0, 0);

  const { data: monitor, error } = await supabase
    .from("monitors")
    .insert({
      organization_id: ctx.organization.id,
      name: `Exclusion monitoring — ${subject.display_name}`,
      monitor_type: EXCLUSION_MONITOR_TYPE,
      target_type: "screening_subject",
      target_id: subject.id,
      vendor_id: subject.vendor_id,
      status: "active",
      config: {
        screening_subject_id: subject.id,
        sources: ["oig"],
        owner_id: ownerId,
      },
      next_run_at: nextRun.toISOString(),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase
    .from("screening_subjects")
    .update({ status: "monitoring" })
    .eq("id", subject.id);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    action: "exclusion_monitor.created",
    targetType: "monitor",
    targetId: monitor.id,
    metadata: { screeningSubjectId: subject.id },
  });

  trackEvent("exclusion_monitor_created", { organizationId: ctx.organization.id });

  return monitor;
}
