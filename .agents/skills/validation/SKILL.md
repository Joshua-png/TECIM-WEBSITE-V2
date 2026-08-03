---
name: validation
description: Use when adding or changing request validation on the TECIM API. Front-load "validation", "Zod", "validate", "schema".
---

# Validation Standards

- Zod schemas in `api/src/validators/`, one per feature.
- A `validate` middleware runs the schema against `req.body`/`req.params` before the controller.
- Reject with `422 VALIDATION_ERROR` and `details: [{ field, message }]`.
- Never trust client input; sanitize URLs and restrict media ids to existing assets.
- Section `content` blobs are validated against the template's schema before save.

## Rules

- Every request body is validated before reaching a service — no exceptions.
- Keep `validators/` names mirroring the feature (`auth.schema.ts`, `pages.schema.ts`).
