import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ObjectHeader } from "@/components/objects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { EditVendorForm } from "@/components/vendors/EditVendorForm";
import { VendorExclusionSection } from "@/components/exclusions/VendorExclusionSection";
import { formatDate } from "@/lib/utils/cn";
import { PEOPLE } from "@/lib/terminology/people";
import { isWorkforceVendor } from "@/lib/vendors/workforce";
import { VENDOR_RECORD_TYPE_LABELS, recordTypeFromMetadata } from "@/lib/vendors/types";

export default async function PersonDetailPage({ params }: { params: { id: string } }) {
  const ctx = await requireOrganization();
  const supabase = await createClient();

  const { data: person } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", params.id)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!person || !isWorkforceVendor(person)) notFound();

  const recordType = recordTypeFromMetadata(person.metadata);

  return (
    <div>
      <ObjectHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: PEOPLE.nav, href: "/app/people" }, { label: person.name }]} />
        }
        title={person.name}
        status={person.status}
        primaryAction={
          <Link href={`/app/apps/exclusions?vendor=${person.id}&name=${encodeURIComponent(person.name)}`}>
            <Button variant="secondary">Run OIG check</Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-body-sm">
              <p>
                <span className="text-secondary">Type:</span> {VENDOR_RECORD_TYPE_LABELS[recordType]}
              </p>
              <p>
                <span className="text-secondary">Email:</span> {person.email ?? "—"}
              </p>
              <p>
                <span className="text-secondary">Phone:</span> {person.phone ?? "—"}
              </p>
              <p>
                <span className="text-secondary">Updated:</span> {formatDate(person.updated_at)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{PEOPLE.editProfile}</CardTitle>
            </CardHeader>
            <CardContent>
              <EditVendorForm
                vendorId={person.id}
                initialName={person.name}
                initialEmail={person.email}
                initialPhone={person.phone}
                archiveRedirectTo="/app/people"
              />
            </CardContent>
          </Card>

          <VendorExclusionSection vendorId={person.id} vendorName={person.name} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{PEOPLE.policiesTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-body-sm">
              <p className="text-secondary">{PEOPLE.policiesDescription}</p>
              <Button asChild size="sm" variant="secondary">
                <Link href={`/app/apps/policies?person=${person.id}`}>{PEOPLE.policiesAction}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{PEOPLE.trainingTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-body-sm">
              <p className="text-secondary">{PEOPLE.trainingDescription}</p>
              <Button asChild size="sm" variant="secondary">
                <Link href={`/app/apps/training?person=${person.id}`}>{PEOPLE.trainingAction}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
