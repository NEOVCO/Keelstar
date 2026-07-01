import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { sanitizeFilename } from "@/lib/utils";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { validateMagicLink } from "@/lib/magic-links/validateMagicLink";
import { sendEmail } from "@/lib/email/sendEmail";
import { internalVendorPacketItemUploadedEmail } from "@/lib/email/templates/vendor-packets";
import { trackEvent } from "@/lib/analytics/track";
import { PACKET_ALLOWED_MIME, PACKET_MAX_FILE_SIZE, VENDOR_PACKET_MAGIC_LINK_PURPOSE } from "./constants";
import { computePacketProgress, updatePacketStatus } from "./completion";

export function buildPacketStoragePath(
  organizationId: string,
  vendorId: string,
  workflowId: string,
  documentId: string,
  versionNumber: number,
  filename: string
): string {
  const safe = sanitizeFilename(filename);
  return `organizations/${organizationId}/vendors/${vendorId}/packets/${workflowId}/documents/${documentId}/versions/v${versionNumber}/${safe}`;
}

export async function uploadVendorPacketItem(
  rawToken: string,
  itemKey: string,
  file: { filename: string; mimeType: string; sizeBytes: number; buffer: Buffer }
) {
  if (!PACKET_ALLOWED_MIME.includes(file.mimeType as (typeof PACKET_ALLOWED_MIME)[number])) {
    throw new Error("File type not allowed. Accepted: PDF, PNG, JPEG");
  }
  if (file.sizeBytes > PACKET_MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 25MB");
  }

  const result = await validateMagicLink(rawToken);
  if (!result.valid) {
    const reasons = {
      not_found: "Invalid link",
      expired: "Link expired",
      revoked: "Link revoked",
      max_uses: "Link no longer available",
    };
    throw new Error(reasons[result.reason]);
  }

  if (result.link.purpose !== VENDOR_PACKET_MAGIC_LINK_PURPOSE) {
    throw new Error("Invalid portal link");
  }

  const supabase = createServiceClient();
  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*, vendors(*)")
    .eq("id", result.link.workflowInstanceId)
    .single();

  if (!workflow) throw new Error("Packet not found");
  if (["completed", "cancelled"].includes(workflow.status)) {
    throw new Error("This vendor packet has already been completed");
  }

  const vendorId = workflow.vendor_id as string;
  if (!vendorId) throw new Error("Vendor not linked");

  const { data: itemTask } = await supabase
    .from("tasks")
    .select("id, metadata")
    .eq("workflow_instance_id", workflow.id)
    .contains("metadata", { packet_item_key: itemKey })
    .maybeSingle();

  if (!itemTask) throw new Error("Checklist item not found");

  const taskMeta = itemTask.metadata as { document_id?: string };
  const documentId = taskMeta.document_id;
  if (!documentId) throw new Error("Document not linked to checklist item");

  const { data: document } = await supabase
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .single();

  if (!document) throw new Error("Document record not found");

  const { count } = await supabase
    .from("document_versions")
    .select("id", { count: "exact", head: true })
    .eq("document_id", document.id);

  const versionNumber = (count ?? 0) + 1;
  const safeFilename = sanitizeFilename(file.filename);
  const storagePath = buildPacketStoragePath(
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

  const submittedAt = new Date().toISOString();

  await supabase
    .from("documents")
    .update({ status: "uploaded", current_version_id: version.id })
    .eq("id", document.id);

  await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: submittedAt,
      completed_by_type: "external",
      completed_by_id: result.link.externalParticipantId,
    })
    .eq("id", itemTask.id);

  const metadata = (workflow.metadata ?? {}) as Record<string, unknown>;
  const completions = (metadata.completions ?? {}) as Record<string, unknown>;
  completions[itemKey] = {
    documentId: document.id,
    versionId: version.id,
    submittedAt,
    filename: safeFilename,
  };

  await supabase
    .from("workflow_instances")
    .update({
      metadata: { ...metadata, completions },
    })
    .eq("id", workflow.id);

  await updatePacketStatus(workflow.id);

  await createAuditLog({
    organizationId: workflow.organization_id,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    actorEmail: participant?.email ?? undefined,
    action: "vendor_packet.item_uploaded",
    targetType: "document",
    targetId: document.id,
    metadata: { itemKey, filename: safeFilename, versionNumber },
  });

  trackEvent("vendor_packet_item_uploaded", { workflowId: workflow.id, itemKey });

  const progress = await computePacketProgress(workflow.id);
  if (progress.allRequiredComplete) {
    trackEvent("vendor_packet_all_required_uploaded", { workflowId: workflow.id });
  }

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
      const email = internalVendorPacketItemUploadedEmail({
        organizationName: org?.name ?? "",
        vendorName: vendor?.name ?? "Vendor",
        itemLabel: itemKey,
        workflowUrl: `${appUrl}/app/workflows/${workflow.id}`,
        progressPercent: progress.percentComplete,
      });
      await sendEmail({
        organizationId: workflow.organization_id,
        to: user.email,
        templateKey: email.templateKey,
        subject: email.subject,
        variables: {
          organizationName: org?.name ?? "",
          vendorName: vendor?.name ?? "",
          itemKey,
          workflowUrl: `${appUrl}/app/workflows/${workflow.id}`,
        },
      }).catch(() => {});
    }
  }

  return { documentId: document.id, versionId: version.id, workflowId: workflow.id, progress };
}
