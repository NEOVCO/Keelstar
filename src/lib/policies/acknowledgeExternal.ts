import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { validateMagicLink, useMagicLink } from "@/lib/magic-links/validateMagicLink";
import { sendEmail } from "@/lib/email/sendEmail";
import { internalPolicyAcknowledgedEmail } from "@/lib/email/templates/policies";
import { trackEvent } from "@/lib/analytics/track";
import { cancelPolicyReminders } from "./scheduleReminders";
import { POLICY_DOCUMENT_TYPE, POLICY_MAGIC_LINK_PURPOSE } from "./constants";

const acknowledgeSchema = z.object({
  acknowledgedName: z.string().min(2).max(200),
  agreed: z.literal(true),
});

export async function acknowledgePolicyExternal(
  rawToken: string,
  input: z.infer<typeof acknowledgeSchema>
) {
  const data = acknowledgeSchema.parse(input);

  const result = await validateMagicLink(rawToken);
  if (!result.valid) {
    const reasons = {
      not_found: "Invalid link",
      expired: "Link expired",
      revoked: "Link revoked",
      max_uses: "Link already used",
    };
    throw new Error(reasons[result.reason]);
  }

  if (result.link.purpose !== POLICY_MAGIC_LINK_PURPOSE) {
    throw new Error("Invalid link purpose");
  }

  const supabase = createServiceClient();
  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name, email)")
    .eq("id", result.link.workflowInstanceId)
    .single();

  if (!workflow) throw new Error("Request not found");
  if (["completed", "cancelled"].includes(workflow.status)) {
    throw new Error("This policy has already been acknowledged");
  }

  const { data: participant } = await supabase
    .from("external_participants")
    .select("email")
    .eq("id", result.link.externalParticipantId)
    .single();

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id, title")
    .eq("workflow_instance_id", workflow.id)
    .eq("document_type", POLICY_DOCUMENT_TYPE)
    .maybeSingle();

  if (!document?.current_version_id) {
    throw new Error("Policy document is not available");
  }

  const acknowledgedAt = new Date().toISOString();
  const metadata = (workflow.metadata ?? {}) as Record<string, unknown>;
  const policyTitle = (metadata.policy_title as string) ?? document.title;

  const fieldRows = [
    { field_key: "policy_title", field_value: policyTitle },
    { field_key: "policy_version", field_value: (metadata.policy_version as string) ?? "" },
    { field_key: "acknowledged_name", field_value: data.acknowledgedName },
    { field_key: "acknowledged_at", field_value: acknowledgedAt },
  ];

  for (const field of fieldRows) {
    const { data: existing } = await supabase
      .from("document_parsed_fields")
      .select("id")
      .eq("document_version_id", document.current_version_id)
      .eq("field_key", field.field_key)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("document_parsed_fields")
        .update({
          field_value: field.field_value,
          extraction_source: "manual",
          confidence: 1,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("document_parsed_fields").insert({
        organization_id: workflow.organization_id,
        document_version_id: document.current_version_id,
        field_key: field.field_key,
        field_value: field.field_value,
        field_type: field.field_key.includes("at") ? "date" : "text",
        extraction_source: "manual",
        confidence: 1,
      });
    }
  }

  await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: acknowledgedAt,
    })
    .eq("id", result.link.taskId);

  await supabase
    .from("workflow_instances")
    .update({
      status: "completed",
      completed_at: acknowledgedAt,
      metadata: {
        ...metadata,
        acknowledged_name: data.acknowledgedName,
        acknowledged_at: acknowledgedAt,
      },
    })
    .eq("id", workflow.id);

  await useMagicLink(result.link.id);
  await supabase.from("magic_links").update({ status: "used" }).eq("id", result.link.id);
  await cancelPolicyReminders(workflow.id, workflow.organization_id);

  const person = workflow.vendors as { name: string; email: string | null } | null;

  await createAuditLog({
    organizationId: workflow.organization_id,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    actorEmail: participant?.email ?? undefined,
    action: "policy_acknowledged",
    targetType: "workflow_instance",
    targetId: workflow.id,
    metadata: {
      acknowledgedName: data.acknowledgedName,
      acknowledgedAt,
      policyTitle,
    },
  });

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", workflow.organization_id)
    .single();

  const base = process.env.APP_URL ?? "http://localhost:3000";
  const workflowUrl = `${base}/app/workflows/${workflow.id}`;
  const emailContent = internalPolicyAcknowledgedEmail({
    organizationName: org?.name ?? "Organization",
    personName: person?.name ?? data.acknowledgedName,
    policyTitle,
    acknowledgedAt: new Date(acknowledgedAt).toLocaleString(),
    workflowUrl,
  });

  const { data: owner } = await supabase
    .from("workflow_instances")
    .select("owner_id, created_by")
    .eq("id", workflow.id)
    .single();

  const notifyUserId = owner?.owner_id ?? owner?.created_by;
  if (notifyUserId) {
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(notifyUserId);
    if (user?.email) {
      await sendEmail({
        organizationId: workflow.organization_id,
        to: user.email,
        templateKey: emailContent.templateKey,
        subject: emailContent.subject,
        variables: {
          organizationName: org?.name ?? "",
          personName: person?.name ?? data.acknowledgedName,
          policyTitle,
          acknowledgedAt,
          workflowUrl,
        },
        recipientType: "member",
        recipientId: notifyUserId,
      }).catch(() => {});
    }
  }

  trackEvent("policy_acknowledged", { workflowId: workflow.id });

  return {
    workflowId: workflow.id,
    acknowledgedAt,
    acknowledgedName: data.acknowledgedName,
  };
}
