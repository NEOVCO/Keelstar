"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Mail, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function UserMenu({ email }: { email?: string }) {
  const router = useRouter();

  return (
    <div className="group relative">
      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full bg-sunken p-0" aria-label="User menu">
        <User className="h-4 w-4" />
      </Button>
      <div className="invisible absolute right-0 top-full z-30 mt-1 w-56 rounded-md border border-border bg-surface py-1 opacity-0 shadow-md group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {email && (
          <p className="border-b border-border px-3 py-2 text-caption text-secondary truncate">{email}</p>
        )}
        <Link href="/app/settings" className="flex items-center gap-2 px-3 py-2 text-body-sm hover:bg-sunken">
          <Settings className="h-4 w-4" /> Settings
        </Link>
        <a
          href={`mailto:${site.contactEmail}`}
          className="flex items-center gap-2 px-3 py-2 text-body-sm hover:bg-sunken"
        >
          <Mail className="h-4 w-4" /> Contact support
        </a>
        <form
          action="/api/auth/signout"
          method="POST"
          onSubmit={() => router.refresh()}
        >
          <button
            type="submit"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm hover:bg-sunken"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
