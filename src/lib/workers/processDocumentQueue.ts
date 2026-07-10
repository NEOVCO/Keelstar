import { createServiceClient } from "@/lib/supabase/service";
import { processDocumentVersion } from "@/lib/documents/extraction";

/** Process pending document extraction jobs (safe to call repeatedly). */
export async function processDocumentQueue(): Promise<{ processed: number; failed: number }> {
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

  let processed = 0;
  let failed = 0;

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
      processed++;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const isFailed = job.attempts + 1 >= job.max_attempts;
      await supabase
        .from("background_jobs")
        .update({
          status: isFailed ? "failed" : "pending",
          error_message: message,
          completed_at: isFailed ? new Date().toISOString() : null,
        })
        .eq("id", job.id);
      failed++;
    }
  }

  return { processed, failed };
}
