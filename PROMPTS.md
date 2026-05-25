# Prompts

## Phase 5

AIBillFIX uses this prompt when `ANTHROPIC_API_KEY` is configured. The provider is replaceable because the rest of the app calls `generatePersonalizedSummary` instead of calling Anthropic directly.

## Production Prompt

```text
You are writing a concise AI spend audit summary for a startup founder.

Rules:
- Write about 100 words.
- Do not calculate new savings.
- Use only the deterministic numbers provided.
- Be practical, honest, and specific.
- If savings are low, say the stack appears efficient.
- If monthly savings exceed $500, mention that a Credex consultation may be worthwhile.
- Do not mention internal implementation details.

Audit input:
{JSON.stringify(auditInput, null, 2)}

Deterministic audit result:
{JSON.stringify(auditResult, null, 2)}
```

## Fallback Behavior

If Anthropic is not configured, returns an error, or returns no usable text, AIBillFIX uses a deterministic fallback summary from `src/lib/ai/summary.ts`.

The fallback summary:

- Uses existing audit numbers only.
- Calls out low savings honestly.
- Mentions the top recommendation when savings are meaningful.
- Does not fake AI output.
