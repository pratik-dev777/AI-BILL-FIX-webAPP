# Reflection

## Phase 2

The audit engine uses deterministic rules instead of AI-generated math. This is important because savings numbers should be explainable in an interview and trustworthy to a user.

The main tradeoff is that pricing changes over time. To keep the app honest, all MVP pricing assumptions live in `src/lib/pricing.ts` and are documented in `PRICING_DATA.md`.

## TODO

- Revisit pricing assumptions before final deployment.
- Tune savings rates after real user feedback.
