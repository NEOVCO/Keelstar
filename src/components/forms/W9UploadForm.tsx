"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export function W9UploadForm({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("token", token);
    formData.append("file", file);

    const res = await fetch("/api/external/w9/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!data.success) {
      setError(data.error ?? "Upload failed");
      setLoading(false);
      return;
    }

    setCompleted(true);
    setLoading(false);
  }

  if (completed) {
    return (
      <div className="py-6 text-center">
        <p className="text-h4 text-primary">Thank you</p>
        <p className="mt-2 text-body-sm text-secondary">
          Your W-9 has been securely submitted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md border border-dashed border-border bg-sunken/50 p-6 text-center">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          className="text-body-sm text-secondary"
        />
        <p className="mt-2 text-caption text-tertiary">PDF, PNG, or JPEG · Max 10MB</p>
      </div>
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Uploading…" : "Upload W-9"}
      </Button>
    </form>
  );
}
