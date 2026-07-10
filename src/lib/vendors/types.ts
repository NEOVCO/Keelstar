import type { SubjectType } from "@/lib/exclusions/constants";

export const VENDOR_RECORD_TYPES = ["company", "individual", "tenant", "contractor", "employee"] as const;

export const WORKFORCE_RECORD_TYPES = ["employee", "contractor"] as const;

export type WorkforceRecordType = (typeof WORKFORCE_RECORD_TYPES)[number];

export type VendorRecordType = (typeof VENDOR_RECORD_TYPES)[number];

export const VENDOR_RECORD_TYPE_LABELS: Record<VendorRecordType, string> = {
  company: "Company",
  individual: "Individual",
  tenant: "Tenant",
  contractor: "Contractor",
  employee: "Employee",
};

export function vendorRecordToSubjectType(recordType: VendorRecordType): SubjectType {
  switch (recordType) {
    case "company":
      return "vendor";
    case "individual":
      return "person";
    case "tenant":
      return "person";
    case "contractor":
      return "contractor";
    case "employee":
      return "employee";
  }
}

export function isPersonRecordType(recordType: VendorRecordType): boolean {
  return recordType === "individual" || recordType === "tenant" || recordType === "contractor" || recordType === "employee";
}

export function isWorkforceRecordType(recordType: VendorRecordType): boolean {
  return (WORKFORCE_RECORD_TYPES as readonly string[]).includes(recordType);
}

export function recordTypeFromMetadata(metadata: unknown): VendorRecordType {
  const recordType = (metadata as VendorMetadata | null)?.record_type;
  if (recordType && (VENDOR_RECORD_TYPES as readonly string[]).includes(recordType)) {
    return recordType;
  }
  return "company";
}

export type VendorPersonFields = {
  firstName?: string;
  lastName?: string;
  npi?: string;
};

export type VendorMetadata = {
  record_type?: VendorRecordType;
  first_name?: string;
  last_name?: string;
  npi?: string;
};

export function buildVendorMetadata(
  recordType: VendorRecordType,
  person?: VendorPersonFields
): VendorMetadata {
  const metadata: VendorMetadata = { record_type: recordType };
  if (person?.firstName) metadata.first_name = person.firstName;
  if (person?.lastName) metadata.last_name = person.lastName;
  if (person?.npi) metadata.npi = person.npi;
  return metadata;
}
