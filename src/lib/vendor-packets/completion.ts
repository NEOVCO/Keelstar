import { createServiceClient } from "@/lib/supabase/service";

export type PacketProgress = {
  total: number;
  required: number;
  completed: number;
  requiredCompleted: number;
  percentComplete: number;
  allRequiredComplete: boolean;
  items: Array<{
    key: string;
    label: string;
    required: boolean;
    status: "pending" | "uploaded";
    submittedAt?: string;
  }>;
};

export async function computePacketProgress(workflowId: string): Promise<PacketProgress> {
  const supabase = createServiceClient();
  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("metadata")
    .eq("id", workflowId)
    .single();

  const metadata = (workflow?.metadata ?? {}) as {
    checklist?: Array<{ key: string; label: string; required: boolean }>;
    completions?: Record<string, { submittedAt?: string }>;
  };

  const checklist = metadata.checklist ?? [];
  const completions = metadata.completions ?? {};

  const items = checklist.map((item) => ({
    key: item.key,
    label: item.label,
    required: item.required,
    status: completions[item.key] ? ("uploaded" as const) : ("pending" as const),
    submittedAt: completions[item.key]?.submittedAt,
  }));

  const completed = items.filter((i) => i.status === "uploaded").length;
  const required = items.filter((i) => i.required).length;
  const requiredCompleted = items.filter((i) => i.required && i.status === "uploaded").length;

  return {
    total: items.length,
    required,
    completed,
    requiredCompleted,
    percentComplete: items.length ? Math.round((completed / items.length) * 100) : 0,
    allRequiredComplete: required > 0 && requiredCompleted >= required,
    items,
  };
}

export async function updatePacketStatus(workflowId: string): Promise<string> {
  const supabase = createServiceClient();
  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("status, due_date")
    .eq("id", workflowId)
    .single();

  if (!workflow || ["completed", "cancelled"].includes(workflow.status)) {
    return workflow?.status ?? "draft";
  }

  const progress = await computePacketProgress(workflowId);
  let newStatus = workflow.status;

  if (progress.allRequiredComplete) {
    newStatus = "review_needed";
  } else if (progress.completed > 0) {
    newStatus = "in_progress";
  } else if (["sent", "opened"].includes(workflow.status)) {
    newStatus = workflow.status;
  }

  if (workflow.due_date && new Date(workflow.due_date) < new Date() && !progress.allRequiredComplete) {
    newStatus = "overdue";
  }

  if (newStatus !== workflow.status) {
    await supabase.from("workflow_instances").update({ status: newStatus }).eq("id", workflowId);
  }

  return newStatus;
}
