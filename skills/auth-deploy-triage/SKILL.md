---
name: auth-deploy-triage
description: Diagnose and fix Cena Studio authentication, account creation, GitHub OAuth, Supabase Admin sync, admin/demo access, Vercel deploy auth failures, smoke tests, and related documentation before production releases.
---

# Auth Deploy Triage

Use this skill when authentication, account creation, GitHub login, Supabase/Vercel integration, admin/demo access, or deploy smoke checks look disconnected.

## Workflow

1. Read the auth surface before editing:
   - `server/controllers/authController.ts`
   - `server/routes/auth.ts`
   - `server/services/authService.ts`
   - `server/middleware/authenticate.ts`
   - `server/config/passport.ts`
   - `server/config/launchGuards.ts`
   - `server/models/prismaSeed.ts`
   - `client/src/contexts/AuthContext.tsx`
   - `client/src/pages/Login.tsx`
   - `client/src/pages/Register.tsx`
   - `client/src/pages/AuthCallback.tsx`
   - `client/src/lib/api.ts`
   - `client/src/lib/supabase.ts`

2. Check environment without printing secrets:
   - Confirm whether each key is set/unset, not its value.
   - Required for email cookie auth: `JWT_SECRET`, `CLIENT_ORIGIN`.
   - Required for Prisma production: `DATABASE_URL` or `POSTGRES_PRISMA_URL`, migrations applied, `prisma generate`.
   - Required for Supabase Auth fallback: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
   - Required for managed Supabase access sync: `SUPABASE_SERVICE_ROLE_KEY`.
   - Required for server GitHub OAuth: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`.
   - Required for seeded access: `ADMIN_DEFAULT_PASSWORD`, `DEMO_USER_PASSWORD`.

3. Preserve the core login guarantee:
   - Email/password login must work through backend JWT cookie `frame_token`.
   - In production, operational users must be persisted in Supabase Postgres through Prisma, not runtime SQLite.
   - Public register must create user, plan/trial, default workspace, and set cookie.
   - Admin-created users must be able to log in through the operational database even if Supabase Auth Admin sync is unavailable.
   - Workspace bootstrap, Supabase Auth sync, notifications, and OAuth metadata must not block the core login path.

4. Triage GitHub:
   - Prefer Supabase OAuth if the frontend Supabase client is configured.
   - Fall back to server `/api/auth/github` when backend GitHub credentials are configured.
   - If neither is configured, show a clear UI/API error and keep email login primary.
   - A new GitHub identity must become a regular `user` unless explicit email policy grants admin.
   - Confirm Prisma and SQLite both use the shared user, workspace, and initial-plan flow.

5. Validate paid activation:
   - Self-service Studio registration must remain `pending` until Stripe confirms payment.
   - Pending accounts may authenticate and access checkout, but operational routes must return `402`.
   - Free client creation stops at 5; Pro stops at 50; Studio is unlimited only while active.

6. Validate locally:
   - Run focused tests for auth/admin first when possible.
   - Run `npm run verify` before handing off.
   - Smoke at least login, register, admin-managed user creation, `/api/auth/me`, logout, and health routes.

7. Validate deploy:
   - Confirm migrations ran before code that requires new tables.
   - Confirm Vercel env vars are set for Production, and Preview when testing preview deployments.
   - Run `npm run launch:check` or production smoke scripts when available.
   - Record the deploy URL, smoke date/time, and failures in docs.

8. Update documentation in the same change:
   - `CODEX_PROMPT.md`
   - `QA_STATUS.md`
   - `CHANGELOG.md`
   - `DECISION_LOG.md`
   - any deploy/setup/troubleshooting doc that mentions auth, Supabase, GitHub, admin, demo, tests, or production smoke.

## Test Debt Gate

When touching auth or deploy, also update the testing backlog if coverage is below target:

- Add or keep a dead-code check task using a tool such as `ts-prune`, `knip`, or an agreed equivalent.
- Track coverage uplift toward 95% as a staged target, starting with auth, admin, clients/opportunities/interactions, files/storage, analytics finance, Studio/Tools, and Documents.
- Do not claim 95% until coverage reports prove it.
