# Prompt: About Section Template (`site/`)

## Goal
Build the About section as the second section component: image-left visual with a floating glass badge, headline, description, ✓ check-list, and a closing line with strong partner names. Content matches `site/reference/tecim-home.html` exactly; CMS-driven later.

## Source of truth
- `site/reference/tecim-home.html` lines 579–630 (about CSS), 1391–1416 (markup), 1153 (mobile).
- Existing design system in `site/app/globals.css` + `.agents/ui-registry.md`.

## Files likely to change
- `site/components/sections/About.tsx` — section (server component + `Reveal`)
- `site/components/sections/about/content.ts` — typed content
- `site/app/globals.css` — `.about`, `.about-grid`, `.about-visual`, `.about-badge`, `.check-list` styles
- `site/lib/sections.ts` — register `about`
- `site/app/page.tsx` — render `<About />` after `<Hero />`
- `.agents/specs/SECTION_LIBRARY.md` — real `about_image_left` schema
- `.agents/prompts/about-section.md` — this file

## Decisions / Assumptions
- Full-viewport section (`100dvh`), centered vertically, `--bg-alt` background; content scrolls internally on short viewports.
- Grid `1.05fr 1fr` (→ 1fr ≤900px); visual `aspect-ratio 4/3.4`, `max-height 60vh` (46vh mobile), radius `--radius`, soft shadow.
- Badge: glass `rgba(15,17,21,.85)` + `blur(12px)`, serif title + Inter subtitle.
- Check-list: `✓` in a 22px turquoise circle (`rgba(15,118,110,.12)` bg).
- Partner names rendered `<strong>` in `--text` color.
- Image via `next/image` (`fill`, `object-fit: cover`).

## Acceptance criteria
- About renders below the hero, matching the reference layout at desktop + ≤900px + ≤640px.
- `npm run typecheck`, `npm run lint`, `npm run build` pass (report exact output).
- `.agents/ui-registry.md` updated via imprint.

## Checks to run (from `site/`)
- `npm run typecheck`, `npm run lint`, `npm run build`

## Manual test steps
1. `cd site && npm run dev` → scroll past hero; About fades in (reveal), image + badge + check-list visible.
2. Resize: grid stacks ≤900px; full-viewport vertical centering retained; visual shrinks to 46vh ≤640px.
3. `#about` anchor works from the nav.
