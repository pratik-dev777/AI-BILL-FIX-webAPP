# Economics

## Phase 2 Savings Model

- Current monthly spend: sum of normalized user-entered monthly spend.
- Monthly savings: sum of the best deterministic recommendation for each tool.
- Optimized monthly spend: current monthly spend minus monthly savings.
- Annual savings: monthly savings multiplied by 12.
- Credex CTA threshold: savings greater than `$500` per month.
- Efficient-stack message threshold: savings lower than `$100` per month.

## Deterministic Rules

- Unused seats: if paid seats exceed team size, estimate savings from removable seats.
- Overpowered plan: if a team of 3 or fewer is on a higher-tier plan, compare against a cheaper same-vendor plan.
- Duplicate tools: if tools overlap on the same use case, recommend consolidating into the lowest-spend overlapping tool.
- High API spend: if direct API spend is at least `$500/month`, estimate 20% reviewable savings.
- Retail credits: if high-tier retail subscription spend is at least `$300/month`, estimate 15% reviewable savings.
- Efficient stack: if total savings are below `$100/month`, say the stack appears efficient.

## Honesty Note

The audit engine chooses one best recommendation per tool to avoid double-counting savings.
