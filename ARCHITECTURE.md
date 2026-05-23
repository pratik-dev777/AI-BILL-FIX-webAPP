# Architecture

## Phase 3 Snapshot

AIBillFIX currently contains:

- A Next.js App Router frontend shell.
- A client-side audit workspace with a multi-tool form.
- Browser `localStorage` draft persistence.
- A documented pricing data module.
- A deterministic audit engine.
- A results panel with summary metrics and per-tool recommendations.
- Automated tests for the audit engine.

## Current Code Structure

- `src/app`: app layout and homepage route.
- `src/components/audit-workspace.tsx`: form state, localStorage persistence, audit trigger, and results UI.
- `src/lib/pricing.ts`: supported tools, plans, pricing assumptions, and pricing helpers.
- `src/lib/audit/types.ts`: Zod schemas and TypeScript types for audit input/output.
- `src/lib/audit/engine.ts`: deterministic savings rules.
- `src/lib/audit/engine.test.ts`: Vitest tests for the audit engine.

## Planned Data Flow

1. User enters AI tools and team details.
2. The browser saves the draft to `localStorage`.
3. The UI converts form strings into an `AuditInput`.
4. Zod validates and normalizes input.
5. Deterministic audit engine calculates savings.
6. Results panel shows savings and recommendations.
7. Optional lead capture saves contact data in a later phase.
8. Backend creates public shareable audit URL with private fields removed in a later phase.

## Phase 3 Rule

The audit engine does not use AI to calculate savings. AI summaries in a later phase may explain results, but the numbers must come from deterministic code.
