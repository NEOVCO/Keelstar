"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ExclusionResultReview({
  resultId,
  reviewStatus,
}: {
  resultId: string;
  reviewStatus: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (reviewStatus !== "review_needed") {
    return (
      <p className="text-body-sm text-secondary">
        Review status: <span className="text-primary">{reviewStatus.replace(/_/g, " ")}</span>
      </p>
    );
  }

  async function submit(action: "clear" | "confirm") {
    if (notes.trim().length < 3) {
      setError("Review note is required (min 3 characters).");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/exclusions/results/${resultId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "review", reviewAction: action, reviewNotes: notes }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error ?? "Review failed");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <p className="text-body-sm text-secondary">
        Potential matches require human review. Keelstar does not make final compliance determinations.
      </p>
      {error && <p className="text-body-sm text-error">{error}</p>}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Review notes (required)"
        rows={3}
        className="w-full rounded-md border border-border-strong bg-bg px-3 py-2 text-body-sm"
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={loading} onClick={() => submit("clear")}>
          Clear as false positive
        </Button>
        <Button disabled={loading} onClick={() => submit("confirm")}>
          Confirm match
        </Button>
      </div>
    </div>
  );
}
