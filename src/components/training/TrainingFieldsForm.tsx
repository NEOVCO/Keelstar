"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TRAINING_FIELD_KEYS } from "@/lib/training/constants";

export function TrainingFieldsForm({
  workflowId,
  initialFields,
  readOnly = false,
}: {
  workflowId: string;
  initialFields: Record<string, string>;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [fields, setFields] = useState<Record<string, string>>(initialFields);
  const [saving, setSaving] = useState(false);

  const labels: Record<string, string> = {
    course_name: "Course / certification name",
    provider: "Provider",
    certification_number: "Certification / license number",
    completion_date: "Completion date",
    expiration_date: "Expiration date",
    notes: "Notes",
  };

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/training/records/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_fields", fields }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {TRAINING_FIELD_KEYS.map((key) => (
        <div key={key}>
          <label className="mb-1 block text-body-sm text-secondary">{labels[key]}</label>
          {key === "notes" ? (
            <textarea
              className="w-full rounded-md border border-border bg-surface p-2 text-body-sm"
              rows={3}
              value={fields[key] ?? ""}
              onChange={(e) => setFields((p) => ({ ...p, [key]: e.target.value }))}
              disabled={readOnly}
            />
          ) : (
            <input
              type={key.includes("date") ? "date" : "text"}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              value={fields[key] ?? ""}
              onChange={(e) => setFields((p) => ({ ...p, [key]: e.target.value }))}
              disabled={readOnly}
              required={["course_name", "completion_date", "expiration_date"].includes(key)}
            />
          )}
        </div>
      ))}
      {!readOnly && (
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save fields"}
        </Button>
      )}
    </div>
  );
}
