import { validateMagicLink } from "@/lib/magic-links/validateMagicLink";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { getSignedUrl } from "@/lib/documents/upload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PolicyAcknowledgeForm } from "@/components/forms/PolicyAcknowledgeForm";
import { formatDate } from "@/lib/utils/cn";
import { POLICY_DOCUMENT_TYPE } from "@/lib/policies/constants";

export default async function ExternalPolicyPage({ params }: { params: { token: string } }) {
  const result = await validateMagicLink(params.token);

  if (!result.valid) {
    const messages = {
      not_found: "This link is invalid.",
      expired: "This link has expired. Please contact your organization for a new link.",
      revoked: "This link is no longer active.",
      max_uses: "This policy has already been acknowledged.",
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

  if (workflow && ["completed", "cancelled"].includes(workflow.status)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Already acknowledged</CardTitle>
            <CardDescription>This policy acknowledgement has already been completed.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const metadata = (workflow?.metadata ?? {}) as Record<string, string | null>;
  const policyTitle = metadata.policy_title ?? "Company policy";

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

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", result.link.workflowInstanceId)
    .eq("document_type", POLICY_DOCUMENT_TYPE)
    .maybeSingle();

  let policyUrl: string | null = null;
  if (document?.current_version_id) {
    const { data: version } = await supabase
      .from("document_versions")
      .select("storage_path, filename")
      .eq("id", document.current_version_id)
      .single();
    if (version?.storage_path) {
      try {
        policyUrl = await getSignedUrl(version.storage_path, 3600);
      } catch {
        policyUrl = null;
      }
    }
  }

  await createAuditLog({
    organizationId: result.link.organizationId,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    actorEmail: participant?.email ?? undefined,
    action: "policy_magic_link.opened",
    targetType: "magic_link",
    targetId: result.link.id,
  });

  if (workflow && workflow.status === "sent") {
    await supabase.from("workflow_instances").update({ status: "opened" }).eq("id", workflow.id);
    await createAuditLog({
      organizationId: result.link.organizationId,
      actorType: "external",
      actorId: result.link.externalParticipantId,
      action: "policy_request.opened",
      targetType: "workflow_instance",
      targetId: workflow.id,
    });
  }

  trackEvent("policy_magic_link_opened", { workflowId: result.link.workflowInstanceId });

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-overline text-tertiary">Keelstar</p>
          <p className="mt-1 text-body-sm text-secondary">
            Policy acknowledgement from <strong className="text-primary">{org?.name}</strong>
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{policyTitle}</CardTitle>
            <CardDescription>
              Please review the policy document and submit your acknowledgement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-sunken/50 p-3 text-body-sm text-secondary">
              <p>Recipient: {participant?.email}</p>
              {workflow?.due_date && <p>Due date: {formatDate(workflow.due_date)}</p>}
              {metadata.policy_version && <p>Version: {metadata.policy_version}</p>}
            </div>
            {policyUrl ? (
              <a
                href={policyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-body-sm text-accent hover:underline"
              >
                Open policy document (PDF)
              </a>
            ) : (
              <p className="text-body-sm text-warning">Policy document is not yet available. Contact your administrator.</p>
            )}
            <PolicyAcknowledgeForm token={params.token} policyTitle={policyTitle} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
