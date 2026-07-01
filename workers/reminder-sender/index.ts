/**
 * Reminder sender worker — run daily via Render cron
 * Usage: npm run worker:reminders
 */
import { createServiceClient } from "../../src/lib/supabase/service";
import { sendEmail } from "../../src/lib/email/sendEmail";
import { vendorW9ReminderEmail, vendorW9OverdueEmail } from "../../src/lib/email/templates/w9";
import {
  vendorCoiReminderEmail,
  vendorCoiOverdueEmail,
} from "../../src/lib/email/templates/coi";
import { createAuditLog } from "../../src/lib/audit/createAuditLog";
import { resolveW9MagicLinkUrl } from "../../src/lib/w9/magicLinkUrl";
import { resolveCoiMagicLinkUrl } from "../../src/lib/coi/magicLinkUrl";
import { TERMINAL_STATUSES } from "../../src/lib/w9/scheduleReminders";
import { TERMINAL_COI_STATUSES } from "../../src/lib/coi/scheduleReminders";

async function run() {
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: dueReminders, error } = await supabase
    .from("reminders")
    .select("*, workflow_instances(id, status, due_date, metadata, organization_id, vendor_id)")
    .eq("status", "scheduled")
    .in("type", ["w9_reminder", "w9_overdue", "coi_reminder", "coi_overdue"])
    .lte("scheduled_at", now)
    .limit(100);

  if (error) {
    console.error("Failed to fetch reminders:", error.message);
    process.exit(1);
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
    } | null;

    const isCoi = reminder.type.startsWith("coi_");
    const terminalStatuses = isCoi ? TERMINAL_COI_STATUSES : TERMINAL_STATUSES;

    if (!workflow || terminalStatuses.includes(workflow.status as (typeof TERMINAL_STATUSES)[number])) {
      await supabase.from("reminders").update({ status: "cancelled" }).eq("id", reminder.id);
      skipped++;
      continue;
    }

    const { data: org } = await supabase.from("organizations").select("name").eq("id", reminder.organization_id).single();
    const { data: vendor } = workflow.vendor_id
      ? await supabase.from("vendors").select("name").eq("id", workflow.vendor_id).single()
      : { data: null };

    const magicLinkUrl = isCoi
      ? await resolveCoiMagicLinkUrl(workflow.id)
      : await resolveW9MagicLinkUrl(workflow.id);
    if (!magicLinkUrl) {
      await supabase.from("reminders").update({ status: "cancelled" }).eq("id", reminder.id);
      skipped++;
      continue;
    }

    const emailVars = {
      organizationName: org?.name ?? "",
      vendorName: vendor?.name ?? "",
      dueDate: workflow.due_date ?? "",
      magicLinkUrl,
    };

    const emailContent =
      reminder.type === "w9_overdue" || reminder.type === "coi_overdue"
        ? isCoi
          ? vendorCoiOverdueEmail(emailVars)
          : vendorW9OverdueEmail(emailVars)
        : isCoi
          ? vendorCoiReminderEmail(emailVars)
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
          },
          recipientType: "external",
        });
      }

      await supabase
        .from("reminders")
        .update({ status: "sent", sent_at: now })
        .eq("id", reminder.id);

      if (workflow.status === "sent" || workflow.status === "opened") {
        await supabase.from("workflow_instances").update({ status: "overdue" }).eq("id", workflow.id).eq("status", "sent");
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
      console.error(`Reminder ${reminder.id} failed:`, err);
      await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id);
      failed++;
    }
  }

  console.log(`Reminder worker done: sent=${sent} skipped=${skipped} failed=${failed}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
