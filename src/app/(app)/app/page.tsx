import { PageHeader } from "@/components/navigation/Breadcrumbs";
import {
  DashboardAttentionPanel,
  WaitingOnOthersPanel,
  ExpiringSoonPanel,
  RecentActivityTimeline,
  WorkflowOverview,
  SuggestedNextSteps,
} from "@/components/dashboard";
import { EmptyState } from "@/components/empty-states/EmptyState";
import { OnboardingChecklist } from "@/components/onboarding";
import { requireOrganization } from "@/lib/tenant/context";
import {
  fetchDashboardStats,
  fetchWorkflows,
  fetchOrgMembers,
  moduleSlugForType,
} from "@/lib/app-queries";
import { MODULES, getModuleBySlug } from "@/lib/modules/modules";
import { TOUR_TARGETS } from "@/lib/onboarding/constants";
import {
  buildOnboardingChecklist,
  shouldShowOnboardingChecklist,
  parseOrgOnboardingSettings,
  getFirstActionRouteForSlug,
  getGoalModule,
} from "@/lib/onboarding/checklist";

export default async function AppHomePage() {
  const ctx = await requireOrganization();
  const onboardingSettings = parseOrgOnboardingSettings(ctx.organization.settings);
  const goalModule = getGoalModule(onboardingSettings.first_goal);

  const [stats, workflows, members] = await Promise.all([
    fetchDashboardStats(ctx.organization.id),
    fetchWorkflows(ctx.organization.id),
    fetchOrgMembers(ctx.organization.id),
  ]);

  const attention = workflows
    .filter((w) => ["review_needed", "submitted", "overdue", "needs_correction"].includes(w.status))
    .slice(0, 6)
    .map((w) => ({
      id: w.id,
      objectName: w.title,
      status: w.status,
      owner: { id: "o", name: "Team", initials: "T" },
      dueDate: w.due_date ?? w.updated_at,
      action: w.status === "overdue" ? "Resolve" : "Review",
      href: `/app/workflows/${w.id}`,
    }));

  const waiting = workflows
    .filter((w) => ["sent", "opened"].includes(w.status))
    .slice(0, 4)
    .map((w) => ({
      id: w.id,
      who: (w.vendors as { email?: string } | null)?.email ?? "External",
      what: w.title,
      since: new Date(w.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

  const hasReviewableWorkflow = workflows.some((w) =>
    ["review_needed", "submitted", "in_review", "needs_correction"].includes(w.status)
  );
  const hasCompletedWorkflow = workflows.some((w) =>
    ["completed", "approved", "active"].includes(w.status)
  );

  const showChecklist = shouldShowOnboardingChecklist(onboardingSettings, workflows.length);
  const checklistItems = buildOnboardingChecklist({
    settings: onboardingSettings,
    workflowCount: workflows.length,
    hasReviewableWorkflow,
    hasCompletedWorkflow,
    memberCount: members.length,
  });

  if (workflows.length === 0) {
    const firstActionHref = getFirstActionRouteForSlug(onboardingSettings.first_goal);
    const primaryLabel = goalModule?.primaryAction ?? "Add vendor";
    const secondaryLabel = goalModule ? `Open ${goalModule.name}` : "W-9 Collector";
    const secondaryHref = goalModule?.routes.app ?? "/app/apps/w9";

    return (
      <div id={TOUR_TARGETS.dashboardMain}>
        <PageHeader title="Home" description="Set up your workspace." />
        {showChecklist && (
          <OnboardingChecklist items={checklistItems} goalLabel={goalModule?.name} />
        )}
        <EmptyState
          title={goalModule ? `Start with ${goalModule.name}` : "Set up your workspace"}
          description={
            goalModule?.emptyStateDescription ??
            "Upload a document, start a workflow, or send an external request."
          }
          primaryAction={{ label: primaryLabel, href: firstActionHref }}
          secondaryAction={{ label: secondaryLabel, href: secondaryHref }}
        />
      </div>
    );
  }

  const w9 = MODULES.find((m) => m.slug === "w9")!;
  const coi = getModuleBySlug("coi");

  return (
    <div id={TOUR_TARGETS.dashboardMain} className="space-y-8">
      <PageHeader title="Home" description={`Overview for ${ctx.organization.name}.`} />

      {showChecklist && (
        <OnboardingChecklist items={checklistItems} goalLabel={goalModule?.name} />
      )}

      <DashboardAttentionPanel items={attention} />

      <div className="grid gap-6 lg:grid-cols-2">
        <WaitingOnOthersPanel items={waiting} />
        <ExpiringSoonPanel
          items={workflows
            .filter((w) => w.due_date)
            .slice(0, 4)
            .map((w) => ({
              id: w.id,
              name: w.title,
              expires: w.due_date
                ? new Date(w.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "—",
              module: moduleSlugForType(w.type),
            }))}
        />
      </div>

      <WorkflowOverview
        stats={[
          { label: "Active", value: stats.activeWorkflows, href: "/app/workflows" },
          { label: "Open tasks", value: stats.openTasks, href: "/app/inbox" },
          { label: "Review needed", value: stats.reviewDocuments, href: "/app/documents" },
          { label: "Workflows", value: workflows.length, href: "/app/workflows" },
          { label: "Audit", value: stats.recentAudit.length, href: "/app/audit" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivityTimeline
          events={stats.recentAudit.map((e) => ({
            id: e.id,
            actor: e.actor_email ?? "System",
            actorType: "user" as const,
            action: e.action,
            object: e.target_type ?? "—",
            module: "—",
            timestamp: e.created_at,
          }))}
        />
        <SuggestedNextSteps
          suggestions={[
            {
              title: coi?.primaryAction ?? "Upload COI",
              description: coi?.emptyStateDescription ?? "Track insurance certificates.",
              href: coi?.routes.app ?? "/app/apps/coi",
            },
            {
              title: "Review inbox",
              description: `${stats.openTasks} open tasks need attention.`,
              href: "/app/inbox",
            },
            {
              title: w9.primaryAction,
              description: w9.emptyStateDescription,
              href: w9.routes.app,
            },
          ]}
        />
      </div>
    </div>
  );
}
