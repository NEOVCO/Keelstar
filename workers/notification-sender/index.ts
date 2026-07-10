import { processNotificationQueue } from "@/lib/workers/processNotificationQueue";

const POLL_INTERVAL_MS = 30_000;

async function run() {
  console.log("[notify-worker] Starting notification sender");
  while (true) {
    try {
      const result = await processNotificationQueue();
      if (result.processed || result.failed) {
        console.log(`[notify-worker] processed=${result.processed} failed=${result.failed}`);
      }
    } catch (err) {
      console.error("[notify-worker] Poll error:", err);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

run();
