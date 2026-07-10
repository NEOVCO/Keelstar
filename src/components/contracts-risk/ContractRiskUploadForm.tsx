"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ContractRiskUploadForm({ workflowId }: { workflowId: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/contracts-risk/scans/${workflowId}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.success) {
      setError(data.error ?? "Upload failed");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full text-body-sm"
        required
      />
      {error && <p className="text-body-sm text-danger">{error}</p>}
      <Button type="submit" size="sm" disabled={loading || !file}>
        {loading ? "Uploading…" : "Upload and scan"}
      </Button>
    </form>
  );
}
