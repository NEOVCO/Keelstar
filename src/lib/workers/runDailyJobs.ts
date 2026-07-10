import { expireStaleMagicLinks } from "@/lib/magic-links/revokeMagicLink";
import { runDueMonitors } from "@/lib/monitoring/runMonitors";
import { runModuleMonitors } from "@/lib/workers/runModuleMonitors";
import { runDueReminders } from "@/lib/workers/runDueReminders";

export type DailyJobsResult = {
  cleanup: { expired: number };
  moduleMonitors: Awaited<ReturnType<typeof runModuleMonitors>>;
  genericMonitors: Awaited<ReturnType<typeof runDueMonitors>>;
  reminders: Awaited<ReturnType<typeof runDueReminders>>;
};

/**
 * All scheduled daily maintenance in one run.
 * Order: cleanup → module monitors → generic monitors → vendor/member reminders.
 */
export async function runDailyJobs(): Promise<DailyJobsResult> {
  console.log("[daily] Starting cleanup");
  const expired = await expireStaleMagicLinks();
  console.log(`[daily] Expired ${expired} stale magic links`);

  console.log("[daily] Starting module monitors");
  const moduleMonitors = await runModuleMonitors();

  console.log("[daily] Starting generic monitors");
  const genericMonitors = await runDueMonitors();
  console.log(`[daily] Generic monitors processed=${genericMonitors.processed} failed=${genericMonitors.failed}`);

  console.log("[daily] Starting reminders");
  const reminders = await runDueReminders();

  return {
    cleanup: { expired },
    moduleMonitors,
    genericMonitors,
    reminders,
  };
}
