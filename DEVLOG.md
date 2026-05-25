# Devlog

## 2026-05-25 - Phase 5

- Added an Anthropic-compatible summary provider in `src/lib/ai/summary.ts`.
- Added deterministic fallback summaries for missing keys, API errors, or empty provider responses.
- Added full summary prompt documentation in `PROMPTS.md`.
- Updated `/api/audits` to return a personalized summary and save it with audit results.
- Added public audit pages at `/audit/[slug]` that strip lead-identifying fields.
- Added Open Graph and Twitter metadata for public audit URLs.
- Updated the results UI to display the summary and saved public URL when available.

## 2026-05-24 - Phase 4

- Added Supabase and Resend dependencies.
- Added `.env.example` without real secrets.
- Added Supabase schema SQL for `audit_results` and `leads`.
- Added `/api/audits` to validate audit input, recalculate results server-side, and save audits when Supabase is configured.
- Added `/api/leads` to capture email after results, validate a honeypot field, save lead data, and send a Resend email when configured.
- Updated the UI so lead capture appears only after audit results.
- Kept public share pages and AI-generated summaries out of Phase 4 for later phases.

## 2026-05-23 - Phase 3

- Replaced the static preview landing page with an interactive audit workspace.
- Added a multi-tool spend form with tool, plan, monthly spend, seats, team size, and primary use case fields.
- Connected the form to the deterministic audit engine from Phase 2.
- Added `localStorage` persistence so draft form state survives page reloads.
- Added a results panel with monthly savings, annual savings, current spend, optimized spend, per-tool recommendations, Credex CTA logic, and efficient-stack messaging.
- Kept backend lead capture, email, AI summaries, and share URLs out of Phase 3 so they can be implemented honestly in later phases.

## 2026-05-22 - Phase 2

- Renamed the app from AICostLens to AIBillFIX.
- Restored the required project structure in the current workspace.
- Added `src/lib/pricing.ts` as the single source for supported AI tools, plans, and MVP pricing assumptions.
- Added Zod schemas to validate and normalize audit input.
- Built a deterministic audit engine for unused seats, plan downgrades, overlapping tools, high API spend, retail credit review, and efficient-stack messaging.
- Added Vitest tests for the required audit engine cases.

## Next

- Phase 6: documentation, CI, Lighthouse/accessibility polish, and deployment checklist.
