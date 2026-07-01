import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function ObjectHeader({
  title,
  status,
  owner,
  dueDate,
  primaryAction,
  breadcrumbs,
}: {
  title: string;
  status: string;
  owner?: string;
  dueDate?: string;
  primaryAction?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumbs}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-h2 text-primary">{title}</h1>
            <StatusBadge status={status} />
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-caption text-secondary">
            {owner && <span>Owner: {owner}</span>}
            {dueDate && <span>Due: {new Date(dueDate).toLocaleDateString()}</span>}
          </div>
        </div>
        {primaryAction}
      </div>
    </div>
  );
}

export function ObjectRightRail({
  title = "Activity",
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside className={cn("rounded-lg border border-border bg-surface p-4", className)}>
      <h2 className="mb-4 text-h4 text-primary">{title}</h2>
      {children}
    </aside>
  );
}

export function ObjectActivityTimeline({
  events,
}: {
  events: { id: string; actor: string; action: string; timestamp: string }[];
}) {
  return (
    <ul className="space-y-4">
      {events.map((e) => (
        <li key={e.id} className="flex gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sunken text-caption font-medium text-secondary">
            {e.actor.charAt(0)}
          </span>
          <div>
            <p className="text-body-sm text-primary">{e.action}</p>
            <p className="text-caption text-tertiary">
              {e.actor} · {new Date(e.timestamp).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ObjectMetadataGrid({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-caption text-tertiary">{item.label}</dt>
          <dd className="mt-1 text-body-sm text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function RelatedItemsPanel({
  items,
}: {
  items: { label: string; href: string; meta?: string }[];
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="block rounded-md px-2 py-2 hover:bg-sunken">
            <p className="text-body-sm text-primary">{item.label}</p>
            {item.meta && <p className="text-caption text-tertiary">{item.meta}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
