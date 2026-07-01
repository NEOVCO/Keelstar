import { handleApiError, apiSuccess, apiError } from "@/lib/errors/api";
import { sendVendorPacket } from "@/lib/vendor-packets/createPacket";
import { completeVendorPacket, cancelVendorPacket } from "@/lib/vendor-packets/review";
import { exportVendorPacketEvidence } from "@/lib/vendor-packets/exportEvidence";
import { type NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, ...payload } = await request.json();
    const workflowId = params.id;

    switch (action) {
      case "send":
        return apiSuccess(await sendVendorPacket(workflowId));
      case "complete":
        return apiSuccess(await completeVendorPacket(workflowId));
      case "cancel":
        return apiSuccess(await cancelVendorPacket(workflowId));
      case "export": {
        const csv = await exportVendorPacketEvidence(workflowId);
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="vendor-packet-evidence-${workflowId}.csv"`,
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
