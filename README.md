# AIBillFIX

AIBillFIX is a free web app for auditing a startup's AI tool spending. The project is being built phase by phase for the Credex internship assessment.

## Current Status

Phase 4 is complete:

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
- Required root documentation files added as honest placeholders or working notes.

Later phases will add AI summaries, public share pages, CI, and deployment documentation.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest
- Zod
- Supabase
- Resend
- Anthropic-compatible provider wrapper, planned for summaries

## Environment Variables

Copy `.env.example` to `.env.local` and fill in real values when testing backend storage and email.

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
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

## Notes For Evaluators

This repository intentionally shows incremental work. Features that are not implemented yet are documented as planned work instead of being faked.
