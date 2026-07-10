import type { VendorRecordType } from "@/lib/vendors/types";
import { isWorkforceRecordType, recordTypeFromMetadata } from "@/lib/vendors/types";

export type VendorRow = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  metadata?: unknown;
  updated_at: string;
};

export function isWorkforceVendor(vendor: Pick<VendorRow, "metadata">): boolean {
  return isWorkforceRecordType(recordTypeFromMetadata(vendor.metadata));
}

export function filterWorkforceVendors<T extends Pick<VendorRow, "metadata">>(vendors: T[]): T[] {
  return vendors.filter(isWorkforceVendor);
}

export function workforceRecordTypeLabel(metadata: unknown): string {
  const type = recordTypeFromMetadata(metadata);
  return type === "contractor" ? "Contractor" : type === "employee" ? "Employee" : type;
}

export function isValidWorkforceImportType(recordType: VendorRecordType): boolean {
  return isWorkforceRecordType(recordType);
}
