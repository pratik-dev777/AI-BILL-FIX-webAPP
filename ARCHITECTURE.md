# Architecture

## Phase 2 Snapshot

AIBillFIX currently contains:

- A Next.js App Router frontend shell.
- A documented pricing data module.
- A deterministic audit engine.
- Automated tests for the audit engine.

## Current Code Structure

- `src/app`: homepage and app layout.
- `src/lib/pricing.ts`: supported tools, plans, pricing assumptions, and pricing helpers.
- `src/lib/audit/types.ts`: Zod schemas and TypeScript types for audit input/output.
- `src/lib/audit/engine.ts`: deterministic savings rules.
- `src/lib/audit/engine.test.ts`: Vitest tests for the audit engine.

## Planned Data Flow

1. User enters AI tools and team details.
2. Zod validates and normalizes input.
3. Deterministic audit engine calculates savings.
4. Results page shows savings and recommendations.
5. Optional lead capture saves contact data.
6. Backend creates public shareable audit URL with private fields removed.

## Phase 2 Rule

The audit engine does not use AI to calculate savings. AI summaries in a later phase may explain results, but the numbers must come from deterministic code.
