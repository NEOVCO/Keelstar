"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";
import {
  VENDOR_RECORD_TYPES,
  VENDOR_RECORD_TYPE_LABELS,
  WORKFORCE_RECORD_TYPES,
  isPersonRecordType,
  type VendorRecordType,
} from "@/lib/vendors/types";
import { DIRECTORY } from "@/lib/terminology/directory";
import { PEOPLE } from "@/lib/terminology/people";

export type AddVendorFormProps = {
  redirectTo?: string;
  defaultRecordType?: VendorRecordType;
  recordTypeOptions?: readonly VendorRecordType[];
  defaultRegisterForScreening?: boolean;
  submitLabel?: string;
  typeHelpText?: string;
};

export function AddVendorForm({
  redirectTo = "/app/vendors",
  defaultRecordType = "company",
  recordTypeOptions = VENDOR_RECORD_TYPES,
  defaultRegisterForScreening = false,
  submitLabel,
  typeHelpText,
}: AddVendorFormProps) {
  const router = useRouter();
  const [recordType, setRecordType] = useState<VendorRecordType>(defaultRecordType);
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [npi, setNpi] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [registerForScreening, setRegisterForScreening] = useState(defaultRegisterForScreening);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitError, setLimitError] = useState("");

  const isPerson = isPersonRecordType(recordType);
  const nameLabel =
    recordType === "company"
      ? "Company name"
      : recordType === "tenant"
        ? "Tenant name"
        : recordType === "employee"
          ? "Full name"
          : recordType === "individual"
            ? "Full name"
            : "Display name";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLimitError("");

    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email: email || undefined,
        phone: phone || undefined,
        recordType,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        npi: npi || undefined,
        registerForScreening,
      }),
    });
    const data = await res.json();

    if (!data.success) {
      if (res.status === 402) setLimitError(data.error ?? "Usage limit reached");
      else setError(data.error ?? DIRECTORY.failedCreate);
      setLoading(false);
      return;
    }

    router.push(`${redirectTo}/${data.data.vendor.id}`);
    router.refresh();
  }

  const defaultTypeHelp =
    recordTypeOptions === WORKFORCE_RECORD_TYPES
      ? "Employees and contractors can be screened against OIG, assigned policies, and tracked for training."
      : "Companies, tenants, and individuals work for COI tracking. Add vendors and contractors for W-9 requests. Individuals can also be added to the OIG screening roster.";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="vendor-record-type" className="mb-1 block text-body-sm text-secondary">
          {recordTypeOptions === WORKFORCE_RECORD_TYPES ? "Person type" : "Record type"}
        </label>
        <select
          id="vendor-record-type"
          value={recordType}
          onChange={(e) => setRecordType(e.target.value as VendorRecordType)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {recordTypeOptions.map((type) => (
            <option key={type} value={type}>
              {VENDOR_RECORD_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        <p className="mt-1 text-caption text-tertiary">{typeHelpText ?? defaultTypeHelp}</p>
      </div>

      <div>
        <label className="mb-1 block text-body-sm text-secondary">{nameLabel}</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      {isPerson && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-body-sm text-secondary">First name</label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-body-sm text-secondary">Last name</label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-body-sm text-secondary">NPI (optional)</label>
            <Input value={npi} onChange={(e) => setNpi(e.target.value)} placeholder="For OIG screening" />
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-body-sm text-secondary">Email</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <label className="mb-1 block text-body-sm text-secondary">Phone (optional)</label>
        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-body-sm text-secondary">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={registerForScreening}
          onChange={(e) => setRegisterForScreening(e.target.checked)}
        />
        <span>
          Add to OIG screening roster
          <span className="mt-0.5 block text-caption text-tertiary">
            Creates a linked screening subject for exclusions monitoring.
          </span>
        </span>
      </label>

      {limitError && <UsageLimitAlert message={limitError} />}
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : submitLabel ?? DIRECTORY.add}
      </Button>
    </form>
  );
}

export function AddPersonForm() {
  return (
    <AddVendorForm
      redirectTo="/app/people"
      defaultRecordType="employee"
      recordTypeOptions={WORKFORCE_RECORD_TYPES}
      defaultRegisterForScreening
      submitLabel={PEOPLE.add}
    />
  );
}
