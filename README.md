# AIBillFIX

AIBillFIX is a free web app for auditing a startup's AI tool spending. The project is being built phase by phase for the Credex internship assessment.

## Current Status

Phase 2 is complete:

- Next.js App Router project scaffolded with TypeScript and Tailwind CSS.
- Initial landing page created.
- Pricing data model added in `src/lib/pricing.ts`.
- Deterministic audit engine added in `src/lib/audit/engine.ts`.
- Vitest coverage added for core audit rules.
- Required root documentation files added as honest placeholders or working notes.

Later phases will add the spend form, localStorage persistence, backend storage, email, AI summaries, public share pages, CI, and deployment documentation.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest
- Zod
- Supabase, planned for storage
- Resend, planned for transactional email
- Anthropic-compatible provider wrapper, planned for summaries

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
