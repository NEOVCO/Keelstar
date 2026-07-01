import { createServiceClient } from "@/lib/supabase/service";

export function buildVendorPacketExternalUrl(token: string): string {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return `${base}/external/vendor-packet/${token}`;
}

export async function saveWorkflowMagicLinkUrl(workflowId: string, url: string): Promise<void> {
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
