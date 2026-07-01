import { runDueMonitors } from "@/lib/monitoring/runMonitors";

async function main() {
  console.log("[monitor-worker] Starting daily monitor run");
  const result = await runDueMonitors();
  console.log(`[monitor-worker] Processed: ${result.processed}, Failed: ${result.failed}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[monitor-worker] Fatal error:", err);
  process.exit(1);
});
