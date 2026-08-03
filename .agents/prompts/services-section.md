# Prompt: Services Section Template (`site/`)

## Goal
Build the Services section as the fifth section component: "What's Happening" list of three full-width row links (date, tag pill, title+copy, arrow) with hover states, plus a header with a "Plan a Visit →" CTA. **Faithful to the reference** — no numbers, no tabs (user decision 2026-08-03). Content matches `site/reference/tecim-home.html` exactly; CMS-driven later.

## Source of truth
- `site/reference/tecim-home.html` lines 736–795 (services CSS), 1473–1523 (markup). Mobile grid rules at 785–795.
- Existing design system in `site/app/globals.css` + `.agents/ui-registry.md`.

## Files likely to change
- `site/components/sections/Services.tsx` — section (server component, static)
- `site/components/sections/services/content.ts` — typed content
- `site/app/globals.css` — `.wh-*` styles
- `site/lib/sections.ts` — register `services`
- `site/app/page.tsx` — render `<Services />` after `<Vision />`
- `.agents/specs/SECTION_LIBRARY.md` — real `services` schema
- `.agents/prompts/services-section.md` — this file

## Decisions / Assumptions
- Header (`.wh-head`): flex `space-between` end-aligned, wrap, gap `1.5rem`, `margin-bottom 3rem`. Label + `h2` + `.wh-sub` (`max-width 460px`, `margin-top .85rem`).
- CTA (`.wh-cta`): dark pill (`--dark`, white text, radius 999, uppercase `0.8rem` `0.04em`, gap `0.5rem`), hover → `--turquoise` bg + `translateY(-2px)`. Links `#contact`.
- List (`.wh-list`): `border-top` hairline.
- Rows (`.wh-row`): anchors, grid `130px 130px 1fr 28px`, `gap 1.75rem`, padding `1.85rem .5rem`, `border-bottom` hairline; hover → `--bg-alt` + `padding-left 1rem` (0.3s ease).
- Date: `wh-day` Cormorant `1.7rem/600`, `wh-time` `0.8rem` muted. Tag: gold outline pill (`0.68rem` uppercase `0.08em`, radius 999). Copy: h3 `1.3rem` (serif), p `0.95rem`. Arrow: `1.3rem` muted, `justify-self end`; hover → `translateX(6px)` + turquoise.
- ≤720px: grid `1fr auto` with areas `date arrow / tag tag / copy copy`; date row-direction baseline with gap `0.5rem`.
- No numbering, no tabs (per user decision).

## Acceptance criteria
- Services renders below Vision matching the reference (header + 3 rows + hover states).
- `#services` anchor works; CTA + rows link `#contact`.
- `npm run typecheck`, `npm run lint`, `npm run build` pass (report exact output).
- `.agents/ui-registry.md` updated via imprint.

## Checks to run (from `site/`)
- `npm run typecheck`, `npm run lint`, `npm run build`

## Manual test steps
1. `cd site && npm run dev` → scroll to Services; header + CTA + 3 rows with hairline dividers.
2. Hover a row → background `--bg-alt`, padding shifts right, arrow slides + turquoise.
3. Resize <720px → rows restack (date+arrow top row, tag, copy).
4. `#services` from nav; CTA/rows → `#contact`.
