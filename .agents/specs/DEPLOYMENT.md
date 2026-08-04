# DEPLOYMENT.md — Deployment Strategy

## Topology — everything on Vercel

```
Vercel
  ├── site/   (Next.js public website)      → https://tecim.vercel.app
  ├── admin/  (Next.js admin portal)        → https://tecim-admin.vercel.app
  └── api/    (Express API, serverless fn)  → https://tecim-api.vercel.app
```

All three apps live in this repo and deploy from git pushes. The Express API runs as a
**serverless function** on Vercel's Node runtime via `api/src/vercel.ts` + `api/vercel.json`.
This avoids a separate always-on host (Railway/Render) and keeps the stack on one free platform.

## Providers

| Concern | Provider | Why |
|---|---|---|
| Website + admin + API | Vercel | free Hobby tier, no expiry, preview deploys, ISR + on-demand revalidation |
| Database | Supabase (PostgreSQL) | free tier, managed, daily backups, pooler (built for serverless) |
| Cache / OTP | Upstash Redis | serverless-first, free tier |
| Media | Cloudinary | CDN, auto-format, transformations, folders |
| Email | SendGrid | OTP + password reset |
| DNS | Cloudflare | fast, free, edge routing |

## How the API runs serverless

- `api/src/vercel.ts` exports the Express app (`createApp()`); Vercel's `@vercel/node` builder
  bundles it (verified with esbuild — sharp and native deps resolve).
- `api/vercel.json` maps every path to that function; existing routes like `/api/v1/health`
  and `/api-docs` work unchanged.
- `api/src/server.ts` (`app.listen`) is untouched and still usable for local dev / a future
  always-on host — the serverless entry is additive.
- Serverless-safe by design: multer uses `memoryStorage`, the store initializes lazily
  (`getStore()`), and the `pg` pool uses the **Supabase pooled URL** (port 6543).

## Environment Variables (per app, never in repo)

Only `NEXT_PUBLIC_*` values may reach browser code; everything else is server-only.
`REVALIDATE_SECRET` is shared between the API and the site. Never commit `.env*`;
keep `.env.example` in sync with the tables below.

**api/** (Vercel) — matches `api/src/config/env.ts`
```
DATABASE_URL          # Supabase pooled postgres URL (port 6543, keeps sslmode=require)
REDIS_URL             # Upstash redis URL (ioredis-compatible)
JWT_ACCESS_SECRET     # long random string
JWT_REFRESH_SECRET    # long random string, different from access
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_FOLDER     # default tecim/site
SENDGRID_API_KEY
FROM_EMAIL
CORS_ORIGINS          # comma-separated site + admin domains
SITE_URL              # the site app's public origin (for revalidation)
REVALIDATE_SECRET     # shared with site/
ADMIN_EMAIL           # single admin login (seeded once)
ADMIN_PASSWORD        # admin password (seeded once)
```

**site/** (Vercel)
```
NEXT_PUBLIC_API_URL   # public API base, e.g. https://tecim-api.vercel.app
REVALIDATE_SECRET     # shared with api/
```

**admin/** (Vercel)
```
NEXT_PUBLIC_API_URL   # public API base
NEXT_PUBLIC_SITE_URL  # public site origin for "view live" links
```

## First Deploy

### 1. Supabase database
1. Create a project; save the database password.
2. Project Settings → Database → **Connection string → Pooler** (port 6543).
   It already includes `sslmode=require`, which `pg` honours — no SSL code change needed.
3. Run migrations against it locally from `api/`:
   ```
   DATABASE_URL="<pooled-supabase-url>" npm run migrate:up
   ```

### 2. Upstash Redis
1. Create a database; copy the `redis://` URL (or `rediss://`).
2. Paste into `api.REDIS_URL`. If unset, the API falls back to in-memory (`api/src/utils/store.ts`).

### 3. Vercel — three projects (site, admin, api)
Each is an independent Vercel project pointing at the same repo with a different **Root Directory**
(`site`, `admin`, `api`). The API needs no healthcheck — it's request-driven.

### 4. Seed (once)
After the API env vars are set and `DATABASE_URL` is live, run the seed against Supabase once:
```
cd api
DATABASE_URL="<supabase-url>" ADMIN_EMAIL=theeaglecenter1@gmail.com ADMIN_PASSWORD=... npm run seed
```
Creates the admin user, section templates, home page + initial version, settings, and SEO.
Idempotent — safe to re-run for template schema updates.

## Publish → Live Flow
1. Admin clicks **Publish** → API creates immutable version + sets `published`.
2. API calls `SITE_URL/api/revalidate?secret=REVALIDATE_SECRET`
   (`api/src/services/publish.service.ts`) — the site revalidates the content tag.
3. Site reflects the change in seconds (ISR), no rebuild.

## Secrets Hygiene
- Generate secrets with `openssl rand -hex 32`; access + refresh JWT secrets must differ.
- One `REVALIDATE_SECRET` shared by `api` and `site`; never expose it to the browser.
- Rotate `ADMIN_PASSWORD` after first login.

## Cost Notes
- Vercel Hobby (free), Supabase free tier, Upstash free tier, Cloudinary free tier, SendGrid free tier.
- Watch Cloudinary transformations and SendGrid monthly volume as traffic grows.
- If the API ever outgrows serverless (long-running jobs, WebSockets), the `api/src/server.ts`
  entry + `DATABASE_URL`/`REDIS_URL` move unchanged to Railway/Render/Fly.
