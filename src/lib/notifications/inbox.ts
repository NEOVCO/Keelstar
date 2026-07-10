import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export type InAppNotificationItem = {
  id: string;
  title: string;
  body: string | null;
  href: string | null;
  read_at: string | null;
  created_at: string;
};

export async function fetchInAppNotifications(
  organizationId: string,
  recipientEmail: string,
  limit = 20
): Promise<InAppNotificationItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, title, body, href, read_at, created_at, subject")
    .eq("organization_id", organizationId)
    .eq("recipient_email", recipientEmail)
    .eq("channel", "in_app")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((n) => ({
    id: n.id,
    title: n.title ?? n.subject ?? "Notification",
    body: n.body,
    href: n.href,
    read_at: n.read_at,
    created_at: n.created_at,
  }));
}

export async function markNotificationRead(
  organizationId: string,
  notificationId: string,
  recipientEmail: string
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("organization_id", organizationId)
    .eq("recipient_email", recipientEmail)
    .eq("channel", "in_app");

  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead(organizationId: string, recipientEmail: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("organization_id", organizationId)
    .eq("recipient_email", recipientEmail)
    .eq("channel", "in_app")
    .is("read_at", null);

  if (error) throw new Error(error.message);
}

export async function countUnreadNotifications(
  organizationId: string,
  recipientEmail: string
): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .eq("recipient_email", recipientEmail)
    .eq("channel", "in_app")
    .is("read_at", null);

  return count ?? 0;
}
