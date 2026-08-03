---
name: api-format
description: Use when adding endpoints or responding from the TECIM API to match the uniform response envelope. Front-load "response format", "envelope", "ApiResponse", "endpoint".
---

# API Response Format

- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code", "message", "details? } }`
- Paginated: `{ "success": true, "data": [...], "meta": { "page", "perPage", "total" } }`
- Use the `ApiResponse`/`ApiError` helpers in `utils/`. Never hand-build envelopes.
- HTTP status: 200 / 201 / 204 / 400 / 401 / 403 / 404 / 409 / 422 / 429 / 500.
- Error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `OTP_EXPIRED`, `OTP_INVALID`, `INTERNAL`.

## Method discipline

- `GET` for reads/status only.
- `POST` for actions that create or mutate (login, publish, rollback, upload, reorder).
- `PATCH`/`PUT` for updates; `DELETE` for removals.
- Never trigger a mutation with `GET`.
