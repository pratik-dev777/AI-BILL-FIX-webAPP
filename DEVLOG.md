# Devlog

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

- Phase 4: Supabase backend, save audit, lead capture, Resend email, and abuse protection.
