import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { revokeMagicLink } from "@/lib/magic-links/revokeMagicLink";
import { sendPolicyRequestEmail } from "./sendRequest";
import { createAuditLog } from "@/lib/audit/createAuditLog";

export async function resendPolicyRequest(workflowId: string, options?: { ccMe?: boolean }) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("metadata")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Request not found");

  const metadata = workflow.metadata as Record<string, string | null>;
  const lastResent = metadata.last_resent_at ? new Date(metadata.last_resent_at) : null;
  const isAdmin = ctx.membership.roles.some((r) => ["owner", "admin"].includes(r));

  if (lastResent && !isAdmin) {
    const hoursSince = (Date.now() - lastResent.getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) {
      throw new Error("Resend limit: one manual resend per 24 hours");
    }
  }

  const result = await sendPolicyRequestEmail(workflowId, options);

  await supabase
    .from("workflow_instances")
    .update({
      metadata: { ...metadata, last_resent_at: new Date().toISOString() },
    })
    .eq("id", workflowId);

  return result;
}

export async function revokePolicyMagicLink(workflowId: string) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const supabase = createServiceClient();

  const { data: links } = await supabase
    .from("magic_links")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("status", "active");

  for (const link of links ?? []) {
    await revokeMagicLink(link.id, ctx.user.id, ctx.organization.id);
    await supabase.from("magic_links").update({ status: "revoked" }).eq("id", link.id);
  }

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "policy_magic_link.revoked",
    targetType: "workflow_instance",
    targetId: workflowId,
  });

  return { revoked: links?.length ?? 0 };
}
