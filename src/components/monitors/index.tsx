import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/cn";

export function MonitorCard({
  id,
  name,
  monitorType,
  status,
  nextRunAt,
}: {
  id: string;
  name: string;
  monitorType: string;
  status: string;
  nextRunAt?: string | null;
}) {
  return (
    <Link
      href={`/app/monitors/${id}`}
      className="block rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-sm md:hidden"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-primary">{name}</p>
        <StatusBadge status={status} />
      </div>
      <p className="mt-1 text-caption text-secondary">{monitorType}</p>
      {nextRunAt && (
        <p className="mt-2 text-caption text-tertiary">Next: {formatDate(nextRunAt)}</p>
      )}
    </Link>
  );
}

export function MonitorTimeline({
  items,
}: {
  items: Array<{ label: string; date: string; status?: string }>;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-center justify-between text-body-sm">
          <span className="text-primary">{item.label}</span>
          <span className="text-caption text-secondary">{formatDate(item.date)}</span>
        </li>
      ))}
    </ul>
  );
}
