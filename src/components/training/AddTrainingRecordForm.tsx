"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UsageLimitAlert } from "@/components/billing/UsageLimitAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddTrainingRecordForm({
  people,
  defaultPersonId,
}: {
  people: Array<{ id: string; name: string }>;
  defaultPersonId?: string;
}) {
  const router = useRouter();
  const [personId, setPersonId] = useState(defaultPersonId ?? people[0]?.id ?? "");
  const [courseName, setCourseName] = useState("");
  const [provider, setProvider] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitError, setLimitError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLimitError("");

    const formData = new FormData();
    formData.append("vendorId", personId);
    formData.append("courseName", courseName);
    if (provider) formData.append("provider", provider);
    if (file) formData.append("file", file);

    const res = await fetch("/api/training/records", { method: "POST", body: formData });
    const data = await res.json();

    if (!data.success) {
      if (res.status === 402) setLimitError(data.error ?? "Usage limit reached");
      else setError(data.error ?? "Failed to create training record");
      setLoading(false);
      return;
    }

    router.push(`/app/workflows/${data.data.workflow.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Person</label>
        <select
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
          required
        >
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Course / certification name</label>
        <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Provider (optional)</label>
        <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="e.g. OSHA, Red Cross" />
      </div>
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Certificate file (optional now)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-body-sm"
        />
      </div>
      {limitError && <UsageLimitAlert message={limitError} />}
      {error && <p className="text-body-sm text-danger">{error}</p>}
      <Button type="submit" disabled={loading || !personId || !courseName.trim()}>
        {loading ? "Creating…" : "Add training record"}
      </Button>
    </form>
  );
}
