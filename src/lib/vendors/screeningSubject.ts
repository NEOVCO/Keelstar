import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import {
  buildVendorMetadata,
  vendorRecordToSubjectType,
  type VendorRecordType,
} from "@/lib/vendors/types";

type RegisterScreeningInput = {
  organizationId: string;
  userId: string;
  userEmail?: string;
  vendorId: string;
  name: string;
  recordType: VendorRecordType;
  firstName?: string;
  lastName?: string;
  npi?: string;
};

export async function registerVendorForScreening(input: RegisterScreeningInput): Promise<string | null> {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("screening_subjects")
    .select("id")
    .eq("organization_id", input.organizationId)
    .eq("vendor_id", input.vendorId)
    .maybeSingle();

  if (existing) return existing.id;

  const subjectType = vendorRecordToSubjectType(input.recordType);
  const { data: subject, error } = await supabase
    .from("screening_subjects")
    .insert({
      organization_id: input.organizationId,
      subject_type: subjectType,
      vendor_id: input.vendorId,
      display_name: input.name,
      first_name: input.firstName || null,
      last_name: input.lastName || null,
      organization_name: input.recordType === "company" ? input.name : null,
      npi: input.npi || null,
      owner_id: input.userId,
      created_by: input.userId,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !subject) return null;

  await createAuditLog({
    organizationId: input.organizationId,
    actorType: "user",
    actorId: input.userId,
    actorEmail: input.userEmail,
    action: "exclusion_subject.created",
    targetType: "screening_subject",
    targetId: subject.id,
    metadata: { source: "vendor_import", vendorId: input.vendorId, subjectType },
  });

  return subject.id;
}

export function vendorRowToMetadata(row: {
  recordType: VendorRecordType;
  firstName?: string;
  lastName?: string;
  npi?: string;
}) {
  return buildVendorMetadata(row.recordType, {
    firstName: row.firstName,
    lastName: row.lastName,
    npi: row.npi,
  });
}
