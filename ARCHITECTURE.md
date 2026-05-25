# Architecture

## Phase 5 Snapshot

AIBillFIX currently contains:

- A Next.js App Router frontend shell.
- A client-side audit workspace with a multi-tool form.
- Browser `localStorage` draft persistence.
- A documented pricing data module.
- A deterministic audit engine.
- A results panel with summary metrics and per-tool recommendations.
- Server API route for saving audits.
- Server API route for post-result lead capture.
- Supabase storage helpers and schema SQL.
- Resend transactional email helper.
- Honeypot abuse protection for lead capture.
- Anthropic-compatible summary provider with deterministic fallback.
- Public audit route at `/audit/[slug]`.
- Open Graph and Twitter metadata for public audit pages.
- Automated tests for the audit engine.

## Current Code Structure

- `src/app`: app layout and homepage route.
- `src/app/api/audits/route.ts`: validates audit input, recalculates results on the server, and saves the audit when Supabase is configured.
- `src/app/api/leads/route.ts`: validates post-result lead capture, rejects non-empty honeypot submissions, saves the lead, and sends email when configured.
- `src/app/audit/[slug]/page.tsx`: public stripped audit page and social metadata.
- `src/components/audit-workspace.tsx`: form state, localStorage persistence, audit trigger, and results UI.
- `src/lib/ai/summary.ts`: replaceable summary provider with Anthropic and fallback paths.
- `src/lib/env.ts`: server environment variable access.
- `src/lib/supabase/server.ts`: Supabase server client.
- `src/lib/storage/audits.ts`: audit and lead persistence helpers.
- `src/lib/email/resend.ts`: transactional email helper.
- `src/lib/pricing.ts`: supported tools, plans, pricing assumptions, and pricing helpers.
- `src/lib/audit/types.ts`: Zod schemas and TypeScript types for audit input/output.
- `src/lib/audit/engine.ts`: deterministic savings rules.
- `src/lib/audit/engine.test.ts`: Vitest tests for the audit engine.

## Planned Data Flow

1. User enters AI tools and team details.
2. The browser saves the draft to `localStorage`.
3. The UI converts form strings into an `AuditInput`.
4. Zod validates and normalizes input.
5. Deterministic audit engine calculates savings.
6. Results panel shows savings and recommendations.
7. Summary provider tries Anthropic when configured and falls back to a deterministic template.
8. API route saves the audit and summary if Supabase environment variables are configured.
9. Lead capture appears only after results.
10. Lead API validates the honeypot, stores lead details if Supabase is configured, and sends email if Resend is configured.
11. Public audit page shows tools, savings, recommendations, and summary without email/company/role data.

## Phase 5 Rule

The audit engine does not use AI to calculate savings. AI summaries explain deterministic results only and must not create new math.

## Abuse Protection

Phase 4 uses a honeypot field as the first lead-capture field. Real users never see it. Basic bots often fill every input, and the API rejects submissions where the honeypot is non-empty. Rate limiting is planned as a later hardening step.
