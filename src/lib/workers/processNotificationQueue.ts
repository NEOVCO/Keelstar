import { createServiceClient } from "@/lib/supabase/service";
import { deliverQueuedNotification } from "@/lib/email/sendEmail";

/** Drain pending email notifications (safe to call repeatedly). */
export async function processNotificationQueue(): Promise<{ processed: number; failed: number }> {
  const supabase = createServiceClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, retry_count")
    .eq("status", "pending")
    .eq("channel", "email")
    .lt("retry_count", 3)
    .order("created_at", { ascending: true })
    .limit(20);

  let processed = 0;
  let failed = 0;

  for (const notif of notifications ?? []) {
    try {
      await deliverQueuedNotification(notif.id);
      processed++;
    } catch {
      const nextRetry = (notif.retry_count ?? 0) + 1;
      await supabase
        .from("notifications")
        .update({ retry_count: nextRetry, status: nextRetry >= 3 ? "failed" : "pending" })
        .eq("id", notif.id);
      failed++;
    }
  }

  return { processed, failed };
}
