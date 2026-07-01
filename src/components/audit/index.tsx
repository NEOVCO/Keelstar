import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/cn";

export { EvidenceExportPanel } from "./EvidenceExportPanel";

export function AuditEventRow({
  action,
  actor,
  timestamp,
  target,
}: {
  action: string;
  actor: string;
  timestamp: string;
  target?: string;
}) {
  return (
    <div className="flex gap-3 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sunken text-caption font-medium text-secondary">
        {actor.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm text-primary">{action}</p>
        {target && <p className="text-caption text-secondary">{target}</p>}
        <p className="text-caption text-tertiary">
          {actor} · {formatDate(timestamp)}
        </p>
      </div>
    </div>
  );
}

export function AuditTimeline({
  events,
}: {
  events: Array<{ id: string; action: string; actor: string; timestamp: string; target?: string }>;
}) {
  if (!events.length) {
    return <p className="text-body-sm text-secondary">No audit events yet.</p>;
  }
  return (
    <ul className="divide-y divide-border">
      {events.map((e) => (
        <li key={e.id}>
          <AuditEventRow {...e} />
        </li>
      ))}
    </ul>
  );
}

