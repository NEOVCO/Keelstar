"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { Faq as FaqType } from "@/lib/products";

export function Faq({ items }: { items: FaqType[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-h4 text-primary">{it.q}</span>
                {isOpen ? (
                  <Minus className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                ) : (
                  <Plus className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
                )}
              </button>
            </h3>
            <div className={isOpen ? "pb-4" : "hidden pb-4"}>
              <p className="max-w-reading text-body text-secondary">{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
