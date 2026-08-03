---
name: testing
description: Use when writing or running tests and verification for the TECIM project — services, routes, auth, publishing, and the required checks. Front-load "test", "typecheck", "lint", "build", "verify".
---

# Testing Guidelines

- **Services**: pure unit tests (Vitest/Jest) — no HTTP, no DB mocks unless needed.
- **Controllers/routes**: integration tests with `supertest` against a test DB.
- **Repositories**: test against the real Postgres test schema; always parameterized SQL.
- **Auth flows**: login, refresh, forgot-password → OTP → reset, and route protection.
- **Publishing**: publish creates a version; rollback restores it; published content is what the site reads.

## Verification

- Run `npm run typecheck` and `npm run lint` (add `npm run build` when routes/config/server modules changed) and report the **exact output**. Never claim a check passed without running it.
- After implementation, share exact manual test steps — commands, URLs, and curl calls with method, headers, and body (e.g. `Authorization: Bearer <token>` for admin routes).
