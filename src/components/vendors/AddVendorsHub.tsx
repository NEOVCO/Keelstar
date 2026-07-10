"use client";

import Link from "next/link";
import { useState } from "react";
import { FileSpreadsheet, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { AddVendorForm } from "@/components/vendors/AddVendorForm";
import { VendorImportPanel } from "@/components/vendors/VendorImportPanel";
import { DIRECTORY } from "@/lib/terminology/directory";

type AddMode = "single" | "import";

const MODES: { id: AddMode; label: string; description: string; icon: typeof UserPlus }[] = [
  {
    id: "single",
    label: "One at a time",
    description: "Add a company, tenant, or individual with contact details.",
    icon: UserPlus,
  },
  {
    id: "import",
    label: "Spreadsheet",
    description: "Batch import tenants, vendors, and contractors from CSV.",
    icon: FileSpreadsheet,
  },
];

export function AddVendorsHub({ initialMode = "single" }: { initialMode?: "single" | "import" }) {
  const [mode, setMode] = useState<AddMode>(initialMode);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {MODES.map((option) => {
          const Icon = option.icon;
          const active = mode === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              className={cn(
                "rounded-lg border p-4 text-left transition-colors",
                active
                  ? "border-accent bg-accent-subtle"
                  : "border-border bg-surface hover:border-accent/40"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                    active ? "bg-accent text-white" : "bg-sunken text-accent"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-body-sm font-medium text-primary">{option.label}</span>
                  <span className="mt-0.5 block text-caption text-secondary">{option.description}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        {mode === "single" ? <AddVendorForm redirectTo="/app/vendors" /> : <VendorImportPanel />}
      </div>

      <p className="text-caption text-secondary">
        Track COIs for tenants and vendors, send W-9 requests, and manage onboarding packets. Optionally
        register people on the OIG screening roster during import.{" "}
        <Link href="/app/vendors" className="text-accent hover:underline">
          {DIRECTORY.backTo}
        </Link>
      </p>
    </div>
  );
}
