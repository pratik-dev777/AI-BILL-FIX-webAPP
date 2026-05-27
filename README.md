# AIBillFIX

AIBillFIX is a free web app for auditing a startup's AI tool spending. The project is being built phase by phase for the Credex internship assessment.

## Current Status

Phase 7 is complete:

- Next.js App Router project scaffolded with TypeScript and Tailwind CSS.
- Pricing data model added in `src/lib/pricing.ts`.
- Deterministic audit engine added in `src/lib/audit/engine.ts`.
- Vitest coverage added for core audit rules.
- Interactive spend form added for multiple AI tools.
- Form draft persists across reloads with `localStorage`.
- Results UI shows monthly savings, annual savings, current spend, optimized spend, and per-tool recommendations.
- API route saves audits through Supabase when environment variables are configured.
- Post-result lead capture stores email details through Supabase.
- Resend transactional email helper sends a confirmation when configured.
- Honeypot abuse protection is included before rate limiting.
- Anthropic-compatible summary provider added with deterministic fallback.
- Public audit pages added at `/audit/[slug]`.
- Public pages include Open Graph and Twitter metadata.
- GitHub Actions CI added for lint and tests on `main`.
- Accessibility polish added for skip links, focus states, and live status announcements.
- Deployment checklist added in `DEPLOYMENT.md`.
- Interview explanation guide added in `INTERVIEW_GUIDE.md`.
- Submission checklist added in `SUBMISSION_CHECKLIST.md`.
- Required root documentation files added as honest placeholders or working notes.

Final deployment, real Supabase/Resend/Anthropic verification, and real Lighthouse scoring still require production environment variables and a deployed URL.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest
- Zod
- Supabase
- Resend
- Anthropic-compatible provider wrapper

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values when testing backend storage and email.

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

No secrets are committed to the repository.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, and `npm run test` on pushes and pull requests targeting `main`.

## Notes For Evaluators

This repository intentionally shows incremental work. Features that are not implemented yet are documented as planned work instead of being faked.

Helpful final-review docs:

- `INTERVIEW_GUIDE.md`
- `SUBMISSION_CHECKLIST.md`
- `DEPLOYMENT.md`
