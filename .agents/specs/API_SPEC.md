# API_SPEC.md — Endpoints

Base path: `/api/v1`. Public routes read **published** content only. Admin routes (`/api/v1/admin/*`) require JWT.

## Envelope
- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code", "message", "details? } }`
- Paginated: `{ "success": true, "data": [...], "meta": { "page", "perPage", "total" } }`

## Auth (public, rate-limited)
| Method | Path | Description |
|---|---|---|
| POST | /auth/login | email + password → `{ accessToken, refreshToken, user }` |
| POST | /auth/refresh | refresh token → new `{ accessToken, refreshToken }` |
| POST | /auth/forgot-password | email → sends 6-digit OTP via SendGrid. Always 200. |
| POST | /auth/verify-otp | email + otp → confirms OTP (required before reset) |
| POST | /auth/reset-password | email + otp + new password → resets, invalidates OTP |
| POST | /auth/logout | blacklists refresh token |
| GET | /auth/me | current admin profile |

## Pages
| Method | Path | Access | Description |
|---|---|---|---|
| GET | /pages?status=published | public | list published pages |
| GET | /pages/:slug | public | single published page with sections |
| GET | /admin/pages | admin | all pages incl. drafts |
| POST | /admin/pages | admin | create page |
| PATCH | /admin/pages/:id | admin | update page meta |
| GET | /admin/pages/:id | admin | page + sections (draft state) |
| GET | /admin/pages/:id/preview | admin | draft payload for preview renderer |
| POST | /admin/pages/:id/publish | admin | snapshot → version → publish → revalidate |
| POST | /admin/pages/:id/rollback/:versionId | admin | restore snapshot + re-publish |
| DELETE | /admin/pages/:id | admin | delete page (+ sections) |

## Sections
| Method | Path | Access | Description |
|---|---|---|---|
| GET | /admin/pages/:pageId/sections | admin | sections of a page |
| POST | /admin/pages/:pageId/sections | admin | add section from a template |
| PATCH | /admin/sections/:id | admin | update `content` / `layout` |
| DELETE | /admin/sections/:id | admin | remove section |
| PUT | /admin/pages/:pageId/sections/order | admin | drag-and-drop order (array of ids) |
| GET | /admin/templates | admin | list section templates + schemas |

## Media
| Method | Path | Access | Description |
|---|---|---|---|
| POST | /admin/media/upload | admin | multipart → Cloudinary → store metadata |
| GET | /admin/media | admin | list media (paginated) |
| GET | /media/:id | public | single media record |
| DELETE | /admin/media/:id | admin | delete asset + row |

## Collections (CRUD pattern)
| Method | Path | Access |
|---|---|---|
| GET | /events /gallery /sermons /announcements | public (published only) |
| GET | /admin/events /admin/gallery /admin/sermons /admin/announcements | admin |
| POST | /admin/events /admin/gallery /admin/sermons /admin/announcements | admin |
| PATCH | /admin/events/:id ... | admin |
| DELETE | /admin/events/:id ... | admin |

## Settings / Navigation / SEO
| Method | Path | Access | Description |
|---|---|---|---|
| GET | /settings | public | global settings (site, contact, social, service-times, announcements) |
| GET | /admin/settings | admin | all settings incl. drafts |
| PUT | /admin/settings/:key | admin | update a setting blob |
| GET | /navigation | public | published navigation tree |
| PUT | /admin/navigation | admin | replace navigation (labels, urls, order, logo) |
| GET | /seo | public | global SEO (meta + OG) |
| GET | /seo/pages/:slug | public | per-page SEO |
| PUT | /admin/seo | admin | update global SEO |
| PUT | /admin/seo/pages/:pageId | admin | update page SEO |

## Versions / Activity
| Method | Path | Access | Description |
|---|---|---|---|
| GET | /admin/pages/:pageId/versions | admin | version history |
| GET | /admin/versions/:id | admin | single snapshot (rollback target) |
| GET | /admin/activity | admin | activity log (paginated) |

## Error codes
`VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `OTP_EXPIRED`, `OTP_INVALID`, `INTERNAL`.
