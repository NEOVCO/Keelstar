import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { sanitizeFilename } from "@/lib/utils";
import { createAuditLog } from "@/lib/audit/createAuditLog";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/csv",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export type UploadDocumentInput = {
  organizationId: string;
  title: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  fileBuffer: Buffer;
  uploadedBy: string;
  source?: "internal_upload" | "external_upload" | "email" | "api";
  documentType?: string;
};

export function validateUpload(input: { mimeType: string; sizeBytes: number; filename: string }) {
  if (!ALLOWED_MIME_TYPES.includes(input.mimeType)) {
    throw new Error(`File type not allowed: ${input.mimeType}`);
  }
  if (input.sizeBytes > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
  if (!input.filename || input.filename.length > 255) {
    throw new Error("Invalid filename");
  }
}

export function buildStoragePath(
  organizationId: string,
  documentId: string,
  versionNumber: number,
  filename: string
): string {
  const safe = sanitizeFilename(filename);
  return `organizations/${organizationId}/documents/${documentId}/versions/${versionNumber}/${safe}`;
}

export async function uploadDocument(input: UploadDocumentInput) {
  validateUpload(input);
  const supabase = createServiceClient();
  const safeFilename = sanitizeFilename(input.filename);
  const checksum = createHash("sha256").update(input.fileBuffer).digest("hex");

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      organization_id: input.organizationId,
      title: input.title,
      document_type: input.documentType ?? null,
      created_by: input.uploadedBy,
    })
    .select("id")
    .single();

  if (docError) throw new Error(`Failed to create document: ${docError.message}`);

  const versionNumber = 1;
  const storagePath = buildStoragePath(input.organizationId, doc.id, versionNumber, safeFilename);

  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(storagePath, input.fileBuffer, {
      contentType: input.mimeType,
      upsert: false,
    });

  if (storageError) throw new Error(`Failed to upload file: ${storageError.message}`);

  const { data: version, error: versionError } = await supabase
    .from("document_versions")
    .insert({
      organization_id: input.organizationId,
      document_id: doc.id,
      version_number: versionNumber,
      filename: safeFilename,
      mime_type: input.mimeType,
      size_bytes: input.sizeBytes,
      checksum,
      storage_path: storagePath,
      source: input.source ?? "internal_upload",
      status: "uploaded",
      uploaded_by: input.uploadedBy,
    })
    .select("id")
    .single();

  if (versionError) throw new Error(`Failed to create version: ${versionError.message}`);

  await supabase.from("background_jobs").insert({
    organization_id: input.organizationId,
    job_type: "document_processing",
    payload: { documentVersionId: version.id },
    idempotency_key: `doc-process-${version.id}`,
  });

  await createAuditLog({
    organizationId: input.organizationId,
    actorType: "user",
    actorId: input.uploadedBy,
    action: "document.created",
    targetType: "document",
    targetId: doc.id,
    metadata: { filename: safeFilename, mimeType: input.mimeType },
  });

  await createAuditLog({
    organizationId: input.organizationId,
    actorType: "user",
    actorId: input.uploadedBy,
    action: "document.version_created",
    targetType: "document_version",
    targetId: version.id,
    metadata: { documentId: doc.id, versionNumber },
  });

  return { documentId: doc.id, versionId: version.id, storagePath };
}

export async function getSignedUrl(storagePath: string, expiresIn = 3600): Promise<string> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, expiresIn);

  if (error) throw new Error(`Failed to create signed URL: ${error.message}`);
  return data.signedUrl;
}
