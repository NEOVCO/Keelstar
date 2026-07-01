import { createServiceClient } from "@/lib/supabase/service";
import { processDocumentVersion } from "@/lib/documents/extraction";

const POLL_INTERVAL_MS = 60_000;

async function processJobs() {
  const supabase = createServiceClient();

  const { data: jobs } = await supabase
    .from("background_jobs")
    .select("*")
    .eq("job_type", "document_processing")
    .eq("status", "pending")
    .lte("scheduled_at", new Date().toISOString())
    .order("priority", { ascending: false })
    .order("scheduled_at", { ascending: true })
    .limit(10);

  for (const job of jobs ?? []) {
    const payload = job.payload as { documentVersionId?: string };
    if (!payload.documentVersionId) continue;

    await supabase
      .from("background_jobs")
      .update({ status: "processing", started_at: new Date().toISOString(), attempts: job.attempts + 1 })
      .eq("id", job.id);

    try {
      await processDocumentVersion(payload.documentVersionId);
      await supabase
        .from("background_jobs")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", job.id);
      console.log(`[doc-worker] Processed document version ${payload.documentVersionId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const failed = job.attempts + 1 >= job.max_attempts;
      await supabase
        .from("background_jobs")
        .update({
          status: failed ? "failed" : "pending",
          error_message: message,
          completed_at: failed ? new Date().toISOString() : null,
        })
        .eq("id", job.id);
      console.error(`[doc-worker] Failed: ${message}`);
    }
  }
}

async function run() {
  console.log("[doc-worker] Starting document processing worker");
  while (true) {
    try {
      await processJobs();
    } catch (err) {
      console.error("[doc-worker] Poll error:", err);
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
}

run();
