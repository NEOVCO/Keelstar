import { cn } from "@/lib/utils/cn";
import { getStatusLabel, getStatusVariant, type StatusCategory } from "@/lib/statuses";

const variants: Record<StatusCategory, string> = {
  default: "bg-sunken text-secondary",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  error: "bg-error-subtle text-error",
  accent: "bg-accent-subtle text-accent",
};

export function Badge({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: StatusCategory;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-caption font-medium capitalize",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>;
}
