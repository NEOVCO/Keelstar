import { getModuleBySlug, MODULES } from "@/lib/modules/modules";
import {
  getFirstActionRouteForSlug,
  getGoalModule,
  parseOrgOnboardingSettings,
  type OrgOnboardingSettings,
} from "@/lib/onboarding/org-settings";
import type { ChecklistItem } from "@/components/onboarding/OnboardingChecklist";

type ChecklistInput = {
  settings: OrgOnboardingSettings;
  workflowCount: number;
  hasReviewableWorkflow: boolean;
  hasCompletedWorkflow: boolean;
  memberCount: number;
};

export function buildOnboardingChecklist(input: ChecklistInput): ChecklistItem[] {
  const goal = getGoalModule(input.settings.first_goal);
  const firstActionHref = getFirstActionRouteForSlug(input.settings.first_goal);
  const exploreHref = goal?.crossSell[0]
    ? getModuleBySlug(goal.crossSell[0])?.routes.app ?? "/app"
    : MODULES.find((m) => m.slug !== goal?.slug && m.status === "active")?.routes.app ?? "/app";

  return [
    {
      id: "first_action",
      label: goal ? goal.primaryAction : "Start your first workflow",
      href: firstActionHref,
      done: input.workflowCount > 0,
    },
    {
      id: "review",
      label: "Review a submission",
      href: "/app/inbox",
      done: input.hasReviewableWorkflow || input.hasCompletedWorkflow,
    },
    {
      id: "invite",
      label: "Invite a teammate",
      href: "/app/settings/members",
      done: input.memberCount > 1,
    },
    {
      id: "explore",
      label: "Explore another app",
      href: exploreHref,
      done: false,
    },
  ];
}

export function shouldShowOnboardingChecklist(
  settings: OrgOnboardingSettings,
  workflowCount: number
): boolean {
  if (settings.checklist_dismissed) return false;
  return workflowCount < 3;
}

export { parseOrgOnboardingSettings, getFirstActionRouteForSlug, getGoalModule };
