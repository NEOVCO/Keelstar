import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { sanitizeFilename } from "@/lib/utils";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { validateMagicLink, useMagicLink } from "@/lib/magic-links/validateMagicLink";
import { sendEmail } from "@/lib/email/sendEmail";
import { internalCoiSubmissionReceivedEmail } from "@/lib/email/templates/coi";
import { trackEvent } from "@/lib/analytics/track";
import { cancelCoiReminders } from "./scheduleReminders";
import { COI_ALLOWED_MIME, COI_MAX_FILE_SIZE, COI_DOCUMENT_TYPE } from "./constants";

export function buildCoiStoragePath(
  organizationId: string,
  vendorId: string,
  workflowId: string,
  documentId: string,
  versionNumber: number,
  filename: string
): string {
  const safe = sanitizeFilename(filename);
  return `organizations/${organizationId}/vendors/${vendorId}/workflows/${workflowId}/documents/${documentId}/versions/v${versionNumber}/${safe}`;
}

export async function uploadExternalCoi(
  rawToken: string,
  file: { filename: string; mimeType: string; sizeBytes: number; buffer: Buffer }
) {
  if (!COI_ALLOWED_MIME.includes(file.mimeType as (typeof COI_ALLOWED_MIME)[number])) {
    throw new Error("File type not allowed. Accepted: PDF, PNG, JPEG");
  }
  if (file.sizeBytes > COI_MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 10MB");
  }

  const result = await validateMagicLink(rawToken);
  if (!result.valid) {
    const reasons = {
      not_found: "Invalid link",
      expired: "Link expired",
      revoked: "Link revoked",
      max_uses: "Link already used",
    };
    throw new Error(reasons[result.reason]);
  }

  const supabase = createServiceClient();
  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*, vendors(*)")
    .eq("id", result.link.workflowInstanceId)
    .single();

  if (!workflow) throw new Error("Request not found");
  if (["active_monitoring", "expiring_soon", "approved", "completed", "cancelled"].includes(workflow.status)) {
    throw new Error("This request has already been completed");
  }

  const vendorId = workflow.vendor_id as string;
  if (!vendorId) throw new Error("Vendor not linked");

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id")
    .eq("workflow_instance_id", workflow.id)
    .eq("document_type", COI_DOCUMENT_TYPE)
    .maybeSingle();

  if (!document) throw new Error("Document record not found");

  const { count } = await supabase
    .from("document_versions")
    .select("id", { count: "exact", head: true })
    .eq("document_id", document.id);

  const versionNumber = (count ?? 0) + 1;
  const safeFilename = sanitizeFilename(file.filename);
  const storagePath = buildCoiStoragePath(
    workflow.organization_id,
    vendorId,
    workflow.id,
    document.id,
    versionNumber,
    safeFilename
  );
  const checksum = createHash("sha256").update(file.buffer).digest("hex");

  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file.buffer, { contentType: file.mimeType, upsert: false });

  if (storageError) throw new Error(`Upload failed: ${storageError.message}`);

  const { data: participant } = await supabase
    .from("external_participants")
    .select("email")
    .eq("id", result.link.externalParticipantId)
    .single();

  const { data: version, error: versionError } = await supabase
    .from("document_versions")
    .insert({
      organization_id: workflow.organization_id,
      document_id: document.id,
      version_number: versionNumber,
      filename: safeFilename,
      mime_type: file.mimeType,
      size_bytes: file.sizeBytes,
      checksum,
      storage_path: storagePath,
      storage_bucket: "documents",
      source: "external_upload",
      status: "uploaded",
      uploaded_by_type: "external",
      uploaded_by_email: participant?.email ?? null,
    })
    .select("id")
    .single();

  if (versionError) throw new Error(versionError.message);

  await supabase
    .from("documents")
    .update({ status: "review_needed", current_version_id: version.id })
    .eq("id", document.id);

  const submittedAt = new Date().toISOString();
  await supabase
    .from("workflow_instances")
    .update({
      status: "review_needed",
      metadata: {
        ...(workflow.metadata as object),
        submitted_at: submittedAt,
      },
    })
    .eq("id", workflow.id);

  await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: submittedAt,
      completed_by_type: "external",
      completed_by_id: result.link.externalParticipantId,
    })
    .eq("id", result.link.taskId);

  await useMagicLink(result.link.id);
  await supabase.from("magic_links").update({ status: "used" }).eq("id", result.link.id);

  await createAuditLog({
    organizationId: workflow.organization_id,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    actorEmail: participant?.email ?? undefined,
    action: "coi_document.uploaded",
    targetType: "document",
    targetId: document.id,
    metadata: { filename: safeFilename, versionNumber },
  });

  await createAuditLog({
    organizationId: workflow.organization_id,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    action: "coi_document.version_created",
    targetType: "document_version",
    targetId: version.id,
    metadata: { documentId: document.id, versionNumber },
  });

  await createAuditLog({
    organizationId: workflow.organization_id,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    action: "coi_magic_link.used",
    targetType: "magic_link",
    targetId: result.link.id,
  });

  trackEvent("external_coi_uploaded", { workflowId: workflow.id });
  trackEvent("coi_submission_received", { workflowId: workflow.id });
  trackEvent("first_coi_uploaded", { workflowId: workflow.id });

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", workflow.organization_id)
    .single();
  const vendor = workflow.vendors as { name: string } | null;
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  if (workflow.owner_id) {
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(workflow.owner_id);
    if (user?.email) {
      const email = internalCoiSubmissionReceivedEmail({
        organizationName: org?.name ?? "",
        vendorName: vendor?.name ?? "Vendor",
        workflowUrl: `${appUrl}/app/workflows/${workflow.id}`,
      });
      await sendEmail({
        organizationId: workflow.organization_id,
        to: user.email,
        templateKey: email.templateKey,
        subject: email.subject,
        variables: {
          organizationName: org?.name ?? "",
          vendorName: vendor?.name ?? "",
          workflowUrl: `${appUrl}/app/workflows/${workflow.id}`,
        },
      }).catch(() => {});
    }
  }

  return { documentId: document.id, versionId: version.id, workflowId: workflow.id };
}
