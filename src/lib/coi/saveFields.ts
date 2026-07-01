import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { COI_FIELD_KEYS, COI_POLICY_TYPES } from "./constants";

const saveCoiFieldsSchema = z.object({
  workflowId: z.string().uuid(),
  fields: z.record(z.string().max(5000).nullable()),
});

export async function saveCoiFields(input: z.infer<typeof saveCoiFieldsSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const data = saveCoiFieldsSchema.parse(input);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, organization_id")
    .eq("id", data.workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Request not found");

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", data.workflowId)
    .eq("document_type", "coi")
    .maybeSingle();

  if (!document?.current_version_id) throw new Error("No document version to update");

  for (const key of Object.keys(data.fields)) {
    if (!COI_FIELD_KEYS.includes(key as (typeof COI_FIELD_KEYS)[number])) continue;
    const value = data.fields[key];
    if (key === "policy_type" && value && !COI_POLICY_TYPES.includes(value as (typeof COI_POLICY_TYPES)[number])) {
      throw new Error("Invalid policy type");
    }

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
        field_type: key.includes("date") ? "date" : "text",
        confidence: 1.0,
        extraction_source: "manual",
        is_override: true,
        overridden_by: ctx.user.id,
        overridden_at: new Date().toISOString(),
      });
    }
  }

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "coi_fields.updated",
    targetType: "document",
    targetId: document.id,
    metadata: { fields: Object.keys(data.fields) },
  });

  trackEvent("coi_fields_saved", { workflowId: data.workflowId });

  return { success: true };
}

export async function getCoiFieldsForWorkflow(workflowId: string, organizationId: string) {
  const supabase = createServiceClient();
  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", "coi")
    .maybeSingle();

  if (!document?.current_version_id) return [];

  const { data: fields } = await supabase
    .from("document_parsed_fields")
    .select("field_key, field_value, confidence, extraction_source")
    .eq("document_version_id", document.current_version_id);

  return fields ?? [];
}

export { saveCoiFieldsSchema };
