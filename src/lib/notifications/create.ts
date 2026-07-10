import { createServiceClient } from "@/lib/supabase/service";

export type InAppNotificationInput = {
  organizationId: string;
  recipientEmail: string;
  title: string;
  body?: string;
  href?: string;
  templateKey: string;
  metadata?: Record<string, unknown>;
};

export async function createInAppNotification(input: InAppNotificationInput) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      organization_id: input.organizationId,
      recipient_email: input.recipientEmail,
      channel: "in_app",
      template_key: input.templateKey,
      subject: input.title,
      title: input.title,
      body: input.body ?? null,
      href: input.href ?? null,
      status: "sent",
      sent_at: new Date().toISOString(),
      metadata: input.metadata ?? {},
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}
