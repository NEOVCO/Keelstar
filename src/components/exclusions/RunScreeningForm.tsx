"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DIRECTORY } from "@/lib/terminology/directory";

type Vendor = { id: string; name: string };

export function RunScreeningForm({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectType, setSubjectType] = useState("vendor");
  const [vendorId, setVendorId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [npi, setNpi] = useState("");
  const [createMonitor, setCreateMonitor] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/exclusions/screen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectType,
        vendorId: vendorId || undefined,
        displayName: displayName || vendors.find((v) => v.id === vendorId)?.name || `${firstName} ${lastName}`.trim(),
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        organizationName: organizationName || undefined,
        npi: npi || undefined,
        sources: ["oig"],
        createMonthlyMonitor: createMonitor,
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Screening failed");
      return;
    }
    const resultId = json.data?.resultIds?.[0];
    if (resultId) router.push(`/app/exclusions/results/${resultId}`);
    else router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-surface p-6">
      <p className="text-caption text-secondary">
        Keelstar organizes screening workflows and audit evidence. Results require human review—not legal or compliance advice.
      </p>
      {error && <p className="text-body-sm text-error">{error}</p>}
      <div>
        <label className="mb-1 block text-caption font-medium text-secondary">Subject type</label>
        <select
          value={subjectType}
          onChange={(e) => setSubjectType(e.target.value)}
          className="h-10 w-full rounded-md border border-border-strong bg-bg px-3 text-body-sm"
        >
          <option value="vendor">Vendor</option>
          <option value="person">Person</option>
          <option value="organization">Organization</option>
          <option value="contractor">Contractor</option>
          <option value="employee">Employee</option>
        </select>
      </div>
      {subjectType === "vendor" && (
        <div>
          <label className="mb-1 block text-caption font-medium text-secondary">{DIRECTORY.nav}</label>
          <select
            value={vendorId}
            onChange={(e) => {
              setVendorId(e.target.value);
              const v = vendors.find((x) => x.id === e.target.value);
              if (v) setDisplayName(v.name);
            }}
            className="h-10 w-full rounded-md border border-border-strong bg-bg px-3 text-body-sm"
          >
            <option value="">Select from directory</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="mb-1 block text-caption font-medium text-secondary">Display name</label>
        <input
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="h-10 w-full rounded-md border border-border-strong bg-bg px-3 text-body-sm"
        />
      </div>
      {(subjectType === "person" || subjectType === "employee") && (
        <div className="grid gap-3 sm:grid-cols-2">
          <input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-10 rounded-md border border-border-strong bg-bg px-3 text-body-sm" />
          <input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-10 rounded-md border border-border-strong bg-bg px-3 text-body-sm" />
        </div>
      )}
      {subjectType === "organization" && (
        <input placeholder="Organization name" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className="h-10 w-full rounded-md border border-border-strong bg-bg px-3 text-body-sm" />
      )}
      <input placeholder="NPI (optional)" value={npi} onChange={(e) => setNpi(e.target.value)} className="h-10 w-full rounded-md border border-border-strong bg-bg px-3 text-body-sm" />
      <label className="flex items-center gap-2 text-body-sm text-secondary">
        <input type="checkbox" checked={createMonitor} onChange={(e) => setCreateMonitor(e.target.checked)} />
        Create monthly monitor
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Running…" : "Run check"}
      </Button>
    </form>
  );
}
