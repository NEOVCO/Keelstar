import { ExternalLayout, ExternalTaskSummary } from "@/components/external";

/** Mock external flow for UI foundation — production uses /external/w9/[token] */
export default function ExternalTokenMockPage() {
  return (
    <ExternalLayout organizationName="Acme Operations">
      <ExternalTaskSummary
        title="Upload your W-9"
        requestedBy="Alex Morgan"
        dueDate="2026-07-05"
      />
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="mb-4 text-body-sm text-secondary">
          Upload a completed IRS Form W-9 (PDF, PNG, or JPEG, max 10 MB).
        </p>
        {/* TODO(backend): Replace with token-validated external flow */}
        <p className="text-caption text-tertiary">Demo token page — use /external/w9/[token] for live uploads.</p>
      </div>
    </ExternalLayout>
  );
}
