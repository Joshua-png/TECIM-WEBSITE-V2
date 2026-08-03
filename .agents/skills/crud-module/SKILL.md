---
name: crud-module
description: Use when adding a CRUD content collection to the TECIM CMS — events, gallery, sermons, announcements (and future blog). Front-load "CRUD", "new collection", "events module", "gallery".
---

# Create a CRUD Module (Events, Gallery, Sermons, Announcements)

## Steps

1. **Migration**: create the table (see `.agents/specs/DATABASE.md`). Add `status`, indexes on `slug`/`status`/`display_order` where relevant.
2. **Zod schema**: `api/src/validators/<feature>.schema.ts`.
3. **Repository** `api/src/repositories/<feature>.repo.ts`: parameterized SQL only.
4. **Service** `api/src/services/<feature>.service.ts`: business logic, no `req`/`res`.
5. **Controller** `api/src/controllers/<feature>.controller.ts`: parse request, call service, respond via `ApiResponse`.
6. **Routes**: public read (published only) at `/api/v1/<feature>`, admin CRUD at `/api/v1/admin/<feature>`.
7. **Admin UI**: list page + form under `admin/app/(dashboard)/<feature>/`.
8. **Site rendering**: query published items in the section/component that displays them.
9. Run `typecheck` + `lint` (add `build` if routes changed) and share curl test steps.

## Rules

- Public routes read published content only; mutations require admin JWT.
- Reuse the `activity_logs` table for create/update/delete actions.
