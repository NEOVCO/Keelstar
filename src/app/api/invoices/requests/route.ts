import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { createInvoice } from "@/lib/invoices/createInvoice";
import { uploadInvoiceDocument } from "@/lib/invoices/uploadInvoice";
import { submitInvoiceForApproval } from "@/lib/invoices/submitForApproval";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const vendorId = (formData.get("vendorId") as string) || undefined;
      const vendorName = (formData.get("vendorName") as string) || undefined;
      const invoiceNumber = (formData.get("invoiceNumber") as string) || undefined;
      const approverMemberId = formData.get("approverMemberId") as string;
      const approvalDueDate = (formData.get("approvalDueDate") as string) || undefined;
      const submitImmediately = formData.get("submitImmediately") === "true";

      if (!approverMemberId) {
        return apiError("approverMemberId is required", 400);
      }

      const result = await createInvoice({
        vendorId,
        vendorName,
        invoiceNumber,
        approverMemberId,
        approvalDueDate,
      });

      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        await uploadInvoiceDocument(result.workflow.id, {
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: buffer.length,
          buffer,
        });
      }

      if (submitImmediately && file) {
        await submitInvoiceForApproval(result.workflow.id);
      }

      return apiSuccess(result);
    }

    const body = await request.json();
    const { submitImmediately, ...input } = body;
    const result = await createInvoice(input);

    if (submitImmediately) {
      await submitInvoiceForApproval(result.workflow.id);
    }

    return apiSuccess(result);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Usage limit")) {
      return apiError(err.message, 402);
    }
    return handleApiError(err);
  }
}
