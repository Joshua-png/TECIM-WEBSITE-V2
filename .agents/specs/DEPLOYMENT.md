# DEPLOYMENT.md — Deployment Strategy

## Topology

```
Cloudflare DNS
  ├── www.tecim.org ───────────────→ Vercel — site/ (Next.js public website)
  ├── admin.tecim.org ─────────────→ Vercel — admin/ (Next.js admin portal)
  ├── preview.tecim.org ───────────→ Vercel — site/ preview route (draft preview, protected)
  └── api.tecim.org ───────────────→ Railway — api/ (Express backend)
```

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

**api/** (Railway)
```
DATABASE_URL (Supabase)
REDIS_URL (Upstash)
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET
SENDGRID_API_KEY / FROM_EMAIL
SITE_URL / ADMIN_URL / CORS_ORIGINS
REVALIDATE_SECRET
```

**site/** (Vercel)
```
API_BASE_URL
REVALIDATE_SECRET
PREVIEW_TOKEN (optional, if preview route is token-gated)
```

**admin/** (Vercel)
```
API_BASE_URL
NEXT_PUBLIC_SITE_URL
```

## Environment Exposure Rules
- Only `NEXT_PUBLIC_*` values ship to the browser; everything else is server-only.
- `REVALIDATE_SECRET` is shared between the API and the site (server-only on both) and protects the revalidation route.
- Service credentials (DB, Redis, Cloudinary, SendGrid, JWT secrets) never appear in `NEXT_PUBLIC_*` and never reach browser code.
- Never commit `.env*`; keep `.env.example` in sync with the tables above.

## Publish → Live Flow
1. Admin clicks **Publish** → API creates immutable version + sets `published`.
2. API calls the site's revalidation endpoint (`revalidatePath`/`revalidateTag` with `REVALIDATE_SECRET`).
3. Site reflects the change in seconds (ISR), no rebuild.

## CI/CD
- Site/admin: Vercel Git integration → automatic preview deployments per branch, production on merge.
- API: Railway GitHub integration → build `api/`, run migrations (`npm run migrate:up`), start `npm start`.
- Migrations run as a Railway release step before deploy.

## Cost Notes
- Free tiers cover most usage at launch (Supabase, Upstash, Cloudinary, SendGrid, Vercel, Railway $0–$5).
- Watch Cloudinary transformations and SendGrid monthly email volume as traffic grows.
