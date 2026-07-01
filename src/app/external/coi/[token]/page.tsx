import { validateMagicLink } from "@/lib/magic-links/validateMagicLink";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CoiUploadForm } from "@/components/forms/CoiUploadForm";
import { formatDate } from "@/lib/utils/cn";

export default async function ExternalCoiPage({ params }: { params: { token: string } }) {
  const result = await validateMagicLink(params.token);

  if (!result.valid) {
    const messages = {
      not_found: "This link is invalid.",
      expired: "This link has expired. Please contact the requesting organization to request a new link.",
      revoked: "This link is no longer active.",
      max_uses: "This request has already been completed.",
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

  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("id, status, due_date, organization_id, metadata")
    .eq("id", result.link.workflowInstanceId)
    .single();

  if (workflow && ["active_monitoring", "expiring_soon", "approved", "completed", "cancelled"].includes(workflow.status)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Already completed</CardTitle>
            <CardDescription>This request has already been completed.</CardDescription>
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

  await createAuditLog({
    organizationId: result.link.organizationId,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    actorEmail: participant?.email ?? undefined,
    action: "coi_magic_link.opened",
    targetType: "magic_link",
    targetId: result.link.id,
  });

  if (workflow && ["sent", "needs_correction"].includes(workflow.status)) {
    await supabase.from("workflow_instances").update({ status: "opened" }).eq("id", workflow.id);
    await createAuditLog({
      organizationId: result.link.organizationId,
      actorType: "external",
      actorId: result.link.externalParticipantId,
      action: "coi_request.opened",
      targetType: "workflow_instance",
      targetId: workflow.id,
    });
  }

  trackEvent("coi_magic_link_opened", { workflowId: result.link.workflowInstanceId });

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-overline text-tertiary">Keelstar</p>
          <p className="mt-1 text-body-sm text-secondary">
            Secure request from <strong className="text-primary">{org?.name}</strong>
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Certificate of insurance upload</CardTitle>
            <CardDescription>
              {org?.name} is requesting a certificate of insurance from you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-sunken/50 p-3 text-body-sm text-secondary">
              <p>Recipient: {participant?.email}</p>
              {workflow?.due_date && <p>Due date: {formatDate(workflow.due_date)}</p>}
              <p className="mt-2 text-caption">
                Your file is transmitted securely and stored privately. No account is required.
              </p>
            </div>
            <CoiUploadForm token={params.token} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
