"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthFormCard } from "@/components/auth/AuthFormCard";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setDone(true);
  }

  return (
    <AuthFormCard title="Set new password" description="Choose a strong password for your account.">
      {done ? (
        <p className="text-body-sm text-secondary">
          Password updated.{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      ) : !ready ? (
        <p className="text-body-sm text-secondary">
          Open the reset link from your email to continue.{" "}
          <Link href="/forgot-password" className="font-medium text-accent hover:underline">
            Request a new link
          </Link>
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
            />
            <p className="text-caption text-tertiary">At least 8 characters</p>
          </div>
          {error && <p className="rounded-md bg-error-subtle px-3 py-2 text-body-sm text-error">{error}</p>}
          <Button type="submit" className="h-10 w-full" disabled={loading}>
            {loading ? "Saving…" : "Update password"}
          </Button>
        </form>
      )}
    </AuthFormCard>
  );
}
