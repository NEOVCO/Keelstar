import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createMagicLink } from "@/lib/magic-links/createMagicLink";
import { sendEmail } from "@/lib/email/sendEmail";
import { vendorW9CorrectionEmail } from "@/lib/email/templates/w9";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { W9_MAGIC_LINK_PURPOSE, W9_MAGIC_LINK_EXPIRY_DAYS } from "./constants";
import { buildW9ExternalUrl, saveWorkflowMagicLinkUrl } from "./magicLinkUrl";

export async function sendCorrectionEmail(workflowId: string, reason: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_APPROVE);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*, vendors(*)")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Request not found");

  const metadata = workflow.metadata as Record<string, string | null>;
  const vendor = workflow.vendors as { id: string; name: string; email: string | null } | null;
  const recipientEmail = metadata.recipient_email ?? vendor?.email;
  if (!recipientEmail) throw new Error("Recipient email required");

  const { data: task } = await supabase
    .from("tasks")
    .insert({
      organization_id: ctx.organization.id,
      workflow_instance_id: workflowId,
      title: "Upload corrected W-9",
      description: reason,
      status: "pending",
      assignee_type: "external",
      due_date: workflow.due_date,
    })
    .select("id")
    .single();

  if (!task) throw new Error("Failed to create correction task");

  const { data: participant } = await supabase
    .from("external_participants")
    .select("id")
    .eq("organization_id", ctx.organization.id)
    .eq("email", recipientEmail)
    .single();

  if (!participant) throw new Error("External participant not found");

  const { id: linkId, token } = await createMagicLink({
    organizationId: ctx.organization.id,
    externalParticipantId: participant.id,
    workflowInstanceId: workflowId,
    taskId: task.id,
    purpose: W9_MAGIC_LINK_PURPOSE,
    expiresInDays: W9_MAGIC_LINK_EXPIRY_DAYS,
    maxUses: 10,
    createdBy: ctx.user.id,
  });

  await supabase
    .from("magic_links")
    .update({ vendor_id: workflow.vendor_id, external_email: recipientEmail, status: "active" })
    .eq("id", linkId);

  const { data: org } = await supabase.from("organizations").select("name").eq("id", ctx.organization.id).single();
  const w9Url = buildW9ExternalUrl(token);
  await saveWorkflowMagicLinkUrl(workflowId, w9Url);

  const email = vendorW9CorrectionEmail({
    organizationName: org?.name ?? "",
    vendorName: vendor?.name ?? "",
    dueDate: workflow.due_date ?? "",
    magicLinkUrl: w9Url,
    rejectionReason: reason,
  });

  await sendEmail({
    organizationId: ctx.organization.id,
    to: recipientEmail,
    templateKey: email.templateKey,
    subject: email.subject,
    variables: {
      organizationName: org?.name ?? "",
      vendorName: vendor?.name ?? "",
      rejectionReason: reason,
      actionUrl: w9Url,
    },
    recipientType: "external",
    recipientId: participant.id,
  });

  await supabase.from("documents").update({ status: "pending" }).eq("workflow_instance_id", workflowId);

  return { magicLinkUrl: w9Url };
}
