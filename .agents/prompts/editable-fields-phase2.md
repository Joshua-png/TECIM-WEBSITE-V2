# Prompt: Editable-field tagging (Phase 2)

## Goal
Give the shared section components a way to declare which rendered nodes are
admin-editable, without any change to public-site output. The admin app will
later consume these tags to build the click-to-edit overlay.

## Files likely to change
- `shared/editor/EditableText.tsx` (new)
- `shared/editor/EditableImage.tsx` (new)
- `shared/editor/path.ts` (new — getPath/setPath helpers for the overlay)
- `shared/index.ts` (export primitives)
- All 8 section components + `InsightDrawer.tsx` (tag editable nodes)
- `site/lib/sections.ts` + both preview routes (thread `editable` flag)

## Decisions / assumptions
- Primitives are plain function components (no hooks) so server and client
  sections can both use them.
- `editable` defaults to `false` → `EditableText`/`EditableImage` return
  `<>{children}</>` exactly, so the public homepage markup stays byte-identical.
- When `editable` is true, the primitive wraps children in a `span` with
  `data-editable-path` (dot path into the section's content JSON) and
  `data-editable-type` (`text` | `image`), using `display: contents` so the
  wrapper never affects layout (incl. `fill` images).
- Paths use dot notation with numeric array indices, e.g.
  `identities.1.steps.2.title`, `cards.0.text`, `rowA.3`.
- Auto-generated presentational numbers (value-card `01`, gallery frame
  `01–13`, hero finish-line prefix) are NOT tagged.
- Site preview routes render with `editable`; the public homepage does not.
- Design tokens: wrappers add no classes, so token scoping (site vs admin) is
  still a Phase 3 task.

## Acceptance criteria
- Every editable text/image node in all 8 sections is tagged.
- `EditableText`/`EditableImage` with `editable` false produce no wrapper.
- Public homepage output unchanged (byte-identical check against Phase 1).
- Preview routes emit `data-editable-path` attributes.

## Checks to run
- `npm run typecheck` + `npm run lint` + `npm run build` in `site/` and `admin/`.
- Fetch homepage and preview (with a token) and inspect tags.

## Manual test steps
1. Start API + site dev.
2. Open site `/` → no `data-editable-path` in HTML.
3. Open an admin Preview link (page or section) → each editable field carries
   `data-editable-path` + `data-editable-type`.
