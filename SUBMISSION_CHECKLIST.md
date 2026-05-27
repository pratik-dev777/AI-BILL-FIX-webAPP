# Submission Checklist

## Repository

- [ ] All phase work is committed with Conventional Commit messages.
- [ ] Work spans at least 5 distinct calendar days.
- [ ] `git status` is clean before final submission.
- [ ] Latest code is pushed to GitHub `main`.
- [ ] GitHub Actions CI passes on `main`.

## Required Root Files

- [ ] `README.md`
- [ ] `ARCHITECTURE.md`
- [ ] `DEVLOG.md`
- [ ] `REFLECTION.md`
- [ ] `TESTS.md`
- [ ] `PRICING_DATA.md`
- [ ] `PROMPTS.md`
- [ ] `GTM.md`
- [ ] `ECONOMICS.md`
- [ ] `USER_INTERVIEWS.md`
- [ ] `LANDING_COPY.md`
- [ ] `METRICS.md`

## Extra Helpful Files

- [ ] `DEPLOYMENT.md`
- [ ] `INTERVIEW_GUIDE.md`
- [ ] `SUBMISSION_CHECKLIST.md`
- [ ] `.env.example`
- [ ] `supabase/schema.sql`
- [ ] `.github/workflows/ci.yml`

## Local Verification

- [ ] `npm run test`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Manual audit flow works locally.
- [ ] Lead capture appears only after results.
- [ ] Local missing-secret states are honest.
- [ ] Public audit route works when Supabase is configured.

## Deployment

- [ ] Supabase schema has been applied.
- [ ] Vercel environment variables are configured.
- [ ] Resend sender is configured.
- [ ] Deployed app can run an audit.
- [ ] Deployed app can save an audit.
- [ ] Deployed app can capture a lead.
- [ ] Deployed app can send email.
- [ ] Deployed public audit URL loads.
- [ ] Open Graph/Twitter metadata is visible on public audit URL.

## Honesty Checks

- [ ] No hardcoded secrets.
- [ ] No fake pricing data beyond documented MVP assumptions.
- [ ] No fake user interviews.
- [ ] No fake Lighthouse scores.
- [ ] No fake Git history.
- [ ] TODOs are clear and honest.

## Final Submission

- [ ] GitHub repo link is ready.
- [ ] Deployed Vercel link is ready if deployment is complete.
- [ ] README explains setup.
- [ ] Interview guide has been reviewed.
- [ ] Final demo path has been practiced.
