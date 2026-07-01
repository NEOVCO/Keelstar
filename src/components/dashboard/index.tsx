import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { OwnerCell, DueDateCell } from "@/components/tables";
import type { AttentionItem, MockAuditEvent } from "@/lib/mock-data";

export function DashboardAttentionPanel({ items }: { items: AttentionItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attention required</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-body-sm text-secondary">Nothing requires immediate attention.</p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-body-sm font-medium text-primary">{item.objectName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <StatusBadge status={item.status} />
                    <OwnerCell name={item.owner.name} initials={item.owner.initials} />
                    <DueDateCell date={item.dueDate} overdue={item.status === "overdue"} />
                  </div>
                </div>
                <Link href={item.href}>
                  <Button size="sm">{item.action}</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function WaitingOnOthersPanel({
  items,
}: {
  items: { id: string; who: string; what: string; since: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waiting on others</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2">
              <div>
                <p className="text-body-sm text-primary">{item.what}</p>
                <p className="text-caption text-secondary">
                  {item.who} · since {item.since}
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Send reminder
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ExpiringSoonPanel({
  items,
}: {
  items: { id: string; name: string; expires: string; module: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expiring soon</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-1">
              <div>
                <p className="text-body-sm text-primary">{item.name}</p>
                <p className="text-caption text-secondary">{item.module}</p>
              </div>
              <span className="text-caption text-warning">Expires {item.expires}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function RecentActivityTimeline({ events }: { events: MockAuditEvent[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent activity</CardTitle>
        <Link href="/app/audit" className="text-caption text-accent hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {events.slice(0, 5).map((e) => (
            <li key={e.id} className="text-body-sm">
              <span className="text-primary">{e.action}</span>
              <span className="text-secondary"> — {e.object}</span>
              <p className="text-caption text-tertiary">{new Date(e.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function WorkflowOverview({
  stats,
}: {
  stats: { label: string; value: number; href: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((s) => (
        <Link key={s.label} href={s.href}>
          <Card className="transition-shadow hover:shadow-sm">
            <CardContent className="pt-5">
              <p className="text-caption text-secondary">{s.label}</p>
              <p className="mt-1 text-h2 text-primary">{s.value}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function SuggestedNextSteps({
  suggestions,
}: {
  suggestions: { title: string; description: string; href: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested next steps</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {suggestions.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-md border border-border p-4 transition-colors hover:bg-sunken"
          >
            <p className="text-body-sm font-medium text-primary">{s.title}</p>
            <p className="mt-1 text-caption text-secondary">{s.description}</p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
