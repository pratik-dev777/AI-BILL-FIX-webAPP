# Devlog

## 2026-05-22 - Phase 2

- Renamed the app from AICostLens to AIBillFIX.
- Restored the required project structure in the current workspace.
- Added `src/lib/pricing.ts` as the single source for supported AI tools, plans, and MVP pricing assumptions.
- Added Zod schemas to validate and normalize audit input.
- Built a deterministic audit engine for unused seats, plan downgrades, overlapping tools, high API spend, retail credit review, and efficient-stack messaging.
- Added Vitest tests for the required audit engine cases.

## Next

- Phase 3: spend input form, localStorage persistence, and results UI.
