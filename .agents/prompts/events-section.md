# Prompt: Events Section Template (`site/`)

## Goal
Build the Events section as the sixth section component: "Upcoming gatherings" — a 2-column grid of white conference cards (image + date + title + location) on `--bg-alt`, with hover lift. Content matches `site/reference/tecim-home.html` exactly; CMS-driven later.

## Source of truth
- `site/reference/tecim-home.html` lines 797–830 (events CSS), 1525–1549 (markup).
- Existing design system in `site/app/globals.css` + `.agents/ui-registry.md`.

## Files likely to change
- `site/components/sections/Events.tsx` — section (server component, static)
- `site/components/sections/events/content.ts` — typed content
- `site/app/globals.css` — `.events`, `.evt-*` styles
- `site/lib/sections.ts` — register `events`
- `site/app/page.tsx` — render `<Events />` after `<Services />`
- `.agents/specs/SECTION_LIBRARY.md` — real `events` schema
- `.agents/prompts/events-section.md` — this file

## Decisions / Assumptions
- Section: `section events` (`.events { background: var(--bg-alt) }`), standard section padding.
- Grid (`.evt-grid`): `repeat(2, 1fr)` gap `1.5rem` margin-top `2.5rem`; ≤750px → 1 column.
- Card (`.evt-card`): grid `180px 1fr`, `#fff` bg, radius `--radius`, `overflow hidden`, `1px var(--border)`; hover → `translateY(-4px)` + `0 16px 36px rgba(0,0,0,.08)` (0.35s). ≤550px → 1 column (image stacks above body).
- Image (`.evt-img`): `min-height 160px`, `overflow hidden`, `next/image` fill cover.
- Body (`.evt-body`): padding `1.6rem`, flex column centered.
- `.evt-date`: `0.75rem` weight 600 `0.06em` uppercase gold; h3 serif `1.2rem`; `.evt-loc` `0.9rem` muted.
- Unmapped `next/image`: use `fill` + `sizes`; images are `images.unsplash.com` (already whitelisted in `next.config.ts`).

## Acceptance criteria
- Events renders below Services matching the reference (bg-alt band, label, h2, 2 cards).
- Hover lift + shadow on cards; responsive breakpoints correct.
- `npm run typecheck`, `npm run lint`, `npm run build` pass (report exact output).
- `.agents/ui-registry.md` updated via imprint.

## Checks to run (from `site/`)
- `npm run typecheck`, `npm run lint`, `npm run build`

## Manual test steps
1. `cd site && npm run dev` → scroll to Events; two white cards on `--bg-alt`.
2. Hover a card → lifts with shadow.
3. Resize <750px → single column; <550px → image stacks above body.
4. `#events` anchor from nav.
