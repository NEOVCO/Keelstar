import { runDailyJobs } from "@/lib/workers/runDailyJobs";

async function main() {
  console.log("[daily] Starting daily job bundle");
  const result = await runDailyJobs();
  console.log("[daily] Complete", JSON.stringify({
    cleanup: result.cleanup,
    genericMonitors: result.genericMonitors,
    reminders: result.reminders,
  }));
  process.exit(0);
}

main().catch((err) => {
  console.error("[daily] Fatal error:", err);
  process.exit(1);
});
