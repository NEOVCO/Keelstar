import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ObjectHeader, ObjectRightRail } from "@/components/objects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DocumentPreview,
  DocumentVersionHistory,
  DocumentActions,
  ExtractionReviewPanel,
} from "@/components/documents";
import { ParsedFieldsEditor } from "@/components/documents/ParsedFieldsEditor";
import { AuditTimeline } from "@/components/audit";
import { requireOrganization } from "@/lib/tenant/context";
import {
  fetchDocument,
  fetchDocumentVersions,
  fetchDocumentParsedFields,
  fetchWorkflowAudit,
} from "@/lib/app-queries";
import { getSignedUrl } from "@/lib/documents/upload";

export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
  const ctx = await requireOrganization();
  const doc = await fetchDocument(ctx.organization.id, params.id);
  if (!doc) notFound();

  const versions = await fetchDocumentVersions(doc.id);
  const latest = versions[0];
  let previewUrl: string | null = null;
  if (latest?.storage_path) {
    try {
      previewUrl = await getSignedUrl(latest.storage_path);
    } catch {
      previewUrl = null;
    }
  }

  const auditEvents = doc.workflow_instance_id
    ? await fetchWorkflowAudit(ctx.organization.id, doc.workflow_instance_id)
    : await fetchWorkflowAudit(ctx.organization.id, doc.id);

  const parsedFields = latest?.id ? await fetchDocumentParsedFields(latest.id) : [];

  return (
    <div>
      <ObjectHeader
        breadcrumbs={
          <Breadcrumbs items={[{ label: "Documents", href: "/app/documents" }, { label: doc.title }]} />
        }
        title={doc.title}
        status={doc.status}
        primaryAction={<DocumentActions downloadUrl={previewUrl} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentPreview url={previewUrl} mimeType={latest?.mime_type} filename={latest?.filename} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extracted fields</CardTitle>
            </CardHeader>
            <CardContent>
              <ExtractionReviewPanel>
                <ParsedFieldsEditor documentId={doc.id} fields={parsedFields} />
              </ExtractionReviewPanel>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Version history</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentVersionHistory versions={versions} />
            </CardContent>
          </Card>
        </div>

        <ObjectRightRail>
          <AuditTimeline
            events={auditEvents.map((e) => ({
              id: e.id,
              action: e.action,
              actor: e.actor_email ?? e.actor_type ?? "System",
              timestamp: e.created_at,
            }))}
          />
        </ObjectRightRail>
      </div>
    </div>
  );
}
