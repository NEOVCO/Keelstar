import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: {
  title: string;
  description: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-sunken/50 px-6 py-12 text-center",
        className
      )}
    >
      <h3 className="text-h4 text-primary">{title}</h3>
      <p className="mt-2 max-w-md text-body-sm text-secondary">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {primaryAction && (
          <Link href={primaryAction.href}>
            <Button>{primaryAction.label}</Button>
          </Link>
        )}
        {secondaryAction && (
          <Link href={secondaryAction.href}>
            <Button variant="secondary">{secondaryAction.label}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
