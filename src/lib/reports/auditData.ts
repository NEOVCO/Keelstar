import { createServiceClient } from "@/lib/supabase/service";

export type AuditLogEntry = {
  created_at: string;
  action: string;
  actor_type: string;
  actor_email: string | null;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
};

export async function fetchAuditLogEntries(
  organizationId: string,
  options?: { from?: string; to?: string; limit?: number }
): Promise<AuditLogEntry[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("audit_logs")
    .select("created_at, action, actor_type, actor_email, target_type, target_id, metadata")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(options?.limit ?? 5000);

  if (options?.from) query = query.gte("created_at", options.from);
  if (options?.to) query = query.lte("created_at", options.to);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as AuditLogEntry[];
}

export async function fetchOrganizationName(organizationId: string): Promise<string> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", organizationId)
    .single();
  return data?.name ?? "Organization";
}

export function humanizeAction(action: string): string {
  return action
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatActor(entry: AuditLogEntry): string {
  if (entry.actor_email) return entry.actor_email;
  if (entry.actor_type === "system") return "System";
  if (entry.actor_type === "external") return "External user";
  return entry.actor_type;
}

export function shortenId(id: string | null): string {
  if (!id) return "—";
  if (id.length <= 13) return id;
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

export function formatAuditTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
