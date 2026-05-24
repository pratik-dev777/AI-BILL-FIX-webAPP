# Reflection

## Phase 4

The backend routes recalculate audit results on the server instead of trusting numbers sent from the browser. This matters because a user can edit client-side JavaScript, but the API should store results produced by the deterministic engine.

The app now behaves honestly without secrets: local development can calculate audits, but Supabase storage and Resend email report as not configured until real environment variables are provided. The first abuse protection choice is a honeypot field because it is simple, explainable, and does not add friction for real users.

## Phase 3

The main decision was to keep the first screen useful instead of adding a separate marketing page. AIBillFIX now opens directly to the audit workflow, which is better for an assessment project because the evaluator can test the core feature immediately.

The UI stores draft data in `localStorage`, but it does not save to a backend yet. That boundary matters: Phase 3 gives the user a working local audit, while Phase 4 will make saved audits and lead capture real.

## Phase 2

The audit engine uses deterministic rules instead of AI-generated math. This is important because savings numbers should be explainable in an interview and trustworthy to a user.

The main tradeoff is that pricing changes over time. To keep the app honest, all MVP pricing assumptions live in `src/lib/pricing.ts` and are documented in `PRICING_DATA.md`.

## TODO

- Revisit pricing assumptions before final deployment.
- Tune savings rates after real user feedback.
