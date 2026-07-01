"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { StatusBadge } from "@/components/ui/badge";

export function VendorPacketPortal({
  token,
  items,
}: {
  token: string;
  items: Array<{
    key: string;
    label: string;
    required: boolean;
    status: "pending" | "uploaded";
  }>;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function uploadItem(itemKey: string, file: File) {
    setUploading(itemKey);
    setError("");
    const formData = new FormData();
    formData.append("token", token);
    formData.append("itemKey", itemKey);
    formData.append("file", file);

    const res = await fetch("/api/external/vendor-packet/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.success) {
      setError(data.error ?? "Upload failed");
      setUploading(null);
      return;
    }

    setUploading(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.key}
          className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-body-sm font-medium text-primary">
              {item.label}
              {item.required && <span className="text-error"> *</span>}
            </p>
            <StatusBadge status={item.status === "uploaded" ? "completed" : "pending"} />
          </div>
          {item.status === "pending" ? (
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                disabled={!!uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadItem(item.key, file);
                }}
              />
              <span
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  uploading === item.key && "pointer-events-none opacity-50"
                )}
              >
                {uploading === item.key ? "Uploading…" : "Upload"}
              </span>
            </label>
          ) : (
            <span className="text-caption text-success">Submitted</span>
          )}
        </div>
      ))}
      {error && <p className="text-body-sm text-error">{error}</p>}
    </div>
  );
}
