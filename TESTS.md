# Tests

## Phase 1

Automated business logic tests are not added yet because the audit engine starts in Phase 2.

## Manual Checks

- Start the local dev server with `npm run dev`.
- Open `http://localhost:3000`.
- Confirm the AICostLens landing page loads.
- Confirm the build status and MVP scope links scroll to sections on the same page.

## Planned Automated Tests

The audit engine tests in Phase 2 will cover:

1. Unused seats produce correct savings.
2. Small team on expensive team/business plan gets downgrade recommendation.
3. Duplicate coding tools produce consolidation recommendation.
4. High API spend triggers Credex or credits recommendation.
5. Low savings case returns an honest efficient-stack message.
6. Annual savings equals monthly savings times 12.
7. Multiple tools aggregate savings correctly.
8. Invalid negative spend is handled safely.
