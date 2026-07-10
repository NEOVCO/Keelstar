import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireOrganization, getUserOrganizationsList } from "@/lib/tenant/context";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { AuthenticationError, AuthorizationError } from "@/lib/rbac/types";
import { fetchOrgEntitlements, fetchTasks } from "@/lib/app-queries";
import { fetchInAppNotifications } from "@/lib/notifications/inbox";
import { getOrCreateUserProfile } from "@/lib/onboarding/profile";
import { formatRelativeDate } from "@/lib/utils/cn";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/app");
  }

  let ctx;
  try {
    ctx = await requireOrganization();
  } catch (err) {
    if (err instanceof AuthorizationError && err.code === "NO_ORG") {
      redirect("/onboarding");
    }
    if (err instanceof AuthenticationError) {
      redirect("/login?redirect=/app");
    }
    console.error("App layout auth error:", err);
    redirect("/login?error=workspace&redirect=/app");
  }

  const [orgs, entitlements, tasks, profile, inAppNotifications] = await Promise.all([
    getUserOrganizationsList(ctx.user.id),
    fetchOrgEntitlements(ctx.organization.id),
    fetchTasks(ctx.organization.id),
    getOrCreateUserProfile(user.id),
    user.email
      ? fetchInAppNotifications(ctx.organization.id, user.email, 8)
      : Promise.resolve([]),
  ]);

  const taskNotifications = tasks.slice(0, 5).map((t) => ({
    id: `task-${t.id}`,
    title: t.title,
    href: `/app/workflows/${t.workflow_instance_id}`,
    time: t.due_date ? formatRelativeDate(t.due_date) : undefined,
    unread: true,
  }));

  const dbNotifications = inAppNotifications.map((n) => ({
    id: n.id,
    title: n.title,
    href: n.href ?? "/app/inbox",
    time: formatRelativeDate(n.created_at),
    unread: !n.read_at,
  }));

  const notifications = [...dbNotifications, ...taskNotifications].slice(0, 8);

  return (
    <AppShell
      organizationName={ctx.organization.name}
      organizations={orgs.map((o) => ({ id: o.organization.id, name: o.organization.name }))}
      userEmail={user.email}
      notifications={notifications}
      entitlements={Array.from(entitlements)}
      onboardingCompleted={profile.onboarding_completed}
    >
      {children}
    </AppShell>
  );
}
