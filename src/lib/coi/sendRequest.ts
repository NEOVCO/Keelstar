import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { createMagicLink } from "@/lib/magic-links/createMagicLink";
import { sendEmail } from "@/lib/email/sendEmail";
import { vendorCoiRequestEmail } from "@/lib/email/templates/coi";
import { incrementUsage } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import { scheduleCoiRequestReminders } from "./scheduleReminders";
import { COI_MAGIC_LINK_PURPOSE, COI_MAGIC_LINK_EXPIRY_DAYS } from "./constants";
import { buildCoiExternalUrl, saveWorkflowMagicLinkUrl } from "./magicLinkUrl";
import {
  resolveVendorOutboundCc,
  withStoredCc,
  type VendorOutboundEmailOptions,
} from "@/lib/email/outboundCc";

export async function sendCoiRequestEmail(
  workflowId: string,
  options?: VendorOutboundEmailOptions
) {
  let organizationId: string;
  let userId: string;
  let userEmail: string;

  if (options?.skipAuth && options.userId) {
    const supabase = createServiceClient();
    const { data: wf } = await supabase
      .from("workflow_instances")
      .select("organization_id, created_by")
      .eq("id", workflowId)
      .single();
    if (!wf) throw new Error("Workflow not found");
    organizationId = wf.organization_id;
    userId = options.userId;
    userEmail = "";
  } else {
    const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
    organizationId = ctx.organization.id;
    userId = ctx.user.id;
    userEmail = ctx.user.email;
  }

  const supabase = createServiceClient();

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .select("*, vendors(*)")
    .eq("id", workflowId)
    .eq("organization_id", organizationId)
    .single();

  if (error || !workflow) throw new Error("COI request not found");

  const vendor = workflow.vendors as { id: string; name: string; email: string | null } | null;
  const metadata = workflow.metadata as Record<string, unknown>;
  const recipientEmail = (metadata.recipient_email as string) ?? vendor?.email;
  if (!recipientEmail) throw new Error("Recipient email required");

  const { data: task } = await supabase
    .from("tasks")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!task) throw new Error("Upload task not found");

  let externalParticipantId: string;
  const { data: existingParticipant } = await supabase
    .from("external_participants")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("email", recipientEmail)
    .maybeSingle();

  if (existingParticipant) {
    externalParticipantId = existingParticipant.id;
  } else {
    const { data: participant, error: pError } = await supabase
      .from("external_participants")
      .insert({
        organization_id: organizationId,
        email: recipientEmail,
        name: vendor?.name ?? null,
        company: vendor?.name ?? null,
      })
      .select("id")
      .single();
    if (pError) throw new Error(pError.message);
    externalParticipantId = participant.id;
  }

  await supabase
    .from("tasks")
    .update({ assignee_external_id: externalParticipantId })
    .eq("id", task.id);

  const { id: linkId, token } = await createMagicLink({
    organizationId,
    externalParticipantId,
    workflowInstanceId: workflowId,
    taskId: task.id,
    purpose: COI_MAGIC_LINK_PURPOSE,
    expiresInDays: COI_MAGIC_LINK_EXPIRY_DAYS,
    maxUses: 10,
    createdBy: userId,
  });

  await supabase
    .from("magic_links")
    .update({
      vendor_id: workflow.vendor_id,
      external_email: recipientEmail,
      status: "active",
    })
    .eq("id", linkId);

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", organizationId)
    .single();

  const coiUrl = buildCoiExternalUrl(token);
  const emailContent = vendorCoiRequestEmail({
    organizationName: org?.name ?? "Organization",
    vendorName: vendor?.name ?? "Vendor",
    dueDate: workflow.due_date ? new Date(workflow.due_date).toLocaleDateString() : "—",
    message: (metadata.message as string) ?? undefined,
    magicLinkUrl: coiUrl,
    requesterName: (metadata.requester_name as string) ?? undefined,
  });

  const cc = resolveVendorOutboundCc(metadata, options, userEmail);

  await sendEmail({
    organizationId,
    to: recipientEmail,
    templateKey: emailContent.templateKey,
    subject: emailContent.subject,
    variables: {
      organizationName: org?.name ?? "",
      vendorName: vendor?.name ?? "",
      dueDate: workflow.due_date ?? "",
      actionUrl: coiUrl,
      magicLinkUrl: coiUrl,
      message: (metadata.message as string) ?? "",
    },
    recipientType: "external",
    recipientId: externalParticipantId,
    cc,
  });

  const sentAt = new Date().toISOString();
  await supabase
    .from("workflow_instances")
    .update({
      status: "sent",
      metadata: withStoredCc(
        { ...metadata, sent_at: sentAt, magic_link_url: coiUrl, magic_link_updated_at: sentAt },
        options?.ccMe,
        userEmail
      ),
    })
    .eq("id", workflowId);

  await scheduleCoiRequestReminders(
    workflowId,
    organizationId,
    recipientEmail,
    new Date(workflow.due_date)
  );
  await incrementUsage(organizationId, "coi_requests");

  await createAuditLog({
    organizationId,
    actorType: "user",
    actorId: userId,
    actorEmail: userEmail || undefined,
    action: "coi_request.sent",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { vendorEmail: recipientEmail, magicLinkId: linkId },
  });

  await createAuditLog({
    organizationId,
    actorType: "system",
    action: "coi_magic_link.created",
    targetType: "magic_link",
    targetId: linkId,
    metadata: { workflowId },
  });

  trackEvent("coi_request_sent", { workflowId });
  trackEvent("first_coi_request_sent", { workflowId });

  return { magicLinkUrl: coiUrl, linkId };
}
