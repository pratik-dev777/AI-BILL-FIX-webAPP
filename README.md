# AICostLens

AICostLens is a free web app for auditing a startup's AI tool spending. The project is being built phase by phase for the Credex internship assessment.

## Current Status

Phase 1 is complete:

- Next.js App Router project scaffolded with TypeScript and Tailwind CSS.
- Initial landing page created.
- Required root documentation files added as honest placeholders.

Later phases will add pricing data, the deterministic audit engine, tests, the spend form, backend storage, email, AI summaries, public share pages, CI, and deployment documentation.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vitest, planned for Phase 2
- Zod, planned for validation
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
npm run build
```

## Notes For Evaluators

This repository intentionally shows incremental work. Features that are not implemented yet are documented as planned work instead of being faked.
