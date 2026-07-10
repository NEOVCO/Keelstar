import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { sanitizeFilename } from "@/lib/utils";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { trackEvent } from "@/lib/analytics/track";
import {
  POLICY_ALLOWED_MIME,
  POLICY_MAX_FILE_SIZE,
  POLICY_DOCUMENT_TYPE,
  POLICY_WORKFLOW_TYPE,
} from "./constants";

export function buildPolicyStoragePath(
  organizationId: string,
  workflowId: string,
  documentId: string,
  versionNumber: number,
  filename: string
): string {
  const safe = sanitizeFilename(filename);
  return `organizations/${organizationId}/policies/${workflowId}/documents/${documentId}/versions/v${versionNumber}/${safe}`;
}

export async function uploadPolicyDocument(
  workflowId: string,
  file: { filename: string; mimeType: string; sizeBytes: number; buffer: Buffer }
) {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_UPDATE);

  if (!POLICY_ALLOWED_MIME.includes(file.mimeType as (typeof POLICY_ALLOWED_MIME)[number])) {
    throw new Error("File type not allowed. Accepted: PDF, PNG, JPEG, Word");
  }
  if (file.sizeBytes > POLICY_MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 25MB");
  }

  const supabase = createServiceClient();

  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*")
    .eq("id", workflowId)
    .eq("organization_id", ctx.organization.id)
    .eq("type", POLICY_WORKFLOW_TYPE)
    .single();

  if (!workflow) throw new Error("Policy request not found");
  if (["completed", "cancelled"].includes(workflow.status)) {
    throw new Error("Cannot upload policy for a completed request");
  }

  const { data: document } = await supabase
    .from("documents")
    .select("id")
    .eq("workflow_instance_id", workflowId)
    .eq("document_type", POLICY_DOCUMENT_TYPE)
    .maybeSingle();

  if (!document) throw new Error("Document record not found");

  const { count } = await supabase
    .from("document_versions")
    .select("id", { count: "exact", head: true })
    .eq("document_id", document.id);

  const versionNumber = (count ?? 0) + 1;
  const safeFilename = sanitizeFilename(file.filename);
  const storagePath = buildPolicyStoragePath(
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

  if (storageError) throw new Error(`Storage upload failed: ${storageError.message}`);

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
      uploaded_by_email: ctx.user.email,
    })
    .select("id")
    .single();

  if (versionError) throw new Error(versionError.message);

  await supabase
    .from("documents")
    .update({
      status: "uploaded",
      current_version_id: version.id,
    })
    .eq("id", document.id);

  const metadata = (workflow.metadata ?? {}) as Record<string, string | null>;
  await supabase
    .from("workflow_instances")
    .update({
      metadata: {
        ...metadata,
        policy_filename: safeFilename,
        policy_uploaded_at: new Date().toISOString(),
      },
    })
    .eq("id", workflowId);

  await createAuditLog({
    organizationId: ctx.organization.id,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "policy_document.uploaded",
    targetType: "document",
    targetId: document.id,
    metadata: { workflowId, versionNumber, filename: safeFilename },
  });

  trackEvent("policy_document_uploaded", { workflowId });

  return { documentId: document.id, versionId: version.id, versionNumber };
}

export async function assertPolicyDocumentReady(workflowId: string, organizationId: string): Promise<void> {
  const supabase = createServiceClient();
  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id, status")
    .eq("workflow_instance_id", workflowId)
    .eq("organization_id", organizationId)
    .eq("document_type", POLICY_DOCUMENT_TYPE)
    .maybeSingle();

  if (!document?.current_version_id) {
    throw new Error("Upload the policy document before sending the acknowledgement request");
  }
}
