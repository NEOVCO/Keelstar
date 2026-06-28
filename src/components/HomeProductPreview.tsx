import Link from "next/link";
import { Bell, ShieldCheck } from "lucide-react";

type Row = { vendor: string; coverage: string; expires: string; status: "Current" | "Expiring" | "Expired" };

const rows: Row[] = [
  { vendor: "Northwind Facilities", coverage: "General Liability · $1M", expires: "Mar 2027", status: "Current" },
  { vendor: "Harbor Logistics LLC", coverage: "Auto · $1M", expires: "in 12 days", status: "Expiring" },
  { vendor: "Cedar Mechanical", coverage: "Umbrella · $5M", expires: "Apr 2027", status: "Current" },
  { vendor: "Vertex Cleaning Co.", coverage: "General Liability · $1M", expires: "8 days ago", status: "Expired" },
];

const statusStyles: Record<Row["status"], string> = {
  Current: "bg-success-subtle text-success",
  Expiring: "bg-warning-subtle text-warning",
  Expired: "bg-error-subtle text-error",
};

export function HomeProductPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-md">
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-sunken px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
        <span className="ml-2 font-mono text-caption text-tertiary">app.keelstar.com/coi-tracker</span>
      </div>

      {/* header row */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent" aria-hidden />
          <span className="text-body-sm font-semibold text-primary">Certificates of Insurance</span>
        </div>
        <span className="rounded-sm bg-warning-subtle px-2 py-0.5 text-caption font-medium text-warning">1 expiring</span>
      </div>

      {/* table */}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="text-caption uppercase tracking-wide text-tertiary">
            <th className="px-4 py-2 font-medium">Vendor</th>
            <th className="hidden px-4 py-2 font-medium sm:table-cell">Coverage</th>
            <th className="px-4 py-2 font-medium">Expires</th>
            <th className="px-4 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.vendor} className="border-t border-border">
              <td className="px-4 py-3 text-body-sm font-medium text-primary">{r.vendor}</td>
              <td className="hidden px-4 py-3 text-body-sm text-secondary sm:table-cell">{r.coverage}</td>
              <td className="px-4 py-3 text-body-sm tabular-nums text-secondary">{r.expires}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-caption font-medium ${statusStyles[r.status]}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* audit footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-sunken px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-caption text-secondary">
          <Bell className="h-3.5 w-3.5 text-accent" aria-hidden />
          Reminder sent to owner · logged to the audit trail
        </span>
        <Link href="/tools/audit-trail-export-preview/" className="text-caption font-medium text-accent hover:underline">
          See a sample audit export →
        </Link>
      </div>
    </div>
  );
}
