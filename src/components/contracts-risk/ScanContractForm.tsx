"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ScanContractForm({
  vendors,
}: {
  vendors: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [contractName, setContractName] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitError, setLimitError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Upload a contract PDF to scan");
      return;
    }
    setLoading(true);
    setError("");
    setLimitError("");

    const formData = new FormData();
    formData.append("contractName", contractName);
    if (counterparty) formData.append("counterparty", counterparty);
    if (vendorId) formData.append("vendorId", vendorId);
    formData.append("file", file);
    formData.append("scanImmediately", "true");

    const res = await fetch("/api/contracts-risk/scans", { method: "POST", body: formData });
    const data = await res.json();

    if (!data.success) {
      if (res.status === 402) setLimitError(data.error ?? "Usage limit reached");
      else setError(data.error ?? "Failed to start scan");
      setLoading(false);
      return;
    }

    router.push(`/app/workflows/${data.data.workflow.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Contract name</label>
        <Input value={contractName} onChange={(e) => setContractName(e.target.value)} required />
      </div>
      {vendors.length > 0 && (
        <div>
          <label className="mb-1 block text-body-sm text-secondary">Counterparty (optional)</label>
          <select
            value={vendorId}
            onChange={(e) => {
              setVendorId(e.target.value);
              const v = vendors.find((x) => x.id === e.target.value);
              if (v) setCounterparty(v.name);
            }}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
          >
            <option value="">Manual entry</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {!vendorId && (
        <div>
          <label className="mb-1 block text-body-sm text-secondary">Counterparty name</label>
          <Input value={counterparty} onChange={(e) => setCounterparty(e.target.value)} />
        </div>
      )}
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Contract document (PDF)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-body-sm"
          required
        />
      </div>
      <p className="text-caption text-tertiary">
        Uses AI when configured; regex heuristics as fallback. Not legal advice.
      </p>
      {limitError && <UsageLimitAlert message={limitError} />}
      {error && <p className="text-body-sm text-danger">{error}</p>}
      <Button type="submit" disabled={loading || !contractName.trim()}>
        {loading ? "Scanning…" : "Scan contract"}
      </Button>
    </form>
  );
}
