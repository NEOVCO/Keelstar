"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CoiUploadForm({ token }: { token: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("token", token);
    formData.append("file", file);

    const res = await fetch("/api/external/coi/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!data.success) {
      setError(data.error ?? "Upload failed");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <p className="text-body-sm text-success">
        Thank you. Your certificate of insurance has been securely submitted.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full text-body-sm"
        required
      />
      <p className="text-caption text-tertiary">Accepted: PDF, PNG, JPEG. Max 10MB.</p>
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button type="submit" disabled={!file || loading} className="w-full">
        {loading ? "Uploading…" : "Upload certificate"}
      </Button>
    </form>
  );
}
