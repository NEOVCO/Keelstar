import { createHash } from "crypto";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { validateMagicLink, useMagicLink } from "@/lib/magic-links/validateMagicLink";
import { sendEmail } from "@/lib/email/sendEmail";
import { internalDocumentSignedEmail } from "@/lib/email/templates/signer";
import { trackEvent } from "@/lib/analytics/track";
import { sanitizeFilename } from "@/lib/utils";
import { cancelSignerReminders } from "./scheduleReminders";
import { buildSignerStoragePath } from "./uploadDocument";
import { SIGNER_DOCUMENT_TYPE, SIGNER_MAGIC_LINK_PURPOSE } from "./constants";

const signSchema = z.object({
  signedName: z.string().min(2).max(200),
  agreed: z.literal(true),
});

export async function signDocumentExternal(
  rawToken: string,
  input: z.infer<typeof signSchema>
) {
  const data = signSchema.parse(input);

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

  if (result.link.purpose !== SIGNER_MAGIC_LINK_PURPOSE) {
    throw new Error("Invalid link purpose");
  }

  const supabase = createServiceClient();
  const { data: workflow } = await supabase
    .from("workflow_instances")
    .select("*, vendors(name, email)")
    .eq("id", result.link.workflowInstanceId)
    .single();

  if (!workflow) throw new Error("Request not found");
  if (["completed", "cancelled"].includes(workflow.status)) {
    throw new Error("This document has already been signed");
  }

  const { data: participant } = await supabase
    .from("external_participants")
    .select("email")
    .eq("id", result.link.externalParticipantId)
    .single();

  const { data: document } = await supabase
    .from("documents")
    .select("id, current_version_id, title")
    .eq("workflow_instance_id", workflow.id)
    .eq("document_type", SIGNER_DOCUMENT_TYPE)
    .maybeSingle();

  if (!document?.current_version_id) {
    throw new Error("Document is not available");
  }

  const { data: originalVersion } = await supabase
    .from("document_versions")
    .select("*")
    .eq("id", document.current_version_id)
    .single();

  if (!originalVersion?.storage_path) {
    throw new Error("Document file not found");
  }

  const { data: fileData, error: downloadError } = await supabase.storage
    .from("documents")
    .download(originalVersion.storage_path);

  if (downloadError || !fileData) {
    throw new Error("Failed to retrieve document for signing");
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const signedAt = new Date().toISOString();
  const metadata = (workflow.metadata ?? {}) as Record<string, unknown>;
  const documentTitle = (metadata.document_title as string) ?? document.title;

  const { count } = await supabase
    .from("document_versions")
    .select("id", { count: "exact", head: true })
    .eq("document_id", document.id);

  const versionNumber = (count ?? 0) + 1;
  const signedFilename = `signed-${sanitizeFilename(originalVersion.filename)}`;
  const storagePath = buildSignerStoragePath(
    workflow.organization_id,
    workflow.id,
    document.id,
    versionNumber,
    signedFilename
  );
  const checksum = createHash("sha256").update(buffer).digest("hex");

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: originalVersion.mime_type ?? "application/pdf",
      upsert: false,
    });

  if (uploadError) throw new Error(`Failed to store signed document: ${uploadError.message}`);

  const { data: signedVersion, error: versionError } = await supabase
    .from("document_versions")
    .insert({
      organization_id: workflow.organization_id,
      document_id: document.id,
      version_number: versionNumber,
      filename: signedFilename,
      mime_type: originalVersion.mime_type,
      size_bytes: buffer.length,
      checksum,
      storage_path: storagePath,
      storage_bucket: "documents",
      source: "external_upload",
      status: "approved",
      uploaded_by_type: "external",
      uploaded_by_email: participant?.email ?? undefined,
    })
    .select("id")
    .single();

  if (versionError) throw new Error(versionError.message);

  const fieldRows = [
    { field_key: "document_title", field_value: documentTitle },
    { field_key: "signed_name", field_value: data.signedName },
    { field_key: "signed_at", field_value: signedAt },
    { field_key: "signer_email", field_value: participant?.email ?? "" },
  ];

  for (const field of fieldRows) {
    const { data: existing } = await supabase
      .from("document_parsed_fields")
      .select("id")
      .eq("document_version_id", signedVersion.id)
      .eq("field_key", field.field_key)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("document_parsed_fields")
        .update({
          field_value: field.field_value,
          extraction_source: "manual",
          confidence: 1,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("document_parsed_fields").insert({
        organization_id: workflow.organization_id,
        document_version_id: signedVersion.id,
        field_key: field.field_key,
        field_value: field.field_value,
        field_type: field.field_key.includes("at") ? "date" : "text",
        extraction_source: "manual",
        confidence: 1,
      });
    }
  }

  await supabase
    .from("documents")
    .update({
      status: "approved",
      current_version_id: signedVersion.id,
    })
    .eq("id", document.id);

  await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: signedAt,
    })
    .eq("id", result.link.taskId);

  await supabase
    .from("workflow_instances")
    .update({
      status: "completed",
      completed_at: signedAt,
      metadata: {
        ...metadata,
        signed_name: data.signedName,
        signed_at: signedAt,
        signer_email: participant?.email ?? metadata.signer_email,
        signed_version_id: signedVersion.id,
      },
    })
    .eq("id", workflow.id);

  await useMagicLink(result.link.id);
  await supabase.from("magic_links").update({ status: "used" }).eq("id", result.link.id);
  await cancelSignerReminders(workflow.id, workflow.organization_id);

  const vendor = workflow.vendors as { name: string; email: string | null } | null;

  await createAuditLog({
    organizationId: workflow.organization_id,
    actorType: "external",
    actorId: result.link.externalParticipantId,
    actorEmail: participant?.email ?? undefined,
    action: "signer.document_signed",
    targetType: "workflow_instance",
    targetId: workflow.id,
    metadata: {
      signedName: data.signedName,
      signedAt,
      documentTitle,
    },
  });

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", workflow.organization_id)
    .single();

  const base = process.env.APP_URL ?? "http://localhost:3000";
  const workflowUrl = `${base}/app/workflows/${workflow.id}`;
  const emailContent = internalDocumentSignedEmail({
    organizationName: org?.name ?? "Organization",
    signerName: data.signedName,
    documentTitle,
    signedAt: new Date(signedAt).toLocaleString(),
    workflowUrl,
  });

  const notifyUserId = workflow.owner_id ?? workflow.created_by;
  if (notifyUserId) {
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(notifyUserId);
    if (user?.email) {
      await sendEmail({
        organizationId: workflow.organization_id,
        to: user.email,
        templateKey: emailContent.templateKey,
        subject: emailContent.subject,
        variables: {
          organizationName: org?.name ?? "",
          signerName: data.signedName,
          documentTitle,
          signedAt,
          workflowUrl,
        },
        recipientType: "member",
        recipientId: notifyUserId,
      }).catch(() => {});
    }
  }

  trackEvent("document_signed", { workflowId: workflow.id });
  trackEvent("signer_request_completed", { workflowId: workflow.id });

  return {
    workflowId: workflow.id,
    signedAt,
    signedName: data.signedName,
  };
}
