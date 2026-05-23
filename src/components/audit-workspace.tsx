"use client";

import { useEffect, useMemo, useState } from "react";
import { auditAiSpend } from "@/lib/audit/engine";
import type { AuditInput, AuditResult } from "@/lib/audit/types";
import { PRICING_PLANS, type ToolName, type UseCase } from "@/lib/pricing";

type ToolDraft = {
  id: string;
  toolName: ToolName;
  planName: string;
  monthlySpend: string;
  seats: string;
  teamSize: string;
  primaryUseCase: UseCase;
};

type DraftState = {
  tools: ToolDraft[];
};

const STORAGE_KEY = "aibillfix:audit-draft:v1";
const supportedTools = Array.from(
  new Set(PRICING_PLANS.map((plan) => plan.toolName)),
) as ToolName[];
const useCases: UseCase[] = ["coding", "writing", "data", "research", "mixed"];

const defaultDraft: DraftState = {
  tools: [
    {
      id: "tool-1",
      toolName: "Cursor",
      planName: "Pro",
      monthlySpend: "20",
      seats: "1",
      teamSize: "3",
      primaryUseCase: "coding",
    },
  ],
};

export function AuditWorkspace() {
  const [draft, setDraft] = useState<DraftState>(defaultDraft);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedDraft = window.localStorage.getItem(STORAGE_KEY);

      if (savedDraft) {
        try {
          setDraft(normalizeDraft(JSON.parse(savedDraft)));
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      setHasLoadedDraft(true);
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, hasLoadedDraft]);

  const totalEnteredSpend = useMemo(
    () =>
      draft.tools.reduce(
        (total, tool) => total + parseCurrencyInput(tool.monthlySpend),
        0,
      ),
    [draft.tools],
  );

  function updateTool(toolId: string, update: Partial<ToolDraft>) {
    setAuditResult(null);
    setFormError(null);
    setDraft((currentDraft) => ({
      tools: currentDraft.tools.map((tool) => {
        if (tool.id !== toolId) {
          return tool;
        }

        const nextTool = { ...tool, ...update };

        if (update.toolName) {
          nextTool.planName = getPlansForTool(update.toolName)[0]?.planName ?? "";
        }

        return nextTool;
      }),
    }));
  }

  function addTool() {
    setAuditResult(null);
    setFormError(null);
    setDraft((currentDraft) => ({
      tools: [
        ...currentDraft.tools,
        {
          ...defaultDraft.tools[0],
          id: crypto.randomUUID(),
        },
      ],
    }));
  }

  function removeTool(toolId: string) {
    setAuditResult(null);
    setFormError(null);
    setDraft((currentDraft) => ({
      tools:
        currentDraft.tools.length === 1
          ? currentDraft.tools
          : currentDraft.tools.filter((tool) => tool.id !== toolId),
    }));
  }

  function resetDraft() {
    setDraft(defaultDraft);
    setAuditResult(null);
    setFormError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function runAudit() {
    try {
      const auditInput: AuditInput = {
        tools: draft.tools.map((tool) => ({
          toolName: tool.toolName,
          planName: tool.planName,
          monthlySpend: parseCurrencyInput(tool.monthlySpend),
          seats: parseWholeNumberInput(tool.seats),
          teamSize: parseWholeNumberInput(tool.teamSize),
          primaryUseCase: tool.primaryUseCase,
        })),
      };

      setAuditResult(auditAiSpend(auditInput));
      setFormError(null);
    } catch {
      setAuditResult(null);
      setFormError("Check each tool, plan, spend, seats, and team size.");
    }
  }

  return (
    <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)]">
      <section className="space-y-6">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#a4472a]">
            Free AI spend audit
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-normal text-[#17211c] sm:text-5xl">
            Find waste in your AI stack before it becomes monthly burn.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#4b5c51]">
            Enter your tools, plans, monthly spend, seats, team size, and main
            use case. AIBillFIX uses deterministic rules to estimate practical
            savings.
          </p>
        </div>

        <section className="rounded-lg border border-[#d8dfd2] bg-white p-4 shadow-[0_18px_55px_rgba(23,33,28,0.08)] sm:p-5">
          <div className="flex flex-col gap-3 border-b border-[#e4eadf] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI tools</h2>
              <p className="mt-1 text-sm text-[#64766b]">
                Draft saves automatically in this browser.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-md border border-[#b9c3b1] px-3 py-2 text-sm font-semibold text-[#17211c] transition hover:bg-[#f8faf6]"
                onClick={resetDraft}
                type="button"
              >
                Reset
              </button>
              <button
                className="rounded-md bg-[#17211c] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#2d3a33]"
                onClick={addTool}
                type="button"
              >
                Add tool
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {draft.tools.map((tool, index) => (
              <ToolRow
                index={index}
                key={tool.id}
                onRemove={() => removeTool(tool.id)}
                onUpdate={(update) => updateTool(tool.id, update)}
                tool={tool}
              />
            ))}
          </div>

          {formError ? (
            <p className="mt-4 rounded-md bg-[#fff3ed] p-3 text-sm font-medium text-[#a4472a]">
              {formError}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 border-t border-[#e4eadf] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#64766b]">
              Entered monthly spend:{" "}
              <span className="font-semibold text-[#17211c]">
                {formatCurrency(totalEnteredSpend)}
              </span>
            </p>
            <button
              className="rounded-md bg-[#176b4d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12563d]"
              onClick={runAudit}
              type="button"
            >
              Run audit
            </button>
          </div>
        </section>
      </section>

      <ResultsPanel result={auditResult} />
    </div>
  );
}

function ToolRow({
  index,
  onRemove,
  onUpdate,
  tool,
}: {
  index: number;
  onRemove: () => void;
  onUpdate: (update: Partial<ToolDraft>) => void;
  tool: ToolDraft;
}) {
  const planOptions = getPlansForTool(tool.toolName);

  return (
    <article className="rounded-lg border border-[#e4eadf] bg-[#fbfcfa] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#17211c]">
          Tool {index + 1}
        </h3>
        <button
          className="rounded-md border border-[#d8dfd2] px-3 py-1.5 text-sm font-medium text-[#64766b] transition hover:bg-white"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="grid gap-1.5 text-sm font-medium">
          Tool name
          <select
            className="h-11 rounded-md border border-[#b9c3b1] bg-white px-3 text-sm text-[#17211c] outline-none transition focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/20"
            onChange={(event) =>
              onUpdate({ toolName: event.target.value as ToolName })
            }
            value={tool.toolName}
          >
            {supportedTools.map((toolName) => (
              <option key={toolName} value={toolName}>
                {toolName}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          Plan
          <select
            className="h-11 rounded-md border border-[#b9c3b1] bg-white px-3 text-sm text-[#17211c] outline-none transition focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/20"
            onChange={(event) => onUpdate({ planName: event.target.value })}
            value={tool.planName}
          >
            {planOptions.map((plan) => (
              <option key={plan.planName} value={plan.planName}>
                {plan.planName}
              </option>
            ))}
          </select>
        </label>

        <NumberField
          label="Monthly spend"
          min="0"
          onChange={(monthlySpend) => onUpdate({ monthlySpend })}
          prefix="$"
          value={tool.monthlySpend}
        />

        <NumberField
          label="Seats"
          min="0"
          onChange={(seats) => onUpdate({ seats })}
          value={tool.seats}
        />

        <NumberField
          label="Team size"
          min="1"
          onChange={(teamSize) => onUpdate({ teamSize })}
          value={tool.teamSize}
        />

        <label className="grid gap-1.5 text-sm font-medium">
          Primary use case
          <select
            className="h-11 rounded-md border border-[#b9c3b1] bg-white px-3 text-sm capitalize text-[#17211c] outline-none transition focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/20"
            onChange={(event) =>
              onUpdate({ primaryUseCase: event.target.value as UseCase })
            }
            value={tool.primaryUseCase}
          >
            {useCases.map((useCase) => (
              <option className="capitalize" key={useCase} value={useCase}>
                {useCase}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  );
}

function NumberField({
  label,
  min,
  onChange,
  prefix,
  value,
}: {
  label: string;
  min: string;
  onChange: (value: string) => void;
  prefix?: string;
  value: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <span className="flex h-11 overflow-hidden rounded-md border border-[#b9c3b1] bg-white focus-within:border-[#176b4d] focus-within:ring-2 focus-within:ring-[#176b4d]/20">
        {prefix ? (
          <span className="flex items-center border-r border-[#d8dfd2] px-3 text-[#64766b]">
            {prefix}
          </span>
        ) : null}
        <input
          className="min-w-0 flex-1 px-3 text-sm text-[#17211c] outline-none"
          inputMode="decimal"
          min={min}
          onChange={(event) => onChange(event.target.value)}
          type="number"
          value={value}
        />
      </span>
    </label>
  );
}

function ResultsPanel({ result }: { result: AuditResult | null }) {
  if (!result) {
    return (
      <aside className="rounded-lg border border-[#d8dfd2] bg-white p-5 shadow-[0_18px_55px_rgba(23,33,28,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a4472a]">
          Audit results
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight">
          Add your tools and run the audit.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#64766b]">
          Results will show monthly savings, annual savings, current spend,
          optimized spend, and per-tool recommendations.
        </p>
      </aside>
    );
  }

  return (
    <aside className="space-y-4 rounded-lg border border-[#d8dfd2] bg-white p-5 shadow-[0_18px_55px_rgba(23,33,28,0.08)]">
      <section className="rounded-lg bg-[#17211c] p-5 text-white">
        <p className="text-sm font-medium text-[#c8d4ca]">
          Estimated monthly savings
        </p>
        <p className="mt-2 text-5xl font-semibold">
          {formatCurrency(result.monthlySavings)}
        </p>
        <p className="mt-3 text-sm leading-6 text-[#dfe7df]">
          {result.statusMessage}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Metric label="Annual savings" value={formatCurrency(result.annualSavings)} />
        <Metric
          label="Current monthly spend"
          value={formatCurrency(result.currentMonthlySpend)}
        />
        <Metric
          label="Optimized monthly spend"
          value={formatCurrency(result.optimizedMonthlySpend)}
        />
        <Metric label="Tools audited" value={String(result.tools.length)} />
      </section>

      {result.showCredexCta ? (
        <section className="rounded-lg border border-[#ffcaa8] bg-[#fff3ed] p-4">
          <h2 className="text-base font-semibold text-[#a4472a]">
            Credex consultation recommended
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6c4b3d]">
            Savings are above $500/month, so credits, consolidation, or
            negotiated plans may be worth a deeper review.
          </p>
          <a
            className="mt-4 inline-flex rounded-md bg-[#a4472a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#873821]"
            href="mailto:hello@credex.example"
          >
            Talk to Credex
          </a>
        </section>
      ) : null}

      {result.showEfficientStackMessage ? (
        <section className="rounded-lg border border-[#d8dfd2] bg-[#f8faf6] p-4">
          <h2 className="text-base font-semibold">Efficient stack</h2>
          <p className="mt-2 text-sm leading-6 text-[#64766b]">
            Savings are below $100/month. A notify-me signup will be connected
            after backend lead capture is added.
          </p>
        </section>
      ) : null}

      <section>
        <h2 className="text-base font-semibold">Per-tool breakdown</h2>
        <div className="mt-3 space-y-3">
          {result.recommendations.map((recommendation, index) => (
            <article
              className="rounded-lg border border-[#e4eadf] p-4"
              key={`${recommendation.toolName}-${recommendation.planName}-${index}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    {recommendation.toolName} {recommendation.planName}
                  </h3>
                  <p className="mt-1 text-sm text-[#64766b]">
                    {formatCurrency(recommendation.currentMonthlySpend)} to{" "}
                    {formatCurrency(recommendation.recommendedMonthlySpend)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#176b4d]">
                  {formatCurrency(recommendation.monthlySavings)}
                </p>
              </div>
              <p className="mt-3 text-sm font-medium text-[#17211c]">
                {recommendation.action}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#64766b]">
                {recommendation.reason}
              </p>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#e4eadf] p-3">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#64766b]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[#17211c]">{value}</p>
    </div>
  );
}

function getPlansForTool(toolName: ToolName) {
  return PRICING_PLANS.filter((plan) => plan.toolName === toolName);
}

function normalizeDraft(rawDraft: unknown): DraftState {
  if (!rawDraft || typeof rawDraft !== "object" || !("tools" in rawDraft)) {
    return defaultDraft;
  }

  const tools = Array.isArray(rawDraft.tools)
    ? rawDraft.tools.map((tool, index) => normalizeToolDraft(tool, index))
    : defaultDraft.tools;

  return {
    tools: tools.length > 0 ? tools : defaultDraft.tools,
  };
}

function normalizeToolDraft(rawTool: unknown, index: number): ToolDraft {
  const fallback = {
    ...defaultDraft.tools[0],
    id: `tool-${index + 1}`,
  };

  if (!rawTool || typeof rawTool !== "object") {
    return fallback;
  }

  const tool = rawTool as Partial<ToolDraft>;
  const toolName = supportedTools.includes(tool.toolName as ToolName)
    ? (tool.toolName as ToolName)
    : fallback.toolName;
  const plans = getPlansForTool(toolName);
  const planName = plans.some((plan) => plan.planName === tool.planName)
    ? String(tool.planName)
    : plans[0]?.planName ?? fallback.planName;

  return {
    id: typeof tool.id === "string" ? tool.id : fallback.id,
    toolName,
    planName,
    monthlySpend:
      typeof tool.monthlySpend === "string"
        ? tool.monthlySpend
        : fallback.monthlySpend,
    seats: typeof tool.seats === "string" ? tool.seats : fallback.seats,
    teamSize:
      typeof tool.teamSize === "string" ? tool.teamSize : fallback.teamSize,
    primaryUseCase: useCases.includes(tool.primaryUseCase as UseCase)
      ? (tool.primaryUseCase as UseCase)
      : fallback.primaryUseCase,
  };
}

function parseCurrencyInput(value: string): number {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : 0;
}

function parseWholeNumberInput(value: string): number {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? Math.max(0, Math.floor(parsedValue)) : 0;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
