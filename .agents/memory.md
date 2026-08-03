# memory.md — Cross-session context

Written by the `remember` skill at the end of each session; read at the start of the next. Never store secrets.

## Project state

- **Site (`site/`)**: DONE. All 8 sections + footer + nav (scroll-spy) + Connect CTA, reference-faithful, committed (`406b8d5`). Reads hardcoded `content.ts` — not yet wired to API.
- **API (`api/`)**: Phase 1 core content engine built and verified locally.
  - Scaffold: Express 4 + TS (ESM/NodeNext, strict), pg, node-pg-migrate, zod 3, ajv, bcryptjs 3, jsonwebtoken, helmet, cors, ioredis (in-memory fallback when `REDIS_URL` unset), vitest 2 + supertest.
  - Migration `001_init.sql`: 15 tables. Dev DBs `tecim_api` + `tecim_api_test` (Postgres 14 local). `npm run migrate:up`/`down` work.
  - `npm run seed`: admin (`admin@tecim.org` / from env `ADMIN_PASSWORD`, default `changeme123`), 10 section templates, home page with 8 published sections (version 1). Settings/navigation/global SEO NOT seeded (empty in dev).
  - Endpoints: `/api/v1/{health,auth,pages,settings,navigation,seo}` public; `/api/v1/admin/*` JWT-protected (pages CRUD, sections, templates, preview/publish/rollback/versions, settings, navigation, seo, activity).
  - **Swagger docs**: interactive UI at `/api-docs` (Swagger UI, spec embedded). Implemented like Capis-Backend: `swagger-jsdoc` + `swagger-ui-express`, `@openapi` JSDoc above every route, component schemas auto-derived from Zod validators via `zod-to-json-schema` (`src/config/swagger/openapi-schemas.ts`, names `<module>_<name>` e.g. `auth_loginSchema`), plus hand-written envelope/resource schemas in `src/config/swagger/index.ts` (`SuccessEnvelope`, `ErrorEnvelope`, `PaginatedEnvelope`, `Page`, `Section`, `Version`, `Setting`, `NavItem`, `Seo`, `User`, `TokenPair`, `ActivityEntry`, `SectionTemplate`). Global `bearerAuth` security. 28 endpoints documented. `AGENTS.md` §5 + `.agents/skills/api-format/SKILL.md` now mandate a doc block per endpoint.
  - **All checks green**: `typecheck`, `lint`, `build`, `test` (31 tests) — run from `api/`.
  - Tests hit `tecim_api_test` via `tests/setup.ts`; ensure test data via `ensureTestData()` (admin + templates + global seo).

## Decisions

- Phase 2 deferred: Cloudinary media, SendGrid OTP forgot-password, collections CRUD (events/gallery/sermons).
- JSON API currently returns **snake_case** field names (repo rows passed through); AGENTS.md §5 says camelCase — **open decision**, revisit before wiring `site/`/`admin/`.
- `resetRateLimits()` exported from `middlewares/rateLimit.ts` for test isolation.
- tsconfig split: `tsconfig.json` (src, build) + `tsconfig.eslint.json` (src+tests, used by lint + typecheck).
- See `.agents/specs/DECISIONS.md` for architecture ADRs.

## Next steps

- User decision on camelCase vs snake_case API responses (docs currently document the snake_case responses).
- Phase 2: Cloudinary media library + upload, SendGrid OTP forgot-password, events/gallery/sermons CRUD.
- Build `admin/` portal (login, pages, sections, publish/rollback, media, settings, nav, seo).
- Wire `site/` to API (lib/api.ts + revalidation route with `REVALIDATE_SECRET`).
- Optionally extend `api/src/seed.ts` to seed default settings, navigation tree, and global SEO.
- Commit swagger work (`api/` src/config/swagger, route docs, AGENTS.md, skills, memory.md) — uncommitted.
