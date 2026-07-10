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

    const { data: version, error } = await supabase
      .from("document_versions")
      .select("id, storage_path, filename, document_id, documents!inner(organization_id)")
      .eq("document_id", params.id)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    if (error || !version) return apiError("Document not found", 404);

    const doc = version.documents as unknown as { organization_id: string };
    if (doc.organization_id !== ctx.organization.id) {
      return apiError("Document not found", 404);
    }

    const url = await getSignedUrl(version.storage_path);
    return apiSuccess({ url, filename: version.filename });
  } catch (err) {
    return handleApiError(err);
  }
}
