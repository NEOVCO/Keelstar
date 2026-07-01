import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  title: string;
  description: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-surface px-6 py-10 text-center">
      <h2 className="text-h3 text-primary">{title}</h2>
      <p className="mt-2 text-body-sm text-secondary">{description}</p>
      <div className="mt-6 flex justify-center gap-3">
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

export function PermissionDeniedState() {
  return (
    <ErrorState
      title="You don't have access"
      description="Your role does not include permission for this action. Contact your workspace admin."
      primaryAction={{ label: "Back to home", href: "/app" }}
    />
  );
}

export function LimitReachedState({ resource, limit }: { resource: string; limit: number }) {
  return (
    <ErrorState
      title="Plan limit reached"
      description={`You've reached the limit of ${limit} ${resource} on your current plan.`}
      primaryAction={{ label: "View billing", href: "/app/settings/billing" }}
      secondaryAction={{ label: "Back to home", href: "/app" }}
    />
  );
}
