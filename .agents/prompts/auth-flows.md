# Feature: Forgot-password UI + change-password flow

## Goal
- Wire the existing forgot-password/verify-otp/reset-password API into the admin UI.
- Add a change-password flow (new API endpoint + Settings UI) that did not exist.

## Background
- API already has `POST /auth/forgot-password`, `/verify-otp`, `/reset-password` (OTP stored in Redis, 5-min TTL, SendGrid email). No admin UI reached them.
- No change-password endpoint or UI existed at all.

## Files likely to change
### API (backend first)
- `api/src/validators/auth.schema.ts` — add `changePasswordSchema`
- `api/src/services/auth.service.ts` — add `changePassword()`
- `api/src/controllers/auth.controller.ts` — add `changePasswordHandler` (uses `requireUser(req).id`)
- `api/src/routes/auth.routes.ts` — add `POST /auth/change-password` (requireAuth + authIpLimiter + validate) with Swagger `@openapi` block
- `api/tests/auth-password.test.ts` — tests: 401 unauthenticated, success (new password logs in), wrong current password 401, short new password 422

### Admin
- `admin/lib/api.ts` — add `requestPasswordReset(email)` + `resetPassword(email, otp, newPassword)`
- `admin/components/auth/AuthShell.tsx` — extract login split-screen shell (branding left, form right, theme toggle)
- `admin/app/login/page.tsx` — use AuthShell; add "Forgot password?" link
- `admin/app/forgot-password/page.tsx` — 2-step flow (email → OTP + new password), calls forgot-password then reset-password
- `admin/middleware.ts` — allow `/forgot-password` without session (currently only `/login` is public)
- `admin/app/(dashboard)/settings/page.tsx` — add Change password card (current + new + confirm)

## Decisions / assumptions
- No migration needed (password_hash column exists; `updatePassword` exists).
- reset-password endpoint verifies OTP itself → UI skips the separate verify-otp round-trip (2-step UX).
- change-password keeps the user logged in (single admin; they proved knowledge of current password). No session revocation.
- Change-password failure modes: 401 = wrong current password; VALIDATION_ERROR = new password too short.
- `changePasswordSchema`: currentPassword min 1, newPassword min 8 max 200.

## Acceptance criteria
- Login page shows a "Forgot password?" link → `/forgot-password`.
- `/forgot-password` is reachable while logged out (middleware allows it) and redirects to `/` when already authenticated.
- Email step always shows the same success message (no enumeration).
- OTP + new password step resets the password; wrong/expired OTP shows a clear error.
- Settings page has a Change password card; wrong current password shows "Current password is incorrect"; success shows a toast.
- API change-password endpoint requires a valid access token; Swagger doc present.
- Checks pass: `npm run typecheck`, `npm run lint`, `npm run build` in `api` and `admin`; `npm test` in `api` (all existing + new tests).

## Manual test steps
- API (local): login → `POST /auth/change-password` with correct/incorrect current password; `POST /auth/forgot-password` + `reset-password` with an OTP stored via `storeOtp`.
- Admin (local): open `/forgot-password` logged out; run the 2-step flow; verify Settings → Change password.
