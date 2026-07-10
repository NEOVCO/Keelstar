import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { uploadDocument } from "@/lib/documents/upload";
import { processDocumentVersion } from "@/lib/documents/extraction";
import { uploadDocumentSchema } from "@/lib/validation/schemas";
import { apiSuccess, handleApiError } from "@/lib/errors/api";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const ctx = await requirePermission(PERMISSIONS.DOCUMENTS_VIEW);
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("documents")
      .select("id, title, document_type, status, created_at, updated_at")
      .eq("organization_id", ctx.organization.id)
      .neq("status", "deleted")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    return apiSuccess({ documents: data ?? [] });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const ctx = await requirePermission(PERMISSIONS.DOCUMENTS_CREATE);
    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") ?? "");
    const documentType = formData.get("documentType")
      ? String(formData.get("documentType"))
      : undefined;

    if (!(file instanceof File)) {
      return handleApiError(new Error("File is required"));
    }

    uploadDocumentSchema.parse({ title, documentType });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadDocument({
      organizationId: ctx.organization.id,
      title,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      fileBuffer: buffer,
      uploadedBy: ctx.user.id,
      documentType,
    });

    void processDocumentVersion(result.versionId).catch((err) => {
      console.error("[documents] inline extraction failed:", err);
    });

    return apiSuccess(result, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
