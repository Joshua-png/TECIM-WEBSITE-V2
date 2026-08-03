---
name: preview-publish-version
description: Use when implementing or debugging the draft → preview → publish → rollback workflow on TECIM. Front-load "preview", "publish", "version", "rollback", "draft".
---

# Preview, Publish & Versioning

## Preview (drafts)

- The **site only ever renders published** content.
- Admin edits are saved as `draft` — the live site is unchanged.
- Preview: admin (or the preview route) calls `GET /api/v1/admin/pages/:id/preview` with the admin JWT, which returns the current draft (page + sections).
- The preview route (`site/app/preview/page.tsx`) is protected and renders the draft exactly like the published renderer — same components, same data shape.
- Publish only when the preview looks right.

## Publish

`POST /api/v1/admin/pages/:id/publish`:
1. Snapshot the page + all its sections (full JSON) into a new `versions` row (`number = last + 1`).
2. Set `status = published` on page and sections; stamp `published_version_id`.
3. Trigger Next.js on-demand revalidation (site reflects changes in seconds).

## Rollback

`POST /api/v1/admin/pages/:id/rollback/:versionId`:
1. Read the immutable snapshot.
2. Restore page + sections from it.
3. Create a new version (history is never rewritten) and re-publish.

## Never

Mutate a published version row in place.
