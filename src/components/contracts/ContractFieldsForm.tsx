"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CONTRACT_FIELD_KEYS } from "@/lib/contracts/constants";
import { computeLatestNoticeDate, parseNoticePeriodDays } from "@/lib/contracts/noticeDate";

export function ContractFieldsForm({
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
    contract_name: "Contract name",
    counterparty: "Counterparty",
    contract_type: "Contract type",
    effective_date: "Effective date",
    start_date: "Start date",
    end_date: "End date",
    renewal_date: "Renewal date",
    notice_period_days: "Notice period (days)",
    termination_notice_days: "Termination notice (days)",
    auto_renewal: "Auto-renews (yes/no)",
    renewal_term: "Renewal term",
    contract_value: "Contract value",
    currency: "Currency",
    notes: "Notes",
  };

  const noticeDays = parseNoticePeriodDays(fields);
  const renewalRaw = fields.renewal_date;
  let computedNotice = "";
  if (renewalRaw && noticeDays != null) {
    const renewalDate = new Date(renewalRaw);
    if (!Number.isNaN(renewalDate.getTime())) {
      computedNotice = computeLatestNoticeDate(renewalDate, noticeDays).toISOString().slice(0, 10);
    }
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...fields };
    if (payload.notice_period_days && !payload.termination_notice_days) {
      payload.termination_notice_days = payload.notice_period_days;
    }
    await fetch(`/api/contracts/requests/${workflowId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_fields", fields: payload }),
    });
    setSaving(false);
    router.refresh();
  }

  const visibleKeys = CONTRACT_FIELD_KEYS.filter((k) => k !== "termination_notice_days");

  return (
    <div className="space-y-4">
      {visibleKeys.map((key) => (
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
          ) : key === "contract_type" ? (
            <select
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              value={fields[key] ?? ""}
              onChange={(e) => setFields((p) => ({ ...p, [key]: e.target.value }))}
              disabled={readOnly}
            >
              <option value="">Select type</option>
              {[
                "vendor_agreement",
                "msa",
                "sow",
                "lease",
                "subscription",
                "service_agreement",
                "nda",
                "employment",
                "insurance",
                "other",
              ].map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          ) : key.includes("date") ? (
            <input
              type="date"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              value={fields[key]?.slice(0, 10) ?? ""}
              onChange={(e) => setFields((p) => ({ ...p, [key]: e.target.value }))}
              disabled={readOnly}
            />
          ) : (
            <input
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-body-sm"
              value={fields[key] ?? ""}
              onChange={(e) => setFields((p) => ({ ...p, [key]: e.target.value }))}
              disabled={readOnly}
            />
          )}
        </div>
      ))}

      {computedNotice && (
        <div className="rounded-md border border-warning/30 bg-warning-subtle px-3 py-2 text-body-sm">
          <span className="text-secondary">Latest notice date (computed): </span>
          <strong>{computedNotice}</strong>
        </div>
      )}

      {fields.auto_renewal?.toLowerCase() === "yes" && computedNotice && (
        <p className="text-caption text-warning">
          Auto-renewal enabled — act before the notice deadline to avoid unwanted renewal.
        </p>
      )}

      {!readOnly && (
        <Button variant="secondary" size="sm" disabled={saving} onClick={handleSave}>
          {saving ? "Saving…" : "Save renewal details"}
        </Button>
      )}
    </div>
  );
}
