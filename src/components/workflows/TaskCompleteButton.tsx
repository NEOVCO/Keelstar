"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TaskCompleteButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function complete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      router.refresh();
    } catch {
      // silent — user can retry
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" disabled={loading} onClick={complete}>
      {loading ? "…" : "Complete"}
    </Button>
  );
}
