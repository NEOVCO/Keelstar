"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ParsedFieldRow } from "@/components/documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function confidenceLevel(value: number | null | undefined): "high" | "medium" | "low" {
  if (value == null) return "medium";
  if (value >= 0.85) return "high";
  if (value >= 0.6) return "medium";
  return "low";
}

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ParsedFieldsEditor({
  documentId,
  fields,
}: {
  documentId: string;
  fields: Array<{
    id: string;
    field_key: string;
    field_value: string | null;
    confidence: number | null;
    is_override: boolean | null;
  }>;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editable = fields.filter((f) => !["filename", "file_size_bytes", "mime_type"].includes(f.field_key));

  async function save(fieldId: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/parsed-fields/${fieldId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: draft }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Failed to save");
      setEditingId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!editable.length) {
    return <p className="text-body-sm text-secondary">No extracted fields yet. Upload completes processing automatically.</p>;
  }

  return (
    <div className="space-y-1">
      {error && <p className="text-body-sm text-error">{error}</p>}
      {editable.map((f) => (
        <div key={f.id} className="border-b border-border py-3 last:border-0">
          {editingId === f.id ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input value={draft} onChange={(e) => setDraft(e.target.value)} className="flex-1" />
              <div className="flex gap-2">
                <Button size="sm" disabled={saving} onClick={() => save(f.id)}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <ParsedFieldRow
                  label={formatLabel(f.field_key)}
                  value={f.field_value ?? "—"}
                  confidence={confidenceLevel(f.confidence)}
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditingId(f.id);
                  setDraft(f.field_value ?? "");
                }}
              >
                Edit
              </Button>
            </div>
          )}
          {f.is_override && editingId !== f.id && (
            <p className="mt-1 text-caption text-tertiary">Manually overridden</p>
          )}
        </div>
      ))}
    </div>
  );
}
