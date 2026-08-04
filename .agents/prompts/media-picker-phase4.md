# Phase 4 — In-place image replacement (media picker in the preview overlay)

## Goal
Let the admin swap images by clicking them in the preview canvas. Clicking an editable
image (`data-editable-type="image"`) opens a small media-library picker inside the
overlay; selecting an asset replaces the field's `ImageValue`, PATCHes the section draft,
and swaps the displayed image in place. Text editing from Phase 3 is unchanged.

## Why this approach
- The image fields are already tagged (50 in the preview DOM) and inert in Phase 3.
- The API already exposes `GET /api/v1/admin/media?page=&perPage=` (paginated, JWT) and
  the record shape (`Media`: `id`, `publicId`, `secureUrl`, `width`, `height`,
  `resourceType`, `format`, `sizeBytes`, `altText`, …). No backend changes.
- Envelope: `{ success, data: [...], meta: { page, perPage, total } }`.
- Template schema (`api/src/config/templates.ts` `imageField`): `oneOf [string, object]`
  with the object requiring `public_id` + `secure_url`; `width`/`height` are `integer`
  (so they must be omitted when null). Saved value = `{ public_id, secure_url,
  ...(width!=null && {width}), ...(height!=null && {height}) }`.
- Cloudinary `next/image` renders responsive `srcset`; after a save we swap via
  `img.removeAttribute("srcset")` + `img.src = secureUrl` on the `<img>` inside each
  matching tag (marquee/duplicate paths handled by `querySelectorAll`). On refresh,
  `next/image` re-renders proper transforms.

## Files to change
- `site/components/editor/EditableOverlay.tsx` — extend click handler to open the picker
  for image fields; add picker modal (fetch, grid, pager, empty/error/loading states),
  image hover outline CSS, and `handlePick` (setPath → PATCH → DOM swap → toast).
- No changes to shared/, api/, admin/, site preview pages.

## Decisions / assumptions
- Picker is pick-only: lists `resourceType === "image"` assets, perPage 60, simple
  prev/next pager. Upload stays in the admin Media page.
- Only a valid token opens it (same guard as text editing: edit mode ON + preview token).
- Grid uses plain `<img>` with the MediaPicker-style `eslint-disable-next-line
  @next/next/no-img-element` comment (site runs `next/core-web-vitals`).
- Duplicate paths (gallery marquee, hero bg across slides) all update via `querySelectorAll`.
- Draft-only; publish/versioning unchanged.

## Acceptance criteria
- Edit mode ON: image fields show a hover outline (distinct cursor) in the preview only.
- Click an image → picker opens listing library images (paginated); empty library shows a
  hint; error shows the API message.
- Pick an asset → image swaps in place on all duplicates + "Saved" toast; refresh shows
  the change persisted (draft). The `width`/`height` are only included when non-null.
- Esc / outside click / X closes the picker without saving.
- Public homepage: still byte-identical; no picker/overlay markup leaks.

## Checks (from site/)
- `npm run typecheck` · `npm run lint` · `npm run build`.
- Re-verify public homepage `<main>` byte-identity + leak scan (`data-section-id`,
  `data-editable`, `tecim-ec`, picker classes) via a prod server fetch.

## Manual test steps
1. API :4000, site dev :3000, admin :3001 up. Admin → page → Preview & edit.
2. Hover an image (outline appears). Click the hero background → picker opens → pick a
   library image → background swaps + "Saved". Refresh → persists (draft).
3. Click a gallery marquee image → all copies of that frame update.
4. Click a film-card image → swaps; drawer does NOT open.
5. Empty library / offline API → picker shows the hint/error; X / Esc closes.
6. `http://localhost:3000/` → byte-identical, no leaks.
