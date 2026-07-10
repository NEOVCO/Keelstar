"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PolicyAcknowledgeForm({
  token,
  policyTitle,
}: {
  token: string;
  policyTitle: string;
}) {
  const [acknowledgedName, setAcknowledgedName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/external/policy/acknowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, acknowledgedName, agreed: true }),
    });
    const data = await res.json();

    if (!data.success) {
      setError(data.error ?? "Acknowledgement failed");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <p className="text-body-sm text-success">
        Thank you. Your acknowledgement of <strong>{policyTitle}</strong> has been recorded.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-body-sm text-secondary">Type your full name to acknowledge</label>
        <Input
          value={acknowledgedName}
          onChange={(e) => setAcknowledgedName(e.target.value)}
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
          I have read and understand <strong className="text-primary">{policyTitle}</strong> and agree to comply
          with its terms.
        </span>
      </label>
      {error && <p className="text-body-sm text-danger">{error}</p>}
      <Button type="submit" disabled={loading || !agreed || acknowledgedName.length < 2}>
        {loading ? "Submitting…" : "Submit acknowledgement"}
      </Button>
    </form>
  );
}
