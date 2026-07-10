import Link from "next/link";
import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { requireOrganization } from "@/lib/tenant/context";
import { fetchInAppNotifications } from "@/lib/notifications/inbox";
import { formatRelativeDate } from "@/lib/utils/cn";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { MarkAllReadButton } from "@/components/notifications/MarkAllReadButton";

export default async function NotificationsPage() {
  const ctx = await requireOrganization();
  const email = ctx.user.email;
  const notifications = email
    ? await fetchInAppNotifications(ctx.organization.id, email, 100)
    : [];

  const unread = notifications.filter((n) => !n.read_at);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="In-app alerts for tasks, workflows, and monitors."
        action={unread.length > 0 ? <MarkAllReadButton /> : undefined}
      />
      {!notifications.length ? (
        <EmptyState
          title="No notifications yet"
          description="Workflow updates and task assignments will appear here."
          primaryAction={{ label: "View inbox", href: "/app/inbox" }}
        />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
          {notifications.map((n) => (
            <li key={n.id} className="px-4 py-3">
              <Link
                href={n.href ?? "/app/inbox"}
                className="block hover:opacity-80"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-body-sm ${n.read_at ? "text-secondary" : "font-medium text-primary"}`}>
                      {n.title}
                    </p>
                    {n.body && <p className="mt-0.5 text-caption text-tertiary">{n.body}</p>}
                  </div>
                  <span className="shrink-0 text-caption text-tertiary">
                    {formatRelativeDate(n.created_at)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
