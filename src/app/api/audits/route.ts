import { NextResponse } from "next/server";
import { auditAiSpend } from "@/lib/audit/engine";
import { auditInputSchema } from "@/lib/audit/types";
import { generatePersonalizedSummary } from "@/lib/ai/summary";
import { getServerEnv } from "@/lib/env";
import { saveAuditResult } from "@/lib/storage/audits";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = auditInputSchema.parse(body);
    const result = auditAiSpend(input);
    const summary = await generatePersonalizedSummary({
      auditInput: input,
      auditResult: result,
    });
    const storage = await saveAuditResult(input, result, summary);
    const publicUrl = storage.publicSlug
      ? `${getServerEnv().appUrl}/audit/${storage.publicSlug}`
      : null;

    return NextResponse.json({
      auditId: storage.auditId,
      publicSlug: storage.publicSlug,
      publicUrl,
      result,
      summary,
      storageStatus: storage.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create audit result.",
      },
      { status: 400 },
    );
  }
}
