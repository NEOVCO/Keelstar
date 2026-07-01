import { createServiceClient } from "@/lib/supabase/service";
import { hashToken } from "./createMagicLink";

export type ValidatedMagicLink = {
  id: string;
  organizationId: string;
  externalParticipantId: string;
  workflowInstanceId: string;
  taskId: string;
  purpose: string;
  maxUses: number;
  useCount: number;
};

export type MagicLinkValidationResult =
  | { valid: true; link: ValidatedMagicLink }
  | { valid: false; reason: "not_found" | "expired" | "revoked" | "max_uses" };

export async function validateMagicLink(
  rawToken: string
): Promise<MagicLinkValidationResult> {
  const tokenHash = hashToken(rawToken);
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("magic_links")
    .select("*")
    .eq("token_hash", tokenHash)
    .single();

  if (error || !data) {
    return { valid: false, reason: "not_found" };
  }

  if (data.revoked_at) {
    return { valid: false, reason: "revoked" };
  }

  if (new Date(data.expires_at) < new Date()) {
    return { valid: false, reason: "expired" };
  }

  if (data.use_count >= data.max_uses) {
    return { valid: false, reason: "max_uses" };
  }

  return {
    valid: true,
    link: {
      id: data.id,
      organizationId: data.organization_id,
      externalParticipantId: data.external_participant_id,
      workflowInstanceId: data.workflow_instance_id,
      taskId: data.task_id,
      purpose: data.purpose,
      maxUses: data.max_uses,
      useCount: data.use_count,
    },
  };
}

export async function useMagicLink(linkId: string): Promise<void> {
  const supabase = createServiceClient();
  const { data: link } = await supabase
    .from("magic_links")
    .select("*")
    .eq("id", linkId)
    .single();

  if (!link) throw new Error("Magic link not found");

  const updates: Record<string, unknown> = {
    use_count: link.use_count + 1,
  };
  if (!link.used_at) {
    updates.used_at = new Date().toISOString();
  }

  await supabase.from("magic_links").update(updates).eq("id", linkId);

  const { createAuditLog } = await import("@/lib/audit/createAuditLog");
  await createAuditLog({
    organizationId: link.organization_id,
    actorType: "external",
    actorId: link.external_participant_id,
    action: "magic_link.used",
    targetType: "magic_link",
    targetId: linkId,
    metadata: { purpose: link.purpose, taskId: link.task_id },
  });
}
