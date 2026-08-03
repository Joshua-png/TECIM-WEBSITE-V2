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
