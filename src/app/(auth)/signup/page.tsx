"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { signupConfirmRedirectUrl } from "@/lib/auth/urls";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: signupConfirmRedirectUrl(),
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.assign("/onboarding");
      return;
    }

    setConfirmEmail(true);
    setLoading(false);
  }

  if (confirmEmail) {
    return (
      <AuthFormCard title="Check your email" description="We sent a confirmation link to activate your account.">
        <p className="text-body-sm text-secondary">
          Click the link in the email we sent to <strong className="text-primary">{email}</strong>, then sign in to
          continue.
        </p>
        <p className="mt-5 text-center text-body-sm text-secondary">
          <Link href="/login" className="font-medium text-accent hover:underline">
            Back to sign in
          </Link>
        </p>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard
      title="Create account"
      description="Start using Keelstar for your organization."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-5 text-center text-body-sm text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthFormCard>
  );
}
