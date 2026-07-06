import { createServiceClient } from "@/lib/supabase/service";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { normalizeName } from "./matchScoring";
import { runExclusionScreening } from "./runScreening";
import type { ExclusionSource } from "./constants";
import { BULK_IMPORT_MAX_ROWS, type BulkImportRow } from "./bulkImportCsv";

export type { BulkImportRow } from "./bulkImportCsv";
export { parseBulkImportCsv, BULK_IMPORT_CSV_HEADERS } from "./bulkImportCsv";

export type BulkImportInput = {
  rows?: BulkImportRow[];
  importExistingVendors?: boolean;
  runScreening?: boolean;
  createMonthlyMonitor?: boolean;
  sources?: ExclusionSource[];
};

export type BulkImportResult = {
  imported: number;
  skipped: number;
  screened: number;
  matches: number;
  errors: string[];
  subjectIds: string[];
};

export async function bulkImportScreeningSubjects(input: BulkImportInput): Promise<BulkImportResult> {
  const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_CREATE);
  const orgId = ctx.organization.id;
  const supabase = createServiceClient();
  const sources = input.sources ?? ["oig"];
  const result: BulkImportResult = {
    imported: 0,
    skipped: 0,
    screened: 0,
    matches: 0,
    errors: [],
    subjectIds: [],
  };

  let rows = input.rows ?? [];

  if (input.importExistingVendors) {
    const { data: vendors } = await supabase
      .from("vendors")
      .select("id, name")
      .eq("organization_id", orgId)
      .eq("status", "active");

    for (const v of vendors ?? []) {
      rows.push({
        subject_type: "vendor",
        display_name: v.name,
        vendor_name: v.name,
      });
    }
  }

  if (!rows.length) {
    result.errors.push("No rows to import.");
    return result;
  }

  if (rows.length > BULK_IMPORT_MAX_ROWS) {
    throw new Error(`Import limited to ${BULK_IMPORT_MAX_ROWS} rows per batch.`);
  }

  const { data: existing } = await supabase
    .from("screening_subjects")
    .select("id, display_name, subject_type")
    .eq("organization_id", orgId);

  const existingKeys = new Set(
    (existing ?? []).map((s) => `${s.subject_type}:${normalizeName(s.display_name)}`)
  );

  const { data: vendors } = await supabase
    .from("vendors")
    .select("id, name")
    .eq("organization_id", orgId);

  const vendorByName = new Map(
    (vendors ?? []).map((v) => [normalizeName(v.name), v.id] as const)
  );

  for (const row of rows) {
    const key = `${row.subject_type}:${normalizeName(row.display_name)}`;
    if (existingKeys.has(key)) {
      result.skipped++;
      continue;
    }

    const vendorId =
      row.subject_type === "vendor"
        ? vendorByName.get(normalizeName(row.vendor_name ?? row.display_name))
        : undefined;

    const { data: subject, error } = await supabase
      .from("screening_subjects")
      .insert({
        organization_id: orgId,
        subject_type: row.subject_type,
        vendor_id: vendorId ?? null,
        display_name: row.display_name,
        first_name: row.first_name ?? null,
        last_name: row.last_name ?? null,
        organization_name: row.organization_name ?? null,
        npi: row.npi ?? null,
        owner_id: ctx.user.id,
        created_by: ctx.user.id,
        status: "active",
      })
      .select("id")
      .single();

    if (error || !subject) {
      result.errors.push(`${row.display_name}: ${error?.message ?? "insert failed"}`);
      continue;
    }

    existingKeys.add(key);
    result.imported++;
    result.subjectIds.push(subject.id);

    await createAuditLog({
      organizationId: orgId,
      actorType: "user",
      actorId: ctx.user.id,
      actorEmail: ctx.user.email,
      action: "exclusion_subject.created",
      targetType: "screening_subject",
      targetId: subject.id,
      metadata: { source: "bulk_import", subjectType: row.subject_type },
    });

    if (input.runScreening) {
      try {
        const screen = await runExclusionScreening({
          subjectType: row.subject_type,
          vendorId,
          displayName: row.display_name,
          firstName: row.first_name,
          lastName: row.last_name,
          organizationName: row.organization_name,
          npi: row.npi,
          sources,
          saveSubject: false,
          screeningSubjectId: subject.id,
          createMonthlyMonitor: input.createMonthlyMonitor ?? false,
          runType: "ad_hoc",
        });
        result.screened++;
        if (screen.hasPotentialMatch) result.matches++;
      } catch (err) {
        result.errors.push(`${row.display_name} screen: ${String(err)}`);
      }
    } else if (input.createMonthlyMonitor) {
      try {
        const { createExclusionMonitor } = await import("./createMonitor");
        await createExclusionMonitor({
          screeningSubjectId: subject.id,
          ownerId: ctx.user.id!,
        });
      } catch (err) {
        result.errors.push(`${row.display_name} monitor: ${String(err)}`);
      }
    }
  }

  await createAuditLog({
    organizationId: orgId,
    actorType: "user",
    actorId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "exclusion_bulk_import.completed",
    targetType: "organization",
    targetId: orgId,
    metadata: {
      imported: result.imported,
      skipped: result.skipped,
      screened: result.screened,
      matches: result.matches,
    },
  });

  return result;
}
