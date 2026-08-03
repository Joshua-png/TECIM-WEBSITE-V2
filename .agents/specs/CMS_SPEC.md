# CMS_SPEC.md — CMS Specification

A custom **Visual Page Builder** for a single admin. The admin edits data, not design.

## Core Modules

### 1. Dashboard
- Overview: pages, published vs draft count, latest activity, recent versions.

### 2. Pages
- List pages with status (draft / published) and last-published time.
- Create/edit page: slug, title.
- Publish / rollback controls per page.

### 3. Section Builder
- Add section → choose a template from the library.
- Fill in editable fields (text, image from media library, button text/link).
- Choose a **layout variant** (presets only).
- Drag-and-drop to reorder; `display_order` updated on save.
- Live preview of the current draft (same renderer as the site).

### 4. Section Templates
- Library of pre-built templates (`.agents/specs/SECTION_LIBRARY.md`).
- Each template defines its editable schema; the admin form is generated from it.

### 5. Preview System
- Two states: `draft` (admin only) and `published` (public site).
- Preview renders the current draft exactly like the published site (protected route).
- The public site never sees drafts.

### 6. Publishing & Versioning
- Publish snapshots page + sections into an immutable `versions` row, marks content published, triggers site revalidation (changes live in seconds).
- Every save/publish creates a version (`Version 1, 2, 3, ...`).
- Rollback restores any prior version and re-publishes.

### 7. Media Library
- Upload to Cloudinary; store `public_id`, `secure_url`, `width`, `height`.
- Browse, search, and pick images/videos in any image field.

### 8. Content Collections (CRUD)
- Events, Gallery, Sermons, Announcements (and future Blog).
- Published items appear on the site via their sections/components.

### 9. Settings
- Site name, contact info (phone, email, address), social links, service times, announcements banner.

### 10. Navigation
- Add/remove/reorder links, set URL or target page, logo image.

### 11. SEO
- Global meta title/description/OG image.
- Per-page meta title/description/OG image.

### 12. Activity Log
- Audit trail of every action (login, create, update, publish, rollback, delete) — even with one admin, useful for tracking.

### 13. Versions & Rollback UI
- Per-page history list; one click to preview and restore a version.

## Never Editable (by design)
HTML, CSS, Tailwind classes, spacing, typography, animations, gradients, overlays, grids, responsive behavior. See `AGENTS.md` §7.

## Roadmap (future)
- Scheduled publishing.
- Theme manager (preset visual themes).
- Analytics dashboard.
- Contact form manager.
- Backup / restore.
- Multi-language (if ever needed).
