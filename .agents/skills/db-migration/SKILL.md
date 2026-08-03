---
name: db-migration
description: Use when creating or altering PostgreSQL schema for TECIM. Front-load "migration", "schema", "new table", "alter table", "add column".
---

# Database Migration

- One SQL file per change, additive and reversible (up/down), in `api/migrations/`.
- Follow `.agents/specs/DATABASE.md` conventions: uuid ids, `created_at`/`updated_at`, `snake_case` columns, indexed FKs.
- Migrations are checked into the repo; never edit a migration that already ran — add a new one.
- Run `npm run migrate:up` before testing; `npm run migrate:down` to roll back locally.
- JSONB only for validated `content` (sections) and `value` (settings) blobs — prefer relations elsewhere.
- Keep `.agents/specs/DATABASE.md` in sync with the final schema.
