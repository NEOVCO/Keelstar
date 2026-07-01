import { Shield } from "lucide-react";

export function ExternalLayout({
  organizationName,
  children,
}: {
  organizationName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <span className="text-h4 font-semibold text-primary">Keelstar</span>
        </div>
        <p className="mx-auto mt-2 max-w-lg text-body-sm text-secondary">
          Secure request from <strong className="text-primary">{organizationName}</strong>
        </p>
      </header>
      <main className="mx-auto max-w-lg px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-lg px-4 pb-8 text-center text-caption text-tertiary">
        <p className="flex items-center justify-center gap-1">
          <Shield className="h-3.5 w-3.5" />
          Your submission is encrypted in transit.
        </p>
      </footer>
    </div>
  );
}

export function ExternalTaskSummary({
  title,
  requestedBy,
  dueDate,
  estimatedMinutes = 2,
}: {
  title: string;
  requestedBy: string;
  dueDate?: string;
  estimatedMinutes?: number;
}) {
  return (
    <div className="mb-6 rounded-lg border border-border bg-surface p-5">
      <h1 className="text-h3 text-primary">{title}</h1>
      <dl className="mt-4 space-y-2 text-body-sm">
        <div className="flex justify-between">
          <dt className="text-secondary">Requested by</dt>
          <dd className="text-primary">{requestedBy}</dd>
        </div>
        {dueDate && (
          <div className="flex justify-between">
            <dt className="text-secondary">Due date</dt>
            <dd className="text-primary">{new Date(dueDate).toLocaleDateString()}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-secondary">Estimated time</dt>
          <dd className="text-primary">~{estimatedMinutes} min</dd>
        </div>
      </dl>
    </div>
  );
}

export function ExternalCompletionState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-border bg-success-subtle/50 p-6 text-center">
      <p className="text-body font-medium text-success">{message}</p>
      <p className="mt-2 text-body-sm text-secondary">You may close this window.</p>
    </div>
  );
}

export function ExternalExpiredState({ organizationName }: { organizationName: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 text-center">
      <p className="text-body font-medium text-primary">This link has expired.</p>
      <p className="mt-2 text-body-sm text-secondary">Ask {organizationName} for a new link.</p>
    </div>
  );
}
