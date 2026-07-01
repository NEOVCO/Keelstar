import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertExclusionCheckLimit, incrementExclusionCheckUsage } from "@/lib/billing/exclusionLimits";
import { trackEvent } from "@/lib/analytics/track";
import {
  screenInputSchema,
  executeProviderScreening,
  createScreeningWorkflow,
  type RunScreeningInput,
} from "./screeningCore";
import type { ExclusionSource } from "./constants";

export async function runExclusionScreening(input: RunScreeningInput) {
  const data = screenInputSchema.parse(input);
  const ctx = input.skipAuth
    ? {
        organization: { id: input.organizationId! },
        user: { id: input.userId ?? null, email: input.userEmail ?? "system@keelstar.com" },
      }
    : await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);

  if (!input.skipAuth) {
    await assertExclusionCheckLimit(ctx.organization.id, ctx.user.id!);
  }

  const supabase = createServiceClient();
  const orgId = ctx.organization.id;
  let subjectId = data.screeningSubjectId;

  if (!subjectId && data.saveSubject) {
    if (data.vendorId) {
      const { data: vendor } = await supabase
        .from("vendors")
        .select("id")
        .eq("id", data.vendorId)
        .eq("organization_id", orgId)
        .single();
      if (!vendor) throw new Error("Vendor not found");
    }

    const { data: subject, error: subErr } = await supabase
      .from("screening_subjects")
      .insert({
        organization_id: orgId,
        subject_type: data.subjectType,
        vendor_id: data.vendorId ?? null,
        display_name: data.displayName,
        first_name: data.firstName ?? null,
        last_name: data.lastName ?? null,
        organization_name: data.organizationName ?? null,
        date_of_birth: data.dateOfBirth ?? null,
        npi: data.npi ?? null,
        owner_id: ctx.user.id,
        created_by: ctx.user.id,
        status: "active",
      })
      .select("id")
      .single();

    if (subErr) throw new Error(subErr.message);
    subjectId = subject.id;

    await createAuditLog({
      organizationId: orgId,
      actorType: input.skipAuth ? "system" : "user",
      actorId: ctx.user.id ?? undefined,
      action: "exclusion_subject.created",
      targetType: "screening_subject",
      targetId: subjectId,
    });
  }

  if (!subjectId) throw new Error("screeningSubjectId required");

  const workflowId = await createScreeningWorkflow(
    orgId,
    data.displayName,
    data.vendorId,
    ctx.user.id,
    data.sources,
    data.runType
  );

  const { data: run, error: runErr } = await supabase
    .from("screening_runs")
    .insert({
      organization_id: orgId,
      screening_subject_id: subjectId,
      workflow_instance_id: workflowId,
      monitor_id: data.monitorId ?? null,
      run_type: data.runType,
      sources: data.sources,
      status: "running",
      started_at: new Date().toISOString(),
      created_by: ctx.user.id,
    })
    .select("id")
    .single();

  if (runErr) throw new Error(runErr.message);

  await createAuditLog({
    organizationId: orgId,
    actorType: input.skipAuth ? "system" : "user",
    actorId: ctx.user.id ?? undefined,
    action: "exclusion_check.started",
    targetType: "screening_run",
    targetId: run.id,
  });

  const { hasPotentialMatch, resultIds } = await executeProviderScreening({
    orgId,
    runId: run.id,
    subjectId,
    sources: data.sources as ExclusionSource[],
    subjectInput: {
      displayName: data.displayName,
      firstName: data.firstName,
      lastName: data.lastName,
      organizationName: data.organizationName,
      dateOfBirth: data.dateOfBirth,
      npi: data.npi,
      subjectType: data.subjectType,
    },
  });

  await supabase
    .from("screening_subjects")
    .update({ status: hasPotentialMatch ? "review_needed" : "cleared" })
    .eq("id", subjectId);

  await supabase
    .from("screening_runs")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", run.id);

  if (!input.skipAuth && data.runType === "ad_hoc") {
    await incrementExclusionCheckUsage(orgId);
  }

  await createAuditLog({
    organizationId: orgId,
    actorType: input.skipAuth ? "system" : "user",
    actorId: ctx.user.id ?? undefined,
    action: "exclusion_check.completed",
    targetType: "screening_run",
    targetId: run.id,
    metadata: { hasPotentialMatch },
  });

  trackEvent(hasPotentialMatch ? "exclusion_potential_match_found" : "exclusion_no_match_found", {
    organizationId: orgId,
  });

  if (data.createMonthlyMonitor && !input.skipAuth && ctx.user.id) {
    const { createExclusionMonitor } = await import("./createMonitor");
    await createExclusionMonitor({ screeningSubjectId: subjectId, ownerId: ctx.user.id });
  }

  if (hasPotentialMatch && !input.skipAuth && ctx.user.email) {
    const { sendPotentialMatchAlert } = await import("./sendAlert");
    await sendPotentialMatchAlert({
      organizationId: orgId,
      subjectName: data.displayName,
      resultId: resultIds[0],
      ownerEmail: ctx.user.email,
    });
  }

  return { runId: run.id, subjectId, workflowId, resultIds, hasPotentialMatch };
}
