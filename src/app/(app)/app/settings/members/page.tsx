import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MembersSettingsPage() {
  return (
    <div>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Settings", href: "/app/settings" }, { label: "Members" }]} />
        }
        title="Members"
        description="Invite teammates and assign roles."
        action={<Button>Invite member</Button>}
      />
      <Card>
        <CardContent className="py-8 text-center text-body-sm text-secondary">
          Member management UI — TODO(backend): organization_members API
        </CardContent>
      </Card>
    </div>
  );
}
