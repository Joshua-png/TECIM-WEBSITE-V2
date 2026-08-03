# Prompt: Values Section Template (`site/`)

## Goal
Build the Values section as the third section component: "Elevation-style" divided columns — three cards separated by hairline borders, each with a numbered turquoise marker, serif title, and muted body. Content matches `site/reference/tecim-home.html` exactly; CMS-driven later.

## Source of truth
- `site/reference/tecim-home.html` lines 632–663 (values CSS), 1418–1441 (markup).
- Existing design system in `site/app/globals.css` + `.agents/ui-registry.md`.

## Files likely to change
- `site/components/sections/Values.tsx` — section (server component + `Reveal`)
- `site/components/sections/values/content.ts` — typed content
- `site/app/globals.css` — `.values-grid`, `.value-card`, `.value-num` styles
- `site/lib/sections.ts` — register `values`
- `site/app/page.tsx` — render `<Values />` after `<About />`
- `.agents/specs/SECTION_LIBRARY.md` — real `values` schema
- `.agents/prompts/values-section.md` — this file

## Decisions / Assumptions
- Default light background (`--bg`), standard section padding.
- Grid `repeat(3, 1fr)` with `border-top` on the grid; each card `border-left` hairline (first card none). ≤850px: stack to 1fr with `border-top` dividers instead.
- Card number (`01`, `02`, …) auto-generated from index — presentation, not CMS data. Turquoise, Inter, `0.72rem` uppercase `0.16em`.
- `h3` `1.5rem` serif, body `0.98rem`/`1.65`.

## Acceptance criteria
- Values renders below About matching the reference at desktop + ≤850px.
- `npm run typecheck`, `npm run lint`, `npm run build` pass (report exact output).
- `.agents/ui-registry.md` updated via imprint.

## Checks to run (from `site/`)
- `npm run typecheck`, `npm run lint`, `npm run build`

## Manual test steps
1. `cd site && npm run dev` → scroll to Values; three numbered columns with hairline dividers.
2. Resize ≤850px: columns stack with top borders.
3. `#values` anchor works from the nav.
