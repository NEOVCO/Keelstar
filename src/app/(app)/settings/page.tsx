import { PageHeader } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireOrganization } from "@/lib/tenant/context";

export default async function SettingsPage() {
  const ctx = await requireOrganization();

  return (
    <div>
      <PageHeader title="Settings" description="Organization settings and preferences." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-caption text-secondary">Name</p>
              <p className="text-body-sm text-primary">{ctx.organization.name}</p>
            </div>
            <div>
              <p className="text-caption text-secondary">Slug</p>
              <p className="text-body-sm text-primary">{ctx.organization.slug}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ctx.membership.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-sm bg-accent-subtle px-2 py-1 text-caption font-medium text-accent"
                >
                  {role}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
