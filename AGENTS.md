# AGENTS.md

Architect's handbook for the TECIM website + CMS project. This is the **single source of truth** for architecture, constraints, and decision-making rules. Read `AGENTS.md` before starting any work, then read `.agents/index.md` (or open the relevant skill in `.agents/skills/`) for the repeatable implementation playbook. Every agent and developer MUST follow this document.

## 1. Project Overview

TECIM is a **cinematic, section-based landing website** (not a blog, not e-commerce) managed by a **custom Visual Page Builder CMS**.

Goals:
- A fast, SEO-friendly, visually cinematic public website.
- A CMS where the admin edits **only text, images, and pre-built section templates** — never HTML, CSS, spacing, or animations.
- A **draft → preview → publish** workflow with **immutable version history and rollback**.
- **Single admin user** (email + password), with forgot-password via SendGrid OTP.

Build only what is specified. Do not overbuild, and do not add features that were not requested.

## 2. Technology Stack

| Layer | Choice |
|---|---|
| Public website | Next.js 15 (App Router), TypeScript |
| Styling / motion | TailwindCSS, Framer Motion, GSAP (cinematic sections only), Lucide React |
| Admin portal | Next.js 15, custom dashboard (NOT React Admin) |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL via **Supabase** (managed, free tier) |
| Cache / OTP | **Upstash Redis** |
| Media | **Cloudinary** (store only `public_id`, `secure_url`, `width`, `height`) |
| Email | **SendGrid** (OTP + password reset) |
| Validation | Zod |
| DB driver / migrations | `pg` (node-postgres) + `node-pg-migrate` |
| Deployment | Vercel (site + admin + backend), Cloudflare DNS |

## 3. Repository Layout

Single monorepo, three independently deployable apps.

```
TECIM/
  AGENTS.md        # rules + entry point (everything else AI-facing lives in .agents/)
  README.md        # human overview
  .agents/         # ALL AI-facing knowledge, centralized
    index.md       # skill index (the "how-to")
    memory.md      # cross-session context (remember skill)
    ui-registry.md # design tokens (imprint skill)
    prompts/       # implementation prompts per feature (see §12)
    skills/        # one SKILL.md folder per recipe (see §13)
    specs/         # ARCHITECTURE, DATABASE, API_SPEC, CMS_SPEC, DECISIONS, ...
  site/            # Public website (Next.js)            → Vercel
  admin/           # Admin portal (Next.js)              → Vercel
  api/             # Express API (Node + TS)             → Railway
    src/
      config/       # env, db pool, redis, cloudinary, sendgrid
      routes/       # feature route definitions
      controllers/  # HTTP layer (parse request, call service, respond)
      services/     # business logic (pure, testable)
      repositories/ # data access (parameterized SQL only)
      middlewares/  # auth, validate, rate-limit, upload, error, not-found
      modules/      # (optional) feature-scoped aggregation for large features
      validators/   # Zod schemas per feature
      utils/        # asyncHandler, jwt, otp, ApiError, ApiResponse, logger
      types/        # shared TypeScript types
      app.ts
      server.ts
    migrations/
    tests/
```

### Backend call flow (MUST follow)

```
route → controller → service → repository → PostgreSQL/Redis/Cloudinary
```

- Controllers never contain business logic or SQL.
- Services contain business logic and never touch `req`/`res`.
- Repositories contain SQL and never return HTTP concerns.
- Middlewares handle cross-cutting concerns (auth, validation, rate limiting).

### Site structure

```
site/
  app/
    layout.tsx
    page.tsx
    [slug]/page.tsx
    preview/page.tsx     # admin draft preview (protected)
  components/
    sections/            # one component per template (Hero, About, ...)
    layouts/             # header, footer, page shell
    ui/                  # buttons, media, cards
  lib/
    api.ts               # fetch published content from backend
    sections.ts          # template slug → React component registry
```

### Admin structure

```
admin/
  app/
    login/
    (dashboard)/
      page.tsx
      pages/
      sections/
      media/
      events/
      gallery/
      settings/
      navigation/
      seo/
      versions/
      activity/
  components/
    forms/               # field renderers generated from section schemas
    editors/             # preview, reorder, publish controls
  lib/
    api.ts               # admin API client (JWT auth)
```

## 4. Coding Standards

- **TypeScript strict** everywhere. No `any` (escape hatches require a comment).
- **ESLint + Prettier** enforced. Run `lint` before considering a task complete.
- Naming:
  - Files: `kebab-case.ts`; feature files suffix the layer (`auth.controller.ts`, `auth.service.ts`, `auth.repo.ts`).
  - Variables/functions: `camelCase`. Components/Types: `PascalCase`.
  - DB columns: `snake_case`. JSON API keys: `camelCase`.
- No comments unless they explain a non-obvious decision. Prefer expressive names.
- Prefer small, focused functions with explicit types and centralized limits (batch sizes, timeouts, pagination).
- Respect Next.js server/client boundaries: server modules (DB, Redis, Cloudinary, SendGrid, JWT) never run in the browser; keep secrets server-only.
- Avoid over-engineering, unrelated refactors, long handlers, and mixed UI/business logic in one function.
- Follow existing patterns; do not introduce a new library for a problem already solved in the codebase.
- Never commit secrets, `.env`, or credentials. Use environment variables.

## 5. API Conventions

- Base path: `/api/v1`.
- Method discipline: `GET` for reads/status only; `POST` for actions that create or mutate (login, publish, rollback, upload, section reorder); `PATCH`/`PUT` for updates; `DELETE` for removals. Never trigger a mutation with `GET`.
- Admin routes: `/api/v1/admin/*` → require JWT (single admin).
- Public routes read **published content only**.
- Uniform envelopes:
  - Success: `{ "success": true, "data": ... }`
  - Error: `{ "success": false, "error": { "code": "...", "message": "...", "details": [...] } }`
  - Paginated: `{ "success": true, "data": [...], "meta": { "page, perPage, total } }`
- Error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `OTP_EXPIRED`, `OTP_INVALID`, `INTERNAL`.
- HTTP status: 200 / 201 / 204 / 400 / 401 / 403 / 404 / 409 / 422 / 429 / 500.
- All request bodies validated with Zod before reaching a service.
- **Every endpoint MUST have a Swagger `@openapi` JSDoc block directly above its route definition** (interactive docs served at `/api-docs`). The block declares the full path, verb, tags, `operationId`, parameters, request body (referencing the Zod-derived component schema) and responses using the envelopes above. See `.agents/skills/api-format/SKILL.md`. No endpoint is complete without its doc.

## 6. CMS Architecture

- **Pages** contain ordered **Sections**.
- Each **Section** references a **section template** (e.g. `hero`, `about_image_left`, `gallery`) plus a `layout` variant (preset only) and a JSON `content` blob validated against the template's schema.
- **`section_templates`** table stores the editable-field schema and maps to a React component name. The component knows how to render the data — the admin never supplies HTML.
- Content states: `draft` and `published`.
  - The **site only reads published** content.
  - The **admin previews drafts** through the authenticated preview flow.
- **Publishing** snapshots the page + its sections into an immutable `versions` row, sets `status = published`, and triggers on-demand revalidation of the site.
- **Rollback** restores a previous version snapshot and re-publishes.
- Section ordering via drag-and-drop only updates `display_order` (no HTML involved).

## 7. Editable vs Hard-coded (CRITICAL RULE)

### Admin CAN edit
- **Text**: titles, subtitles, descriptions, button text/link.
- **Media**: images/videos selected from the Cloudinary-backed media library.
- **Content collections**: events, gallery, announcements, sermons (CRUD).
- **Section composition**: add/remove sections, choose template, drag-and-drop order.
- **Layout variants**: presets only (`image_left`, `image_right`, `full_width`, `split`).
- **Navigation**: link labels/URLs, order. Logo image.
- **Footer**: phone, email, address, social links, service times.
- **SEO**: meta title, meta description, OG image (per page + global).
- **Global settings**: site name, contact info, announcements.

### Admin CAN NEVER edit (hard-coded in code)
- HTML structure, CSS, Tailwind classes.
- Spacing, margins, padding, typography scale, font sizes.
- Animations (GSAP/Framer Motion), scroll effects, transitions, hero transitions, loading/film-strip animations.
- Glass effects, gradients, background overlays.
- Layouts, grids, columns, responsive/breakpoint behavior.
- Any field not declared in the section template schema.

### Why this matters (caveats if you expose everything)
1. **Design breaks** — one spacing/class change destroys the cinematic layout.
2. **Responsive breaks** — desktop changes often break mobile/tablet.
3. **Brand inconsistency** — free-form editing leads to off-brand visuals.
4. **Security risk** — raw HTML editing enables stored XSS and broken scripts.
5. **Performance regressions** — admins unknowingly ship huge media or heavy changes.
6. **SEO damage** — malformed meta, broken links, duplicate/contradictory content.
7. **Maintenance cost** — every change becomes a QA problem; version history fills with noise.

Rule: **content is data, design is code.** If a change is not expressible as template fields + a preset layout variant, it is a code change (do it in the repo), not a CMS change.

## 8. Database Design Principles

- PostgreSQL (Supabase). Full schema in `.agents/specs/DATABASE.md`.
- Prefer **relations** over embedded blobs; use JSONB only for the *validated* `content` of sections and `value` of settings.
- Every table has `id` (uuid), `created_at`, `updated_at`.
- `status` on content tables (`draft` / `published`).
- Immutable `versions` snapshots for rollback; never mutate a published version.
- OTPs live in **Redis** (5-minute TTL), never PostgreSQL.
- Index foreign keys, `slug`, `status`, `display_order`.
- All queries parameterized — never string-concatenate user input.
- Migrations are additive and reversible (up/down), checked into the repo.

## 9. Security Rules

- **Single admin user**, seeded once. No registration endpoint exists.
- Login: email + password → `bcrypt` (cost 12) → short-lived access JWT + rotating refresh token.
- Forgot password: generate 6-digit OTP → store in Redis (5 min) → send via SendGrid → verify → reset.
- Rate limiting on all auth endpoints (per IP and per email).
- `helmet` security headers; CORS locked to the site/admin domains.
- Redis-backed blacklist for logged-out/compromised refresh tokens.
- Uploads go through Cloudinary with folder restrictions; store only `public_id`, `secure_url`, `width`, `height`.
- Full details in `.agents/specs/SECURITY.md`.

## 10. Deployment Strategy

- **Site**: Vercel (Next.js, ISR + on-demand revalidation for instant publish updates).
- **Admin**: Vercel.
- **Backend**: Vercel (Express via `@vercel/node`).
- **DB**: Supabase. **Redis**: Upstash. **Media**: Cloudinary. **Email**: SendGrid.
- **DNS**: Cloudflare → points at all three Vercel apps.
- Environment variables are per-app; never in the repo. See `.agents/specs/DEPLOYMENT.md`.

## 11. Performance Expectations

- Site: Lighthouse 90+, fast TTFB; images served via Cloudinary auto-format (`f_auto`, `q_auto`, WebP) and Next.js `next/image`.
- Site reads published content with ISR; publishing triggers on-demand revalidation (site reflects changes in seconds, not minutes).
- API: p99 < 300ms for public reads; cache hot data in Redis; index all filtered columns.
- Never ship uncompressed/oversized media; never fetch on every render what can be cached.

## 12. How to Approach New Features

### Workflow (every feature)

1. Read `AGENTS.md` (this file) and the relevant spec (`.agents/specs/CMS_SPEC.md`, `.agents/specs/API_SPEC.md`, `.agents/specs/DATABASE.md`, `.agents/specs/SECTION_LIBRARY.md`).
2. Read `.agents/index.md` (the index) and open the matching skill in `.agents/skills/`.
3. Inspect the relevant existing code before writing anything.
4. If the task has meaningful ambiguity, ask **one focused question** before starting.
5. Draft a short implementation prompt in `.agents/prompts/<feature>.md` with: goal, files likely to change, decisions/assumptions, acceptance criteria, checks to run, and exact manual test steps. Confirm it with the user, then implement.
6. Backend first: migration → Zod schema → repository → service → controller → route → middleware wiring.
7. Frontend: build/register the React component, then the admin form (fields derived from the template schema).
8. Wire preview + publish + versioning for anything that changes content.
9. Run the checks in §14. Add/adjust tests for new logic.
10. If the change introduces an architectural decision, append an ADR to `DECISIONS.md`.
11. Share exact steps to test or run the completed feature.
12. Never change the design system (spacing, typography, animations, layouts) as a "content" fix — that is a code change reviewed separately.

### When in doubt

Keep it small → use the relevant skill/recipe → preserve server/client boundaries → ask a focused question → save a prompt → get approval → implement → run checks → share test steps.

## 13. What Belongs in SKILLS.md (not here)

`.agents/index.md` is the **index** to the implementation playbook. Detailed step-by-step recipes live in `.agents/skills/<name>/SKILL.md` (standard agent-skill format): engineering-process skills (architect, remember, review, recover, imprint) plus implementation recipes (section template, CRUD module, Cloudinary uploads, migrations, auth, preview/publish/versioning, validation, API format, testing). `AGENTS.md` defines the *rules*; the skills define the *how-to*.

## 14. Verification & Checks

Before a task is complete, run and report the **exact output** of these commands from the affected app's root:

- `npm run typecheck` — TypeScript, no emit.
- `npm run lint` — ESLint + Prettier.
- `npm run build` — production build (Next.js for site/admin, `tsc` for api) **only** when the change could affect the build.

Rules:
- Never claim a check passed without actually running it. If a check fails, fix it before finishing.
- After implementation, always share exact manual test steps: commands, URLs, and curl calls with method, headers, and body.

## 15. Secrets & Environment Exposure

- Only `NEXT_PUBLIC_*` values may reach browser code; everything else is server-only.
- Service credentials (DB, Redis, Cloudinary, SendGrid, JWT secrets, `REVALIDATE_SECRET`) never appear in `NEXT_PUBLIC_*` and never reach browser code.
- The site's revalidation route is protected by `REVALIDATE_SECRET`; the API's publish/rollback/upload actions require a valid admin JWT.
- Never commit `.env*`. Keep `.env.example` in sync with the canonical env-var list in `.agents/specs/DEPLOYMENT.md`.
