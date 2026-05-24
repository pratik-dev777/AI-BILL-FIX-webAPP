import { NextResponse } from "next/server";
import { z } from "zod";
import { auditInputSchema } from "@/lib/audit/types";
import { getServerEnv } from "@/lib/env";
import { sendLeadConfirmationEmail } from "@/lib/email/resend";
import { saveLead } from "@/lib/storage/audits";
import { auditAiSpend } from "@/lib/audit/engine";

const leadCaptureSchema = z.object({
  auditId: z.string().uuid().nullable().optional(),
  auditInput: auditInputSchema,
  companyName: z.string().max(120).optional(),
  email: z.email(),
  honeypot: z.string().max(0),
  publicSlug: z.string().uuid().nullable().optional(),
  role: z.string().max(120).optional(),
  teamSize: z.number().finite().min(1).max(10000).nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = leadCaptureSchema.parse(body);
    const auditResult = auditAiSpend(input.auditInput);
    const lead = await saveLead({
      auditId: input.auditId ?? null,
      companyName: input.companyName,
      email: input.email,
      role: input.role,
      teamSize: input.teamSize ?? null,
    });
    const publicUrl = input.publicSlug
      ? `${getServerEnv().appUrl}/audit/${input.publicSlug}`
      : null;
    const email = await sendLeadConfirmationEmail({
      auditResult,
      email: input.email,
      publicUrl,
    });

    return NextResponse.json({
      emailStatus: email.status,
      leadId: lead.leadId,
      storageStatus: lead.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to capture lead.",
      },
      { status: 400 },
    );
  }
}
