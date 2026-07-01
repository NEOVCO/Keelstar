import { createServiceClient } from "@/lib/supabase/service";
import { createMagicLink } from "@/lib/magic-links/createMagicLink";
import { COI_MAGIC_LINK_PURPOSE, COI_MAGIC_LINK_EXPIRY_DAYS } from "./constants";

export function buildCoiExternalUrl(token: string): string {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return `${base}/external/coi/${token}`;
}

export async function saveWorkflowMagicLinkUrl(
  workflowId: string,
  url: string
): Promise<void> {
  const supabase = createServiceClient();
  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("metadata")
    .eq("id", workflowId)
    .single();
  const metadata = (workflow?.metadata ?? {}) as Record<string, string | null>;
  await supabase
    .from("workflow_instances")
    .update({
      metadata: {
        ...metadata,
        magic_link_url: url,
        magic_link_updated_at: new Date().toISOString(),
      },
    })
    .eq("id", workflowId);
}

export async function resolveCoiMagicLinkUrl(workflowId: string): Promise<string | null> {
  const supabase = createServiceClient();
  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("metadata, organization_id, vendor_id, created_by")
    .eq("id", workflowId)
    .single();

  if (!workflow) return null;
  const metadata = (workflow.metadata ?? {}) as Record<string, string | null>;
  if (metadata.magic_link_url) return metadata.magic_link_url;

  const { data: task } = await supabase
    .from("tasks")
    .select("id, assignee_external_id")
    .eq("workflow_instance_id", workflowId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!task?.assignee_external_id) return null;

  const { id: linkId, token, url } = await createMagicLink({
    organizationId: workflow.organization_id,
    externalParticipantId: task.assignee_external_id,
    workflowInstanceId: workflowId,
    taskId: task.id,
    purpose: COI_MAGIC_LINK_PURPOSE,
    expiresInDays: COI_MAGIC_LINK_EXPIRY_DAYS,
    maxUses: 10,
    createdBy: workflow.created_by ?? workflow.organization_id,
  });

  await supabase
    .from("magic_links")
    .update({
      vendor_id: workflow.vendor_id,
      status: "active",
    })
    .eq("id", linkId);

  const coiUrl = buildCoiExternalUrl(token);
  await saveWorkflowMagicLinkUrl(workflowId, coiUrl);
  return coiUrl;
}
