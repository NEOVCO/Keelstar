import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { checkModuleEntitlement } from "@/lib/billing/checkEntitlement";
import {
  CONTRACT_ENTITLEMENT,
  CONTRACT_RENEWAL_REMINDER_WINDOWS,
  CONTRACT_NOTICE_REMINDER_WINDOWS,
  CONTRACT_REMINDER_TYPES,
} from "./constants";

export async function cancelContractReminders(
  workflowInstanceId: string,
  organizationId: string
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("reminders")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", workflowInstanceId)
    .eq("organization_id", organizationId)
    .eq("status", "scheduled")
    .in("type", [...CONTRACT_REMINDER_TYPES]);
}

async function resolveOwnerEmail(
  organizationId: string,
  ownerId: string | null,
  createdBy: string | null
): Promise<string | null> {
  const supabase = createServiceClient();
  const userId = ownerId ?? createdBy;
  if (!userId) return null;
  const {
    data: { user },
  } = await supabase.auth.admin.getUserById(userId);
  return user?.email ?? null;
}

export async function scheduleContractReminders(input: {
  workflowInstanceId: string;
  organizationId: string;
  renewalDate: Date;
  latestNoticeDate: Date | null;
  ownerId: string | null;
  createdBy: string | null;
  contractName: string;
  documentId?: string;
}): Promise<void> {
  const hasPaid = await checkModuleEntitlement(input.organizationId, CONTRACT_ENTITLEMENT);
  if (!hasPaid) return;

  const ownerEmail = await resolveOwnerEmail(
    input.organizationId,
    input.ownerId,
    input.createdBy
  );
  if (!ownerEmail) return;

  const supabase = createServiceClient();
  const now = new Date();

  const pipelines: Array<{
    anchorDate: Date;
    windows: ReadonlyArray<
      | (typeof CONTRACT_RENEWAL_REMINDER_WINDOWS)[number]
      | (typeof CONTRACT_NOTICE_REMINDER_WINDOWS)[number]
    >;
  }> = [
    { anchorDate: input.renewalDate, windows: CONTRACT_RENEWAL_REMINDER_WINDOWS },
  ];

  if (input.latestNoticeDate) {
    pipelines.push({
      anchorDate: input.latestNoticeDate,
      windows: CONTRACT_NOTICE_REMINDER_WINDOWS,
    });
  }

  for (const { anchorDate, windows } of pipelines) {
    for (const { window, daysBefore, type, category } of windows) {
      const scheduledAt = new Date(anchorDate);
      scheduledAt.setDate(scheduledAt.getDate() - daysBefore);
      scheduledAt.setHours(9, 0, 0, 0);
      if (scheduledAt <= now) continue;

      const idempotencyKey = `${input.workflowInstanceId}:${type}:${window}`;
      const { data: existing } = await supabase
        .from("reminders")
        .select("id")
        .eq("workflow_instance_id", input.workflowInstanceId)
        .eq("reminder_window", window)
        .eq("type", type)
        .neq("status", "cancelled")
        .maybeSingle();

      if (existing) continue;

      const { error } = await supabase.from("reminders").insert({
        organization_id: input.organizationId,
        workflow_instance_id: input.workflowInstanceId,
        type,
        scheduled_at: scheduledAt.toISOString(),
        status: "scheduled",
        reminder_window: window,
        recipient_email: ownerEmail,
        metadata: {
          category,
          contractName: input.contractName,
          documentId: input.documentId ?? null,
          internal: true,
          idempotencyKey,
          latestNoticeDate: input.latestNoticeDate?.toISOString() ?? null,
          renewalDate: input.renewalDate.toISOString(),
        },
      });

      if (!error) {
        await createAuditLog({
          organizationId: input.organizationId,
          actorType: "system",
          action: "contract.reminder_created",
          targetType: "workflow_instance",
          targetId: input.workflowInstanceId,
          metadata: { window, type, scheduledAt: scheduledAt.toISOString() },
        });
      }
    }
  }
}

export async function rescheduleContractReminders(input: {
  workflowInstanceId: string;
  organizationId: string;
  renewalDate: Date;
  latestNoticeDate: Date | null;
  ownerId: string | null;
  createdBy: string | null;
  contractName: string;
  documentId?: string;
}): Promise<void> {
  await cancelContractReminders(input.workflowInstanceId, input.organizationId);
  await scheduleContractReminders(input);
}
