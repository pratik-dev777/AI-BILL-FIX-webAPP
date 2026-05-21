# Architecture

## Phase 1 

AICostLens currently contains a Next.js App Router frontend shell.

## Planned System

- `src/app`: routes, pages, metadata, and server actions or route handlers.
- `src/components`: reusable UI components.
- `src/lib/pricing.ts`: documented pricing constants.
- `src/lib/audit`: deterministic audit engine.
- `src/lib/ai`: replaceable AI summary provider.
- `src/lib/supabase`: database client helpers.
- `src/lib/email`: Resend email helpers.

## Data Flow Planned

1. User enters AI tools and team details.
2. Zod validates input.
3. Deterministic audit engine calculates savings.
4. Results page shows savings and recommendations.
5. Optional lead capture saves contact data.
6. Backend creates public shareable audit URL with private fields removed.

## Phase 1 TODO

- Add real pricing model in Phase 2.
- Add audit routes and persistence in later phases.
