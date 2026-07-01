import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { sanitizeFilename } from "@/lib/utils";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import { CONTRACT_ALLOWED_MIME, CONTRACT_MAX_FILE_SIZE, CONTRACT_DOCUMENT_TYPE } from "./constants";

export function buildContractStoragePath(
  organizationId: string,
  workflowId: string,
  documentId: string,
  versionNumber: number,
  filename: string
): string {
  const safe = sanitizeFilename(filename);
  return `organizations/${organizationId}/contracts/${workflowId}/documents/${documentId}/versions/v${versionNumber}/${safe}`;
}

export async function uploadContractDocument(
  workflowId: string,
  file: { filename: string; mimeType: string; sizeBytes: number; buffer: Buffer }
) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);

  if (!CONTRACT_ALLOWED_MIME.includes(file.mimeType as (typeof CONTRACT_ALLOWED_MIME)[number])) {
    throw new Error("File type not allowed. Accepted: PDF, PNG, JPEG, Word");
  }
  if (file.sizeBytes > CONTRACT_MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 25MB");
  }

  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", "contract_renewal")
    .single();

  if (!workflow) throw new Error("Contract not found");
  const blockedStatuses = [
    "renewal_monitoring",
    "notice_window_open",
    "renewal_approaching",
    "auto_renew_risk",
    "active_monitoring",
    "expiring_soon",
    "expired",
    "terminated",
    "cancelled",
    "archived",
  ];
  if (blockedStatuses.includes(workflow.status)) {
    throw new Error("Cannot upload while contract is actively monitored. Archive or terminate first.");
  }

  const { data: document } = await supabase
    .from("documents")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", CONTRACT_DOCUMENT_TYPE)
    .maybeSingle();

  if (!document) throw new Error("Document record not found");

  const { count } = await supabase
    .from("document_versions")
    .select("id", { count: "exact", head: true })
    .eq("document_id", document.id);

  const versionNumber = (count ?? 0) + 1;
  const safeFilename = sanitizeFilename(file.filename);
  const storagePath = buildContractStoragePath(
    ctx.organization.id,
    workflowId,
    document.id,
    versionNumber,
    safeFilename
  );
  const checksum = createHash("sha256").update(file.buffer).digest("hex");

  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file.buffer, { contentType: file.mimeType, upsert: false });

  if (storageError) throw new Error(`Upload failed: ${storageError.message}`);

  const { data: version, error: versionError } = await supabase
    .from("document_versions")
    .insert({
      organization_id: ctx.organization.id,
      document_id: document.id,
      version_number: versionNumber,
      filename: safeFilename,
      mime_type: file.mimeType,
      size_bytes: file.sizeBytes,
      checksum,
      storage_path: storagePath,
      storage_bucket: "documents",
      source: "internal_upload",
      status: "uploaded",
      uploaded_by_type: "user",
      uploaded_by: ctx.user.id,
    })
    .select("id")
    .single();

  if (versionError) throw new Error(versionError.message);

  await supabase
    .from("documents")
    .update({ status: "review_needed", current_version_id: version.id })
    .eq("id", document.id);

  const uploadedAt = new Date().toISOString();
  await supabase
    .from("workflow_instances")
    .update({
      status: "review_needed",
      metadata: {
        ...(workflow.metadata as object),
        uploaded_at: uploadedAt,
      },
    })
    .eq("id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "contract.document_uploaded",
    targetType: "document",
    targetId: document.id,
    metadata: { filename: safeFilename, versionNumber },
  });

  trackEvent("contract_uploaded", { workflowId });

  return { documentId: document.id, versionId: version.id };
}
