# memory.md — Cross-session context

Written by the `remember` skill at the end of each session; read at the start of the next. Never store secrets.

## Operating rule (user directive, 2026-08-04)

- **NEVER `git commit` (or amend/push) unless the user explicitly asks.** The user commits manually. Even if a plan/next-step lists a commit, stop and ask first.

## Project state

- **Site (`site/`)**: DONE, **wired to the API and committed** (`56ad560` feat: render published CMS content with ISR + on-demand revalidation; `4da1715` fix: accept POST on revalidate route — branch `site-wired`). Hardcoded `content.ts` is only the fallback when the API is unreachable.
  - `lib/api.ts` BASE = `${API_URL}/api/v1`, fetch tag `tecim-content`, ISR `revalidate: 300`, silent fallback on error. `lib/chrome.ts` (nav+footer from navigation/settings/publisher pages), `lib/sections.ts` (template slug → component via `createElement`), `lib/image.ts` (`imageUrl` resolves string or `{secure_url}`).
  - 8 section components take a typed `content` prop (Hero, About, Values, Vision, Services, Events, Gallery, Contact). `app/page.tsx` (server, renders published "home"), `app/[slug]/page.tsx` (`notFound()` on failure), `app/layout.tsx` (async chrome fetch → Nav links / Footer data).
  - Revalidate route `app/api/revalidate/route.ts`: GET+POST, `REVALIDATE_SECRET` guard, `revalidateTag` + `revalidatePath`. API `publish.service.ts` POSTs `{SITE_URL}/api/revalidate?secret=…` with body `{slug:["/","/"+slug]}`.
  - **`.next` corruption pitfall (recurring!)**: running `npm run build` / `rm -rf .next` while a dev/start server is live destroys routes → ENOENT on `[slug]/page.js`, `favicon.ico/route.js`, and `/api/revalidate` returns 404. Fix: kill server → `rm -rf .next` → restart dev. Always stop the server first.
  - Local env: `NEXT_PUBLIC_API_URL=http://localhost:4000`, `REVALIDATE_SECRET=dev-secret` (`site/.env` + `site/.env.example` committed, `.gitignore` keeps env out).
- **Admin (`admin/`)**: BUILT (Next.js 15 + Tailwind v4, runs `-p 3001`, consumes live API). All pages implemented, **committed** (`8c9cac6` build + `6a8aba0` fix: toast provider + paginated meta shape), checks green (`typecheck`, `lint`, `build` from `admin/`).
  - Auth: login page + JWT via `lib/api.ts` (localStorage `tecim.access`/`tecim.refresh`, cookie `tecim_admin` for middleware), single-flight 401 refresh, logout.
  - Structure: `app/(dashboard)/layout.tsx` (Shell: sidebar nav groups Workspace/Content/Structure/System, topbar user menu, "View site" link, live API pill) + `app/login`.
  - Pages: overview dashboard, pages list + create/delete, page editor (`pages/[id]`: section list, reorder via `PUT /admin/pages/:pageId/sections/order`, edit/delete section, add-section template grid, meta edit, Publish, Versions, PreviewOverlay draft preview, meta modal).
  - Builder components: `SectionEditor` (schema-driven content via `SchemaForm`, layout variant, dirty tracking), `AddSectionModal`, `VersionsModal` (rollback), `PreviewOverlay` (draft render via `GET /admin/pages/:id/preview`).
  - Media library: upload (drag&drop, parallel `POST /admin/media/upload`), grid, delete, pagination; `MediaPicker` modal reused by SchemaForm + collection forms + SEO.
  - Collections via generic `components/collections/collection-manager.tsx` (config-driven fields, create/edit modal, status toggle, delete): `events`, `gallery` (thumbnail from media map), `sermons`, `announcements`. Field types: text/textarea/datetime/date/number/url/media/boolean. Datetime→ISO via `fromLocalInput`, date-only via `toLocalDate`.
  - `settings` page: config-driven forms for seed groups `site`/`contact`/`social` (text/textarea/list/rows editors) + JSON editor fallback; save = `PUT /admin/settings/:key {value}`.
  - `navigation` page: flat ordered editor (label/url/target/active, move up/down, add/remove) → `PUT /admin/navigation {items:[…]}` (replaceAll deletes+reinserts, so **flat only**, parentId null — nested children from API are flattened).
  - `seo` page: global (`PUT /admin/seo`) + per-page override (`GET /seo/pages/:slug` to load, `PUT /admin/seo/pages/:pageId` to save) with Google SERP preview.
  - `activity` page: paginated `GET /admin/activity`, action tones, relative times.
  - Config notes: `(dashboard)/layout.tsx` has `export const dynamic = "force-dynamic"` (avoids prerender context pitfalls; correct for auth-gated admin). `eslint.config.mjs` mirrors site (FlatCompat + next/core-web-vitals + next/typescript). `next.config.ts` sets `outputFileTracingRoot`. Ports: admin 3001, site 3000, API 4000 (`CORS_ORIGINS` includes 3000+3001).
  - Lucide icon note: no `Announcement`/`Publish` icons — use `Megaphone`, `Send`/`Rocket`.
- **API (`api/`)**: Phase 1 core content engine + all Phase 2 integrations built and verified locally.
  - Scaffold: Express 4 + TS (ESM/NodeNext, strict), pg, node-pg-migrate, zod 3, ajv, bcryptjs 3, jsonwebtoken, helmet, cors, ioredis (in-memory fallback when `REDIS_URL` unset), nodemon 3.1.14 (`dev` = `nodemon --watch src -e ts --exec "tsx src/server.ts"`), vitest 2 + supertest. Deps added: `@sendgrid/mail`, `cloudinary`, `multer` (+ dev `@types/multer`).
  - Migrations: `001_init.sql` (15 tables) + `002_collections.sql` (new `announcements` table + `gallery.status` column + indexes). Applied to dev `tecim_api` AND test `tecim_api_test` (`DATABASE_URL=postgres://localhost:5432/tecim_api_test npm run migrate:up`).
  - `npm run seed`: admin, 10 section templates, home page with 8 published sections (version 1), plus **3 default settings (site/contact/social), 7 navigation items, global SEO** (all idempotent). **NOTE**: the seeded admin email in the dev DB is `joshuaaryee07@gmail.com` (password `changeme123`) — this DIFFERS from `ADMIN_EMAIL=admin@tecim.org` in `api/.env`; login only works with the DB email.
  - Endpoints: `/api/v1/{health,auth,pages,settings,navigation,seo,media,events,gallery,sermons,announcements}` public; `/api/v1/admin/*` JWT-protected (pages CRUD, sections, templates, preview/publish/rollback/versions, settings, navigation, seo, activity, **media upload/list/delete, events/gallery/sermons/announcements CRUD**).
  - **Auth**: login/refresh/logout/me + **forgot-password → verify-otp → reset-password** (SendGrid OTP, Redis 5-min TTL, sha256-hashed, max 5 attempts, single-use; `password_resets` audit table; forgot always 200).
  - **Media**: multer memory upload (10MB, MIME whitelist) → Cloudinary `upload_stream` → `media` row (public_id/secure_url/width/height/format/resource_type/size_bytes/folder/alt_text). Delete destroys remote then row.
  - **Collections**: events (auto kebab slug + conflict 409, `image_media_id`), gallery (FK `media_id`, auto `display_order`, `is_featured`), sermons, announcements (public list filters active window). All publish = `PATCH status: "published"`. Repos/services/controllers/serializers per module; helper `slugify.ts` + `uniqueSlug`.
  - **Swagger**: interactive UI at `/api-docs`. `@openapi` block above every route; Zod-derived component schemas via `openapi-schemas.ts` (now imports all 10 validator modules); hand-written `sharedSchemas` in `src/config/swagger/index.ts` — added `Media`, `Event`, `GalleryItem`, `Sermon`, `Announcement` (plus existing envelopes/Page/Section/…). 60+ endpoints documented.
  - **camelCase responses**: `src/utils/serializers.ts` maps repo rows → camelCase DTOs (`pageId`, `displayOrder`, `metaTitle`, `createdAt`, `imageMediaId`, `publicId`…); controllers serialize before responding; Swagger `sharedSchemas` document camelCase shape (ADR-015). Repos stay snake_case.
  - **Graceful degradation** (ADR-017): SendGrid unset → OTP logged+skipped; Cloudinary unset → upload 500 `INTERNAL`, delete skips remote destroy. Tested by `tests/media-unconfigured.test.ts`.
  - **All checks green**: `typecheck`, `lint`, `build`, `test` — run from `api/`. **64 tests** across 8 files (auth, auth-password OTP flow, pages, publish/versions, settings, collections CRUD, media w/ mocked Cloudinary, media-unconfigured). `vi.mock` + `vi.hoisted` pattern used to stub `config/cloudinary.js`.
  - Tests hit `tecim_api_test` via `tests/setup.ts`; `ensureTestData()` seeds admin + templates + global seo. Test DB is **persistent** — tests use `randomUUID()` for unique slugs/public_ids so they pass on re-runs.
  - zod version is **3.25** — use `z.string().datetime()` / `z.string().date()`, NOT v4's `z.iso.*`.

## Decisions

- **Content collections = plain CRUD + status flag** (ADR-016) — no version/rollback for events/gallery/sermons/announcements; publish = PATCH status.
- **Graceful degradation** (ADR-017) — SendGrid/Cloudinary optional at runtime; tested.
- **camelCase JSON API responses** — accepted (ADR-015). Repositories stay snake_case; serializers in `src/utils/serializers.ts`.
- Swagger docs work was committed and pushed by the user (spec + `@openapi` blocks + AGENTS.md §5 + api-format skill).
- `resetRateLimits()` exported from `middlewares/rateLimit.ts` for test isolation.
- tsconfig split: `tsconfig.json` (src, build) + `tsconfig.eslint.json` (src+tests, used by lint + typecheck).
- See `.agents/specs/DECISIONS.md` for architecture ADRs (now through ADR-017).

## Next steps

- Manual browser verification of `admin/` against a running API (login `joshuaaryee07@gmail.com` / `changeme123`, CRUD, publish/preview, uploads) — see `.agents/prompts/admin-portal.md` if drafted.
- Deployment (Railway API → Vercel site+admin) — only on user request.
- Fix unsplash image 404s in seeded/hardcoded content (several `images.unsplash.com` URLs in `content.ts` now return 404 upstream).
- Admin/API/anything uncommitted: **do NOT commit automatically — ask the user first** (user commits manually).
