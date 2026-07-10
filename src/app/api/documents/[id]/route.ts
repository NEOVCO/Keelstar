import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getSignedUrl } from "@/lib/documents/upload";
import { apiSuccess, handleApiError, apiError } from "@/lib/errors/api";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ctx = await requirePermission(PERMISSIONS.DOCUMENTS_VIEW);
    const supabase = createServiceClient();

    const { data: doc, error } = await supabase
      .from("documents")
      .select(
        `
        id, title, document_type, status, created_at, updated_at,
        document_versions (id, version_number, filename, mime_type, size_bytes, status, created_at, storage_path)
      `
      )
      .eq("id", params.id)
      .eq("organization_id", ctx.organization.id)
      .single();

    if (error || !doc) return apiError("Document not found", 404);
    return apiSuccess({ document: doc });
  } catch (err) {
    return handleApiError(err);
  }
}
