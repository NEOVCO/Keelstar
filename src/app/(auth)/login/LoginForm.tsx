"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthFormCard } from "@/components/auth/AuthFormCard";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/app";
  const signedOut = searchParams.get("signed_out") === "1";
  const error = searchParams.get("error");

  return (
    <AuthFormCard
      title="Sign in"
      description="Enter your email and password to access your account."
    >
      {signedOut && (
        <p className="mb-4 rounded-md bg-sunken px-3 py-2 text-body-sm text-secondary">
          You have been signed out. Sign in again to continue.
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-md bg-error-subtle px-3 py-2 text-body-sm text-error">
          {error === "workspace"
            ? "Could not load your workspace. Try signing in again."
            : error}
        </p>
      )}
      <form action="/api/auth/login" method="POST" className="space-y-4">
        <input type="hidden" name="redirect" value={redirect} />
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-caption text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="h-10 w-full">
          Sign in
        </Button>
      </form>
      <p className="mt-5 text-center text-body-sm text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </AuthFormCard>
  );
}
