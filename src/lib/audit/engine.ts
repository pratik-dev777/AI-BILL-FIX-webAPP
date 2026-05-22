import {
  API_DIRECT_TOOLS,
  findCheaperSameVendorPlan,
  findPricingPlan,
  type PricingPlan,
  type UseCase,
} from "@/lib/pricing";
import {
  auditInputSchema,
  type AuditInput,
  type AuditResult,
  type NormalizedAuditToolInput,
  type ToolRecommendation,
  type UseCaseOverlap,
} from "./types";

const HIGH_API_SPEND_THRESHOLD = 500;
const HIGH_API_SAVINGS_RATE = 0.2;
const RETAIL_CREDITS_THRESHOLD = 300;
const RETAIL_CREDITS_SAVINGS_RATE = 0.15;
const LOW_SAVINGS_THRESHOLD = 100;
const CREDEX_CTA_THRESHOLD = 500;
const SMALL_TEAM_SIZE = 3;

type RecommendationCandidate = Omit<
  ToolRecommendation,
  "annualSavings" | "recommendedMonthlySpend"
>;

export function auditAiSpend(input: AuditInput): AuditResult {
  const parsedInput = auditInputSchema.parse(input);
  const tools = parsedInput.tools;
  const candidateMap = new Map<number, RecommendationCandidate[]>();

  tools.forEach((tool, index) => {
    candidateMap.set(index, buildSingleToolCandidates(tool));
  });

  findDuplicateUseCaseOverlaps(tools).forEach((overlap) => {
    addConsolidationCandidates(overlap, tools, candidateMap);
  });

  const recommendations = tools.map((tool, index) => {
    const candidates = candidateMap.get(index) ?? [];
    const bestCandidate = chooseBestCandidate(tool, candidates);

    return finishRecommendation(bestCandidate);
  });

  const currentMonthlySpend = roundMoney(
    tools.reduce((total, tool) => total + tool.monthlySpend, 0),
  );
  const monthlySavings = roundMoney(
    recommendations.reduce(
      (total, recommendation) => total + recommendation.monthlySavings,
      0,
    ),
  );
  const optimizedMonthlySpend = roundMoney(
    Math.max(0, currentMonthlySpend - monthlySavings),
  );
  const annualSavings = roundMoney(monthlySavings * 12);
  const showCredexCta = monthlySavings > CREDEX_CTA_THRESHOLD;
  const showEfficientStackMessage = monthlySavings < LOW_SAVINGS_THRESHOLD;

  return {
    tools,
    recommendations,
    currentMonthlySpend,
    optimizedMonthlySpend,
    monthlySavings,
    annualSavings,
    statusMessage: buildStatusMessage(monthlySavings),
    showCredexCta,
    showEfficientStackMessage,
  };
}

function buildSingleToolCandidates(
  tool: NormalizedAuditToolInput,
): RecommendationCandidate[] {
  const plan = findPricingPlan(tool.toolName, tool.planName);
  const candidates: RecommendationCandidate[] = [];

  const unusedSeatCandidate = buildUnusedSeatsCandidate(tool, plan);
  if (unusedSeatCandidate) {
    candidates.push(unusedSeatCandidate);
  }

  const downgradeCandidate = buildDowngradeCandidate(tool, plan);
  if (downgradeCandidate) {
    candidates.push(downgradeCandidate);
  }

  const apiCandidate = buildApiCreditsCandidate(tool, plan);
  if (apiCandidate) {
    candidates.push(apiCandidate);
  }

  const retailCandidate = buildRetailCreditsCandidate(tool, plan);
  if (retailCandidate) {
    candidates.push(retailCandidate);
  }

  return candidates;
}

function buildUnusedSeatsCandidate(
  tool: NormalizedAuditToolInput,
  plan: PricingPlan | undefined,
): RecommendationCandidate | undefined {
  if (!plan || plan.billingModel !== "per-seat" || tool.seats <= tool.teamSize) {
    return undefined;
  }

  const unusedSeats = tool.seats - tool.teamSize;
  const estimatedSeatCost = estimateSeatCost(tool, plan);
  const monthlySavings = capSavings(unusedSeats * estimatedSeatCost, tool);

  if (monthlySavings <= 0) {
    return undefined;
  }

  return {
    toolName: tool.toolName,
    planName: tool.planName,
    currentMonthlySpend: tool.monthlySpend,
    monthlySavings,
    action: `Remove ${unusedSeats} unused ${pluralize("seat", unusedSeats)}.`,
    reason: `${tool.toolName} has ${tool.seats} paid seats for a ${tool.teamSize}-person team.`,
    kind: "unused-seats",
  };
}

function buildDowngradeCandidate(
  tool: NormalizedAuditToolInput,
  plan: PricingPlan | undefined,
): RecommendationCandidate | undefined {
  if (
    !plan ||
    plan.level < 2 ||
    tool.teamSize > SMALL_TEAM_SIZE ||
    tool.seats > tool.teamSize
  ) {
    return undefined;
  }

  const cheaperPlan = findCheaperSameVendorPlan(tool.toolName, tool.planName);
  if (!cheaperPlan || cheaperPlan.monthlyUsd === null) {
    return undefined;
  }

  const targetCost = estimatePlanCost(tool, cheaperPlan);
  const monthlySavings = capSavings(tool.monthlySpend - targetCost, tool);

  if (monthlySavings <= 0) {
    return undefined;
  }

  return {
    toolName: tool.toolName,
    planName: tool.planName,
    currentMonthlySpend: tool.monthlySpend,
    monthlySavings,
    action: `Consider ${cheaperPlan.toolName} ${cheaperPlan.planName}.`,
    reason: `${tool.planName} is likely more plan than a ${tool.teamSize}-person team needs.`,
    kind: "downgrade-plan",
  };
}

function buildApiCreditsCandidate(
  tool: NormalizedAuditToolInput,
  plan: PricingPlan | undefined,
): RecommendationCandidate | undefined {
  const isDirectApiTool =
    API_DIRECT_TOOLS.includes(tool.toolName) || plan?.billingModel === "usage";

  if (!isDirectApiTool || tool.monthlySpend < HIGH_API_SPEND_THRESHOLD) {
    return undefined;
  }

  const monthlySavings = capSavings(
    tool.monthlySpend * HIGH_API_SAVINGS_RATE,
    tool,
  );

  return {
    toolName: tool.toolName,
    planName: tool.planName,
    currentMonthlySpend: tool.monthlySpend,
    monthlySavings,
    action: "Review committed-use credits or Credex options.",
    reason: `${tool.toolName} spend is above the $${HIGH_API_SPEND_THRESHOLD}/month API review threshold.`,
    kind: "api-credits",
  };
}

function buildRetailCreditsCandidate(
  tool: NormalizedAuditToolInput,
  plan: PricingPlan | undefined,
): RecommendationCandidate | undefined {
  if (
    !plan ||
    plan.billingModel === "usage" ||
    tool.monthlySpend < RETAIL_CREDITS_THRESHOLD ||
    plan.level < 2
  ) {
    return undefined;
  }

  const monthlySavings = capSavings(
    tool.monthlySpend * RETAIL_CREDITS_SAVINGS_RATE,
    tool,
  );

  return {
    toolName: tool.toolName,
    planName: tool.planName,
    currentMonthlySpend: tool.monthlySpend,
    monthlySavings,
    action: "Check whether credits or a negotiated plan can replace retail spend.",
    reason: `${tool.toolName} is a higher-tier retail subscription with enough spend to review.`,
    kind: "retail-credits",
  };
}

function findDuplicateUseCaseOverlaps(
  tools: NormalizedAuditToolInput[],
): UseCaseOverlap[] {
  const useCases: UseCase[] = ["coding", "writing", "data", "research"];

  return useCases
    .map((useCase) => ({
      useCase,
      toolIndexes: tools
        .map((tool, index) => ({ tool, index }))
        .filter(({ tool }) => toolMatchesUseCase(tool, useCase))
        .map(({ index }) => index),
    }))
    .filter((overlap) => overlap.toolIndexes.length > 1);
}

function addConsolidationCandidates(
  overlap: UseCaseOverlap,
  tools: NormalizedAuditToolInput[],
  candidateMap: Map<number, RecommendationCandidate[]>,
) {
  const sortedIndexes = [...overlap.toolIndexes].sort(
    (leftIndex, rightIndex) =>
      tools[leftIndex].monthlySpend - tools[rightIndex].monthlySpend,
  );
  const keptToolIndex = sortedIndexes[0];

  sortedIndexes.slice(1).forEach((toolIndex) => {
    const tool = tools[toolIndex];
    const keptTool = tools[keptToolIndex];
    const monthlySavings = capSavings(tool.monthlySpend, tool);

    if (monthlySavings <= 0) {
      return;
    }

    candidateMap.get(toolIndex)?.push({
      toolName: tool.toolName,
      planName: tool.planName,
      currentMonthlySpend: tool.monthlySpend,
      monthlySavings,
      action: `Consolidate ${overlap.useCase} work into ${keptTool.toolName}.`,
      reason: `${tool.toolName} overlaps with ${keptTool.toolName} for ${overlap.useCase}.`,
      kind: "consolidate-tools",
    });
  });
}

function chooseBestCandidate(
  tool: NormalizedAuditToolInput,
  candidates: RecommendationCandidate[],
): RecommendationCandidate {
  const bestCandidate = candidates
    .filter((candidate) => candidate.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  if (bestCandidate) {
    return bestCandidate;
  }

  return {
    toolName: tool.toolName,
    planName: tool.planName,
    currentMonthlySpend: tool.monthlySpend,
    monthlySavings: 0,
    action: "Keep current plan for now.",
    reason: "No major savings rule was triggered for this tool.",
    kind: "efficient",
  };
}

function finishRecommendation(
  candidate: RecommendationCandidate,
): ToolRecommendation {
  const monthlySavings = roundMoney(candidate.monthlySavings);
  const currentMonthlySpend = roundMoney(candidate.currentMonthlySpend);

  return {
    ...candidate,
    currentMonthlySpend,
    monthlySavings,
    recommendedMonthlySpend: roundMoney(
      Math.max(0, currentMonthlySpend - monthlySavings),
    ),
    annualSavings: roundMoney(monthlySavings * 12),
  };
}

function estimateSeatCost(
  tool: NormalizedAuditToolInput,
  plan: PricingPlan,
): number {
  if (plan.monthlyUsd !== null && plan.monthlyUsd > 0) {
    return plan.monthlyUsd;
  }

  if (tool.seats > 0) {
    return tool.monthlySpend / tool.seats;
  }

  return 0;
}

function estimatePlanCost(
  tool: NormalizedAuditToolInput,
  plan: PricingPlan,
): number {
  if (plan.monthlyUsd === null) {
    return tool.monthlySpend;
  }

  if (plan.billingModel === "per-seat") {
    return plan.monthlyUsd * Math.max(1, Math.min(tool.seats, tool.teamSize));
  }

  return plan.monthlyUsd;
}

function toolMatchesUseCase(
  tool: NormalizedAuditToolInput,
  useCase: UseCase,
): boolean {
  const plan = findPricingPlan(tool.toolName, tool.planName);

  if (tool.primaryUseCase === useCase) {
    return true;
  }

  if (tool.primaryUseCase !== "mixed") {
    return false;
  }

  return plan?.primaryUseCases.includes(useCase) === true;
}

function capSavings(
  rawMonthlySavings: number,
  tool: NormalizedAuditToolInput,
): number {
  return roundMoney(Math.max(0, Math.min(rawMonthlySavings, tool.monthlySpend)));
}

function buildStatusMessage(monthlySavings: number): string {
  if (monthlySavings < LOW_SAVINGS_THRESHOLD) {
    return "Your AI stack appears efficient. AIBillFIX found only low-confidence savings, so the best next step is to monitor spend instead of forcing cuts.";
  }

  if (monthlySavings > CREDEX_CTA_THRESHOLD) {
    return "AIBillFIX found a meaningful savings opportunity. This stack is large enough to justify a Credex consultation about credits, consolidation, or negotiated plans.";
  }

  return "AIBillFIX found practical savings opportunities without assuming every paid tool is wasteful.";
}

function pluralize(word: string, count: number): string {
  return count === 1 ? word : `${word}s`;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
