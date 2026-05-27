# Interview Guide

## One-Minute Explanation

AIBillFIX is a full-stack AI spend audit app for startups. A user enters AI tools, plans, monthly spend, seats, team size, and use case. The app uses deterministic rules to calculate savings, shows per-tool recommendations, saves audits and leads through Supabase when configured, sends a Resend email when configured, generates an AI summary with deterministic fallback, and creates public audit URLs that strip identifying lead data.

## What To Emphasize

- The audit math is deterministic, not AI-generated.
- Pricing assumptions live in `src/lib/pricing.ts` and are documented in `PRICING_DATA.md`.
- Zod validates and normalizes audit input.
- Client-side form state persists in `localStorage`.
- Server routes recalculate audit results before saving.
- Lead capture appears only after results.
- Honeypot abuse protection blocks simple bot submissions.
- Anthropic only summarizes existing results; fallback summaries keep the app working without an API key.
- Public audit pages hide email, company name, and role.
- CI runs lint and tests on `main`.

## Key Files To Know

- `src/components/audit-workspace.tsx`: form, localStorage, results UI, lead capture.
- `src/lib/audit/engine.ts`: deterministic savings rules.
- `src/lib/audit/types.ts`: Zod schemas and TypeScript types.
- `src/lib/pricing.ts`: supported tools and pricing assumptions.
- `src/app/api/audits/route.ts`: server-side audit validation, recalculation, summary, and save.
- `src/app/api/leads/route.ts`: post-result lead capture, honeypot, storage, and email.
- `src/lib/ai/summary.ts`: Anthropic wrapper and fallback summary.
- `src/app/audit/[slug]/page.tsx`: public audit page and metadata.
- `supabase/schema.sql`: database schema.
- `.github/workflows/ci.yml`: CI workflow.

## How The Audit Engine Works

The engine checks each tool against deterministic rules:

- Unused seats: paid seats greater than team size.
- Overpowered plan: small team on higher-tier plan.
- Duplicate tools: overlapping tools for the same use case.
- High API spend: direct/API spend above the review threshold.
- Retail credits: higher-tier retail spend that may benefit from credits or negotiation.
- Efficient stack: savings below `$100/month` gets an honest low-savings message.

The engine chooses one best recommendation per tool to avoid double-counting savings.

## How To Explain AI Usage

AI does not calculate savings. The app first calculates all numbers with deterministic code. Then the summary provider asks Anthropic to explain those results in about 100 words. If Anthropic is not configured or fails, the app uses a deterministic fallback summary.

## How To Explain Backend Storage

The browser gives fast feedback, but the backend recalculates the audit before saving. This prevents trusting numbers that could be changed in the browser. Supabase stores audits and leads when environment variables are configured. Without those variables, the app still works locally and reports that storage is not configured.

## Tradeoffs To Mention

- Pricing changes often, so pricing assumptions are centralized and documented.
- The current abuse protection is a honeypot; rate limiting is a future hardening step.
- Automated tests focus on the audit engine because it is the highest-risk business logic.
- Lighthouse scores are not recorded until actually measured.
- Public share URLs require Supabase configuration because local-only audits are not persisted.

## Demo Script

1. Open the home page.
2. Add a tool such as `OpenAI API direct`.
3. Enter high monthly spend, such as `$1000`.
4. Run the audit.
5. Point out monthly savings, annual savings, optimized spend, and per-tool recommendation.
6. Show the fallback or AI summary.
7. Show post-result lead capture.
8. Explain that saved public share URLs appear when Supabase is configured.

## Questions You May Get

### Why not let AI calculate savings?

Because spend recommendations must be explainable and testable. AI is used only to summarize deterministic results.

### Why use Zod?

Zod validates runtime data. TypeScript helps during development, but API requests and browser form values still need runtime validation.

### Why server-side recalculation?

Client-side data can be edited. The API recalculates the audit before saving so stored results come from trusted server code.

### What would you improve next?

Add rate limiting, stronger Supabase row-level policies for public reads, more integration tests, measured Lighthouse improvements, and real user feedback.
