import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ObjectHeader, ObjectRightRail } from "@/components/objects";
import { AuditTimeline } from "@/components/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireOrganization } from "@/lib/tenant/context";
import { createClient } from "@/lib/supabase/server";
import { EditVendorForm } from "@/components/vendors/EditVendorForm";
import { RequestW9Form } from "@/components/vendors/RequestW9Form";
import { RequestCoiForm } from "@/components/coi/RequestCoiForm";
import { CreateVendorPacketForm } from "@/components/vendor-packets/CreateVendorPacketForm";
import { VendorExclusionSection } from "@/components/exclusions/VendorExclusionSection";
import { defaultDueDate, W9_WORKFLOW_TYPE } from "@/lib/w9/constants";
import { defaultCoiDueDate, COI_WORKFLOW_TYPE } from "@/lib/coi/constants";
import { defaultPacketDueDate, VENDOR_PACKET_WORKFLOW_TYPE, ACTIVE_VENDOR_PACKET_STATUSES } from "@/lib/vendor-packets/constants";
import { formatDate } from "@/lib/utils/cn";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/types";

export default async function AppVendorDetailPage({ params }: { params: { id: string } }) {
  const ctx = await requireOrganization();
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", params.id)
    .eq("organization_id", ctx.organization.id)
    .single();

  if (!vendor) notFound();

  const { data: w9Workflows } = await supabase
    .from("workflow_instances")
    .select("id, status, created_at, metadata")
    .eq("vendor_id", vendor.id)
    .eq("type", W9_WORKFLOW_TYPE)
    .order("created_at", { ascending: false });

  const { data: coiWorkflows } = await supabase
    .from("workflow_instances")
    .select("id, status, created_at, metadata")
    .eq("vendor_id", vendor.id)
    .eq("type", COI_WORKFLOW_TYPE)
    .order("created_at", { ascending: false });

  const { data: packetWorkflows } = await supabase
    .from("workflow_instances")
    .select("id, status, created_at, metadata")
    .eq("vendor_id", vendor.id)
    .eq("type", VENDOR_PACKET_WORKFLOW_TYPE)
    .order("created_at", { ascending: false });

  const { data: auditEvents } = await supabase
    .from("audit_logs")
    .select("id, action, created_at, actor_email")
    .eq("organization_id", ctx.organization.id)
    .eq("target_id", vendor.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const canCreate = can(ctx.permissions, PERMISSIONS.WORKFLOWS_CREATE);
  const activeW9 = w9Workflows?.find((w) =>
    ["draft", "sent", "opened", "submitted", "review_needed", "needs_correction", "overdue"].includes(w.status)
  );
  const activeCoi = coiWorkflows?.find((w) =>
    ["draft", "sent", "opened", "submitted", "review_needed", "needs_correction", "overdue"].includes(w.status)
  );
  const activePacket = packetWorkflows?.find((w) =>
    (ACTIVE_VENDOR_PACKET_STATUSES as readonly string[]).includes(w.status)
  );
  const latestCoi = coiWorkflows?.[0];
  const coiMeta = (latestCoi?.metadata ?? {}) as Record<string, string | null>;

  return (
    <div>
      <ObjectHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Vendors", href: "/app/vendors" }, { label: vendor.name }]} />
        }
        title={vendor.name}
        status={vendor.status}
        primaryAction={
          <div className="flex flex-wrap gap-2">
            {activeW9 ? (
              <Link href={`/app/workflows/${activeW9.id}`}>
                <Button variant="secondary">View W-9 request</Button>
              </Link>
            ) : canCreate ? (
              <a href="#request-w9">
                <Button variant="secondary">Request W-9</Button>
              </a>
            ) : null}
            {activeCoi ? (
              <Link href={`/app/workflows/${activeCoi.id}`}>
                <Button>View COI request</Button>
              </Link>
            ) : canCreate ? (
              <a href="#request-coi">
                <Button>Request COI</Button>
              </a>
            ) : null}
            {activePacket ? (
              <Link href={`/app/workflows/${activePacket.id}`}>
                <Button variant="secondary">View vendor packet</Button>
              </Link>
            ) : canCreate ? (
              <a href="#request-packet">
                <Button variant="secondary">Send packet</Button>
              </a>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-body-sm">
              <p><span className="text-secondary">Email:</span> {vendor.email ?? "—"}</p>
              <p><span className="text-secondary">Phone:</span> {vendor.phone ?? "—"}</p>
              <p><span className="text-secondary">Updated:</span> {formatDate(vendor.updated_at)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit vendor</CardTitle>
            </CardHeader>
            <CardContent>
              <EditVendorForm
                vendorId={vendor.id}
                initialName={vendor.name}
                initialEmail={vendor.email}
                initialPhone={vendor.phone}
              />
            </CardContent>
          </Card>

          <VendorExclusionSection vendorId={vendor.id} vendorName={vendor.name} />

          <Card>
            <CardHeader>
              <CardTitle>W-9 requests</CardTitle>
            </CardHeader>
            <CardContent>
              {!w9Workflows?.length ? (
                <p className="text-body-sm text-secondary">No W-9 requests yet.</p>
              ) : (
                <ul className="space-y-2">
                  {w9Workflows.map((w) => (
                    <li key={w.id} className="flex items-center justify-between text-body-sm">
                      <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                        Request {formatDate(w.created_at)}
                      </Link>
                      <StatusBadge status={w.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certificates of insurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!coiWorkflows?.length ? (
                <p className="text-body-sm text-secondary">No COI records yet.</p>
              ) : (
                <>
                  {latestCoi && (
                    <div className="rounded-md bg-sunken/50 p-3 text-body-sm">
                      <p><span className="text-secondary">Status:</span> <StatusBadge status={latestCoi.status} /></p>
                      {coiMeta.expiration_date && (
                        <p className="mt-1"><span className="text-secondary">Expiration:</span> {formatDate(coiMeta.expiration_date)}</p>
                      )}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {coiWorkflows.map((w) => (
                      <li key={w.id} className="flex items-center justify-between text-body-sm">
                        <Link href={`/app/workflows/${w.id}`} className="text-accent hover:underline">
                          COI {formatDate(w.created_at)}
                        </Link>
                        <StatusBadge status={w.status} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          {canCreate && !activePacket && (
            <Card id="request-packet">
              <CardHeader>
                <CardTitle>Send vendor packet</CardTitle>
              </CardHeader>
              <CardContent className="max-w-md">
                <CreateVendorPacketForm
                  vendorId={vendor.id}
                  vendorEmail={vendor.email}
                  defaultDueDate={defaultPacketDueDate().toISOString()}
                />
              </CardContent>
            </Card>
          )}

          {canCreate && !activeCoi && (
            <Card id="request-coi">
              <CardHeader>
                <CardTitle>Request COI</CardTitle>
              </CardHeader>
              <CardContent className="max-w-md">
                <RequestCoiForm
                  vendorId={vendor.id}
                  vendorEmail={vendor.email}
                  defaultDueDate={defaultCoiDueDate().toISOString()}
                />
              </CardContent>
            </Card>
          )}

          {canCreate && !activeW9 && (
            <Card id="request-w9">
              <CardHeader>
                <CardTitle>Request W-9</CardTitle>
              </CardHeader>
              <CardContent className="max-w-md">
                <RequestW9Form
                  vendorId={vendor.id}
                  vendorEmail={vendor.email}
                  defaultDueDate={defaultDueDate().toISOString()}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <ObjectRightRail>
          <AuditTimeline
            events={(auditEvents ?? []).map((e) => ({
              id: e.id,
              action: e.action.replace(/\./g, " "),
              actor: e.actor_email ?? "System",
              timestamp: e.created_at,
            }))}
          />
        </ObjectRightRail>
      </div>
    </div>
  );
}
