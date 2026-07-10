import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { createWorkflowSchema } from "@/lib/validation/schemas";
import { createInAppNotification } from "@/lib/notifications/create";
import { DEFAULT_WORKFLOW_STEPS, OPERATIONAL_WORKFLOW_TYPE } from "./constants";

export async function createWorkflow(input: unknown) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const data = createWorkflowSchema.parse(input);
  const supabase = createServiceClient();

  const metadata = {
    ...(data.metadata ?? {}),
    ...(data.description ? { description: data.description } : {}),
  };

  const { data: workflow, error } = await supabase
    .from("workflow_instances")
    .insert({
      organization_id: ctx.organization.id,
      type: data.type || OPERATIONAL_WORKFLOW_TYPE,
      title: data.title,
      status: "draft",
      owner_id: ctx.user.id,
      created_by: ctx.user.id,
      due_date: data.dueDate ?? null,
      vendor_id: data.vendorId ?? null,
      metadata,
    })
    .select("id, title, type, status, due_date")
    .single();

  if (error) throw new Error(error.message);

  const steps = DEFAULT_WORKFLOW_STEPS.map((s) => ({
    organization_id: ctx.organization.id,
    workflow_instance_id: workflow.id,
    step_order: s.step_order,
    name: s.name,
    step_type: s.step_type,
    status: s.step_order === 1 ? "active" : "pending",
  }));

  const { data: createdSteps, error: stepsError } = await supabase
    .from("workflow_steps")
    .insert(steps)
    .select("id, step_order");

  if (stepsError) throw new Error(stepsError.message);

  const firstStep = createdSteps?.find((s) => s.step_order === 1);

  const { data: member } = await supabase
    .from("organization_members")
    .select("id")
    .eq("organization_id", ctx.organization.id)
    .eq("user_id", ctx.user.id)
    .eq("status", "active")
    .maybeSingle();

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .insert({
      organization_id: ctx.organization.id,
      workflow_instance_id: workflow.id,
      workflow_step_id: firstStep?.id ?? null,
      title: `Review: ${data.title}`,
      description: "Initial review task for this workflow",
      status: "pending",
      assignee_type: member ? "member" : null,
      assignee_member_id: member?.id ?? null,
      due_date: data.dueDate ?? null,
    })
    .select("id")
    .single();

  if (taskError) throw new Error(taskError.message);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    action: "workflow.created",
    targetType: "workflow_instance",
    targetId: workflow.id,
    metadata: { type: workflow.type },
  });

  if (ctx.user.email) {
    await createInAppNotification({
      organizationId: ctx.organization.id,
      recipientEmail: ctx.user.email,
      title: `Workflow created: ${workflow.title}`,
      body: "A review task was assigned to you.",
      href: `/app/workflows/${workflow.id}`,
      templateKey: "workflow.created",
    });
  }

  return { workflow, taskId: task.id };
}

export async function listWorkflows(organizationId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("workflow_instances")
    .select("id, title, type, status, due_date, owner_id, updated_at, metadata, vendor_id")
    .eq("organization_id", organizationId)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getWorkflow(organizationId: string, id: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("workflow_instances")
    .select("*, workflow_steps(*), tasks(*)")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateWorkflow(
  organizationId: string,
  userId: string,
  id: string,
  patch: { title?: string; status?: string; dueDate?: string | null; metadata?: Record<string, unknown> }
) {
  const supabase = createServiceClient();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title) updates.title = patch.title;
  if (patch.status) updates.status = patch.status;
  if (patch.dueDate !== undefined) updates.due_date = patch.dueDate;
  if (patch.metadata) updates.metadata = patch.metadata;

  const { data, error } = await supabase
    .from("workflow_instances")
    .update(updates)
    .eq("id", id)
    .eq("organization_id", organizationId)
    .select("id, title, status, due_date")
    .single();

  if (error) throw new Error(error.message);

  await createAuditLog({
    organizationId,
    actorType: "user",
    actorId: userId,
    action: "workflow.updated",
    targetType: "workflow_instance",
    targetId: id,
    metadata: patch,
  });

  return data;
}

export async function cancelWorkflow(organizationId: string, userId: string, id: string) {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("workflow_instances")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (error) throw new Error(error.message);

  await supabase
    .from("tasks")
    .update({ status: "cancelled" })
    .eq("workflow_instance_id", id)
    .in("status", ["pending", "in_progress", "overdue"]);

  await createAuditLog({
    organizationId,
    actorType: "user",
    actorId: userId,
    action: "workflow.cancelled",
    targetType: "workflow_instance",
    targetId: id,
  });
}
