import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ObjectHeader, ObjectMetadataGrid, ObjectRightRail } from "@/components/objects";
import { MonitorTimeline } from "@/components/monitors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireOrganization } from "@/lib/tenant/context";
import { fetchMonitor } from "@/lib/app-queries";
import { formatDate } from "@/lib/utils/cn";

export default async function MonitorDetailPage({ params }: { params: { id: string } }) {
  const ctx = await requireOrganization();
  const monitor = await fetchMonitor(ctx.organization.id, params.id);
  if (!monitor) notFound();

  return (
    <div>
      <ObjectHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Monitors", href: "/app/monitors" }, { label: monitor.name }]} />
        }
        title={monitor.name}
        status={monitor.status}
        primaryAction={<Button disabled>Run now</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Rule summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ObjectMetadataGrid
                items={[
                  { label: "Type", value: monitor.monitor_type },
                  { label: "Next run", value: monitor.next_run_at ? formatDate(monitor.next_run_at) : "—" },
                  { label: "Last run", value: monitor.last_run_at ? formatDate(monitor.last_run_at) : "—" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
        <ObjectRightRail title="Schedule">
          <MonitorTimeline
            items={
              monitor.next_run_at
                ? [{ label: "Next scheduled run", date: monitor.next_run_at }]
                : []
            }
          />
        </ObjectRightRail>
      </div>
    </div>
  );
}
