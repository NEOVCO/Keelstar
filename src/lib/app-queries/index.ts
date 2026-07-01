import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { MODULES } from "@/lib/modules/modules";

export async function fetchWorkflows(organizationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workflow_instances")
    .select("id, title, type, status, due_date, owner_id, updated_at, metadata, vendor_id, vendors(name, email)")
    .eq("organization_id", organizationId)
    .order("updated_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function fetchWorkflow(organizationId: string, id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name, email)")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .single();
  return data;
}

export async function fetchDocuments(organizationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("id, title, document_type, status, workflow_instance_id, created_at, updated_at")
    .eq("organization_id", organizationId)
    .neq("status", "deleted")
    .order("updated_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export async function fetchDocument(organizationId: string, id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .single();
  return data;
}

export async function fetchDocumentVersions(documentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("document_versions")
    .select("id, version_number, filename, mime_type, created_at, storage_path, uploaded_by_email, status")
    .eq("document_id", documentId)
    .order("version_number", { ascending: false });
  return data ?? [];
}

export async function fetchDocumentParsedFields(documentVersionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("document_parsed_fields")
    .select("id, field_key, field_value, confidence, extraction_source, is_override")
    .eq("document_version_id", documentVersionId)
    .order("field_key", { ascending: true });
  return data ?? [];
}

export async function fetchTasks(organizationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("id, title, status, due_date, assignee_type, workflow_instance_id, workflow_instances(title)")
    .eq("organization_id", organizationId)
    .in("status", ["pending", "in_progress", "overdue"])
    .order("due_date", { ascending: true })
    .limit(100);
  return data ?? [];
}

export async function fetchMonitors(organizationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("monitors")
    .select("id, name, monitor_type, status, next_run_at, last_run_at, created_at")
    .eq("organization_id", organizationId)
    .order("next_run_at", { ascending: true })
    .limit(100);
  return data ?? [];
}

export async function fetchMonitor(organizationId: string, id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("monitors")
    .select("*")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .single();
  return data;
}

export async function fetchVendors(organizationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vendors")
    .select("*")
    .eq("organization_id", organizationId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function fetchVendor(organizationId: string, id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .single();
  return data;
}

export async function fetchAuditLogs(organizationId: string, limit = 100) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("id, action, actor_type, actor_email, target_type, target_id, metadata, created_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function fetchWorkflowAudit(organizationId: string, targetId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("id, action, actor_email, actor_type, created_at")
    .eq("organization_id", organizationId)
    .eq("target_id", targetId)
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function fetchReminders(workflowId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reminders")
    .select("reminder_window, scheduled_at, status")
    .eq("workflow_instance_id", workflowId)
    .order("scheduled_at", { ascending: true });
  return data ?? [];
}

export async function fetchDashboardStats(organizationId: string) {
  const supabase = await createClient();
  const [workflows, tasks, documents, audit] = await Promise.all([
    supabase
      .from("workflow_instances")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .in("status", ["active", "sent", "submitted", "review_needed", "overdue", "needs_correction", "opened"]),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .in("status", ["pending", "in_progress", "overdue"]),
    supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "review_needed"),
    supabase
      .from("audit_logs")
      .select("id, action, actor_email, target_type, created_at, metadata")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);
  return {
    activeWorkflows: workflows.count ?? 0,
    openTasks: tasks.count ?? 0,
    reviewDocuments: documents.count ?? 0,
    recentAudit: audit.data ?? [],
  };
}

export function moduleLabelForType(workflowType: string): string {
  return MODULES.find((m) => m.workflowType === workflowType)?.name ?? workflowType;
}

export function moduleSlugForType(workflowType: string): string {
  return MODULES.find((m) => m.workflowType === workflowType)?.slug ?? workflowType;
}

export async function fetchOrgMembers(organizationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organization_members")
    .select("id, user_id, status, invited_email, joined_at")
    .eq("organization_id", organizationId)
    .eq("status", "active")
    .order("joined_at", { ascending: true });

  const members = data ?? [];
  const service = createServiceClient();
  const withEmail = await Promise.all(
    members.map(async (m) => {
      if (m.invited_email) return { ...m, email: m.invited_email };
      const { data: userData } = await service.auth.admin.getUserById(m.user_id);
      return { ...m, email: userData.user?.email ?? "Team member" };
    })
  );
  return withEmail;
}

export async function fetchOrgEntitlements(organizationId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organization_entitlements")
    .select("is_enabled, products(key)")
    .eq("organization_id", organizationId)
    .eq("is_enabled", true);

  const keys = new Set(
    (data ?? []).map((e) => (e.products as unknown as { key: string })?.key).filter(Boolean)
  );
  if (keys.size === 0) {
    MODULES.forEach((m) => keys.add(m.requiredEntitlement));
  }
  return keys;
}

export function isModuleEntitled(entitlements: Set<string>, entitlementKey: string) {
  return entitlements.has(entitlementKey);
}
