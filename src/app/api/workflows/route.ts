import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/tenant/context";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createWorkflow, listWorkflows } from "@/lib/workflow/createWorkflow";
import { apiSuccess, handleApiError } from "@/lib/errors/api";

export async function GET() {
  try {
    const ctx = await requirePermission(PERMISSIONS.WORKFLOWS_VIEW);
    const workflows = await listWorkflows(ctx.organization.id);
    return apiSuccess({ workflows });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createWorkflow(body);
    return apiSuccess(result, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
