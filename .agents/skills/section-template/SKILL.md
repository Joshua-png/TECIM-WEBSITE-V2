---
name: section-template
description: Use when adding a new section template to the TECIM section library — the pre-built sections the admin can drop onto a page. Front-load "new section", "add template", "section library".
---

# Create a New Section Template

Purpose: add a pre-built section the admin can place on a page and fill with text/images.

## Steps

1. **Define the template** — add a row to `section_templates` (migration or seed):
   - `slug`: kebab-case, e.g. `about_image_left`.
   - `name`: human label, e.g. "About — Image Left".
   - `schema`: JSON describing editable fields (drives the admin form).
   - `component_name`: React component that renders it.
2. **Zod schema** in `api/src/validators/sections.ts` — validate every `content` field (string, url, media id, etc.).
3. **React component** in `site/components/sections/<Name>.tsx` — renders only declared fields. Design/spacing/animation are hard-coded in the component.
4. **Register** in `site/lib/sections.ts` (template slug → component) and in the admin template picker.
5. **Admin form** in `admin/components/forms/` generated from the field schema (text, textarea, image picker, button link).
6. **Test the flow**: save draft → preview → publish → version snapshot → rollback.

## Never

Add raw HTML/CSS/spacing controls to a template schema. A new visual design is a code change, not a CMS field. Update `.agents/specs/SECTION_LIBRARY.md` when the library changes.
