import { Resend } from "resend";
import { getServerEnv, isResendConfigured } from "@/lib/env";
import type { AuditResult } from "@/lib/audit/types";

export type EmailOutcome =
  | {
      status: "sent";
    }
  | {
      status: "email-not-configured";
    };

export async function sendLeadConfirmationEmail(input: {
  auditResult: AuditResult;
  email: string;
  publicUrl?: string | null;
}): Promise<EmailOutcome> {
  const env = getServerEnv();

  if (!isResendConfigured(env)) {
    return {
      status: "email-not-configured",
    };
  }

  const resendApiKey = env.resendApiKey;
  const resendFromEmail = env.resendFromEmail;

  if (!resendApiKey || !resendFromEmail) {
    return {
      status: "email-not-configured",
    };
  }

  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: resendFromEmail,
    to: input.email,
    subject: "Your AIBillFIX AI spend audit",
    text: buildPlainTextEmail(input.auditResult, input.publicUrl),
  });

  return {
    status: "sent",
  };
}

function buildPlainTextEmail(
  auditResult: AuditResult,
  publicUrl?: string | null,
): string {
  const lines = [
    "Thanks for using AIBillFIX.",
    "",
    `Estimated monthly savings: $${auditResult.monthlySavings}`,
    `Estimated annual savings: $${auditResult.annualSavings}`,
    `Current monthly spend: $${auditResult.currentMonthlySpend}`,
    `Optimized monthly spend: $${auditResult.optimizedMonthlySpend}`,
    "",
    auditResult.statusMessage,
  ];

  if (publicUrl) {
    lines.push("", `Public audit URL: ${publicUrl}`);
  }

  lines.push("", "Credex can help review credits, consolidation, and negotiated plans when savings are meaningful.");

  return lines.join("\n");
}
