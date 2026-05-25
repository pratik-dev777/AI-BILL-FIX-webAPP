import type { AuditInput, AuditResult } from "@/lib/audit/types";
import type { PersonalizedSummary } from "@/lib/ai/summary";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PublicAuditRecord = {
  annualSavings: number;
  createdAt: string;
  currentMonthlySpend: number;
  monthlySavings: number;
  optimizedMonthlySpend: number;
  publicSlug: string;
  result: AuditResult;
  summary: PersonalizedSummary | null;
  tools: AuditInput["tools"];
};

export type SaveAuditOutcome =
  | {
      auditId: string;
      publicSlug: string;
      status: "saved";
    }
  | {
      auditId: null;
      publicSlug: null;
      status: "storage-not-configured";
    };

export type SaveLeadOutcome =
  | {
      leadId: string;
      status: "saved";
    }
  | {
      leadId: null;
      status: "storage-not-configured";
    };

export async function saveAuditResult(
  input: AuditInput,
  result: AuditResult,
  summary?: PersonalizedSummary,
): Promise<SaveAuditOutcome> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return {
      auditId: null,
      publicSlug: null,
      status: "storage-not-configured",
    };
  }

  const publicSlug = crypto.randomUUID();
  const { data, error } = await supabase
    .from("audit_results")
    .insert({
      annual_savings: result.annualSavings,
      current_monthly_spend: result.currentMonthlySpend,
      optimized_monthly_spend: result.optimizedMonthlySpend,
      public_slug: publicSlug,
      monthly_savings: result.monthlySavings,
      result: {
        ...result,
        personalizedSummary: summary ?? null,
      },
      tools: input.tools,
    })
    .select("id, public_slug")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    auditId: data.id,
    publicSlug: data.public_slug,
    status: "saved",
  };
}

export async function getPublicAuditBySlug(
  publicSlug: string,
): Promise<PublicAuditRecord | null> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("audit_results")
    .select(
      "annual_savings, created_at, current_monthly_spend, monthly_savings, optimized_monthly_spend, public_slug, result, tools",
    )
    .eq("public_slug", publicSlug)
    .single();

  if (error || !data) {
    return null;
  }

  const resultWithSummary = data.result as AuditResult & {
    personalizedSummary?: PersonalizedSummary | null;
  };

  return {
    annualSavings: Number(data.annual_savings),
    createdAt: String(data.created_at),
    currentMonthlySpend: Number(data.current_monthly_spend),
    monthlySavings: Number(data.monthly_savings),
    optimizedMonthlySpend: Number(data.optimized_monthly_spend),
    publicSlug: String(data.public_slug),
    result: resultWithSummary,
    summary: resultWithSummary.personalizedSummary ?? null,
    tools: data.tools as AuditInput["tools"],
  };
}

export async function saveLead(input: {
  auditId?: string | null;
  companyName?: string;
  email: string;
  role?: string;
  teamSize?: number | null;
}): Promise<SaveLeadOutcome> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return {
      leadId: null,
      status: "storage-not-configured",
    };
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      audit_id: input.auditId ?? null,
      company_name: emptyToNull(input.companyName),
      email: input.email,
      role: emptyToNull(input.role),
      team_size: input.teamSize ?? null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    leadId: data.id,
    status: "saved",
  };
}

function emptyToNull(value?: string): string | null {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
}
