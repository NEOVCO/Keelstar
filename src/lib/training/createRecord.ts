import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { assertUsageLimit } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import { isWorkforceVendor } from "@/lib/vendors/workforce";
import { TRAINING_WORKFLOW_TYPE, TRAINING_DOCUMENT_TYPE } from "./constants";

const createTrainingRecordSchema = z.object({
  vendorId: z.string().uuid(),
  courseName: z.string().min(1).max(300),
  provider: z.string().max(300).optional(),
  notes: z.string().max(2000).optional(),
});

export async function createTrainingRecord(input: z.infer<typeof createTrainingRecordSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = createTrainingRecordSchema.parse(input);
  const supabase = createServiceClient();

  await assertUsageLimit(ctx.organization.id, "training_active_records", ctx.user.id);

  const { data: person, error: personError } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", data.vendorId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (personError || !person) throw new Error("Person not found");
  if (!isWorkforceVendor(person)) {
    throw new Error("Training records require an employee or contractor from your People roster");
  }

  const title = `Training — ${person.name} — ${data.courseName}`;

  const { data: workflow, error: wfError } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: ctx.organization.id,
      type: TRAINING_WORKFLOW_TYPE,
      title,
      status: "draft",
      vendor_id: data.vendorId,
      owner_id: ctx.user.id,
      created_by: ctx.user.id,
      metadata: {
        course_name: data.courseName,
        person_name: person.name,
        provider: data.provider ?? null,
        notes: data.notes ?? null,
        certification_name: data.courseName,
      },
    })
    .select("*")
    .single();

  if (wfError) throw new Error(wfError.message);

  const { data: document, error: docError } = await supabase
    .from("documents")
    .insert({
      organization_id: ctx.organization.id,
      title: data.courseName,
      document_type: TRAINING_DOCUMENT_TYPE,
      status: "pending",
      workflow_instance_id: workflow.id,
      vendor_id: data.vendorId,
      created_by: ctx.user.id,
    })
    .select("id")
    .single();

  if (docError) throw new Error(docError.message);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "training_record.created",
    targetType: "workflow_instance",
    targetId: workflow.id,
    metadata: { vendorId: data.vendorId, documentId: document.id, courseName: data.courseName },
  });

  trackEvent("training_record_created", { workflowId: workflow.id });

  return { workflow, document, person };
}

export { createTrainingRecordSchema };
