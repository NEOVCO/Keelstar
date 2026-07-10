import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { uploadInvoiceDocument } from "@/lib/invoices/uploadInvoice";
import { saveInvoiceFields } from "@/lib/invoices/saveFields";
import { submitInvoiceForApproval } from "@/lib/invoices/submitForApproval";
import { approveInvoice, rejectInvoice, cancelInvoice } from "@/lib/invoices/review";
import { exportInvoiceEvidence } from "@/lib/invoices/exportEvidence";
import { type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const workflowId = params.id;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) return apiError("File required", 400);
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadInvoiceDocument(workflowId, {
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: buffer.length,
        buffer,
      });
      return apiSuccess(result);
    }

    const { action, ...payload } = await request.json();

    switch (action) {
      case "save_fields":
        return apiSuccess(await saveInvoiceFields({ workflowId, fields: payload.fields ?? {} }));
      case "submit":
        return apiSuccess(await submitInvoiceForApproval(workflowId));
      case "approve":
        return apiSuccess(await approveInvoice(workflowId, payload.notes));
      case "reject":
        return apiSuccess(await rejectInvoice(workflowId, payload.reason));
      case "cancel":
        return apiSuccess(await cancelInvoice(workflowId, payload.reason));
      case "export": {
        const csv = await exportInvoiceEvidence(workflowId);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="invoice-evidence-${workflowId}.csv"`,
          },
        });
      }
      default:
        return apiError("Unknown action", 400);
    }
  } catch (err) {
    return handleApiError(err);
  }
}
