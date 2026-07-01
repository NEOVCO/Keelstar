import { validateMagicLink } from "@/lib/magic-links/validateMagicLink";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/cn";
import { VendorPacketPortal } from "@/components/vendor-packets/VendorPacketPortal";
import { computePacketProgress } from "@/lib/vendor-packets/completion";
import { VENDOR_PACKET_MAGIC_LINK_PURPOSE } from "@/lib/vendor-packets/constants";

export default async function ExternalVendorPacketPage({
  params,
}: {
  params: { token: string };
}) {
  const result = await validateMagicLink(params.token);

  if (!result.valid) {
    const messages = {
      not_found: "This link is invalid.",
      expired: "This link has expired. Please contact the requesting organization.",
      revoked: "This link is no longer active.",
      max_uses: "This portal is no longer available.",
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Link unavailable</CardTitle>
            <CardDescription>{messages[result.reason]}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (result.link.purpose !== VENDOR_PACKET_MAGIC_LINK_PURPOSE) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid link</CardTitle>
            <CardDescription>This link is not for a vendor packet portal.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, status, due_date, organization_id, metadata, title")
    .eq("id", result.link.workflowInstanceId)
    .single();

  if (workflow && ["completed", "cancelled"].includes(workflow.status)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Packet complete</CardTitle>
            <CardDescription>This vendor packet has already been completed. Thank you.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", result.link.organizationId)
    .single();

  const { data: participant } = await supabase
    .from("external_participants")
    .select("email")
    .eq("id", result.link.externalParticipantId)
    .single();

  if (workflow && workflow.status === "sent") {
    await supabase.from("workflow_instances").update({ status: "opened" }).eq("id", workflow.id);
    await createAuditLog({
      organizationId: result.link.organizationId,
      actorType: "external",
      actorId: result.link.externalParticipantId,
      action: "vendor_packet.opened",
      targetType: "workflow_instance",
      targetId: workflow.id,
    });
  }

  await createAuditLog({
    organizationId: result.link.organizationId,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    actorEmail: participant?.email ?? undefined,
    action: "vendor_packet.magic_link_opened",
    targetType: "magic_link",
    targetId: result.link.id,
  });

  trackEvent("vendor_packet_portal_opened", { workflowId: result.link.workflowInstanceId });

  const progress = workflow ? await computePacketProgress(workflow.id) : null;
  const metadata = (workflow?.metadata ?? {}) as {
    message?: string;
    checklist?: Array<{ key: string; label: string; required: boolean; description?: string }>;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-overline text-tertiary">Keelstar</p>
          <p className="mt-1 text-body-sm text-secondary">
            Secure vendor portal from <strong className="text-primary">{org?.name}</strong>
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Vendor onboarding documents</CardTitle>
            <CardDescription>
              Upload each required document below. You can return to this portal until all items are submitted.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-sunken/50 p-3 text-body-sm text-secondary">
              <p>Recipient: {participant?.email}</p>
              {workflow?.due_date && <p>Due date: {formatDate(workflow.due_date)}</p>}
              {progress && (
                <p className="mt-1">
                  Progress: {progress.completed}/{progress.total} documents
                </p>
              )}
            </div>
            {metadata.message && (
              <p className="text-body-sm text-secondary">{metadata.message}</p>
            )}
            <VendorPacketPortal
              token={params.token}
              items={progress?.items ?? []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
