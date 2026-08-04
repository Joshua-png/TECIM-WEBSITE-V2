# DECISIONS.md — Architecture Decision Records (ADRs)

Append a new ADR whenever a decision changes how the system is built. Status: `accepted` | `superseded`.

## ADR-001 — PostgreSQL over MongoDB
**Status:** accepted · **Date:** 2026-08-03

Relational model fits pages → sections → media, versioning, and rollback. Strong typing, easy migrations, lower cost at this scale. Managed via Supabase (free tier, daily backups, connection pooling).

## ADR-002 — Supabase (managed PostgreSQL)
**Status:** accepted · **Date:** 2026-08-03

Free tier, managed, daily backups, dashboard, pooler. Alternatives considered: Neon, Railway, Render. Rejected PlanetScale (no Postgres).

## ADR-003 — Next.js 15 for BOTH site and admin
**Status:** accepted · **Date:** 2026-08-03

SSR/SSG/ISR, SEO, fast TTFB, image optimization, preview deployments, easy Vercel hosting. One framework across both apps reduces context switching.

## ADR-004 — Custom admin dashboard, NOT React Admin
**Status:** accepted · **Date:** 2026-08-03

React Admin can't cleanly support live preview, draft/publish, section builder, and version/rollback workflows. A purpose-built dashboard gives full control over the cinematic editing experience.

## ADR-005 — No raw HTML/CSS editing
**Status:** accepted · **Date:** 2026-08-03

Admin edits template fields only. Raw HTML/CSS editing enables stored XSS, broken design, and responsive breakage. Design belongs in code (see AGENTS.md §7).

## ADR-006 — Section templates + preset layout variants
**Status:** accepted · **Date:** 2026-08-03

Sections reference a template slug + a `layout` variant (e.g. `image_left`, `image_right`, `full_width`, `split`). Variants are React components; admin never defines layout. Drag-and-drop updates only `display_order`.

## ADR-007 — Draft → preview → publish with immutable versions
**Status:** accepted · **Date:** 2026-08-03

Site reads published content only. Publish snapshots page + sections into `versions`; rollback restores a snapshot and re-publishes. Never mutate a published version.

## ADR-008 — Upstash Redis for OTP, rate limiting, token blacklist
**Status:** accepted · **Date:** 2026-08-03

Cheap/free, serverless. OTP lives in Redis (5-min TTL), never PostgreSQL. Also backs rate-limit counters and the refresh-token blacklist.

## ADR-009 — Cloudinary for media
**Status:** accepted · **Date:** 2026-08-03

Auto-format/WebP/resize/crop/CDN/folders. Store only `public_id`, `secure_url`, `width`, `height` in PostgreSQL.

## ADR-010 — Deployment: Vercel (site + admin), Railway (backend), Cloudflare DNS
**Status:** accepted · **Date:** 2026-08-03

Next.js apps on Vercel; Express API on Railway; Cloudflare terminates DNS for both apps and the API.

## ADR-011 — Single admin user, JWT + rotating refresh tokens
**Status:** accepted · **Date:** 2026-08-03

No registration endpoint. One seeded admin. bcrypt (cost 12) for passwords; short-lived access JWT; rotating refresh token; Redis blacklist on logout/rotation.

## ADR-012 — SendGrid for OTP email
**Status:** accepted · **Date:** 2026-08-03

Forgot-password flow: 6-digit OTP → Redis (5 min) → SendGrid → verify → reset.

## ADR-013 — Layered backend (routes → controllers → services → repositories) + Zod
**Status:** accepted · **Date:** 2026-08-03

Consistent with existing systems. Controllers have no business logic; services no `req`/`res`; repositories parameterized SQL only. All bodies validated with Zod.

## ADR-014 — Text/images editable; design hard-coded
**Status:** accepted · **Date:** 2026-08-03

Admin edits text, media, collections, section composition, preset layouts, navigation, SEO, and global settings. Everything visual (spacing, typography, animation, grids, responsive behavior) is code. See AGENTS.md §7.

## ADR-015 — camelCase JSON API responses
**Status:** accepted · **Date:** 2026-08-03

API responses expose camelCase keys (`pageId`, `displayOrder`, `metaTitle`, `createdAt`), matching AGENTS.md §5 and the Zod validators, even though DB columns are `snake_case`. Controllers convert rows to DTOs via `api/src/utils/serializers.ts`; repositories stay snake_case. Swagger `sharedSchemas` document the camelCase shape. Site/admin consume camelCase directly.

## ADR-016 — Content collections are plain CRUD with a status flag
**Status:** accepted · **Date:** 2026-08-03

Events, gallery, sermons, and announcements are standalone tables with a `status` (`draft`/`published`) column and **no** version/rollback machinery. Publishing a collection item = `PATCH` its `status` to `published`; public list endpoints return published items only. Gallery additionally filters published items by `is_featured`/`display_order`, and announcements by their active window (`active_from` ≤ now ≤ `active_until`). Public reads expose the same camelCase DTO shape (via `serializers.ts`) as other resources. Version history remains page/section-scoped per ADR-007 — collection rows are content, not design, and do not need immutable snapshots.

## ADR-017 — Graceful degradation when optional services are unconfigured
**Status:** accepted · **Date:** 2026-08-03

SendGrid and Cloudinary are optional at runtime. If `SENDGRID_API_KEY` is unset, OTP emails are logged and skipped (the forgot-password endpoint still returns 200). If `CLOUDINARY_*` is unset, media upload returns 500 `INTERNAL` ("Cloudinary is not configured") and media delete skips the remote destroy with a warning. This keeps the API fully testable and runnable in development without third-party accounts (see `tests/media-unconfigured.test.ts`).

## ADR-018 — In-place editing lives on the site preview tab (client overlay), not in the admin dashboard
**Status:** accepted · **Date:** 2026-08-04

Draft editing is click-to-edit on the site's `/preview` route rather than embedded in the admin app. Rationale: the preview already renders sections pixel-perfect through the real site renderer + site CSS and already carries the admin access JWT as `?token=`, so there is zero token-scoping/re-theming work and no duplicated section registry in the admin. The admin dashboard keeps structure concerns (add/remove/reorder, versions, publish); content editing happens on the rendered canvas. Implementation: shared section components emit `data-editable-path`/`data-editable-type` when `editable` (Phase 2); preview wraps each rendered section in a `display: contents` div carrying `data-section-id` and mounts `EditableOverlay` (`site/components/editor/EditableOverlay.tsx`), a client-only layer that hover-highlights text fields, opens an in-place input, and saves by **full-content PATCH** (`PATCH /admin/sections/:id` with `setPath`-derived content — the repo replaces `content` wholesale and re-validates). Save is draft-only; publish/versioning unchanged. Constraint: the site origin now makes browser→API calls, so prod `CORS_ORIGINS` must include the site domain. Image replacement shipped in Phase 4: clicking a tagged image opens a library picker in the overlay (`GET /admin/media`, JWT), which saves the new `ImageValue` (`public_id` + `secure_url`, `width`/`height` only when non-null to satisfy the template AJV schema) via the same full-content PATCH and swaps the `<img>` in place.
