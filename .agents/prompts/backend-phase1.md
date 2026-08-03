# Backend Phase 1 — Core Content Engine (`api/`)

## Goal
Scaffold the Express + TypeScript API from scratch and deliver the **core content engine**: all-table migrations, auth (login/refresh/me/logout), pages + sections + templates, preview → publish → rollback with immutable versions, public published reads, settings/navigation/SEO, and activity logs. Media (Cloudinary), OTP (SendGrid), and collections CRUD are Phase 2.

## Decisions / Assumptions
- **DB**: local Postgres 14 (`DATABASE_URL=postgres://localhost:5432/tecim_api`, test DB `tecim_api_test`). User-approved.
- **Migrations**: `node-pg-migrate` with SQL file language (one file per change, additive, up/down) in `api/migrations/`.
- **Redis**: optional in Phase 1 — if `REDIS_URL` absent, fall back to an in-memory store for refresh-token blacklist + rate limiting (documented; swap to Upstash in Phase 2).
- **Revalidation**: on publish, fire-and-forget call to site revalidation route when `SITE_URL` + `REVALIDATE_SECRET` are set; otherwise log.
- **Section content**: validated against each template's JSON Schema (draft-07) stored in `section_templates.schema`, using `ajv`.
- **Seed**: single admin user (from env or default), the 9 templates the site actually uses (hero, about_image_left/right, vision, values, services, events, timeline, contact, gallery), and a `home` page with all sections pre-populated from `site/components/sections/*/content.ts` + an initial published version.
- **Call flow**: route → controller → service → repository → SQL. Controllers HTTP-only; services no `req`/`res`; repos parameterized SQL.
- Envelopes via `utils/` (`ApiResponse`, `ApiError`); status codes + error codes per API_SPEC.

## Files (all new under `api/`)
- `package.json`, `tsconfig.json`, `.eslintrc`/`eslint.config.mjs`, `.prettierrc`, `.env.example`, `.env`, `migrations.json`
- `migrations/001_init.sql` (users, password_resets, pages, sections, section_templates, media, events, gallery, sermons, settings, navigation, seo, versions, drafts, activity_logs)
- `src/config/{env,db}.ts`
- `src/utils/{ApiResponse,ApiError,asyncHandler,jwt,logger,pagination,rateLimit,memoryStore}.ts`
- `src/middlewares/{auth,validate,rateLimit,error,notFound}.ts`
- `src/validators/{auth,pages,sections,settings,navigation,seo}.schema.ts`
- `src/repositories/{user,page,section,template,version,settings,navigation,seo,activity}.repo.ts`
- `src/services/{auth,page,section,publish,settings,navigation,seo,activity}.service.ts`
- `src/controllers/{auth,page,section,settings,navigation,seo}.controller.ts`
- `src/routes/{auth,pages,sections,settings,navigation,seo,admin,index}.ts`
- `src/app.ts`, `src/server.ts`, `src/seed.ts`
- `tests/{auth,pages,publish,public}.test.ts`, `tests/helpers.ts`
- `.agents/prompts/backend-phase1.md` (this file)

## Acceptance Criteria
1. `npm run migrate:up` applies schema on `tecim_api`; `migrate:down` reverses.
2. `npm run seed` creates admin + templates + home page (published).
3. `POST /api/v1/auth/login` → `{ accessToken, refreshToken, user }`; admin routes reject without Bearer token (`401 UNAUTHORIZED`).
4. Public `GET /api/v1/pages/home` returns the published page + ordered sections.
5. Admin can create a page, add/edit/reorder/delete sections, preview drafts, publish (creates immutable version), rollback.
6. Every request validated by Zod (`422 VALIDATION_ERROR`); every admin action logged to `activity_logs`.
7. `npm run typecheck`, `npm run lint`, `npm run build`, `npm test` all pass.

## Checks
- From `api/`: `npm run typecheck`, `npm run lint`, `npm run build`, `npm test`.

## Manual Test Steps
```bash
cd api && cp .env.example .env && npm install
createdb tecim_api && createdb tecim_api_test
npm run migrate:up && npm run seed && npm run dev
# login
curl -s -X POST http://localhost:4000/api/v1/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"admin@tecim.org","password":"..."}'
# public published page
curl -s http://localhost:4000/api/v1/pages/home
# admin page + sections, publish, rollback with Bearer token (see curl in test notes)
```
