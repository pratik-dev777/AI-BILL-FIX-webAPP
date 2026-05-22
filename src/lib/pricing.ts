export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolName =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Anthropic API direct"
  | "OpenAI API direct"
  | "Gemini"
  | "Windsurf";

export type BillingModel = "free" | "per-seat" | "flat" | "usage" | "custom";

export type PricingPlan = {
  toolName: ToolName;
  planName: string;
  monthlyUsd: number | null;
  billingModel: BillingModel;
  level: number;
  primaryUseCases: UseCase[];
  notes: string;
};

export const API_DIRECT_TOOLS: ToolName[] = [
  "Anthropic API direct",
  "OpenAI API direct",
];

export const PRICING_PLANS = [
  {
    toolName: "Cursor",
    planName: "Hobby",
    monthlyUsd: 0,
    billingModel: "free",
    level: 0,
    primaryUseCases: ["coding"],
    notes: "Free starter plan.",
  },
  {
    toolName: "Cursor",
    planName: "Pro",
    monthlyUsd: 20,
    billingModel: "per-seat",
    level: 1,
    primaryUseCases: ["coding"],
    notes: "Public monthly per-user assumption.",
  },
  {
    toolName: "Cursor",
    planName: "Business",
    monthlyUsd: 40,
    billingModel: "per-seat",
    level: 2,
    primaryUseCases: ["coding"],
    notes: "AIBillFIX labels Cursor's team/business tier as Business for the assignment.",
  },
  {
    toolName: "Cursor",
    planName: "Enterprise",
    monthlyUsd: null,
    billingModel: "custom",
    level: 3,
    primaryUseCases: ["coding"],
    notes: "Custom pricing; user-entered spend is used.",
  },
  {
    toolName: "GitHub Copilot",
    planName: "Individual",
    monthlyUsd: 10,
    billingModel: "per-seat",
    level: 1,
    primaryUseCases: ["coding"],
    notes: "Public monthly per-user assumption.",
  },
  {
    toolName: "GitHub Copilot",
    planName: "Business",
    monthlyUsd: 19,
    billingModel: "per-seat",
    level: 2,
    primaryUseCases: ["coding"],
    notes: "Public monthly per-user assumption.",
  },
  {
    toolName: "GitHub Copilot",
    planName: "Enterprise",
    monthlyUsd: 39,
    billingModel: "per-seat",
    level: 3,
    primaryUseCases: ["coding"],
    notes: "Public monthly per-user assumption.",
  },
  {
    toolName: "Claude",
    planName: "Free",
    monthlyUsd: 0,
    billingModel: "free",
    level: 0,
    primaryUseCases: ["writing", "research", "mixed"],
    notes: "Free starter plan.",
  },
  {
    toolName: "Claude",
    planName: "Pro",
    monthlyUsd: 20,
    billingModel: "flat",
    level: 1,
    primaryUseCases: ["writing", "research", "mixed"],
    notes: "Public monthly assumption.",
  },
  {
    toolName: "Claude",
    planName: "Max",
    monthlyUsd: 100,
    billingModel: "flat",
    level: 2,
    primaryUseCases: ["writing", "research", "mixed"],
    notes: "Uses the lower public Max tier for MVP estimates.",
  },
  {
    toolName: "Claude",
    planName: "Team",
    monthlyUsd: 30,
    billingModel: "per-seat",
    level: 2,
    primaryUseCases: ["writing", "research", "mixed"],
    notes: "Public monthly per-user assumption.",
  },
  {
    toolName: "Claude",
    planName: "Enterprise",
    monthlyUsd: null,
    billingModel: "custom",
    level: 3,
    primaryUseCases: ["writing", "research", "mixed"],
    notes: "Custom pricing; user-entered spend is used.",
  },
  {
    toolName: "Claude",
    planName: "API direct",
    monthlyUsd: null,
    billingModel: "usage",
    level: 2,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Usage-based pricing; user-entered spend is used.",
  },
  {
    toolName: "ChatGPT",
    planName: "Plus",
    monthlyUsd: 20,
    billingModel: "flat",
    level: 1,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Public monthly assumption.",
  },
  {
    toolName: "ChatGPT",
    planName: "Team",
    monthlyUsd: 25,
    billingModel: "per-seat",
    level: 2,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Uses the public business/team-style per-user assumption for MVP estimates.",
  },
  {
    toolName: "ChatGPT",
    planName: "Enterprise",
    monthlyUsd: null,
    billingModel: "custom",
    level: 3,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Custom pricing; user-entered spend is used.",
  },
  {
    toolName: "ChatGPT",
    planName: "API direct",
    monthlyUsd: null,
    billingModel: "usage",
    level: 2,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Usage-based pricing; user-entered spend is used.",
  },
  {
    toolName: "Anthropic API direct",
    planName: "API direct",
    monthlyUsd: null,
    billingModel: "usage",
    level: 2,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Usage-based pricing; user-entered spend is used.",
  },
  {
    toolName: "OpenAI API direct",
    planName: "API direct",
    monthlyUsd: null,
    billingModel: "usage",
    level: 2,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Usage-based pricing; user-entered spend is used.",
  },
  {
    toolName: "Gemini",
    planName: "Pro",
    monthlyUsd: 20,
    billingModel: "flat",
    level: 1,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Rounded MVP assumption for Google AI Pro-style subscription.",
  },
  {
    toolName: "Gemini",
    planName: "Ultra",
    monthlyUsd: 100,
    billingModel: "flat",
    level: 2,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Rounded MVP assumption for Google AI Ultra-style subscription.",
  },
  {
    toolName: "Gemini",
    planName: "API",
    monthlyUsd: null,
    billingModel: "usage",
    level: 2,
    primaryUseCases: ["writing", "research", "data", "mixed"],
    notes: "Usage-based pricing; user-entered spend is used.",
  },
  {
    toolName: "Windsurf",
    planName: "Free",
    monthlyUsd: 0,
    billingModel: "free",
    level: 0,
    primaryUseCases: ["coding"],
    notes: "Free starter plan.",
  },
  {
    toolName: "Windsurf",
    planName: "Pro",
    monthlyUsd: 15,
    billingModel: "per-seat",
    level: 1,
    primaryUseCases: ["coding"],
    notes: "Public monthly per-user assumption.",
  },
  {
    toolName: "Windsurf",
    planName: "Teams",
    monthlyUsd: 30,
    billingModel: "per-seat",
    level: 2,
    primaryUseCases: ["coding"],
    notes: "Public monthly per-user assumption.",
  },
  {
    toolName: "Windsurf",
    planName: "Enterprise",
    monthlyUsd: null,
    billingModel: "custom",
    level: 3,
    primaryUseCases: ["coding"],
    notes: "Custom pricing; user-entered spend is used.",
  },
] as const satisfies PricingPlan[];

export function findPricingPlan(
  toolName: ToolName,
  planName: string,
): PricingPlan | undefined {
  return PRICING_PLANS.find(
    (plan) => plan.toolName === toolName && plan.planName === planName,
  );
}

export function findCheaperSameVendorPlan(
  toolName: ToolName,
  currentPlanName: string,
): PricingPlan | undefined {
  const currentPlan = findPricingPlan(toolName, currentPlanName);

  if (!currentPlan) {
    return undefined;
  }

  const cheaperPlans = PRICING_PLANS.filter(
    (plan) =>
      plan.toolName === toolName &&
      plan.monthlyUsd !== null &&
      plan.monthlyUsd > 0 &&
      plan.level < currentPlan.level,
  ) as Array<PricingPlan & { monthlyUsd: number }>;

  return cheaperPlans.sort(
    (a, b) => b.level - a.level || b.monthlyUsd - a.monthlyUsd,
  )[0];
}
