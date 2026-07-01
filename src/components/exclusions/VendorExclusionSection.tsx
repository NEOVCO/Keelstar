import { createClient } from "@/lib/supabase/server";
import { requireOrganization } from "@/lib/tenant/context";
import { ExclusionScreeningCard } from "@/components/exclusions/ExclusionScreeningCard";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/types";

export async function VendorExclusionSection({ vendorId, vendorName }: { vendorId: string; vendorName: string }) {
  const ctx = await requireOrganization();
  const supabase = await createClient();
  const canRun = can(ctx.permissions, PERMISSIONS.WORKFLOWS_CREATE);

  const { data: exclusionSubject } = await supabase
    .from("screening_subjects")
    .select("id")
    .eq("vendor_id", vendorId)
    .eq("organization_id", ctx.organization.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let latestResult = null;
  if (exclusionSubject) {
    const { data } = await supabase
      .from("screening_results")
      .select("id, result_status, review_status, created_at, source")
      .eq("screening_subject_id", exclusionSubject.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    latestResult = data;
  }

  return (
    <ExclusionScreeningCard
      vendorId={vendorId}
      vendorName={vendorName}
      latestResult={latestResult}
      canRun={canRun}
    />
  );
}
