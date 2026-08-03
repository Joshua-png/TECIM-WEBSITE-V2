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

## Swagger documentation (REQUIRED per endpoint)

- **Every endpoint MUST have an `@openapi` JSDoc block directly above its route definition** in the route file — no exceptions. The interactive docs UI is served at `/api-docs` (Swagger UI) with the spec embedded.
- Format: an `@openapi` JSDoc comment declaring the full path (e.g. `/api/v1/admin/pages/{id}`), the verb, `tags`, `operationId`, `summary`, `parameters` (path/query), `requestBody` (`$ref` the Zod-derived schema where one exists), and `responses` (at least `200`/`201`/`204` for success and `401`/`404`/`422` where applicable).
- The `swagger-jsdoc` `apis` glob (`./src/routes/**/*.ts` in `src/config/swagger/index.ts`) picks up these blocks automatically — no registration step.
- Request-body schemas are auto-derived from the Zod validators in `src/validators/` via `zod-to-json-schema` (`src/config/swagger/openapi-schemas.ts`) and exposed as `components.schemas.<module>_<exportName>` (e.g. `auth_loginSchema`, `sections_createSectionSchema`). Reference them with `$ref: '#/components/schemas/<name>'`.
- Response shapes: mirror the runtime envelope by composing `#/components/schemas/SuccessEnvelope`, `ErrorEnvelope`, `PaginatedEnvelope` with the resource schemas (`Page`, `Section`, `Version`, `Setting`, `NavItem`, `Seo`, `User`, `TokenPair`, ...) defined in `src/config/swagger/index.ts`. Document error responses with the `ErrorEnvelope`.
- Admin endpoints inherit global `bearerAuth` security; public endpoints must set `security: []`.

## Method discipline

- `GET` for reads/status only.
- `POST` for actions that create or mutate (login, publish, rollback, upload, reorder).
- `PATCH`/`PUT` for updates; `DELETE` for removals.
- Never trigger a mutation with `GET`.
