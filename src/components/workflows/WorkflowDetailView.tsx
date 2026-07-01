import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ObjectHeader, ObjectRightRail } from "@/components/objects";
import { WorkflowStepper, NextActionPanel } from "@/components/workflows";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { DocumentPreview, DocumentVersionHistory, DocumentActions, ParsedFieldRow, ExtractionReviewPanel } from "@/components/documents";
import { AuditTimeline, EvidenceExportPanel } from "@/components/audit";
import { WorkflowReviewActions } from "@/components/w9/WorkflowReviewActions";
import { VendorMagicLinkPanel } from "@/components/w9/VendorMagicLinkPanel";
import { CoiWorkflowReviewActions } from "@/components/coi/CoiWorkflowReviewActions";
import { CoiFieldsForm } from "@/components/coi/CoiFieldsForm";
import { ContractWorkflowActions } from "@/components/contracts/ContractWorkflowActions";
import { ContractFieldsForm } from "@/components/contracts/ContractFieldsForm";
import { ContractUploadForm } from "@/components/contracts/ContractUploadForm";
import { CrossSellPanel } from "@/components/onboarding/CrossSellPanel";
import { VendorPacketWorkflowActions } from "@/components/vendor-packets/VendorPacketWorkflowActions";
import { VendorPacketChecklistPanel } from "@/components/vendor-packets/VendorPacketChecklistPanel";
import { VENDOR_PACKET_WORKFLOW_TYPE } from "@/lib/vendor-packets/constants";
import { computePacketProgress } from "@/lib/vendor-packets/completion";
import { requireOrganization } from "@/lib/tenant/context";
import {
  fetchWorkflow,
  fetchWorkflowAudit,
  fetchReminders,
  fetchDocumentParsedFields,
  moduleLabelForType,
  moduleSlugForType,
} from "@/lib/app-queries";
import { createClient } from "@/lib/supabase/server";
import { getSignedUrl } from "@/lib/documents/upload";
import { formatDate } from "@/lib/utils/cn";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/types";

function stepForStatus(status: string): number {
  if (["draft"].includes(status)) return 0;
  if (["sent", "opened", "waiting_on_external", "in_progress"].includes(status)) return 1;
  if (["submitted", "processing", "parsed"].includes(status)) return 2;
  if (["review_needed", "in_review", "needs_correction", "rejected"].includes(status)) return 3;
  if (["approved", "active_monitoring", "active"].includes(status)) return 4;
  if (["expiring_soon", "expired", "completed"].includes(status)) return 5;
  return 5;
}

function confidenceLevel(value: number | null | undefined): "high" | "medium" | "low" {
  if (value == null) return "medium";
  if (value >= 0.85) return "high";
  if (value >= 0.6) return "medium";
  return "low";
}

export async function WorkflowDetailView({ id }: { id: string }) {
  const ctx = await requireOrganization();
  const workflow = await fetchWorkflow(ctx.organization.id, id);
  if (!workflow) notFound();

  const supabase = await createClient();
  const vendor = workflow.vendors as { name: string; email: string | null } | null;
  const metadata = (workflow.metadata ?? {}) as Record<string, string | null>;

  const { data: document } = await supabase
    .from("documents")
    .select("id, title, status, document_type, current_version_id")
    .eq("workflow_instance_id", workflow.id)
    .maybeSingle();

  let downloadUrl: string | null = null;
  let previewUrl: string | null = null;
  let mimeType: string | undefined;
  let latestVersionId: string | null = null;
  let versions: Array<{
    version_number: number;
    filename: string;
    created_at: string;
    status?: string;
    uploaded_by_email?: string | null;
  }> = [];

  if (document) {
    const { data: versionRows } = await supabase
      .from("document_versions")
      .select("id, version_number, filename, created_at, storage_path, mime_type, status, uploaded_by_email")
      .eq("document_id", document.id)
      .order("version_number", { ascending: false });

    versions = versionRows ?? [];
    const latest = versionRows?.[0];
    latestVersionId = latest?.id ?? document.current_version_id ?? null;
    mimeType = latest?.mime_type;
    if (latest?.storage_path) {
      try {
        downloadUrl = await getSignedUrl(latest.storage_path);
        previewUrl = downloadUrl;
      } catch {
        downloadUrl = null;
      }
    }
  }

  const [reminders, auditEvents, parsedFields, monitor] = await Promise.all([
    fetchReminders(workflow.id),
    fetchWorkflowAudit(ctx.organization.id, workflow.id),
    latestVersionId ? fetchDocumentParsedFields(latestVersionId) : Promise.resolve([]),
    workflow.type === "coi_tracking"
      ? supabase
          .from("monitors")
          .select("id, status, monitored_date, next_run_at, last_run_at")
          .eq("workflow_instance_id", workflow.id)
          .eq("monitor_type", "coi_expiration")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
          .then((r) => r.data)
      : workflow.type === "contract_renewal"
        ? supabase
            .from("monitors")
            .select("id, status, monitored_date, next_run_at, last_run_at")
            .eq("workflow_instance_id", workflow.id)
            .eq("monitor_type", "contract_renewal")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()
            .then((r) => r.data)
        : workflow.type === VENDOR_PACKET_WORKFLOW_TYPE
          ? supabase
              .from("monitors")
              .select("id, status, monitored_date, next_run_at, last_run_at")
              .eq("workflow_instance_id", workflow.id)
              .eq("monitor_type", "vendor_packet_incomplete")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle()
              .then((r) => r.data)
          : Promise.resolve(null),
  ]);

  const isW9 = workflow.type === "w9_collection";
  const isCoi = workflow.type === "coi_tracking";
  const isContract = workflow.type === "contract_renewal";
  const isVendorPacket = workflow.type === VENDOR_PACKET_WORKFLOW_TYPE;

  const packetProgress = isVendorPacket ? await computePacketProgress(workflow.id) : null;

  const magicLinkUrl =
    (isW9 || isCoi || isVendorPacket) &&
    ["sent", "opened", "needs_correction", "overdue", "in_progress", "review_needed"].includes(workflow.status)
      ? (metadata.magic_link_url as string | null) ?? null
      : null;

  const coiFieldMap = Object.fromEntries(parsedFields.map((f) => [f.field_key, f.field_value ?? ""]));
  const contractFieldMap = isContract ? coiFieldMap : {};

  const canApprove = can(ctx.permissions, PERMISSIONS.WORKFLOWS_APPROVE);
  const moduleLabel = moduleLabelForType(workflow.type);
  const step = stepForStatus(workflow.status);

  const nextAction =
    workflow.status === "review_needed" || workflow.status === "submitted"
      ? { title: "Review submitted document", desc: "Confirm extracted fields before approval.", label: "Review fields" }
      : ["sent", "opened", "needs_correction"].includes(workflow.status)
        ? { title: "Waiting on external participant", desc: `Request sent to ${metadata.recipient_email ?? vendor?.email ?? "vendor"}.`, label: "Send reminder" }
        : { title: "No action required", desc: "This workflow is progressing normally.", label: "View details" };

  return (
    <div>
      <ObjectHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Workflows", href: "/app/workflows" },
              { label: workflow.title },
            ]}
          />
        }
        title={workflow.title}
        status={workflow.status}
        dueDate={workflow.due_date ?? undefined}
        primaryAction={
          <div className="flex gap-2">
            <DocumentActions downloadUrl={downloadUrl} />
            {workflow.vendor_id && (
              <Link
                href={`/app/vendors/${workflow.vendor_id}`}
                className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-body-sm hover:bg-sunken"
              >
                View vendor
              </Link>
            )}
          </div>
        }
      />

      <p className="mb-4 text-caption text-secondary">{moduleLabel}</p>

      <div className="mb-6">
        <WorkflowStepper currentStep={step} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {isW9 && (
          <WorkflowReviewActions workflowId={workflow.id} status={workflow.status} canApprove={canApprove} />
        )}
        {isCoi && (
          <CoiWorkflowReviewActions workflowId={workflow.id} status={workflow.status} canApprove={canApprove} />
        )}
        {isContract && (
          <ContractWorkflowActions workflowId={workflow.id} status={workflow.status} canApprove={canApprove} />
        )}
        {isVendorPacket && (
          <VendorPacketWorkflowActions workflowId={workflow.id} status={workflow.status} canApprove={canApprove} />
        )}
      </div>

      <NextActionPanel title={nextAction.title} description={nextAction.desc} actionLabel={nextAction.label} />

      {["completed", "approved", "active", "active_monitoring", "expiring_soon"].includes(workflow.status) && (
        <div className="mt-6">
          <CrossSellPanel moduleSlug={moduleSlugForType(workflow.type)} />
        </div>
      )}

      {magicLinkUrl && (
        <div className="mt-6">
          <VendorMagicLinkPanel url={magicLinkUrl} />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-body-sm">
              <p><span className="text-secondary">Vendor:</span> {vendor?.name ?? "—"}</p>
              <p><span className="text-secondary">Email:</span> {metadata.recipient_email ?? vendor?.email ?? "—"}</p>
              <p><span className="text-secondary">Due:</span> {workflow.due_date ? formatDate(workflow.due_date) : "—"}</p>
              {metadata.expiration_date && (
                <p><span className="text-secondary">Expiration:</span> {formatDate(metadata.expiration_date)}</p>
              )}
              {metadata.rejection_reason && (
                <p><span className="text-secondary">Correction:</span> {metadata.rejection_reason}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {document ? (
                <>
                  <StatusBadge status={document.status} />
                  <DocumentPreview url={previewUrl} mimeType={mimeType} filename={versions[0]?.filename} />
                  <DocumentVersionHistory versions={versions} />
                </>
              ) : (
                <p className="text-body-sm text-secondary">No document uploaded yet.</p>
              )}
            </CardContent>
          </Card>

          {isContract && workflow.status === "draft" && (
            <Card>
              <CardHeader>
                <CardTitle>Upload contract</CardTitle>
              </CardHeader>
              <CardContent>
                <ContractUploadForm workflowId={workflow.id} />
              </CardContent>
            </Card>
          )}

          {isContract && ["review_needed", "metadata_needed", "uploaded"].includes(workflow.status) && (
            <Card>
              <CardHeader>
                <CardTitle>Renewal details</CardTitle>
              </CardHeader>
              <CardContent>
                <ContractFieldsForm
                  workflowId={workflow.id}
                  initialFields={{
                    contract_name: (metadata.contract_name as string) ?? workflow.title,
                    counterparty: (metadata.counterparty as string) ?? "",
                    notice_period_days:
                      (metadata.notice_period_days as string) ??
                      contractFieldMap.termination_notice_days ??
                      contractFieldMap.notice_period_days ??
                      "",
                    ...contractFieldMap,
                  }}
                  readOnly={!canApprove}
                />
              </CardContent>
            </Card>
          )}

          {isContract &&
            ["renewal_monitoring", "notice_window_open", "renewal_approaching", "auto_renew_risk", "expired", "active_monitoring", "expiring_soon"].includes(
              workflow.status
            ) && (
            <Card>
              <CardHeader>
                <CardTitle>Renewal details</CardTitle>
              </CardHeader>
              <CardContent>
                <ContractFieldsForm
                  workflowId={workflow.id}
                  initialFields={{
                    contract_name: (metadata.contract_name as string) ?? workflow.title,
                    counterparty: (metadata.counterparty as string) ?? "",
                    notice_period_days: String(metadata.notice_period_days ?? contractFieldMap.notice_period_days ?? ""),
                    ...contractFieldMap,
                  }}
                  readOnly={!canApprove}
                />
              </CardContent>
            </Card>
          )}

          {isVendorPacket && packetProgress && (
            <Card>
              <CardHeader>
                <CardTitle>Packet checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-body-sm text-secondary">
                  {packetProgress.completed}/{packetProgress.total} documents submitted
                  {packetProgress.allRequiredComplete ? " — all required items received" : ""}
                </p>
                <VendorPacketChecklistPanel workflowId={workflow.id} items={packetProgress.items} />
              </CardContent>
            </Card>
          )}

          {isCoi && ["submitted", "review_needed", "needs_correction"].includes(workflow.status) && (
            <Card>
              <CardHeader>
                <CardTitle>COI fields</CardTitle>
              </CardHeader>
              <CardContent>
                <CoiFieldsForm
                  workflowId={workflow.id}
                  initialFields={coiFieldMap}
                  readOnly={!canApprove}
                />
              </CardContent>
            </Card>
          )}

          {parsedFields.length > 0 && !isCoi && (
            <Card>
              <CardHeader>
                <CardTitle>Extracted fields</CardTitle>
              </CardHeader>
              <CardContent>
                <ExtractionReviewPanel>
                  {parsedFields.map((f) => (
                    <ParsedFieldRow
                      key={f.id}
                      label={f.field_key.replace(/_/g, " ")}
                      value={f.field_value}
                      confidence={confidenceLevel(f.confidence)}
                    />
                  ))}
                </ExtractionReviewPanel>
              </CardContent>
            </Card>
          )}

          {(isCoi || isContract || isVendorPacket) && monitor && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isContract ? "Renewal monitor" : isVendorPacket ? "Completion monitor" : "Expiration monitor"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-body-sm">
                <p><span className="text-secondary">Status:</span> <StatusBadge status={monitor.status} /></p>
                {monitor.monitored_date && (
                  <p><span className="text-secondary">{isContract ? "Renewal date:" : "Expiration:"}</span> {formatDate(monitor.monitored_date)}</p>
                )}
                {isContract && metadata.latest_notice_date && (
                  <p><span className="text-secondary">Latest notice date:</span> {formatDate(String(metadata.latest_notice_date))}</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              {!reminders.length ? (
                <p className="text-body-sm text-secondary">No reminders scheduled.</p>
              ) : (
                <ul className="space-y-2 text-body-sm">
                  {reminders.map((r, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{r.reminder_window?.replace(/_/g, " ")}</span>
                      <StatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
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
          {(isW9 || isCoi || isContract || isVendorPacket) && ["completed", "approved", "renewal_monitoring", "notice_window_open", "renewal_approaching", "auto_renew_risk", "active_monitoring", "expiring_soon", "expired", "renewed", "review_needed"].includes(workflow.status) && (
            <div className="mt-6">
              <EvidenceExportPanel
                workflowId={workflow.id}
                exportPath={
                  isCoi
                    ? `/api/coi/requests/${workflow.id}`
                    : isContract
                      ? `/api/contracts/requests/${workflow.id}`
                      : isVendorPacket
                        ? `/api/vendor-packets/requests/${workflow.id}`
                        : `/api/w9/requests/${workflow.id}`
                }
              />
            </div>
          )}
        </ObjectRightRail>
      </div>
    </div>
  );
}
