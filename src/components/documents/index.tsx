import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

const CONFIDENCE_VARIANT = {
  high: "success",
  medium: "warning",
  low: "error",
} as const;

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const labels = { high: "High confidence", medium: "Review suggested", low: "Requires review" };
  return <Badge variant={CONFIDENCE_VARIANT[level]}>{labels[level]}</Badge>;
}

export function ParsedFieldRow({
  label,
  value,
  confidence,
}: {
  label: string;
  value: string;
  confidence: "high" | "medium" | "low";
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-caption text-tertiary">{label}</p>
        <p className="text-body-sm text-primary">{value}</p>
      </div>
      <ConfidenceBadge level={confidence} />
    </div>
  );
}

export function DocumentPreview({
  url,
  mimeType,
  filename,
}: {
  url?: string | null;
  mimeType?: string;
  filename?: string;
}) {
  if (!url) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border bg-sunken text-body-sm text-secondary">
        No preview available
      </div>
    );
  }
  if (mimeType?.startsWith("image/")) {
    return (
      <div className="overflow-hidden rounded-md border border-border bg-sunken">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={filename ?? "Document"} className="max-h-96 w-full object-contain" />
      </div>
    );
  }
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-md border border-border bg-sunken p-6 text-center">
      <p className="text-body-sm text-primary">{filename ?? "Document"}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-body-sm text-accent hover:underline">
        Open preview in new tab
      </a>
    </div>
  );
}

export function DocumentVersionHistory({
  versions,
}: {
  versions: Array<{
    version_number: number;
    filename: string;
    created_at: string;
    status?: string;
    uploaded_by_email?: string | null;
  }>;
}) {
  if (!versions.length) {
    return <p className="text-body-sm text-secondary">No versions yet.</p>;
  }
  return (
    <ul className="divide-y divide-border">
      {versions.map((v) => (
        <li key={v.version_number} className="flex items-center justify-between py-3 text-body-sm">
          <div>
            <p className="font-medium text-primary">
              v{v.version_number} — {v.filename}
            </p>
            <p className="text-caption text-tertiary">
              {v.uploaded_by_email ?? "Unknown"} · {new Date(v.created_at).toLocaleString()}
            </p>
          </div>
          {v.status && <span className="text-caption capitalize text-secondary">{v.status}</span>}
        </li>
      ))}
    </ul>
  );
}

export function DocumentUploadZone({
  accept = ".pdf,.png,.jpg,.jpeg",
  maxSizeMb = 10,
  onUpload,
  disabled,
}: {
  accept?: string;
  maxSizeMb?: number;
  onUpload?: (file: File) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-sunken/50 px-6 py-10 text-center transition-colors hover:border-accent hover:bg-accent-subtle/20",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <p className="text-body-sm font-medium text-primary">Drag and drop or browse</p>
      <p className="mt-1 text-caption text-tertiary">
        {accept.replace(/\./g, "").toUpperCase()} · max {maxSizeMb} MB
      </p>
      <input
        type="file"
        className="sr-only"
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload?.(file);
        }}
      />
    </label>
  );
}

export function ExtractionReviewPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-1">{children}</div>;
}

export function DocumentActions({ downloadUrl }: { downloadUrl?: string | null }) {
  if (!downloadUrl) return null;
  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-md border border-border bg-surface px-3 py-1.5 text-body-sm text-primary hover:bg-sunken"
    >
      Download
    </a>
  );
}
