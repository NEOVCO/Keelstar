import { createServiceClient } from "@/lib/supabase/service";
import { createMagicLink } from "@/lib/magic-links/createMagicLink";
import { W9_MAGIC_LINK_EXPIRY_DAYS, W9_MAGIC_LINK_PURPOSE } from "./constants";

export function buildW9ExternalUrl(token: string): string {
  const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${appUrl}/external/w9/${token}`;
}

/** Persist vendor upload URL on the workflow for reminders and dev copy-link UX. */
export async function saveWorkflowMagicLinkUrl(
  workflowId: string,
  magicLinkUrl: string
): Promise<void> {
  const supabase = createServiceClient();
  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("metadata")
    .eq("id", workflowId)
    .single();

  if (!workflow) return;

  const metadata = (workflow.metadata ?? {}) as Record<string, string | null>;
  await supabase
    .from("workflow_instances")
    .update({
      metadata: {
        ...metadata,
        magic_link_url: magicLinkUrl,
        magic_link_updated_at: new Date().toISOString(),
      },
    })
    .eq("id", workflowId);
}

/**
 * Returns an active vendor upload URL. Uses cached metadata when the link is still active;
 * otherwise issues a fresh magic link without sending the initial request email.
 */
export async function resolveW9MagicLinkUrl(workflowId: string): Promise<string | null> {
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, organization_id, created_by, metadata, status")
    .eq("id", workflowId)
    .single();

  if (!workflow) return null;
  if (["completed", "approved", "cancelled"].includes(workflow.status)) return null;

  const metadata = (workflow.metadata ?? {}) as Record<string, string | null>;
  const cached = metadata.magic_link_url;

  const { data: activeLink } = await supabase
    .from("magic_links")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeLink && cached) return cached;

  const { data: task } = await supabase
    .from("tasks")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!task) return cached ?? null;

  const { data: participant } = await supabase
    .from("external_participants")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!participant) return cached ?? null;

  const createdBy = workflow.created_by;
  if (!createdBy) return cached ?? null;

  const { token, id: linkId } = await createMagicLink({
    organizationId: workflow.organization_id,
    externalParticipantId: participant.id,
    workflowInstanceId: workflowId,
    taskId: task.id,
    purpose: W9_MAGIC_LINK_PURPOSE,
    expiresInDays: W9_MAGIC_LINK_EXPIRY_DAYS,
    maxUses: 10,
    createdBy,
  });

  const url = buildW9ExternalUrl(token);
  await supabase.from("magic_links").update({ status: "active" }).eq("id", linkId);
  await saveWorkflowMagicLinkUrl(workflowId, url);
  return url;
}
