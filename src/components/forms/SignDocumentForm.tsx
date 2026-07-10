"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignDocumentForm({
  token,
  documentTitle,
}: {
  token: string;
  documentTitle: string;
}) {
  const [signedName, setSignedName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/external/signer/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, signedName, agreed: true }),
    });
    const data = await res.json();

    if (!data.success) {
      setError(data.error ?? "Signing failed");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <p className="text-body-sm text-success">
        Thank you. Your signature on <strong>{documentTitle}</strong> has been recorded.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Type your full legal name to sign</label>
        <Input
          value={signedName}
          onChange={(e) => setSignedName(e.target.value)}
          placeholder="Full legal name"
          required
          minLength={2}
        />
      </div>
      <label className="flex items-start gap-2 text-body-sm text-secondary">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
          required
        />
        <span>
          I have reviewed <strong className="text-primary">{documentTitle}</strong> and agree to sign
          this document electronically.
        </span>
      </label>
      {error && <p className="text-body-sm text-danger">{error}</p>}
      <Button type="submit" disabled={loading || !agreed || signedName.length < 2}>
        {loading ? "Signing…" : "Sign document"}
      </Button>
    </form>
  );
}
