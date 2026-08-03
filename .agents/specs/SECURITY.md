# SECURITY.md — Security Rules

## Authentication
- **Single admin** user, seeded once. No registration endpoint exists.
- Passwords hashed with `bcrypt` (cost 12).
- Login → short-lived **access JWT** (15 min) + **rotating refresh token** (7 days, rotation blacklists the old one in Redis).
- Access tokens passed as `Authorization: Bearer <token>`; verified by `middlewares/auth.ts` on all `/api/v1/admin/*` routes.
- Logout blacklists the refresh token in Redis.

## Forgot Password (OTP)
1. `POST /auth/forgot-password` → 6-digit OTP → stored in **Redis (5-min TTL)** → sent via **SendGrid**.
2. Always return 200 (no user enumeration). Rate-limited per IP and per email.
3. `POST /auth/verify-otp` confirms; `POST /auth/reset-password` requires email + OTP + new password.
4. OTP is single-use, invalidated on success or expiry. Max attempts enforced (invalid → `OTP_INVALID` / `OTP_EXPIRED`).

## Transport & Headers
- `helmet` security headers on the API.
- CORS locked to the site/admin domains (env `CORS_ORIGINS`).
- HTTPS everywhere (Vercel/Railway/Cloudflare).
- Cookies for refresh tokens (httpOnly, secure, sameSite) if used; otherwise tokens returned in body for the Next.js client to store per platform best practice.

## Rate Limiting
- All auth endpoints: per IP + per email (Upstash Redis counters).
- Media uploads: limited per user/IP.
- Return `429 RATE_LIMITED`.

## Data & Input
- Every request body validated with **Zod** before reaching a service (`422 VALIDATION_ERROR`).
- **Parameterized SQL only** — never string-concatenate user input.
- No raw HTML from the CMS anywhere (mitigates stored XSS by design).
- Uploads → Cloudinary into a restricted folder; store only `public_id`, `secure_url`, `width`, `height`. Never trust client-supplied URLs for storage — derive from the upload response.

## Secrets
- All secrets via environment variables, per app. `.env*` git-ignored.
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` strong and unique.
- Only `NEXT_PUBLIC_*` values may reach browser code; service credentials (DB, Redis, Cloudinary, SendGrid, JWT, `REVALIDATE_SECRET`) stay server-only. See `.agents/specs/DEPLOYMENT.md`.
- Never log tokens, OTPs, or passwords.

## Versioning & Integrity
- Published `versions` snapshots are immutable (never mutated in place).
- Rollback creates a new version; history is never rewritten.

## Audit
- Every admin action logged to `activity_logs` (action, entity, ip, timestamp) for audit trails.
