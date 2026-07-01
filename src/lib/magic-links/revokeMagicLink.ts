import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";

export async function revokeMagicLink(
  linkId: string,
  revokedBy: string,
  organizationId: string
): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("magic_links")
    .update({
      revoked_at: new Date().toISOString(),
      revoked_by: revokedBy,
    })
    .eq("id", linkId)
    .eq("organization_id", organizationId);

  if (error) throw new Error(`Failed to revoke magic link: ${error.message}`);

  await createAuditLog({
    organizationId,
    actorType: "user",
    actorId: revokedBy,
    action: "magic_link.revoked",
    targetType: "magic_link",
    targetId: linkId,
  });
}

export async function expireStaleMagicLinks(): Promise<number> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();

  const { data: staleLinks } = await supabase
    .from("magic_links")
    .select("id, organization_id")
    .lt("expires_at", now)
    .is("revoked_at", null);

  if (!staleLinks?.length) return 0;

  for (const link of staleLinks) {
    await supabase
      .from("magic_links")
      .update({ revoked_at: now })
      .eq("id", link.id);

    await createAuditLog({
      organizationId: link.organization_id,
      actorType: "system",
      action: "magic_link.expired",
      targetType: "magic_link",
      targetId: link.id,
    });
  }

  return staleLinks.length;
}
