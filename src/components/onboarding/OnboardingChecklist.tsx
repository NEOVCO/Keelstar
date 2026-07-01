"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export type ChecklistItem = {
  id: string;
  label: string;
  href: string;
  done: boolean;
};

export function OnboardingChecklist({
  items,
  goalLabel,
}: {
  items: ChecklistItem[];
  goalLabel?: string;
}) {
  const router = useRouter();
  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;

  async function dismiss() {
    await fetch("/api/onboarding/checklist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dismissed: true }),
    });
    router.refresh();
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-body font-medium">Get started</CardTitle>
          <p className="mt-1 text-body-sm text-secondary">
            {goalLabel
              ? `Your first goal: ${goalLabel}. Complete these steps to set up your workspace.`
              : "Complete these steps to set up your workspace."}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={dismiss}>
          Dismiss
        </Button>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-caption text-tertiary">
          {doneCount} of {items.length} complete
        </p>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md border border-border px-3 py-2.5 transition-colors",
                  item.done ? "bg-sunken/50" : "hover:bg-sunken"
                )}
              >
                {item.done ? (
                  <Check className="h-4 w-4 shrink-0 text-success" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-tertiary" />
                )}
                <span
                  className={cn(
                    "text-body-sm",
                    item.done ? "text-secondary line-through" : "text-primary"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {allDone && (
          <Button variant="secondary" size="sm" className="mt-4" onClick={dismiss}>
            Done — hide checklist
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
