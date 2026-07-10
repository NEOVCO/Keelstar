"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { inviteSignupRedirectUrl } from "@/lib/auth/urls";

type InviteDetails = {
  email: string;
  organizationName: string;
  expiresAt: string;
};

export default function InviteAcceptPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [inviteError, setInviteError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetch(`/api/invite/${params.token}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          setInviteError(json.error ?? "Invitation is invalid or expired");
          return;
        }
        setInvite(json.data);
        setEmail(json.data.email);
      })
      .catch(() => setInviteError("Could not load invitation"));
  }, [params.token]);

  async function acceptAfterAuth() {
    const res = await fetch("/api/invite/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: params.token }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error ?? "Could not accept invitation");
    router.push("/app");
    router.refresh();
  }

  useEffect(() => {
    if (!invite || accepting) return;

    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.user?.email) return;
      if (data.session.user.email.toLowerCase() !== invite.email.toLowerCase()) return;

      setAccepting(true);
      try {
        await acceptAfterAuth();
      } catch (err) {
        setAccepting(false);
        setError(err instanceof Error ? err.message : "Could not accept invitation");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invite]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error: signError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: inviteSignupRedirectUrl(params.token),
          },
        });
        if (signError) throw signError;

        if (!data.session) {
          setConfirmEmail(true);
          setLoading(false);
          return;
        }
      } else {
        const { error: signError } = await supabase.auth.signInWithPassword({ email, password });
        if (signError) throw signError;
      }
      await acceptAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (inviteError) {
    return (
      <AuthFormCard title="Invitation unavailable" description="This link may have expired or already been used.">
        <p className="text-body-sm text-secondary">{inviteError}</p>
        <p className="mt-5 text-center text-body-sm text-secondary">
          <Link href="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </AuthFormCard>
    );
  }

  if (!invite || accepting) {
    return (
      <AuthFormCard
        title={accepting ? "Joining team…" : "Loading invitation…"}
        description={accepting ? `Adding you to ${invite?.organizationName ?? "the team"}.` : "Please wait."}
      >
        <p className="text-body-sm text-secondary">{accepting ? "Redirecting to the app…" : "Verifying your invite link."}</p>
      </AuthFormCard>
    );
  }

  if (confirmEmail) {
    return (
      <AuthFormCard
        title="Check your email"
        description={`Confirm your account to join ${invite.organizationName}.`}
      >
        <p className="text-body-sm text-secondary">
          We sent a confirmation link to <strong className="text-primary">{email}</strong>. After confirming, you&apos;ll
          return here to join the team automatically.
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
      title={`Join ${invite.organizationName}`}
      description={mode === "signup" ? "Create an account to accept the invitation." : "Sign in to accept the invitation."}
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
            readOnly
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
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>
        {error && <p className="rounded-md bg-error-subtle px-3 py-2 text-body-sm text-error">{error}</p>}
        <Button type="submit" className="h-10 w-full" disabled={loading}>
          {loading ? "Joining…" : mode === "signup" ? "Create account & join" : "Sign in & join"}
        </Button>
      </form>
      <p className="mt-5 text-center text-body-sm text-secondary">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button type="button" className="font-medium text-accent hover:underline" onClick={() => setMode("login")}>
              Sign in
            </button>
          </>
        ) : (
          <>
            Need an account?{" "}
            <button type="button" className="font-medium text-accent hover:underline" onClick={() => setMode("signup")}>
              Sign up
            </button>
          </>
        )}
      </p>
      <p className="mt-2 text-center text-body-sm text-secondary">
        <Link href="/login" className="font-medium text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthFormCard>
  );
}
