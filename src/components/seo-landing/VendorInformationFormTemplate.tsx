import Link from "next/link";
import { appSignupUrl } from "@/lib/site";

const fields = [
  "Vendor name (DBA and legal entity)",
  "Tax ID (EIN or SSN)",
  "Primary contact name, email, and phone",
  "Business address",
  "Certificate of insurance on file (Y/N)",
  "W-9 on file (Y/N)",
  "Payment terms and banking details",
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
