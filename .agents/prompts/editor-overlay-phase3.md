# Phase 3 — In-place editor overlay (click-to-edit on the site preview)

## Goal
Give the admin a click-to-edit experience on **rendered sections**: the site's draft
preview tab (already rendering sections with `editable=true` from Phase 2) becomes the
editing canvas. Hover shows an outline on editable text; clicking opens a small
in-place input; saving PATCHes the section draft via the existing admin API and the
DOM updates immediately. Images stay tagged but inert — the Cloudinary picker arrives
in Phase 4. Architecture confirmed with user: overlay lives on the **site preview tab**
(not embedded in the admin dashboard).

## Why preview tab (decided)
- The preview already renders pixel-perfect via the real site renderer + site CSS — zero
  token-scoping/re-theming work, no duplicated section registry in the admin.
- The preview URL already carries the admin access JWT as `?token=…`, and `getDraftPreview`
  returns full sections including `id`.
- Dev CORS already allows `http://localhost:3000` (`api/src/config/env.ts`).
- Deploy note: prod `CORS_ORIGINS` must include the site domain (overlay is a new
  browser→API caller from the site origin). Documented in DEPLOYMENT.md.

## Files to change
- NEW `site/components/editor/EditableOverlay.tsx` — client overlay component.
- `site/app/preview/page.tsx` — wrap each rendered section in
  `<div data-section-id={section.id} style={{ display: "contents" }}>`, render overlay.
- `site/app/preview/section/[template]/page.tsx` — same wrapper + overlay (single section).
- `admin/app/(dashboard)/pages/[id]/page.tsx` — rename "Preview site" → "Preview & edit".
- `admin/components/builder/SectionEditorModal.tsx` — rename "Preview section" → "Preview & edit".
- `shared/editor/path.ts`, `api`, admin build tools: **no changes**.

## Decisions / assumptions
- **Overlay is client-only** (`"use client"`), rendered only when token + sections present.
  Activated by a toggle (default ON); toggling off removes hover outlines and disables
  click-to-edit. Body class `tecim-ec` + an injected `<style>` scope all overlay CSS —
  no site stylesheet changes, public pages untouched.
- **Click handling** uses a document-level capture listener; on an editable text span it
  `preventDefault()` + `stopPropagation()` so hero film-cards/pills and gallery/contact
  links do not trigger their own handlers. `closest("[data-section-id]")` gives the
  section; `data-editable-path` gives the content key; value read via `getPath`.
- **Save = full-content PATCH.** `section.repo.update` replaces `content` wholesale
  (`COALESCE($2, content)`) and the service re-validates against the template AJV schema,
  so the overlay keeps a local `contents` map seeded from the preview payload and sends
  `setPath(current, path, draft)` each save (sequential edits safe, no stale writes).
- **DOM update after save** targets ALL nodes matching the section+path (`querySelectorAll`)
  so duplicated fields (gallery marquee `rowA.n`/`rowB.n`, hero identity label in pills +
  finish-line) all update in place. No router refresh needed.
- **Editor UX**: single-line value → `<input>` (Enter saves); value containing `\n` →
  `<textarea>` (Enter newline, Cmd/Ctrl+Enter saves). Esc cancels. Click outside cancels.
  Editor closes on scroll. Save button uses `onMouseDown` preventDefault so the input
  doesn't blur before the click. Fixed-position box overlays the clicked node.
- **Toast** (saved / error from the API envelope) + bottom-center toolbar with edit-mode
  toggle and Refresh (`router.refresh()`, preview is `force-dynamic`).
- All tagged text values are strings (verified: hero `num` is `string`). Images inert in
  this phase.
- Draft-only: saves never touch published content, versions, or the live site; publish is
  unchanged in the admin.

## Acceptance criteria
- Preview with valid token: edit-mode toggle visible; text fields show dashed amber outline
  on hover (and NOT in the public site).
- Click text → in-place editor pre-filled; save updates the clicked text (and duplicate
  paths) immediately + "Saved" toast; refresh shows the change (draft persisted).
- Hero pills/film-cards do NOT open the drawer when clicking their editable text.
- Esc / outside click / scroll cancels without saving. Toggle off disables everything.
- Public homepage unchanged: byte-identical `<main>`, no `data-section-id`, no `tecim-ec`,
  no overlay markup/styles.
- Preview without token/sections still shows the existing "incomplete/invalid" notice.

## Checks (from site/ and admin/ roots)
- `npm run typecheck` · `npm run lint` · `npm run build` (site; admin only label changes).
- Re-run Phase 1 byte-identity check on the public homepage (strip scripts/hashes, diff `<main>`).
- API unchanged — no API checks needed.

## Manual test steps
1. API up: `lsof -ti tcp:4000` (start with `npm run dev` in `api/` if not). Site dev on `:3000`, admin on `:3001`.
2. Admin → open a page → "Preview & edit" → the draft preview opens with edit mode on.
3. Hover text fields (dashed amber outline). Click the hero title → editor appears → change → Enter → text updates + "Saved"; refresh → persists.
4. Click a hero identity label in the pills row → both the pill and the finish-line text update.
5. Click a film-card title's editable span → drawer must NOT open; editor shows.
6. Type "…\n…" into a long description → textarea mode; Cmd+Enter saves, Enter adds a newline.
7. Esc / click outside → cancels. Toggle edit mode off → outlines disappear, clicks inert.
8. `SITE_URL/` (public) → no overlay, no `data-section-id`, byte-identical.
9. `SITE_URL/preview?pageId=<id>` (no token) → "incomplete" notice.
10. Admin "Publish" still works; live site reflects the publish as before.

## Post-Phase-4 fixes (2026-08-04)
- **Editor vanish on open**: `focus({ preventScroll: true })`, viewport-clamped editor
  positioning (`useLayoutEffect`; flips above the field when it would overflow the bottom),
  and a 250 ms grace period after open during which scroll events are ignored.
- **Long text hidden in single-line input**: values longer than 32 chars (or containing
  `\n`) now open in an auto-growing textarea (resized via `scrollHeight` in the layout
  effect, capped at `40vh` with internal scroll). Internal editor scrolls no longer close
  the editor (scroll-close handler ignores targets inside `.tecim-ec-editor`).
- **Editability affordance**: edit mode now shows faint dashed amber outlines on all
  editable fields at rest; hover strengthens them. Toolbar hint: "Dashed = editable · click to edit".

## Fix (2026-08-04): empty `src` when a section is missing an image
`imageUrl()` returned "" for missing image values, and `<Image src="">` produced a
Next.js warning (and could refetch the page). Added `shared/sections/SectionImage.tsx`
(a thin `next/image` wrapper): when `src` is falsy it renders a subtle
`.section-image-fallback` placeholder ("Add an image" for About, "No image" elsewhere)
instead of an empty `<img>`; when a real image is present the markup is byte-identical
to a plain `<Image>`. Wired into About, Events, Gallery, and Hero (both background and
film-card images). In edit mode the placeholder sits inside `EditableImage`, so clicking
it still opens the image picker; saving re-renders via `router.refresh()`.
