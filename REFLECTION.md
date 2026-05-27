# Reflection

## Phase 7

The final phase is about making the work explainable. The interview guide turns implementation details into a story: deterministic audit math first, AI summary second, backend recalculation for trust, and public sharing without lead-identifying fields.

The submission checklist is intentionally practical. It separates what is complete locally from what still needs real production configuration, such as Supabase, Resend, Anthropic, deployment, and Lighthouse scoring.

## Phase 6

CI is deliberately simple: install dependencies, lint, and run tests on `main`. The assignment specifically requires lint and tests, and keeping CI focused makes failures easier to explain as a beginner.

The accessibility pass focused on keyboard and screen reader basics rather than cosmetic changes. Skip links, visible focus states, live regions, and alert/status roles improve usability without changing the product flow.

Lighthouse scores are not documented yet because they have not been measured. This is intentional: recording fake performance or accessibility scores would be worse than leaving a clear TODO.

## Phase 5

The summary layer is intentionally separate from the audit engine. The engine owns numbers; the AI provider only explains them. This keeps the app easier to defend in an interview because the savings math remains deterministic and testable.

The public page reads saved audit data by slug and avoids lead-identifying fields. This keeps the share URL useful without exposing email, company name, or role. When Supabase is not configured locally, the app still calculates results and fallback summaries honestly, but public URLs require real storage.

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
