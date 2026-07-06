import { z } from "zod";
import { bulkImportScreeningSubjects } from "@/lib/exclusions/bulkImport";
import { parseBulkImportCsv } from "@/lib/exclusions/bulkImportCsv";
import { handleApiError, apiSuccess } from "@/lib/errors/api";

const bodySchema = z.object({
  csv: z.string().optional(),
  rows: z
    .array(
      z.object({
        subject_type: z.enum(["vendor", "person", "organization", "contractor", "employee", "other"]),
        display_name: z.string().min(1),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        organization_name: z.string().optional(),
        npi: z.string().optional(),
        vendor_name: z.string().optional(),
      })
    )
    .optional(),
  importExistingVendors: z.boolean().optional(),
  runScreening: z.boolean().optional().default(false),
  createMonthlyMonitor: z.boolean().optional().default(false),
  sources: z.array(z.enum(["oig", "sam"])).optional(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const rows = body.csv ? parseBulkImportCsv(body.csv) : body.rows;

    const result = await bulkImportScreeningSubjects({
      rows,
      importExistingVendors: body.importExistingVendors,
      runScreening: body.runScreening,
      createMonthlyMonitor: body.createMonthlyMonitor,
      sources: body.sources,
    });

    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}
