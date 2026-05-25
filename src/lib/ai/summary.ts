import type { AuditInput, AuditResult } from "@/lib/audit/types";
import { getServerEnv, isAnthropicConfigured } from "@/lib/env";

export type SummarySource = "anthropic" | "fallback";

export type PersonalizedSummary = {
  source: SummarySource;
  text: string;
};

const ANTHROPIC_MODEL = "claude-3-5-haiku-latest";

export async function generatePersonalizedSummary(input: {
  auditInput: AuditInput;
  auditResult: AuditResult;
}): Promise<PersonalizedSummary> {
  const env = getServerEnv();

  if (!isAnthropicConfigured(env) || !env.anthropicApiKey) {
    return buildFallbackSummary(input.auditResult);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      body: JSON.stringify({
        max_tokens: 180,
        messages: [
          {
            content: buildSummaryPrompt(input),
            role: "user",
          },
        ],
        model: ANTHROPIC_MODEL,
      }),
      headers: {
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "x-api-key": env.anthropicApiKey,
      },
      method: "POST",
    });

    if (!response.ok) {
      return buildFallbackSummary(input.auditResult);
    }

    const data = (await response.json()) as {
      content?: Array<{
        text?: string;
        type?: string;
      }>;
    };
    const text = data.content?.find((item) => item.type === "text")?.text;

    if (!text) {
      return buildFallbackSummary(input.auditResult);
    }

    return {
      source: "anthropic",
      text: trimSummary(text),
    };
  } catch {
    return buildFallbackSummary(input.auditResult);
  }
}

export function buildFallbackSummary(
  auditResult: AuditResult,
): PersonalizedSummary {
  const topRecommendation =
    auditResult.recommendations.find(
      (recommendation) => recommendation.monthlySavings > 0,
    ) ?? auditResult.recommendations[0];

  if (auditResult.monthlySavings < 100) {
    return {
      source: "fallback",
      text: `AIBillFIX found a lean AI stack with only ${formatUsd(
        auditResult.monthlySavings,
      )} in estimated monthly savings. Current spend is ${formatUsd(
        auditResult.currentMonthlySpend,
      )}, and the optimized estimate is ${formatUsd(
        auditResult.optimizedMonthlySpend,
      )}. The best move is to monitor usage instead of forcing cuts. Keep reviewing seats, direct API usage, and overlapping subscriptions as the team grows.`,
    };
  }

  return {
    source: "fallback",
    text: `AIBillFIX estimates ${formatUsd(
      auditResult.monthlySavings,
    )} in monthly savings, or ${formatUsd(
      auditResult.annualSavings,
    )} per year. Current monthly spend is ${formatUsd(
      auditResult.currentMonthlySpend,
    )}, with an optimized estimate of ${formatUsd(
      auditResult.optimizedMonthlySpend,
    )}. The clearest next step is: ${topRecommendation.action} ${
      topRecommendation.reason
    } Use these numbers as a practical starting point before changing vendor contracts.`,
  };
}

function buildSummaryPrompt(input: {
  auditInput: AuditInput;
  auditResult: AuditResult;
}): string {
  return `You are writing a concise AI spend audit summary for a startup founder.

Rules:
- Write about 100 words.
- Do not calculate new savings.
- Use only the deterministic numbers provided.
- Be practical, honest, and specific.
- If savings are low, say the stack appears efficient.
- If monthly savings exceed $500, mention that a Credex consultation may be worthwhile.
- Do not mention internal implementation details.

Audit input:
${JSON.stringify(input.auditInput, null, 2)}

Deterministic audit result:
${JSON.stringify(input.auditResult, null, 2)}
`;
}

function trimSummary(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
