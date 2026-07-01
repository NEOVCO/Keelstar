import { randomBytes, createHash } from "crypto";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuditLog } from "@/lib/audit/createAuditLog";

const createMagicLinkSchema = z.object({
  organizationId: z.string().uuid(),
  externalParticipantId: z.string().uuid(),
  workflowInstanceId: z.string().uuid(),
  taskId: z.string().uuid(),
  purpose: z.string().min(1),
  expiresInDays: z.number().min(1).max(90).default(7),
  maxUses: z.number().min(1).max(100).default(1),
  createdBy: z.string().uuid(),
});

export type CreateMagicLinkInput = z.infer<typeof createMagicLinkSchema>;

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createMagicLink(
  input: CreateMagicLinkInput
): Promise<{ id: string; token: string; url: string }> {
  const validated = createMagicLinkSchema.parse(input);
  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + validated.expiresInDays);

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("magic_links")
    .insert({
      organization_id: validated.organizationId,
      external_participant_id: validated.externalParticipantId,
      workflow_instance_id: validated.workflowInstanceId,
      task_id: validated.taskId,
      token_hash: tokenHash,
      purpose: validated.purpose,
      expires_at: expiresAt.toISOString(),
      max_uses: validated.maxUses,
      created_by: validated.createdBy,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create magic link: ${error.message}`);

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const url = `${appUrl}/external/${rawToken}`;

  await createAuditLog({
    organizationId: validated.organizationId,
    actorType: "user",
    actorId: validated.createdBy,
    action: "magic_link.created",
    targetType: "magic_link",
    targetId: data.id,
    metadata: {
      purpose: validated.purpose,
      taskId: validated.taskId,
      expiresAt: expiresAt.toISOString(),
    },
  });

  return { id: data.id, token: rawToken, url };
}
