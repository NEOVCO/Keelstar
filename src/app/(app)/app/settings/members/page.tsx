import { PageHeader, Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  listOrganizationMembers,
  listPendingInvitations,
} from "@/lib/organizations/members";
import { MembersPanel } from "@/components/settings/MembersPanel";

export default async function MembersSettingsPage() {
  const ctx = await requirePermission(PERMISSIONS.MEMBERS_INVITE);
  const [members, invitations] = await Promise.all([
    listOrganizationMembers(ctx.organization.id),
    listPendingInvitations(ctx.organization.id),
  ]);

  return (
    <div>
      <PageHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Settings", href: "/app/settings" }, { label: "Members" }]} />
        }
        title="Members"
        description="Invite teammates and assign roles."
      />
      <Card>
        <CardContent className="pt-6">
          <MembersPanel initialMembers={members as never} initialInvitations={invitations as never} />
        </CardContent>
      </Card>
    </div>
  );
}
