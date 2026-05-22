# Pricing Data

## Rule

All pricing values used by the audit engine come from `src/lib/pricing.ts`. The audit engine must not hide pricing constants in random components or tests.

## Sources Checked

Pricing was checked during Phase 2 on 2026-05-22 against current public pricing pages and official pricing references where available:

- Cursor pricing: `https://cursor.com/pricing`
- GitHub Copilot pricing: `https://github.com/features/copilot/plans`
- Claude pricing: `https://claude.com/pricing`
- OpenAI ChatGPT pricing: `https://openai.com/chatgpt/pricing`
- OpenAI API pricing: `https://openai.com/api/pricing`
- Anthropic API pricing: `https://www.anthropic.com/pricing`
- Gemini subscription/API pricing: `https://gemini.google/subscriptions` and `https://ai.google.dev/gemini-api/docs/pricing`
- Windsurf pricing: `https://windsurf.com/pricing`

## MVP Pricing Assumptions

Some tools have custom, enterprise, usage-based, annual, or region-specific pricing. For the MVP, AIBillFIX uses rounded monthly USD assumptions that are easy to explain and easy to update.

| Tool | Plan | Monthly USD | Billing model | Notes |
| --- | --- | ---: | --- | --- |
| Cursor | Hobby | 0 | free | Starter plan |
| Cursor | Pro | 20 | per-seat | Public monthly assumption |
| Cursor | Business | 40 | per-seat | Assignment label for team/business tier |
| Cursor | Enterprise | custom | custom | User-entered spend is used |
| GitHub Copilot | Individual | 10 | per-seat | Public monthly assumption |
| GitHub Copilot | Business | 19 | per-seat | Public monthly assumption |
| GitHub Copilot | Enterprise | 39 | per-seat | Public monthly assumption |
| Claude | Free | 0 | free | Starter plan |
| Claude | Pro | 20 | flat | Public monthly assumption |
| Claude | Max | 100 | flat | Lower Max-style tier assumption |
| Claude | Team | 30 | per-seat | Public monthly assumption |
| Claude | Enterprise | custom | custom | User-entered spend is used |
| Claude | API direct | variable | usage | User-entered spend is used |
| ChatGPT | Plus | 20 | flat | Public monthly assumption |
| ChatGPT | Team | 25 | per-seat | Business/team-style MVP assumption |
| ChatGPT | Enterprise | custom | custom | User-entered spend is used |
| ChatGPT | API direct | variable | usage | User-entered spend is used |
| Anthropic API direct | API direct | variable | usage | User-entered spend is used |
| OpenAI API direct | API direct | variable | usage | User-entered spend is used |
| Gemini | Pro | 20 | flat | Rounded Google AI Pro-style assumption |
| Gemini | Ultra | 100 | flat | Rounded Google AI Ultra-style assumption |
| Gemini | API | variable | usage | User-entered spend is used |
| Windsurf | Free | 0 | free | Starter plan |
| Windsurf | Pro | 15 | per-seat | Public monthly assumption |
| Windsurf | Teams | 30 | per-seat | Public monthly assumption |
| Windsurf | Enterprise | custom | custom | User-entered spend is used |

## TODO

- Re-check prices before final submission.
- Add source dates if pricing screenshots or archived links are included later.
