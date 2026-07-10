import { PageHeader } from "@/components/navigation/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportExportButton } from "@/components/reports/ReportExportButton";

const REPORTS = [
  {
    title: "Directory compliance matrix",
    desc: "W-9, COI, and packet status by directory entry.",
    href: "/api/reports/vendor-matrix",
    filename: "vendor-compliance-matrix.csv",
  },
  {
    title: "Training matrix",
    desc: "Certifications and expiration by person.",
    href: "/api/reports/training-matrix",
    filename: "training-matrix.csv",
  },
  {
    title: "Audit export (CSV)",
    desc: "Audit log spreadsheet for date range filtering.",
    href: "/api/reports/audit-export",
    filename: "audit-export.csv",
  },
  {
    title: "Audit export (PDF)",
    desc: "Formatted audit trail report for compliance reviews.",
    href: "/api/reports/audit-pdf",
    filename: "audit-trail.pdf",
  },
  {
    title: "Evidence packets",
    desc: "Index of workflows with evidence export paths.",
    href: "/api/reports/evidence",
    filename: "evidence-index.csv",
  },
] as const;

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Compliance summaries and export entry points." />
      <div className="grid gap-4 sm:grid-cols-2">
        {REPORTS.map((r) => (
          <Card key={r.title}>
            <CardHeader>
              <CardTitle className="text-body font-medium">{r.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-body-sm text-secondary">{r.desc}</p>
              <ReportExportButton href={r.href} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
