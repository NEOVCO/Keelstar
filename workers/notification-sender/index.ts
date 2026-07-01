import { createServiceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/email/sendEmail";

const POLL_INTERVAL_MS = 30_000;

async function processNotifications() {
  const supabase = createServiceClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("status", "pending")
    .eq("channel", "email")
    .lt("retry_count", 3)
    .order("created_at", { ascending: true })
    .limit(20);

  for (const notif of notifications ?? []) {
    try {
      await sendEmail({
        organizationId: notif.organization_id,
        to: notif.recipient_email,
        templateKey: notif.template_key,
        subject: notif.subject ?? "Notification from Keelstar",
        variables: (notif.metadata as Record<string, string>) ?? {},
        recipientType: notif.recipient_type as "member" | "external" | undefined,
        recipientId: notif.recipient_id ?? undefined,
      });
      console.log(`[notify-worker] Sent notification ${notif.id}`);
    } catch {
      await supabase
        .from("notifications")
        .update({ retry_count: notif.retry_count + 1, status: notif.retry_count + 1 >= 3 ? "failed" : "pending" })
        .eq("id", notif.id);
      console.error(`[notify-worker] Failed notification ${notif.id}`);
    }
  }
}

async function run() {
  console.log("[notify-worker] Starting notification sender");
  while (true) {
    try {
      await processNotifications();
    } catch (err) {
      console.error("[notify-worker] Poll error:", err);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

run();
