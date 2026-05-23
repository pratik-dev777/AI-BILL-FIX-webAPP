# Tests

## Phase 3 Automated Tests

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
- Confirm the page says AIBillFIX.
- Add at least two tools.
- Change a tool, plan, monthly spend, seats, team size, and primary use case.
- Refresh the page and confirm the form values remain.
- Run the audit and confirm results appear.
- Try a high-savings stack and confirm the Credex CTA appears.
- Try a low-savings stack and confirm the efficient-stack message appears.

## Notes

Phase 3 still uses automated tests for business logic only. Browser/UI tests can be added later if time allows.
