"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { INVOICE_FIELD_KEYS } from "@/lib/invoices/constants";

export function InvoiceFieldsForm({
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
    vendor_name: "Vendor name",
    invoice_number: "Invoice number",
    invoice_amount: "Amount",
    due_date: "Payment due date",
    notes: "Notes",
  };

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/invoices/requests/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_fields", fields }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {INVOICE_FIELD_KEYS.map((key) => (
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
              type={key.includes("date") ? "date" : key === "invoice_amount" ? "number" : "text"}
              step={key === "invoice_amount" ? "0.01" : undefined}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              value={fields[key] ?? ""}
              onChange={(e) => setFields((p) => ({ ...p, [key]: e.target.value }))}
              disabled={readOnly}
              required={["vendor_name", "invoice_amount", "due_date"].includes(key)}
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
