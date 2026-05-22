import { z } from "zod";
import { PRICING_PLANS, type ToolName, type UseCase } from "@/lib/pricing";

const supportedToolNames = Array.from(
  new Set(PRICING_PLANS.map((plan) => plan.toolName)),
) as [ToolName, ...ToolName[]];

const supportedPlansByTool = PRICING_PLANS.reduce<Record<string, string[]>>(
  (plans, plan) => {
    plans[plan.toolName] = [...(plans[plan.toolName] ?? []), plan.planName];
    return plans;
  },
  {},
);

export const auditToolInputSchema = z
  .object({
    toolName: z.enum(supportedToolNames),
    planName: z.string().min(1),
    monthlySpend: z.number().finite(),
    seats: z.number().finite(),
    teamSize: z.number().finite(),
    primaryUseCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  })
  .transform((input) => ({
    ...input,
    monthlySpend: Math.max(0, input.monthlySpend),
    seats: Math.max(0, Math.floor(input.seats)),
    teamSize: Math.max(1, Math.floor(input.teamSize)),
  }))
  .superRefine((input, context) => {
    const supportedPlans = supportedPlansByTool[input.toolName] ?? [];

    if (!supportedPlans.includes(input.planName)) {
      context.addIssue({
        code: "custom",
        path: ["planName"],
        message: `${input.planName} is not supported for ${input.toolName}.`,
      });
    }
  });

export const auditInputSchema = z.object({
  tools: z.array(auditToolInputSchema).min(1),
});

export type AuditToolInput = z.input<typeof auditToolInputSchema>;
export type NormalizedAuditToolInput = z.output<typeof auditToolInputSchema>;
export type AuditInput = z.input<typeof auditInputSchema>;

export type RecommendationKind =
  | "unused-seats"
  | "downgrade-plan"
  | "consolidate-tools"
  | "api-credits"
  | "retail-credits"
  | "efficient";

export type ToolRecommendation = {
  toolName: ToolName;
  planName: string;
  currentMonthlySpend: number;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  action: string;
  reason: string;
  kind: RecommendationKind;
};

export type AuditResult = {
  tools: NormalizedAuditToolInput[];
  recommendations: ToolRecommendation[];
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  statusMessage: string;
  showCredexCta: boolean;
  showEfficientStackMessage: boolean;
};

export type UseCaseOverlap = {
  useCase: UseCase;
  toolIndexes: number[];
};
