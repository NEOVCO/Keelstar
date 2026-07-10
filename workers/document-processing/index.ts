import { processDocumentQueue } from "@/lib/workers/processDocumentQueue";

const POLL_INTERVAL_MS = 60_000;

async function run() {
  console.log("[doc-worker] Starting document processing worker");
  while (true) {
    try {
      const result = await processDocumentQueue();
      if (result.processed || result.failed) {
        console.log(`[doc-worker] processed=${result.processed} failed=${result.failed}`);
      }
    } catch (err) {
      console.error("[doc-worker] Poll error:", err);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

run();
