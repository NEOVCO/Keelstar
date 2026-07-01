import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";

export default function SecuritySettingsPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Settings", href: "/app/settings" }, { label: "Security" }]} />
        }
        title="Security"
        description="Sessions and security preferences."
      />
      <Card>
        <CardContent className="py-8 text-body-sm text-secondary">
          SSO and session management — planned for a future release.
        </CardContent>
      </Card>
    </div>
  );
}
