# Deployment Checklist

## Vercel Setup

1. Import the GitHub repository into Vercel.
2. Use the default Next.js framework preset.
3. Set the production branch to `main`.
4. Add environment variables in Vercel project settings:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
5. Run `supabase/schema.sql` in the Supabase SQL editor before testing saved audits.
6. Deploy.

## Pre-Deploy Checks

Run locally:

```bash
npm run lint
npm run test
npm run build
```

## Post-Deploy Checks

- Run an audit on the deployed URL.
- Confirm lead capture appears only after results.
- Confirm Supabase receives `audit_results` and `leads` rows.
- Confirm Resend sends the transactional email.
- Confirm a public `/audit/[slug]` page loads.
- Confirm public pages do not show email, company name, or role.
- Inspect Open Graph and Twitter metadata on a public audit page.
- Run Lighthouse against the deployed URL and record real scores in `TESTS.md`.

## Current Honesty Note

Lighthouse has not been run yet in this repository. Do not add Lighthouse scores until they are measured from a real local or deployed page.
