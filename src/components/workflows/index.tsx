import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  { id: "start", label: "Start" },
  { id: "collect", label: "Collect document" },
  { id: "extract", label: "Extract fields" },
  { id: "review", label: "Review" },
  { id: "monitor", label: "Monitor" },
];

export function WorkflowStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex flex-wrap gap-2">
      {STEPS.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <li
            key={step.id}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 text-caption",
              done && "border-success/30 bg-success-subtle text-success",
              active && "border-accent bg-accent-subtle font-medium text-accent",
              !done && !active && "border-border text-tertiary"
            )}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px]">
              {done ? "✓" : i + 1}
            </span>
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}

export function NextActionPanel({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <Card className="border-accent/20 bg-accent-subtle/30">
      <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-body-sm font-medium text-primary">{title}</p>
          <p className="mt-1 text-caption text-secondary">{description}</p>
        </div>
        <Button onClick={onAction}>{actionLabel}</Button>
      </CardContent>
    </Card>
  );
}

export function WorkflowSummaryCard({
  title,
  status,
  module,
  dueDate,
  href,
}: {
  title: string;
  status: string;
  module: string;
  dueDate: string;
  href: string;
}) {
  return (
    <a href={href} className="block rounded-lg border border-border bg-surface p-4 hover:shadow-sm">
      <p className="text-body-sm font-medium text-primary">{title}</p>
      <p className="mt-1 text-caption text-secondary">
        {module} · Due {new Date(dueDate).toLocaleDateString()}
      </p>
      <p className="mt-2 text-caption capitalize text-tertiary">{status.replace(/_/g, " ")}</p>
    </a>
  );
}
