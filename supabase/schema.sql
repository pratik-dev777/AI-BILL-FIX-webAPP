create extension if not exists pgcrypto;

create table if not exists public.audit_results (
  id uuid primary key default gen_random_uuid(),
  public_slug uuid not null unique,
  tools jsonb not null,
  result jsonb not null,
  current_monthly_spend numeric not null,
  optimized_monthly_spend numeric not null,
  monthly_savings numeric not null,
  annual_savings numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references public.audit_results(id) on delete set null,
  email text not null,
  company_name text,
  role text,
  team_size integer,
  created_at timestamptz not null default now()
);

alter table public.audit_results enable row level security;
alter table public.leads enable row level security;

create policy "Public can read stripped audit results"
  on public.audit_results
  for select
  using (true);

-- No public insert policies are added. The Next.js API uses the service role
-- key on the server, and the service role bypasses RLS.
