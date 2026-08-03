# Prompt: Vision Section Template (`site/`)

## Goal
Build the Vision section as the fourth section component: dark band with a teal radial glow, Vision/Mission auto-sliding carousel (dots control, 5s auto-advance) inside a glass card. Content matches `site/reference/tecim-home.html` exactly; CMS-driven later.

## Source of truth
- `site/reference/tecim-home.html` lines 665–734 (vision CSS), 1443–1471 (markup), 1770–1782 (JS), 1155 (mobile).
- Existing design system in `site/app/globals.css` + `.agents/ui-registry.md`.

## Files likely to change
- `site/components/sections/Vision.tsx` — section (client: carousel state + auto-slide)
- `site/components/sections/vision/content.ts` — typed content
- `site/app/globals.css` — `.vision-band`, `.vm-*` carousel styles
- `site/lib/sections.ts` — register `vision`
- `site/app/page.tsx` — render `<Vision />` after `<Values />`
- `.agents/specs/SECTION_LIBRARY.md` — real `vision` schema
- `.agents/prompts/vision-section.md` — this file

## Decisions / Assumptions
- Dark band `--dark`, `--text-on-dark`, `overflow hidden`, radial teal glow `::before` (`rgba(20,184,166,.08)`, top-right).
- Section label gold-bright; `h2` white.
- Carousel: `max-width 620px`, glass viewport (`rgba(255,255,255,.04)` + `1px rgba(255,255,255,.08)` border, radius `--radius`), track `translateX(-index*50%)` over `0.9s cubic-bezier(0.65,0,0.35,1)`.
- Slide accent bars are presets in code: Vision → turquoise-bright, Mission → gold-bright (3px top bar).
- Dots: 8px inactive `rgba(255,255,255,.22)` → 24px turquoise-bright active.
- Auto-advance 5s; disabled under reduced motion (`matchMedia`). Dots + keyboard accessible.
- Slide heading + content per slide; `vm-slide h3` is Inter `0.7rem` uppercase `0.16em` (overrides global serif h3).

## Acceptance criteria
- Vision renders below Values matching the reference (dark band, glow, carousel, dots).
- Carousel auto-slides every 5s; dots switch slides.
- `npm run typecheck`, `npm run lint`, `npm run build` pass (report exact output).
- `.agents/ui-registry.md` updated via imprint.

## Checks to run (from `site/`)
- `npm run typecheck`, `npm run lint`, `npm run build`

## Manual test steps
1. `cd site && npm run dev` → scroll to Vision; dark band with teal glow, carousel card + dots.
2. Dots switch Vision/Mission; auto-advance pauses? (reference keeps auto-advancing — verify it cycles).
3. `#vision` anchor works from the nav.
