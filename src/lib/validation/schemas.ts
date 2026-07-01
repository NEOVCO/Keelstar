import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  roleKey: z.enum(["admin", "manager", "member", "viewer"]),
});

export const createWorkflowSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1).max(200),
  dueDate: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const uploadDocumentSchema = z.object({
  title: z.string().min(1).max(200),
  documentType: z.string().optional(),
});

export const completeTaskSchema = z.object({
  taskId: z.string().uuid(),
  metadata: z.record(z.unknown()).optional(),
});

export const createMonitorSchema = z.object({
  name: z.string().min(1).max(200),
  monitorType: z.string().min(1),
  targetType: z.string().optional(),
  targetId: z.string().uuid().optional(),
  config: z.record(z.unknown()).optional(),
});

export const switchOrganizationSchema = z.object({
  organizationId: z.string().uuid(),
});
