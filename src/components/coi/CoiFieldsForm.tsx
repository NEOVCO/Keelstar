"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COI_FIELD_KEYS, COI_POLICY_TYPES } from "@/lib/coi/constants";

export function CoiFieldsForm({
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
  const [saved, setSaved] = useState(false);

  function setField(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/coi/requests/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_fields", fields }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  const labels: Record<string, string> = {
    insured_name: "Insured name",
    certificate_holder: "Certificate holder",
    insurance_carrier: "Insurance carrier",
    policy_number: "Policy number",
    policy_type: "Policy type",
    effective_date: "Effective date",
    expiration_date: "Expiration date",
    coverage_limit: "Coverage limit",
    notes: "Notes",
    additional_insured: "Additional insured",
    waiver_of_subrogation: "Waiver of subrogation",
    aggregate_limit: "Aggregate limit",
    per_occurrence_limit: "Per occurrence limit",
  };

  return (
    <div className="space-y-4">
      {COI_FIELD_KEYS.map((key) => (
        <div key={key}>
          <label className="mb-1 block text-body-sm text-secondary">{labels[key] ?? key}</label>
          {key === "policy_type" ? (
            <select
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              value={fields[key] ?? ""}
              onChange={(e) => setField(key, e.target.value)}
              disabled={readOnly}
            >
              <option value="">Select type</option>
              {COI_POLICY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          ) : key === "notes" ? (
            <textarea
              className="w-full rounded-md border border-border bg-surface p-2 text-body-sm"
              rows={3}
              value={fields[key] ?? ""}
              onChange={(e) => setField(key, e.target.value)}
              disabled={readOnly}
            />
          ) : key.includes("date") ? (
            <Input
              type="date"
              value={fields[key]?.slice(0, 10) ?? ""}
              onChange={(e) => setField(key, e.target.value)}
              disabled={readOnly}
            />
          ) : (
            <Input
              value={fields[key] ?? ""}
              onChange={(e) => setField(key, e.target.value)}
              disabled={readOnly}
            />
          )}
        </div>
      ))}
      {!readOnly && (
        <Button variant="secondary" size="sm" disabled={saving} onClick={handleSave}>
          {saving ? "Saving…" : saved ? "Saved" : "Save fields"}
        </Button>
      )}
    </div>
  );
}
