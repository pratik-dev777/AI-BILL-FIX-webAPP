# Tests

## Phase 7 Automated Tests

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
- Confirm lead capture appears only after results are shown.
- Submit an email after results and confirm the UI handles missing local Supabase/Resend config honestly.
- With Supabase configured, confirm an audit row and lead row are created.
- With Resend configured, confirm the transactional email is sent.
- Confirm a personalized summary appears after running an audit.
- Without `ANTHROPIC_API_KEY`, confirm the summary source is `fallback`.
- With Supabase configured, open the returned `/audit/[slug]` URL.
- Confirm the public page shows tools, savings, recommendations, and summary.
- Confirm the public page does not show email, company name, or role.
- Inspect page source or browser dev tools to confirm Open Graph and Twitter metadata are present.
- Press `Tab` on the home page and confirm the `Skip to audit` link appears.
- Confirm keyboard focus is visible on links, buttons, selects, and inputs.
- Run the same keyboard skip-link check on a public audit page when Supabase is configured.
- Review `INTERVIEW_GUIDE.md` and rehearse the demo script.
- Review `SUBMISSION_CHECKLIST.md` before submitting the repository.

## API Smoke Checks

Without real environment variables, local API routes should still respond honestly:

```bash
# /api/audits should return storageStatus: storage-not-configured and summary.source: fallback
# /api/leads should return storageStatus: storage-not-configured and emailStatus: email-not-configured
```

## CI Checks

GitHub Actions runs:

```bash
npm ci
npm run lint
npm run test
```

on pushes and pull requests targeting `main`.

## Lighthouse

Lighthouse has not been run yet. Do not write Lighthouse scores until they are measured from a real local or deployed page.

Recommended command after deployment:

```bash
npx lighthouse https://YOUR_DEPLOYED_URL --view
```

## Notes

Phase 7 still uses automated tests for business logic only. Supabase, Resend, and Anthropic need real environment variables for full integration verification.
