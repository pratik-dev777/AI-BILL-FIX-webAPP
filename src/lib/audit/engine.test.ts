import { describe, expect, it } from "vitest";
import { auditAiSpend } from "./engine";
import type { AuditInput } from "./types";

describe("auditAiSpend", () => {
  it("calculates unused seat savings", () => {
    const result = auditAiSpend({
      tools: [
        tool({
          toolName: "Cursor",
          planName: "Business",
          monthlySpend: 200,
          seats: 5,
          teamSize: 3,
          primaryUseCase: "coding",
        }),
      ],
    });

    expect(result.monthlySavings).toBe(80);
    expect(result.recommendations[0]).toMatchObject({
      kind: "unused-seats",
      monthlySavings: 80,
    });
  });

  it("recommends a downgrade for a small team on an expensive plan", () => {
    const result = auditAiSpend({
      tools: [
        tool({
          toolName: "GitHub Copilot",
          planName: "Enterprise",
          monthlySpend: 117,
          seats: 3,
          teamSize: 3,
          primaryUseCase: "coding",
        }),
      ],
    });

    expect(result.recommendations[0]).toMatchObject({
      kind: "downgrade-plan",
      action: "Consider GitHub Copilot Business.",
      monthlySavings: 60,
    });
  });

  it("recommends consolidation for duplicate coding tools", () => {
    const result = auditAiSpend({
      tools: [
        tool({
          toolName: "GitHub Copilot",
          planName: "Individual",
          monthlySpend: 10,
          seats: 1,
          teamSize: 1,
          primaryUseCase: "coding",
        }),
        tool({
          toolName: "Cursor",
          planName: "Pro",
          monthlySpend: 20,
          seats: 1,
          teamSize: 1,
          primaryUseCase: "coding",
        }),
      ],
    });

    expect(result.monthlySavings).toBe(20);
    expect(result.recommendations[1]).toMatchObject({
      kind: "consolidate-tools",
      monthlySavings: 20,
    });
  });

  it("flags high API spend for credits or Credex review", () => {
    const result = auditAiSpend({
      tools: [
        tool({
          toolName: "OpenAI API direct",
          planName: "API direct",
          monthlySpend: 1000,
          seats: 1,
          teamSize: 5,
          primaryUseCase: "mixed",
        }),
      ],
    });

    expect(result.monthlySavings).toBe(200);
    expect(result.recommendations[0]).toMatchObject({
      kind: "api-credits",
      monthlySavings: 200,
    });
  });

  it("returns an honest efficient-stack message when savings are low", () => {
    const result = auditAiSpend({
      tools: [
        tool({
          toolName: "ChatGPT",
          planName: "Plus",
          monthlySpend: 20,
          seats: 1,
          teamSize: 2,
          primaryUseCase: "writing",
        }),
      ],
    });

    expect(result.monthlySavings).toBe(0);
    expect(result.showEfficientStackMessage).toBe(true);
    expect(result.statusMessage).toContain("appears efficient");
  });

  it("sets annual savings to monthly savings times 12", () => {
    const result = auditAiSpend({
      tools: [
        tool({
          toolName: "Cursor",
          planName: "Business",
          monthlySpend: 200,
          seats: 5,
          teamSize: 3,
          primaryUseCase: "coding",
        }),
      ],
    });

    expect(result.annualSavings).toBe(result.monthlySavings * 12);
  });

  it("aggregates savings across multiple tools", () => {
    const result = auditAiSpend({
      tools: [
        tool({
          toolName: "Cursor",
          planName: "Business",
          monthlySpend: 200,
          seats: 5,
          teamSize: 3,
          primaryUseCase: "coding",
        }),
        tool({
          toolName: "OpenAI API direct",
          planName: "API direct",
          monthlySpend: 1000,
          seats: 1,
          teamSize: 5,
          primaryUseCase: "mixed",
        }),
      ],
    });

    expect(result.monthlySavings).toBe(280);
    expect(result.optimizedMonthlySpend).toBe(920);
  });

  it("handles invalid negative spend safely", () => {
    const result = auditAiSpend({
      tools: [
        tool({
          toolName: "Claude",
          planName: "Pro",
          monthlySpend: -20,
          seats: 1,
          teamSize: 1,
          primaryUseCase: "research",
        }),
      ],
    });

    expect(result.currentMonthlySpend).toBe(0);
    expect(result.monthlySavings).toBe(0);
    expect(result.optimizedMonthlySpend).toBe(0);
  });
});

function tool(overrides: AuditInput["tools"][number]): AuditInput["tools"][number] {
  return overrides;
}
