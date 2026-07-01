import Link from "next/link";
import { appSignupUrl } from "@/lib/site";

const fields = [
  "Vendor name (DBA and trade name)",
  "Legal entity name (as it appears on tax and insurance documents)",
  "Federal tax ID (EIN or SSN — often collected via W-9)",
  "Business address and remit-to address if different",
  "Primary contact name, email, and phone",
  "Accounts payable contact if different from primary",
  "Certificate of insurance on file (Y/N) and expiration date if known",
  "W-9 on file (Y/N) and date last collected",
  "Payment terms (Net 30, Net 45, etc.)",
  "Banking details for approved vendors (routing and account or ACH instructions)",
  "Contract or purchase order reference if applicable",
];

export function VendorInformationFormTemplate() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <p className="text-body-sm text-secondary">
        Use this vendor information form template when onboarding a new supplier.
      </p>
      <ul className="mt-6 space-y-3">
        {fields.map((f) => (
          <li key={f} className="flex items-start gap-3 text-body-sm text-primary">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border-strong" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={appSignupUrl()}
        className="mt-8 inline-flex h-10 items-center rounded-sm bg-accent px-4 text-body-sm font-semibold text-white hover:bg-accent-hover"
      >
        Create a Keelstar workspace
      </Link>
    </div>
  );
}
