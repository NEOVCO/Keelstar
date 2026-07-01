import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";

export type ParsedField = {
  fieldKey: string;
  fieldValue: string;
  fieldType: "text" | "number" | "date" | "boolean" | "currency" | "json";
  confidence?: number;
  extractionSource: "manual" | "regex" | "ai" | "ocr" | "system";
};

export async function extractDocumentFields(
  documentVersionId: string
): Promise<ParsedField[]> {
  const supabase = createServiceClient();

  const { data: version } = await supabase
    .from("document_versions")
    .select("*, documents(title)")
    .eq("id", documentVersionId)
    .single();

  if (!version) throw new Error("Document version not found");

  // Placeholder extraction — replace with OCR/AI pipeline
  const fields: ParsedField[] = [
    {
      fieldKey: "filename",
      fieldValue: version.filename,
      fieldType: "text",
      confidence: 1.0,
      extractionSource: "system",
    },
    {
      fieldKey: "file_size_bytes",
      fieldValue: String(version.size_bytes),
      fieldType: "number",
      confidence: 1.0,
      extractionSource: "system",
    },
    {
      fieldKey: "mime_type",
      fieldValue: version.mime_type,
      fieldType: "text",
      confidence: 1.0,
      extractionSource: "system",
    },
  ];

  const title = (version.documents as { title?: string })?.title;
  if (title) {
    fields.push({
      fieldKey: "document_title",
      fieldValue: title,
      fieldType: "text",
      confidence: 0.9,
      extractionSource: "system",
    });
  }

  return fields;
}

export async function processDocumentVersion(documentVersionId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: version } = await supabase
    .from("document_versions")
    .select("organization_id, document_id")
    .eq("id", documentVersionId)
    .single();

  if (!version) throw new Error("Document version not found");

  await supabase
    .from("document_versions")
    .update({ status: "processing" })
    .eq("id", documentVersionId);

  try {
    const fields = await extractDocumentFields(documentVersionId);

    for (const field of fields) {
      await supabase.from("document_parsed_fields").insert({
        organization_id: version.organization_id,
        document_version_id: documentVersionId,
        field_key: field.fieldKey,
        field_value: field.fieldValue,
        field_type: field.fieldType,
        confidence: field.confidence ?? null,
        extraction_source: field.extractionSource,
      });
    }

    await supabase
      .from("document_versions")
      .update({ status: "parsed" })
      .eq("id", documentVersionId);

    await createAuditLog({
      organizationId: version.organization_id,
      actorType: "system",
      action: "document.parsed",
      targetType: "document_version",
      targetId: documentVersionId,
      metadata: { fieldCount: fields.length },
    });
  } catch (err) {
    await supabase
      .from("document_versions")
      .update({
        status: "failed",
        error_message: err instanceof Error ? err.message : "Unknown error",
      })
      .eq("id", documentVersionId);
    throw err;
  }
}

export async function overrideParsedField(
  fieldId: string,
  newValue: string,
  organizationId: string,
  userId: string
): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("document_parsed_fields")
    .update({
      field_value: newValue,
      is_override: true,
      overridden_by: userId,
      overridden_at: new Date().toISOString(),
      extraction_source: "manual",
    })
    .eq("id", fieldId)
    .eq("organization_id", organizationId);

  if (error) throw new Error(`Failed to override field: ${error.message}`);

  await createAuditLog({
    organizationId,
    actorType: "user",
    actorId: userId,
    action: "document.field_overridden",
    targetType: "document_parsed_field",
    targetId: fieldId,
    metadata: { newValue },
  });
}
