import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { createMagicLink } from "@/lib/magic-links/createMagicLink";
import { sendEmail } from "@/lib/email/sendEmail";
import { vendorPacketPortalEmail } from "@/lib/email/templates/vendor-packets";
import { incrementUsage } from "@/lib/billing/checkUsageLimit";
import { trackEvent } from "@/lib/analytics/track";
import { scheduleVendorPacketReminders } from "./scheduleReminders";
import { createVendorPacketMonitor } from "./incompleteMonitor";
import {
  VENDOR_PACKET_MAGIC_LINK_PURPOSE,
  VENDOR_PACKET_MAGIC_LINK_EXPIRY_DAYS,
  VENDOR_PACKET_MAGIC_LINK_MAX_USES,
} from "./constants";
import { buildVendorPacketExternalUrl, saveWorkflowMagicLinkUrl } from "./magicLinkUrl";

export async function sendVendorPacketEmail(
  workflowId: string,
  options?: { userId?: string; skipAuth?: boolean }
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

  if (error || !workflow) throw new Error("Vendor packet not found");

  const vendor = workflow.vendors as { id: string; name: string; email: string | null } | null;
  const metadata = workflow.metadata as Record<string, unknown>;
  const recipientEmail = (metadata.recipient_email as string) ?? vendor?.email;
  if (!recipientEmail) throw new Error("Recipient email required");

  const { data: portalTask } = await supabase
    .from("tasks")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("title", "Vendor onboarding portal")
    .maybeSingle();

  if (!portalTask) throw new Error("Portal task not found");

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
    .eq("workflow_instance_id", workflowId)
    .eq("assignee_type", "external");

  const { id: linkId, token } = await createMagicLink({
    organizationId,
    externalParticipantId,
    workflowInstanceId: workflowId,
    taskId: portalTask.id,
    purpose: VENDOR_PACKET_MAGIC_LINK_PURPOSE,
    expiresInDays: VENDOR_PACKET_MAGIC_LINK_EXPIRY_DAYS,
    maxUses: VENDOR_PACKET_MAGIC_LINK_MAX_USES,
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

  const portalUrl = buildVendorPacketExternalUrl(token);
  const checklist = (metadata.checklist as Array<{ label: string }>) ?? [];

  const emailContent = vendorPacketPortalEmail({
    organizationName: org?.name ?? "Organization",
    vendorName: vendor?.name ?? "Vendor",
    dueDate: workflow.due_date ? new Date(workflow.due_date).toLocaleDateString() : "—",
    message: (metadata.message as string) ?? undefined,
    portalUrl,
    itemCount: checklist.length,
  });

  await sendEmail({
    organizationId,
    to: recipientEmail,
    templateKey: emailContent.templateKey,
    subject: emailContent.subject,
    variables: {
      organizationName: org?.name ?? "",
      vendorName: vendor?.name ?? "",
      dueDate: workflow.due_date ?? "",
      portalUrl,
      message: (metadata.message as string) ?? "",
    },
    recipientType: "external",
    recipientId: externalParticipantId,
  });

  const sentAt = new Date().toISOString();
  await supabase
    .from("workflow_instances")
    .update({
      status: "sent",
      metadata: {
        ...metadata,
        sent_at: sentAt,
        magic_link_url: portalUrl,
        magic_link_updated_at: sentAt,
      },
    })
    .eq("id", workflowId);

  await scheduleVendorPacketReminders(
    workflowId,
    organizationId,
    recipientEmail,
    new Date(workflow.due_date)
  );

  await createVendorPacketMonitor(
    workflowId,
    organizationId,
    workflow.vendor_id as string,
    new Date(workflow.due_date),
    userId,
    vendor?.name ?? "Vendor"
  );

  await incrementUsage(organizationId, "vendor_packet_requests");

  await createAuditLog({
    organizationId,
    actorType: "user",
    actorId: userId,
    actorEmail: userEmail || undefined,
    action: "vendor_packet.sent",
    targetType: "workflow_instance",
    targetId: workflowId,
    metadata: { vendorEmail: recipientEmail, magicLinkId: linkId },
  });

  await createAuditLog({
    organizationId,
    actorType: "system",
    action: "vendor_packet.magic_link_created",
    targetType: "magic_link",
    targetId: linkId,
    metadata: { workflowId },
  });

  trackEvent("vendor_packet_sent", { workflowId });
  await saveWorkflowMagicLinkUrl(workflowId, portalUrl);

  return { portalUrl, linkId };
}
