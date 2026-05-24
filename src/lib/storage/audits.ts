import type { AuditInput, AuditResult } from "@/lib/audit/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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
      result,
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
