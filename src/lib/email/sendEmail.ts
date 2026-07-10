import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { getEmailFrom } from "@/lib/email/config";
import { wrapEmailHtml } from "@/lib/email/layout";

export type SendEmailInput = {
  organizationId: string;
  to: string;
  templateKey: string;
  subject: string;
  variables: Record<string, string>;
  recipientType?: "member" | "external";
  recipientId?: string;
  cc?: string[];
};

const TEMPLATES: Record<string, (vars: Record<string, string>) => string> = {
  magic_link_task_request: (v) =>
    `<p>${v.organizationName} has requested your action on: <strong>${v.taskTitle}</strong></p>
     <p><a href="${v.actionUrl}">Complete Task</a></p>
     <p>This link expires on ${v.expiresAt}.</p>`,
  reminder: (v) =>
    `<p>Reminder from ${v.organizationName}: <strong>${v.subject}</strong></p>
     <p>${v.message}</p>`,
  overdue_reminder: (v) =>
    `<p>Overdue from ${v.organizationName}: <strong>${v.subject}</strong></p>
     <p>${v.message}</p>
     <p>Please take action as soon as possible.</p>`,
  task_completed: (v) =>
    `<p>Task completed: <strong>${v.taskTitle}</strong></p>
     <p>Completed by ${v.completedBy} on ${v.completedAt}.</p>`,
  document_submitted: (v) =>
    `<p>Document submitted to ${v.organizationName}: <strong>${v.documentTitle}</strong></p>`,
  monitor_alert: (v) =>
    `<p>Alert from ${v.organizationName}: <strong>${v.monitorName}</strong></p>
     <p>${v.message}</p>`,
  invitation: (v) =>
    `<p>You've been invited to join <strong>${v.organizationName}</strong> on Keelstar.</p>
     <p><a href="${v.inviteUrl}">Accept Invitation</a></p>`,
  vendor_w9_request: (v) =>
    `<p>${v.organizationName} needs your completed W-9 for their records.</p>
     ${v.message ? `<p>${v.message}</p>` : ""}
     <p><strong>Due date:</strong> ${v.dueDate}</p>
     <p><a href="${v.actionUrl ?? v.magicLinkUrl}">Upload W-9 securely</a></p>`,
  vendor_w9_reminder: (v) =>
    `<p>Reminder: ${v.organizationName} is still waiting for your W-9.</p>
     <p><a href="${v.actionUrl ?? v.magicLinkUrl}">Upload W-9 securely</a></p>`,
  vendor_w9_overdue: (v) =>
    `<p>Your W-9 request from ${v.organizationName} is overdue.</p>
     <p><a href="${v.actionUrl ?? v.magicLinkUrl}">Upload W-9 securely</a></p>`,
  vendor_w9_correction: (v) =>
    `<p>${v.organizationName} needs an updated W-9.</p>
     ${v.rejectionReason ? `<p><strong>Reason:</strong> ${v.rejectionReason}</p>` : ""}
     <p><a href="${v.actionUrl ?? v.magicLinkUrl}">Upload updated W-9</a></p>`,
  internal_submission_received: (v) =>
    `<p>${v.vendorName} submitted a W-9 for ${v.organizationName}.</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">Review submission</a></p>` : ""}`,
  vendor_coi_request: (v) =>
    `<p>${v.organizationName} needs your certificate of insurance for their records.</p>
     ${v.message ? `<p>${v.message}</p>` : ""}
     <p><strong>Due date:</strong> ${v.dueDate}</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Upload certificate securely</a></p>`,
  vendor_coi_reminder: (v) =>
    `<p>Reminder: ${v.organizationName} is still waiting for your certificate of insurance.</p>
     <p><strong>Due date:</strong> ${v.dueDate}</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Upload certificate securely</a></p>`,
  vendor_coi_overdue: (v) =>
    `<p>Your certificate of insurance request from ${v.organizationName} is now overdue.</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Upload certificate securely</a></p>`,
  vendor_coi_correction: (v) =>
    `<p>${v.organizationName} needs an updated certificate of insurance from you.</p>
     ${v.rejectionReason ? `<p><strong>Reason:</strong> ${v.rejectionReason}</p>` : ""}
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Upload updated certificate</a></p>`,
  internal_coi_submission_received: (v) =>
    `<p>${v.vendorName} has submitted a certificate of insurance for ${v.organizationName}.</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">Review submission</a></p>` : ""}`,
  internal_coi_expiration_reminder: (v) =>
    `<p>The certificate of insurance for ${v.vendorName} is approaching expiration.</p>
     <p><strong>Expiration date:</strong> ${v.expirationDate}</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">View COI</a></p>` : ""}`,
  vendor_coi_renewal_request: (v) =>
    `<p>${v.organizationName} needs an updated certificate of insurance before your current coverage expires.</p>
     <p><strong>Expiration date:</strong> ${v.expirationDate}</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Upload updated certificate</a></p>`,
  internal_contract_renewal_reminder: (v) =>
    `<p>The contract <strong>${v.contractName}</strong> is approaching its renewal date.</p>
     <p><strong>Renewal date:</strong> ${v.renewalDate}</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">View contract</a></p>` : ""}`,
  "vendor-packet-portal-request": (v) =>
    `<p><strong>${v.organizationName}</strong> has requested onboarding documents from you.</p>
     <p>Please upload the required document(s) through the secure vendor portal.</p>
     ${v.dueDate ? `<p><strong>Due date:</strong> ${v.dueDate}</p>` : ""}
     ${v.message ? `<p>${v.message}</p>` : ""}
     ${v.portalUrl ? `<p><a href="${v.portalUrl}">Open vendor portal</a></p>` : ""}`,
  "vendor-packet-reminder": (v) =>
    `<p>This is a reminder to complete your vendor onboarding documents for <strong>${v.organizationName}</strong>.</p>
     ${v.dueDate ? `<p><strong>Due date:</strong> ${v.dueDate}</p>` : ""}
     ${v.portalUrl ? `<p><a href="${v.portalUrl}">Open vendor portal</a></p>` : ""}`,
  "vendor-packet-overdue": (v) =>
    `<p>Your vendor onboarding documents for <strong>${v.organizationName}</strong> are overdue.</p>
     ${v.dueDate ? `<p><strong>Due date was:</strong> ${v.dueDate}</p>` : ""}
     ${v.portalUrl ? `<p><a href="${v.portalUrl}">Open vendor portal</a></p>` : ""}`,
  "vendor-packet-item-uploaded": (v) =>
    `<p><strong>${v.vendorName}</strong> uploaded <strong>${v.itemLabel}</strong>.</p>
     ${v.progressPercent ? `<p>Packet progress: ${v.progressPercent}%</p>` : ""}
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">Review packet</a></p>` : ""}`,
  "vendor-packet-complete": (v) =>
    `<p>All required documents have been uploaded for <strong>${v.vendorName}</strong>.</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">Review and complete packet</a></p>` : ""}`,
  policy_ack_request: (v) =>
    `<p>${v.organizationName} needs you to read and acknowledge: <strong>${v.policyTitle}</strong>.</p>
     ${v.message ? `<p>${v.message}</p>` : ""}
     <p><strong>Due date:</strong> ${v.dueDate}</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Review and acknowledge policy</a></p>`,
  policy_ack_reminder: (v) =>
    `<p>Reminder: please acknowledge <strong>${v.policyTitle}</strong> for ${v.organizationName}.</p>
     <p><strong>Due date:</strong> ${v.dueDate}</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Review and acknowledge policy</a></p>`,
  policy_ack_overdue: (v) =>
    `<p>Your policy acknowledgement for <strong>${v.policyTitle}</strong> from ${v.organizationName} is overdue.</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Review and acknowledge policy</a></p>`,
  internal_policy_acknowledged: (v) =>
    `<p><strong>${v.personName}</strong> acknowledged <strong>${v.policyTitle}</strong> for ${v.organizationName}.</p>
     <p><strong>Acknowledged at:</strong> ${v.acknowledgedAt}</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">View acknowledgement record</a></p>` : ""}`,
  internal_training_expiration_reminder: (v) =>
    `<p>The training certification <strong>${v.courseName}</strong> for <strong>${v.personName}</strong> is approaching expiration.</p>
     <p><strong>Expiration date:</strong> ${v.expirationDate}</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">View training record</a></p>` : ""}`,
  invoice_approval_request: (v) =>
    `<p>${v.requesterName ?? "A teammate"} submitted an invoice from <strong>${v.vendorName}</strong> for your approval.</p>
     <p><strong>Amount:</strong> ${v.invoiceAmount}</p>
     <p><strong>Approval due:</strong> ${v.approvalDueDate}</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">Review invoice</a></p>` : ""}`,
  invoice_approval_reminder: (v) =>
    `<p>Invoice from <strong>${v.vendorName}</strong> (${v.invoiceAmount}) is still awaiting your approval.</p>
     <p><strong>Due:</strong> ${v.approvalDueDate}</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">Review invoice</a></p>` : ""}`,
  invoice_approval_overdue: (v) =>
    `<p>Invoice approval for <strong>${v.vendorName}</strong> (${v.invoiceAmount}) is overdue.</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">Review invoice now</a></p>` : ""}`,
  invoice_approved: (v) =>
    `<p>Your invoice for <strong>${v.vendorName}</strong> (${v.invoiceAmount}) was approved.</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">View record</a></p>` : ""}`,
  invoice_rejected: (v) =>
    `<p>Your invoice for <strong>${v.vendorName}</strong> (${v.invoiceAmount}) was rejected.</p>
     ${v.rejectionReason ? `<p><strong>Reason:</strong> ${v.rejectionReason}</p>` : ""}
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">View record</a></p>` : ""}`,
  signer_request: (v) =>
    `<p>${v.organizationName} needs your signature on: <strong>${v.documentTitle}</strong>.</p>
     ${v.message ? `<p>${v.message}</p>` : ""}
     <p><strong>Due date:</strong> ${v.dueDate}</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Review and sign document</a></p>`,
  signer_reminder: (v) =>
    `<p>Reminder: please sign <strong>${v.documentTitle}</strong> for ${v.organizationName}.</p>
     <p><strong>Due date:</strong> ${v.dueDate}</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Review and sign document</a></p>`,
  signer_overdue: (v) =>
    `<p>Your signature on <strong>${v.documentTitle}</strong> from ${v.organizationName} is overdue.</p>
     <p><a href="${v.magicLinkUrl ?? v.actionUrl}">Review and sign document</a></p>`,
  internal_document_signed: (v) =>
    `<p><strong>${v.signerName}</strong> signed <strong>${v.documentTitle}</strong> for ${v.organizationName}.</p>
     <p><strong>Signed at:</strong> ${v.signedAt}</p>
     ${v.workflowUrl ? `<p><a href="${v.workflowUrl}">View signed document</a></p>` : ""}`,
};

function renderTemplate(templateKey: string, variables: Record<string, string>): string {
  const renderer = TEMPLATES[templateKey];
  if (!renderer) throw new Error(`Unknown email template: ${templateKey}`);
  return renderer(variables);
}

type DeliverEmailInput = {
  organizationId: string;
  notificationId: string;
  to: string;
  templateKey: string;
  subject: string;
  variables: Record<string, string>;
  cc?: string[];
};

async function deliverEmail(input: DeliverEmailInput): Promise<{ resendId: string | null; status: "sent" | "failed" | "skipped"; errorMessage: string | null }> {
  const html = renderTemplate(input.templateKey, input.variables);
  const from = getEmailFrom();
  const organizationName = input.variables.organizationName;

  let resendId: string | null = null;
  let status: "sent" | "failed" | "skipped" = "skipped";
  let errorMessage: string | null = null;

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from,
        to: input.to,
        ...(input.cc?.length ? { cc: input.cc } : {}),
        subject: input.subject,
        html: wrapEmailHtml(html, organizationName),
      });
      resendId = result.data?.id ?? null;
      if (result.error) {
        status = "failed";
        errorMessage = result.error.message;
      } else {
        status = "sent";
      }
    } catch (err) {
      status = "failed";
      errorMessage = err instanceof Error ? err.message : "Send failed";
    }
  } else {
    errorMessage = "RESEND_API_KEY not configured";
  }

  return { resendId, status, errorMessage };
}

/** Send an existing queued notification row (used by the notification worker). */
export async function deliverQueuedNotification(notificationId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: notification, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", notificationId)
    .single();

  if (error || !notification) {
    throw new Error(`Notification not found: ${notificationId}`);
  }

  const variables = (notification.metadata as Record<string, string>) ?? {};
  const { resendId, status, errorMessage } = await deliverEmail({
    organizationId: notification.organization_id,
    notificationId: notification.id,
    to: notification.recipient_email,
    templateKey: notification.template_key,
    subject: notification.subject ?? "Notification from Keelstar",
    variables,
    cc: Array.isArray(notification.metadata?.cc) ? (notification.metadata.cc as string[]) : undefined,
  });

  await supabase.from("email_events").insert({
    organization_id: notification.organization_id,
    notification_id: notification.id,
    resend_id: resendId,
    status,
    error_message: errorMessage,
    sent_at: new Date().toISOString(),
  });

  await supabase
    .from("notifications")
    .update({
      status: status === "sent" ? "sent" : status === "failed" ? "failed" : "pending",
      sent_at: status === "sent" ? new Date().toISOString() : null,
      retry_count: status === "failed" ? (notification.retry_count ?? 0) + 1 : notification.retry_count,
    })
    .eq("id", notification.id);

  await createAuditLog({
    organizationId: notification.organization_id,
    actorType: "system",
    action:
      status === "sent"
        ? "notification.sent"
        : status === "failed"
          ? "notification.failed"
          : "notification.skipped",
    targetType: "notification",
    targetId: notification.id,
    metadata: { templateKey: notification.template_key, to: notification.recipient_email, reason: errorMessage },
  });

  if (status === "failed") {
    throw new Error(errorMessage ?? "Email send failed");
  }
}

export async function sendEmail(input: SendEmailInput): Promise<string> {
  const supabase = createServiceClient();

  const { data: notification, error: notifError } = await supabase
    .from("notifications")
    .insert({
      organization_id: input.organizationId,
      recipient_type: input.recipientType ?? "member",
      recipient_id: input.recipientId ?? null,
      recipient_email: input.to,
      channel: "email",
      template_key: input.templateKey,
      subject: input.subject,
      status: "pending",
      metadata: input.variables,
    })
    .select("id")
    .single();

  if (notifError) throw new Error(`Failed to create notification: ${notifError.message}`);

  const { resendId, status: emailStatus, errorMessage } = await deliverEmail({
    organizationId: input.organizationId,
    notificationId: notification.id,
    to: input.to,
    templateKey: input.templateKey,
    subject: input.subject,
    variables: input.variables,
    cc: input.cc,
  });

  await supabase.from("email_events").insert({
    organization_id: input.organizationId,
    notification_id: notification.id,
    resend_id: resendId,
    status: emailStatus,
    error_message: errorMessage,
    sent_at: new Date().toISOString(),
  });

  await supabase
    .from("notifications")
    .update({
      status: emailStatus === "sent" ? "sent" : emailStatus === "failed" ? "failed" : "pending",
      sent_at: emailStatus === "sent" ? new Date().toISOString() : null,
    })
    .eq("id", notification.id);

  await createAuditLog({
    organizationId: input.organizationId,
    actorType: "system",
    action:
      emailStatus === "sent"
        ? "notification.sent"
        : emailStatus === "failed"
          ? "notification.failed"
          : "notification.skipped",
    targetType: "notification",
    targetId: notification.id,
    metadata: { templateKey: input.templateKey, to: input.to, cc: input.cc, reason: errorMessage },
  });

  if (emailStatus === "failed") {
    throw new Error(errorMessage ?? "Email send failed");
  }

  return notification.id;
}

export async function queueEmail(input: SendEmailInput): Promise<string> {
  const supabase = createServiceClient();

  const { data: notification, error } = await supabase
    .from("notifications")
    .insert({
      organization_id: input.organizationId,
      recipient_type: input.recipientType ?? "member",
      recipient_id: input.recipientId ?? null,
      recipient_email: input.to,
      channel: "email",
      template_key: input.templateKey,
      subject: input.subject,
      status: "pending",
      metadata: input.variables,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to queue notification: ${error.message}`);
  return notification.id;
}
