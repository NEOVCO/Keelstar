import { validateMagicLink, useMagicLink } from "@/lib/magic-links/validateMagicLink";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";
import { rateLimit } from "@/lib/errors/rate-limit";
import { apiSuccess, apiError, handleApiError } from "@/lib/errors/api";
import { type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1),
  taskId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(request, 10, 60_000);
    if (!limit.allowed) return apiError("Too many requests", 429);

    const { token, taskId } = schema.parse(await request.json());
    const result = await validateMagicLink(token);

    if (!result.valid) return apiError("Invalid or expired link", 403);
    if (result.link.taskId !== taskId) return apiError("Task mismatch", 403);

    const supabase = createServiceClient();

    await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        completed_by_type: "external",
        completed_by_id: result.link.externalParticipantId,
      })
      .eq("id", taskId)
      .eq("organization_id", result.link.organizationId);

    await useMagicLink(result.link.id);

    await createAuditLog({
      organizationId: result.link.organizationId,
      actorType: "external",
      actorId: result.link.externalParticipantId,
      action: "task.completed",
      targetType: "task",
      targetId: taskId,
    });

    return apiSuccess({ completed: true });
  } catch (err) {
    return handleApiError(err);
  }
}
