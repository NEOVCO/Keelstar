import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { completeTaskSchema } from "@/lib/validation/schemas";
import { createInAppNotification } from "@/lib/notifications/create";

export async function listTasks(organizationId: string, filters?: { status?: string[] }) {
  const supabase = createServiceClient();
  let query = supabase
    .from("tasks")
    .select("id, title, status, due_date, workflow_instance_id, assignee_member_id, metadata, created_at")
    .eq("organization_id", organizationId)
    .order("due_date", { ascending: true })
    .limit(100);

  if (filters?.status?.length) {
    query = query.in("status", filters.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function completeTask(input: unknown) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);
  const data = completeTaskSchema.parse(input);
  const supabase = createServiceClient();

  const { data: task, error } = await supabase
    .from("tasks")
    .select("*, workflow_instances(title)")
    .eq("id", data.taskId)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (error || !task) throw new Error("Task not found");

  const { error: updateError } = await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      completed_by_type: "user",
      completed_by_id: ctx.user.id,
      metadata: { ...(task.metadata as object), ...(data.metadata ?? {}) },
    })
    .eq("id", data.taskId);

  if (updateError) throw new Error(updateError.message);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    action: "task.completed",
    targetType: "task",
    targetId: data.taskId,
    metadata: { workflowId: task.workflow_instance_id },
  });

  const wf = task.workflow_instances as { title?: string } | null;
  if (ctx.user.email) {
    await createInAppNotification({
      organizationId: ctx.organization.id,
      recipientEmail: ctx.user.email,
      title: `Task completed: ${task.title}`,
      body: wf?.title ? `Workflow: ${wf.title}` : undefined,
      href: `/app/workflows/${task.workflow_instance_id}`,
      templateKey: "task.completed",
    });
  }

  return { taskId: data.taskId };
}

export async function getTask(organizationId: string, taskId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*, workflow_instances(id, title, status, type)")
    .eq("id", taskId)
    .eq("organization_id", organizationId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
