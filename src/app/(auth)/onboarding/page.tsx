"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MODULES } from "@/lib/modules/modules";
import { getModuleFirstActionRoute } from "@/lib/onboarding/org-settings";
import { cn } from "@/lib/utils/cn";

const STARTER_GOALS = MODULES.filter((m) => m.status === "active").slice(0, 6);

export default function OnboardingPage() {
  const [step, setStep] = useState<"org" | "goal">("org");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (!data.success) {
      setError(data.error ?? "Failed to create organization");
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep("goal");
  }

  async function saveGoal(firstGoal: string | null) {
    await fetch("/api/onboarding/goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstGoal }),
    });
  }

  async function handleFinish() {
    if (!goal) return;
    setLoading(true);
    await saveGoal(goal);
    const mod = MODULES.find((m) => m.slug === goal);
    const href = mod ? getModuleFirstActionRoute(mod) : "/app";
    router.push(href);
    router.refresh();
  }

  async function handleSkip() {
    setLoading(true);
    await saveGoal(null);
    router.push("/app");
    router.refresh();
  }

  if (step === "goal") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>What do you want to do first?</CardTitle>
              <CardDescription>
                Pick a starting point — you can enable more apps anytime from the sidebar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                {STARTER_GOALS.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <button
                      key={mod.slug}
                      type="button"
                      onClick={() => setGoal(mod.slug)}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                        goal === mod.slug
                          ? "border-accent bg-accent-subtle"
                          : "border-border bg-surface hover:border-accent/50"
                      )}
                    >
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <div>
                        <p className="text-body-sm font-medium text-primary">{mod.name}</p>
                        <p className="text-caption text-secondary">{mod.jobToBeDone}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" disabled={loading} onClick={handleSkip}>
                  Skip for now
                </Button>
                <Button className="flex-1" disabled={!goal || loading} onClick={handleFinish}>
                  {loading ? "Saving…" : "Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create your organization</CardTitle>
            <CardDescription>
              Keelstar is organization-first. Set up your workspace to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Acme Corp"
                  required
                />
              </div>
              {error && <p className="text-body-sm text-error">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating…" : "Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
