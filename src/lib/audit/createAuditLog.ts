import { z } from "zod";

export type ActorType = "user" | "external" | "system";

export const auditLogSchema = z.object({
  organizationId: z.string().uuid(),
  actorType: z.enum(["user", "external", "system"]),
  actorId: z.string().uuid().optional(),
  actorEmail: z.string().email().optional().or(z.literal("")),
  action: z.string().min(1),
  targetType: z.string().optional(),
  targetId: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
  correlationId: z.string().uuid().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export type AuditLogInput = z.infer<typeof auditLogSchema>;

export async function createAuditLog(input: AuditLogInput): Promise<string> {
  const validated = auditLogSchema.parse(input);
  const { createServiceClient } = await import("@/lib/supabase/service");
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      organization_id: validated.organizationId,
      actor_type: validated.actorType,
      actor_id: validated.actorId ?? null,
      actor_email: validated.actorEmail || null,
      action: validated.action,
      target_type: validated.targetType ?? null,
      target_id: validated.targetId ?? null,
      metadata: validated.metadata ?? {},
      correlation_id: validated.correlationId ?? null,
      ip_address: validated.ipAddress ?? null,
      user_agent: validated.userAgent ?? null,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create audit log: ${error.message}`);
  return data.id;
}

export type AuditHandlerResult = {
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

export async function withAudit<T>(
  action: string,
  ctx: {
    organizationId: string;
    actorType: ActorType;
    actorId?: string;
    actorEmail?: string;
    correlationId?: string;
    ipAddress?: string;
    userAgent?: string;
  },
  handler: () => Promise<{ result: T; audit?: AuditHandlerResult }>
): Promise<T> {
  const { result, audit } = await handler();

  await createAuditLog({
    organizationId: ctx.organizationId,
    actorType: ctx.actorType,
    actorId: ctx.actorId,
    actorEmail: ctx.actorEmail,
    action,
    targetType: audit?.targetType,
    targetId: audit?.targetId,
    metadata: audit?.metadata,
    correlationId: ctx.correlationId,
    ipAddress: ctx.ipAddress,
    userAgent: ctx.userAgent,
  });

  return result;
}
