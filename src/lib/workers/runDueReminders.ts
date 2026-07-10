import { createServiceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/email/sendEmail";
import { vendorW9ReminderEmail, vendorW9OverdueEmail } from "@/lib/email/templates/w9";
import { vendorCoiReminderEmail, vendorCoiOverdueEmail } from "@/lib/email/templates/coi";
import {
  policyAcknowledgementReminderEmail,
  policyAcknowledgementOverdueEmail,
} from "@/lib/email/templates/policies";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { resolveW9MagicLinkUrl } from "@/lib/w9/magicLinkUrl";
import { resolveCoiMagicLinkUrl } from "@/lib/coi/magicLinkUrl";
import { resolvePolicyMagicLinkUrl } from "@/lib/policies/magicLinkUrl";
import { resolveSignerMagicLinkUrl } from "@/lib/signer/magicLinkUrl";
import { parseStoredCcEmails } from "@/lib/email/outboundCc";
import { TERMINAL_STATUSES } from "@/lib/w9/scheduleReminders";
import { TERMINAL_COI_STATUSES } from "@/lib/coi/scheduleReminders";
import { TERMINAL_POLICY_STATUSES } from "@/lib/policies/scheduleReminders";
import { signerReminderEmail, signerOverdueEmail } from "@/lib/email/templates/signer";
import { TERMINAL_SIGNER_STATUSES } from "@/lib/signer/scheduleReminders";
import {
  invoiceApprovalReminderEmail,
  invoiceApprovalOverdueEmail,
} from "@/lib/email/templates/invoices";
import { TERMINAL_INVOICE_STATUSES } from "@/lib/invoices/scheduleReminders";
import { getAppUrl } from "@/lib/site";

export type ReminderRunResult = { sent: number; skipped: number; failed: number };

/** Send due W-9, COI, policy, signer, and invoice reminders. */
export async function runDueReminders(): Promise<ReminderRunResult> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();
  const appUrl = getAppUrl();

  const { data: dueReminders, error } = await supabase
    .from("reminders")
    .select("*, workflow_instances(id, status, due_date, metadata, organization_id, vendor_id)")
    .eq("status", "scheduled")
    .in("type", [
      "w9_reminder",
      "w9_overdue",
      "coi_reminder",
      "coi_overdue",
      "policy_reminder",
      "policy_overdue",
      "invoice_reminder",
      "invoice_overdue",
      "signer_reminder",
      "signer_overdue",
    ])
    .lte("scheduled_at", now)
    .limit(100);

  if (error) {
    throw new Error(`Failed to fetch reminders: ${error.message}`);
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const reminder of dueReminders ?? []) {
    const workflow = reminder.workflow_instances as {
      id: string;
      status: string;
      due_date: string;
      metadata: Record<string, string | null>;
      organization_id: string;
      vendor_id: string;
      title?: string;
    } | null;

    const isCoi = reminder.type.startsWith("coi_");
    const isPolicy = reminder.type.startsWith("policy_");
    const isSigner = reminder.type.startsWith("signer_");
    const isInvoice = reminder.type.startsWith("invoice_");
    const terminalStatuses = isCoi
      ? TERMINAL_COI_STATUSES
      : isPolicy
        ? TERMINAL_POLICY_STATUSES
        : isSigner
          ? TERMINAL_SIGNER_STATUSES
          : isInvoice
            ? TERMINAL_INVOICE_STATUSES
            : TERMINAL_STATUSES;

    if (!workflow || terminalStatuses.includes(workflow.status as (typeof TERMINAL_STATUSES)[number])) {
      await supabase.from("reminders").update({ status: "cancelled" }).eq("id", reminder.id);
      skipped++;
      continue;
    }

    const { data: org } = await supabase.from("organizations").select("name").eq("id", reminder.organization_id).single();
    const { data: vendor } = workflow.vendor_id
      ? await supabase.from("vendors").select("name").eq("id", workflow.vendor_id).single()
      : { data: null };

    const metadata = workflow.metadata as Record<string, string | null>;
    const workflowUrl = `${appUrl}/app/workflows/${workflow.id}`;
    const vendorName = vendor?.name ?? metadata.vendor_name ?? "Vendor";
    const invoiceAmount = metadata.invoice_amount ?? "—";

    if (isInvoice) {
      const emailContent =
        reminder.type === "invoice_overdue"
          ? invoiceApprovalOverdueEmail({
              organizationName: org?.name ?? "",
              vendorName,
              invoiceAmount,
              approvalDueDate: workflow.due_date ? new Date(workflow.due_date).toLocaleDateString() : "—",
              workflowUrl,
            })
          : invoiceApprovalReminderEmail({
              organizationName: org?.name ?? "",
              vendorName,
              invoiceAmount,
              approvalDueDate: workflow.due_date ? new Date(workflow.due_date).toLocaleDateString() : "—",
              workflowUrl,
            });

      try {
        if (reminder.recipient_email) {
          await sendEmail({
            organizationId: reminder.organization_id,
            to: reminder.recipient_email,
            templateKey: emailContent.templateKey,
            subject: emailContent.subject,
            variables: {
              organizationName: org?.name ?? "",
              vendorName,
              invoiceAmount,
              approvalDueDate: workflow.due_date ?? "",
              workflowUrl,
            },
            recipientType: "member",
          });
        }

        await supabase.from("reminders").update({ status: "sent", sent_at: now }).eq("id", reminder.id);

        if (workflow.status === "submitted") {
          await supabase.from("workflow_instances").update({ status: "overdue" }).eq("id", workflow.id);
          await supabase
            .from("tasks")
            .update({ status: "overdue" })
            .eq("workflow_instance_id", workflow.id)
            .eq("status", "pending");
        }

        await createAuditLog({
          organizationId: reminder.organization_id,
          actorType: "system",
          action: "invoice_reminder.sent",
          targetType: "reminder",
          targetId: reminder.id,
          metadata: { window: reminder.reminder_window },
        });

        sent++;
      } catch (err) {
        console.error(`[reminders] Reminder ${reminder.id} failed:`, err);
        await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id);
        failed++;
      }
      continue;
    }

    const magicLinkUrl = isCoi
      ? await resolveCoiMagicLinkUrl(workflow.id)
      : isPolicy
        ? await resolvePolicyMagicLinkUrl(workflow.id)
        : isSigner
          ? await resolveSignerMagicLinkUrl(workflow.id)
          : await resolveW9MagicLinkUrl(workflow.id);

    if (!magicLinkUrl) {
      await supabase.from("reminders").update({ status: "cancelled" }).eq("id", reminder.id);
      skipped++;
      continue;
    }

    const policyTitle = metadata.policy_title ?? "Company policy";
    const documentTitle = metadata.document_title ?? workflow.title ?? "Document";
    const signerName = metadata.signer_name ?? vendor?.name ?? "Signer";

    const emailVars = {
      organizationName: org?.name ?? "",
      vendorName: vendor?.name ?? "",
      personName: vendor?.name ?? "",
      signerName,
      policyTitle,
      documentTitle,
      dueDate: workflow.due_date ?? "",
      magicLinkUrl,
    };

    const emailContent =
      reminder.type === "w9_overdue" ||
      reminder.type === "coi_overdue" ||
      reminder.type === "policy_overdue" ||
      reminder.type === "signer_overdue"
        ? isCoi
          ? vendorCoiOverdueEmail(emailVars)
          : isPolicy
            ? policyAcknowledgementOverdueEmail(emailVars)
            : isSigner
              ? signerOverdueEmail(emailVars)
              : vendorW9OverdueEmail(emailVars)
        : isCoi
          ? vendorCoiReminderEmail(emailVars)
          : isPolicy
            ? policyAcknowledgementReminderEmail(emailVars)
            : isSigner
              ? signerReminderEmail(emailVars)
              : vendorW9ReminderEmail(emailVars);

    try {
      if (reminder.recipient_email) {
        await sendEmail({
          organizationId: reminder.organization_id,
          to: reminder.recipient_email,
          templateKey: emailContent.templateKey,
          subject: emailContent.subject,
          variables: {
            organizationName: org?.name ?? "",
            dueDate: workflow.due_date ?? "",
            actionUrl: magicLinkUrl,
            magicLinkUrl,
            policyTitle,
            documentTitle,
            signerName,
            personName: vendor?.name ?? "",
          },
          recipientType: "external",
          cc: parseStoredCcEmails(workflow.metadata),
        });
      }

      await supabase.from("reminders").update({ status: "sent", sent_at: now }).eq("id", reminder.id);

      if (workflow.status === "sent" || workflow.status === "opened") {
        await supabase
          .from("workflow_instances")
          .update({ status: "overdue" })
          .eq("id", workflow.id)
          .in("status", ["sent", "opened"]);
      }

      await createAuditLog({
        organizationId: reminder.organization_id,
        actorType: "system",
        action: "reminder.sent",
        targetType: "reminder",
        targetId: reminder.id,
        metadata: { window: reminder.reminder_window },
      });

      sent++;
    } catch (err) {
      console.error(`[reminders] Reminder ${reminder.id} failed:`, err);
      await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id);
      failed++;
    }
  }

  console.log(`[reminders] Done: sent=${sent} skipped=${skipped} failed=${failed}`);
  return { sent, skipped, failed };
}
