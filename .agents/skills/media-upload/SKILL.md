---
name: media-upload
description: Use when implementing or extending Cloudinary image/video uploads in the TECIM media library. Front-load "upload", "Cloudinary", "media library", "image".
---

# Cloudinary Media Upload

- Upload endpoint `POST /api/v1/admin/media/upload` (multipart, admin JWT).
- Service uploads to Cloudinary into a restricted folder (e.g. `tecim/site`).
- Store **only** `public_id`, `secure_url`, `width`, `height` in the `media` table.
- Serve via Cloudinary auto-format: `f_auto`, `q_auto`, WebP; use `next/image` on the site.
- Deletion: `DELETE /api/v1/admin/media/:id` removes the Cloudinary asset and the DB row.

## Rules

- Never trust a client-supplied URL — derive metadata from the Cloudinary upload response.
- Rate-limit uploads per IP/user.
- All image fields across section templates reference `media` records, never arbitrary URLs.
