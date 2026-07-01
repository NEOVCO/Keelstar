import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";

export type SendEmailInput = {
  organizationId: string;
  to: string;
  templateKey: string;
  subject: string;
  variables: Record<string, string>;
  recipientType?: "member" | "external";
  recipientId?: string;
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
};

function renderTemplate(templateKey: string, variables: Record<string, string>): string {
  const renderer = TEMPLATES[templateKey];
  if (!renderer) throw new Error(`Unknown email template: ${templateKey}`);
  return renderer(variables);
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

  const html = renderTemplate(input.templateKey, input.variables);
  const from = process.env.EMAIL_FROM ?? "notifications@keelstar.com";

  let resendId: string | null = null;
  let emailStatus: "sent" | "failed" | "skipped" = "skipped";
  let errorMessage: string | null = null;

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from,
        to: input.to,
        subject: input.subject,
        html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #14171a;">${html}<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" /><p style="font-size: 12px; color: #6b7280;">Sent via Keelstar on behalf of ${input.variables.organizationName ?? "your organization"}.</p></div>`,
      });
      resendId = result.data?.id ?? null;
      emailStatus = "sent";
    } catch (err) {
      emailStatus = "failed";
      errorMessage = err instanceof Error ? err.message : "Send failed";
    }
  } else {
    errorMessage = "RESEND_API_KEY not configured";
  }

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
    metadata: { templateKey: input.templateKey, to: input.to, reason: errorMessage },
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
