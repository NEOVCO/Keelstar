"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ContractUploadForm({ workflowId }: { workflowId: string }) {
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

    const res = await fetch(`/api/contracts/requests/${workflowId}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.success) {
      setError(data.error ?? "Upload failed");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full text-body-sm"
      />
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button type="submit" size="sm" disabled={!file || loading}>
        {loading ? "Uploading…" : "Upload contract"}
      </Button>
    </form>
  );
}
