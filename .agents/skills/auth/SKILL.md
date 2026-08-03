---
name: auth
description: Use when implementing or extending authentication on the TECIM API — login, refresh tokens, forgot password, OTP, route protection. Front-load "login", "auth", "JWT", "forgot password", "OTP", "refresh token".
---

# Authentication Patterns

## Login

- `POST /api/v1/auth/login` → verify bcrypt → issue access JWT (short-lived) + refresh token (rotating). Blacklist the old refresh token in Redis on rotation/logout.
- Single admin only; no registration endpoint.

## Forgot password

- `POST /api/v1/auth/forgot-password` → generate 6-digit OTP → store in Redis (5-min TTL) → send via SendGrid. Always respond 200 (no user enumeration).
- `POST /api/v1/auth/verify-otp` then `POST /api/v1/auth/reset-password` → invalidate the OTP, hash the new password.

## Route protection

- `middlewares/auth.ts` verifies the JWT for all `/api/v1/admin/*` routes.
- Rate-limit all auth endpoints (per IP + per email).

## Rules

- OTPs live in Redis, never PostgreSQL.
- Passwords hashed with bcrypt cost 12.
- Never log tokens, OTPs, or passwords.
