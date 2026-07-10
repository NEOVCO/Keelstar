"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function UploadDocumentForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());

    const res = await fetch("/api/documents", { method: "POST", body: formData });
    const json = await res.json();

    if (!json.success) {
      setError(json.error ?? "Upload failed");
      setLoading(false);
      return;
    }

    router.push(`/app/documents/${json.data.documentId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="doc-title">Title</Label>
        <Input
          id="doc-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="W-9 — Acme Corp"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doc-file">File</Label>
        <Input
          id="doc-file"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button type="submit" disabled={loading || !file}>
        {loading ? "Uploading…" : "Upload"}
      </Button>
    </form>
  );
}
