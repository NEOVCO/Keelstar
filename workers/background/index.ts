import { processNotificationQueue } from "@/lib/workers/processNotificationQueue";
import { processDocumentQueue } from "@/lib/workers/processDocumentQueue";

const POLL_INTERVAL_MS = 30_000;

async function tick(tickNumber: number) {
  const [notify, docs] = await Promise.all([
    processNotificationQueue(),
    // Document queue is lighter; poll every other tick (~60s) to match prior behavior.
    tickNumber % 2 === 0 ? processDocumentQueue() : Promise.resolve({ processed: 0, failed: 0 }),
  ]);

  if (notify.processed || notify.failed) {
    console.log(`[background] notifications processed=${notify.processed} failed=${notify.failed}`);
  }
  if (docs.processed || docs.failed) {
    console.log(`[background] documents processed=${docs.processed} failed=${docs.failed}`);
  }
}

async function run() {
  console.log("[background] Starting unified background worker (notify + documents)");
  let tickNumber = 0;

  while (true) {
    try {
      await tick(tickNumber);
    } catch (err) {
      console.error("[background] Poll error:", err);
    }
    tickNumber += 1;
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

run();
