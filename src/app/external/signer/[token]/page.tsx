import { validateMagicLink } from "@/lib/magic-links/validateMagicLink";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { getSignedUrl } from "@/lib/documents/upload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignDocumentForm } from "@/components/forms/SignDocumentForm";
import { formatDate } from "@/lib/utils/cn";
import { SIGNER_DOCUMENT_TYPE } from "@/lib/signer/constants";

export default async function ExternalSignerPage({ params }: { params: { token: string } }) {
  const result = await validateMagicLink(params.token);

  if (!result.valid) {
    const messages = {
      not_found: "This link is invalid.",
      expired: "This link has expired. Please contact the sender for a new link.",
      revoked: "This link is no longer active.",
      max_uses: "This document has already been signed.",
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
            <CardTitle>Already signed</CardTitle>
            <CardDescription>This document has already been signed.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const metadata = (workflow?.metadata ?? {}) as Record<string, string | null>;
  const documentTitle = metadata.document_title ?? "Document";

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
    .eq("document_type", SIGNER_DOCUMENT_TYPE)
    .maybeSingle();

  let documentUrl: string | null = null;
  if (document?.current_version_id) {
    const { data: version } = await supabase
      .from("document_versions")
      .select("storage_path, filename")
      .eq("id", document.current_version_id)
      .single();
    if (version?.storage_path) {
      try {
        documentUrl = await getSignedUrl(version.storage_path, 3600);
      } catch {
        documentUrl = null;
      }
    }
  }

  await createAuditLog({
    organizationId: result.link.organizationId,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    actorEmail: participant?.email ?? undefined,
    action: "signer_magic_link.opened",
    targetType: "magic_link",
    targetId: result.link.id,
  });

  if (workflow && workflow.status === "sent") {
    await supabase.from("workflow_instances").update({ status: "opened" }).eq("id", workflow.id);
    await createAuditLog({
      organizationId: result.link.organizationId,
      actorType: "external",
      actorId: result.link.externalParticipantId,
      action: "signer_request.opened",
      targetType: "workflow_instance",
      targetId: workflow.id,
    });
  }

  trackEvent("signer_magic_link_opened", { workflowId: result.link.workflowInstanceId });

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-overline text-tertiary">Keelstar</p>
          <p className="mt-1 text-body-sm text-secondary">
            Signature request from <strong className="text-primary">{org?.name}</strong>
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{documentTitle}</CardTitle>
            <CardDescription>Please review the document and sign below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-sunken/50 p-3 text-body-sm text-secondary">
              <p>Signer: {participant?.email}</p>
              {workflow?.due_date && <p>Due date: {formatDate(workflow.due_date)}</p>}
            </div>
            {documentUrl ? (
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-body-sm text-accent hover:underline"
              >
                Open document (PDF)
              </a>
            ) : (
              <p className="text-body-sm text-warning">Document is not yet available. Contact the sender.</p>
            )}
            <SignDocumentForm token={params.token} documentTitle={documentTitle} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
