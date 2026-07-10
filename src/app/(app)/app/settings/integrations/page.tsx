import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { site } from "@/lib/site";

const INTEGRATIONS = [
  {
    id: "email",
    name: "Email (Resend)",
    description: "Send workflow requests and reminders from your organization.",
    status: "connected" as const,
  },
  {
    id: "storage",
    name: "Document storage",
    description: "Supabase Storage for uploaded documents and evidence.",
    status: "connected" as const,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Notify channels when workflows need review.",
    status: "planned" as const,
  },
  {
    id: "hris",
    name: "HRIS",
    description: "Sync people records for training and acknowledgements.",
    status: "planned" as const,
  },
];

export default function IntegrationsSettingsPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Settings", href: "/app/settings" }, { label: "Integrations" }]} />
        }
        title="Integrations"
        description="Connect services that power workflows, notifications, and document storage."
      />
      <div className="grid gap-4">
        {INTEGRATIONS.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-body font-medium">{item.name}</CardTitle>
              <StatusBadge status={item.status === "connected" ? "active" : "draft"} />
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-body-sm text-secondary">{item.description}</p>
              <Button variant="secondary" size="sm" disabled={item.status === "planned"}>
                {item.status === "connected" ? "Manage" : "Coming soon"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-body-sm text-secondary">
        Need a custom integration? Email{" "}
        <a href={`mailto:${site.contactEmail}`} className="text-accent hover:underline">
          {site.contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
