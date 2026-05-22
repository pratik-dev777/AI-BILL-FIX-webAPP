# Tests

## Phase 2 Automated Tests

Run:

```bash
npm run test
```

The audit engine tests cover:

1. Unused seats produce correct savings.
2. Small team on expensive team/business plan gets downgrade recommendation.
3. Duplicate coding tools produce consolidation recommendation.
4. High API spend triggers Credex/credits recommendation.
5. Low savings case returns honest efficient-stack message.
6. Annual savings equals monthly savings times 12.
7. Multiple tools aggregate savings correctly.
8. Invalid negative spend is handled safely.

## Manual Checks

- Run `npm run dev`.
- Open `http://localhost:3000`.
- Confirm the landing page says AIBillFIX.

## Notes

Phase 2 tests focus on business logic only. UI tests are planned after the form and results page exist.
