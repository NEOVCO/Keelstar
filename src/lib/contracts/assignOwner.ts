import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { sendEmail } from "@/lib/email/sendEmail";
import { contractOwnerAssignedEmail } from "@/lib/email/templates/contracts";

const assignOwnerSchema = z.object({
  workflowId: z.string().uuid(),
  ownerId: z.string().uuid(),
});

export async function assignContractOwner(input: z.infer<typeof assignOwnerSchema>) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const data = assignOwnerSchema.parse(input);
  const supabase = createServiceClient();

  const { data: member } = await supabase
    .from("organization_members")
    .select("id, user_id")
    .eq("organization_id", ctx.organization.id)
    .eq("user_id", data.ownerId)
    .eq("status", "active")
    .maybeSingle();

  if (!member) throw new Error("Owner must be an active organization member");

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, title, metadata")
    .eq("id", data.workflowId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!workflow) throw new Error("Contract not found");

  await supabase
    .from("workflow_instances")
    .update({ owner_id: data.ownerId })
    .eq("id", data.workflowId);

  const meta = (workflow.metadata ?? {}) as Record<string, string | null>;
  const contractName = meta.contract_name ?? workflow.title;

  const {
    data: { user: ownerUser },
  } = await supabase.auth.admin.getUserById(data.ownerId);

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", ctx.organization.id)
    .single();

  const workflowUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/app/workflows/${data.workflowId}`;

  if (ownerUser?.email) {
    const email = contractOwnerAssignedEmail({
      organizationName: org?.name ?? "",
      contractName,
      workflowUrl,
    });
    await sendEmail({
      organizationId: ctx.organization.id,
      to: ownerUser.email,
      templateKey: email.templateKey,
      subject: email.subject,
      variables: { organizationName: org?.name ?? "", contractName, workflowUrl },
    });
  }

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract.owner_assigned",
    targetType: "workflow_instance",
    targetId: data.workflowId,
    metadata: { ownerId: data.ownerId, ownerEmail: ownerUser?.email },
  });

  trackEvent("contract_owner_assigned", { workflowId: data.workflowId });
  return { success: true };
}

export { assignOwnerSchema };
