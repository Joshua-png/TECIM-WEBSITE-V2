---
name: add-page
description: Use when adding a new page to the TECIM site via the CMS. Front-load "new page", "add page", "create a page".
---

# Add a New Page

1. Admin creates a page (`POST /api/v1/admin/pages`) with `slug`, `title`, default `status = draft`.
2. Add sections to it (see the `section-template` skill).
3. Publish (`POST /api/v1/admin/pages/:id/publish`) → version snapshot + on-demand revalidation.
4. Site renders it via `site/app/[slug]/page.tsx` — **no code change needed** for new content pages.
5. Set page SEO (meta title/description/OG) from the SEO admin screen.

## Rules

- Slugs are unique and kebab-case.
- New pages start as drafts — never publish without admin confirmation.
- A published page's content is snapshotted into `versions`; rollback restores any prior version.
