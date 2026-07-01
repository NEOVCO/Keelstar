"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ExternalTaskForm({
  token,
  taskId,
  purpose,
}: {
  token: string;
  taskId: string;
  purpose: string;
}) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  async function handleComplete() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/external/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, taskId }),
    });

    const data = await res.json();
    if (!data.success) {
      setError(data.error ?? "Failed to complete task");
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
          Your response has been submitted successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-body-sm text-secondary">
        Action required: <span className="font-medium text-primary">{purpose.replace(/_/g, " ")}</span>
      </p>
      {error && <p className="text-body-sm text-error">{error}</p>}
      <Button onClick={handleComplete} disabled={loading} className="w-full">
        {loading ? "Submitting…" : "Complete task"}
      </Button>
    </div>
  );
}
