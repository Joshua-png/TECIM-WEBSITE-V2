# Architecture

High-level architecture for the TECIM cinematic website + Visual Page Builder CMS.

## 1. System Overview

```
                  Visitors
                     │
            React / Next.js Website  (site/)          → Vercel
                     │  reads only PUBLISHED content
                     ▼
              Node.js Express API  (api/)             → Railway
                     │
   ┌────────────┬────┴──────┬─────────────┬──────────┐
   ▼            ▼           ▼             ▼          ▼
PostgreSQL   Redis      Cloudinary     SendGrid   (OTP/rate-limit/media/email)
(Supabase)  (Upstash)   (media)        (email)

            React Admin Portal (admin/)              → Vercel
            (single admin, draft/preview/publish)
```

## 2. Data Flow

- **Site** → reads published pages/sections/settings/collections via `GET /api/v1/*` public routes. Uses ISR; publishing triggers on-demand revalidation.
- **Admin** → authenticated JWT calls to `/api/v1/admin/*` for pages, sections, media, events, gallery, settings, navigation, SEO, versions.
- **Auth** → login (bcrypt), JWT access + rotating refresh, forgot-password OTP via SendGrid (OTP in Redis, 5-min TTL).

## 3. Call Flow (Backend)

```
route → controller → service → repository → PostgreSQL / Redis / Cloudinary
```

- Controllers: HTTP layer only.
- Services: business logic, no `req`/`res`.
- Repositories: parameterized SQL only.
- Middlewares: auth, validation, rate limiting, error handling.

## 4. App Layout

```
TECIM/
  site/            # Public website (Next.js 15, App Router)
  admin/           # Admin portal (Next.js 15, custom dashboard)
  api/             # Express API (Node + TypeScript)
```

Each app deploys independently (Vercel, Vercel, Railway). Env vars are per-app.

## 5. Content States

- `draft` — edited by admin, invisible to the public site.
- `published` — read by the site. Publishing snapshots into immutable `versions`; rollback restores a snapshot and re-publishes.
- Preview: admin previews drafts through an authenticated preview route that renders the draft exactly like the published renderer.

## 6. CMS Model

- **Page** → ordered **Sections**.
- **Section** → **template** (`hero`, `about_image_left`, ...) + optional **layout variant** (preset) + validated JSON `content`.
- **`section_templates`** defines the editable schema and maps to a React component.
- Admin can never edit HTML/CSS/spacing/animation — only fields declared by the template schema.

## 7. Key Design Rules

1. Content is data; design is code.
2. Site only ever serves published content.
3. Every publish creates an immutable version; history is never rewritten.
4. No registration; single admin user seeded once.
5. Public routes are read-only and cache-friendly.
