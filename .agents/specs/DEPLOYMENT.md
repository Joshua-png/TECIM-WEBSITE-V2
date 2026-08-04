# DEPLOYMENT.md — Deployment Strategy

## Topology

```
Cloudflare DNS
  ├── www.tecim.org ───────────────→ Vercel — site/ (Next.js public website)
  ├── admin.tecim.org ─────────────→ Vercel — admin/ (Next.js admin portal)
  └── api.tecim.org ───────────────→ Railway — api/ (Express backend)
```

Draft preview runs inside the site app (`/preview`, protected by admin JWT) — no separate host needed.

## Providers

| Concern | Provider | Why |
|---|---|---|
| Public website | Vercel | Next.js native, image optimization, CDN, preview deployments, ISR + on-demand revalidation |
| Admin portal | Vercel | same stack, single platform, auth-gated route |
| Backend | Railway | simple Node deploys, cheap, scales from $0 |
| Database | Supabase (PostgreSQL) | free tier, managed, daily backups, pooler |
| Cache / OTP | Upstash Redis | serverless, free tier, per-request pricing |
| Media | Cloudinary | CDN, auto-format, transformations, folders |
| Email | SendGrid | OTP + password reset |
| DNS | Cloudflare | fast, free, edge routing |

## Environment Variables (per app, never in repo)

Only `NEXT_PUBLIC_*` values may reach browser code; everything else is server-only.
`REVALIDATE_SECRET` is shared between the API and the site and protects the revalidation route.
Never commit `.env*`; keep `.env.example` in sync with the tables below.

**api/** (Railway) — matches `api/src/config/env.ts`
```
DATABASE_URL          # Supabase postgres URL (keep ?sslmode=require)
REDIS_URL             # Upstash redis URL (ioredis-compatible)
JWT_ACCESS_SECRET     # long random string
JWT_REFRESH_SECRET    # long random string, different from access
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_FOLDER     # default tecim/site
SENDGRID_API_KEY
FROM_EMAIL
CORS_ORIGINS          # comma-separated https://site + https://admin domains
SITE_URL              # the site app's public origin (for revalidation)
REVALIDATE_SECRET     # shared with site/
ADMIN_EMAIL           # single admin login (seeded once)
ADMIN_PASSWORD        # admin password (seeded once)
PORT                  # Railway sets this automatically
```

**site/** (Vercel)
```
NEXT_PUBLIC_API_URL   # public API base, e.g. https://api.tecim.org
REVALIDATE_SECRET     # shared with api/
```

**admin/** (Vercel)
```
NEXT_PUBLIC_API_URL   # public API base, e.g. https://api.tecim.org
NEXT_PUBLIC_SITE_URL  # public site origin for "view live" links
```

## First Deploy (order matters)

### 1. Supabase database
1. Create a project (any region). Copy the **pooled** connection string from
   Project Settings → Database (port 6543) — it already includes `sslmode=require`.
2. The `pg` pool (`api/src/config/db.ts`) reads the string as-is; node-postgres honours
   `sslmode=require` from the URL, so no SSL code change is needed.
3. Keep this string for `api.DATABASE_URL` and for running migrations locally:
   `DATABASE_URL="<supabase-url>" npm run migrate:up` (from `api/`).

### 2. Upstash Redis
1. Create a Redis database (free tier). Copy the **redis://** URL (not `rediss://` is fine too —
   `ioredis` handles both) into `api.REDIS_URL`.
2. If `REDIS_URL` is unset the API falls back to an in-memory store
   (`api/src/utils/store.ts`) — fine for local dev, not for production.

### 3. Railway — api/
1. New project from the repo; set **Root Directory** to `api/`.
2. `railway.json` (checked into `api/`) sets Nixpacks build, the start command
   `npm run migrate:up && npm start`, and a `/api/v1/health` healthcheck.
   Migrations run on every start and are idempotent (node-pg-migrate tracks applied rows).
3. Add all `api/` env vars above.
4. After the first deploy, run the seed once to create the admin + templates + home page:
   `DATABASE_URL="<supabase-url>" ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed` (from `api/`),
   or with a Railway Shell/one-off task using the same env.

### 4. Vercel — site/ + admin/
1. Add two projects from the same repo; set **Root Directory** to `site/` and `admin/` respectively.
2. Add the env vars from the tables above (site + admin).
3. Git push to the production branch triggers deploys; other branches get preview deployments.
4. `outputFileTracingRoot` in each `next.config.ts` already handles the monorepo layout.

### 5. Cloudflare DNS
Point `www` → site app, `admin` → admin app, `api` → Railway. CORS on the API is locked
to the origins in `CORS_ORIGINS`.

## Publish → Live Flow
1. Admin clicks **Publish** → API creates immutable version + sets `published`.
2. API calls `SITE_URL/api/revalidate?secret=REVALIDATE_SECRET`
   (`api/src/services/publish.service.ts`) — the site revalidates the content tag.
3. Site reflects the change in seconds (ISR), no rebuild.

## Secrets Hygiene
- Generate with `openssl rand -hex 32`. Access + refresh JWT secrets must differ.
- Reuse one `REVALIDATE_SECRET` in `api` and `site`; never expose it to the browser.
- Rotate `ADMIN_PASSWORD` after first login.

## Cost Notes
- Free tiers cover most usage at launch (Supabase, Upstash, Cloudinary, SendGrid, Vercel, Railway $0–$5).
- Watch Cloudinary transformations and SendGrid monthly email volume as traffic grows.
