# Prompt: Gallery Section Template (`site/`)

## Goal
Build the Gallery section as the seventh section component: a cinematic dark marquee with two CSS-animated rows of grayscale frames (colorize + scale on hover), edge fades, film grain, reel tag, and a "View more →" link. Content matches `site/reference/tecim-home.html` exactly; CMS-driven later.

## Source of truth
- `site/reference/tecim-home.html` lines 832–949 (gallery CSS), 1551–1603 (markup), 1162 (mobile `.gallery .section-inner`).
- Existing design system in `site/app/globals.css` + `.agents/ui-registry.md`.

## Files likely to change
- `site/components/sections/Gallery.tsx` — section (server component; marquee is pure CSS animation)
- `site/components/sections/gallery/content.ts` — typed content
- `site/app/globals.css` — `.gallery`, `.gal-*` styles + keyframes
- `site/lib/sections.ts` — register `gallery`
- `site/app/page.tsx` — render `<Gallery />` after `<Events />`
- `.agents/specs/SECTION_LIBRARY.md` — real `gallery` schema
- `.agents/prompts/gallery-section.md` — this file

## Decisions / Assumptions
- Section: `section gallery` — `--dark` bg, `padding: 5.5rem 0` (no horizontal padding), `position: relative`, `overflow: hidden`; `.gallery .section-inner { padding: 0 2.5rem; z-index: 2; position: relative; }`. Mobile ≤640px: `padding: 4rem 0`, inner `padding: 0 1.25rem`.
- Grain overlay `.gallery-grain`: absolute inset 0, z-index 1, SVG turbulence noise, `opacity .05`, `mix-blend overlay`, pointer-events none.
- Header: `.gallery .section-label` gold-bright; `h2` text-on-dark; `.gal-sub` `rgba(245,242,237,.6)` max-width 460; `.gal-reel-tag` uppercase `0.72rem` `0.2em` `rgba(245,242,237,.45)` with 22×1px line `::before`.
- Marquee (`.gal-marquee`): `margin-top 3rem`, relative, z-index 2; `.gal-edge left/right` 8vw vertical dark fades z-index 3 (12vw ≤700px, 14vw ≤480px).
- Rows: `.gal-row` `display:flex; width:max-content; gap:1rem; will-change:transform`, `+margin-top 1rem`. `.row-a` → `galScrollLeft 52s linear infinite` (0→-50%); `.row-b` → `galScrollRight 60s` (-50%→0). Pause on `.gal-marquee:hover`. Reduced motion → `animation: none`. Mobile ≤480px: gap 0.6, row gap 0.6, durations 32s/38s.
- Frames (`.gal-frame`): `flex:0 0 auto; 300×210px` (`.row-b .gal-frame` `240×320px`), radius 6, overflow hidden, `1px rgba(245,242,237,.08)`, `position: relative` (fill parent). ≤700px: 210×150 / row-b 160×220; ≤480px: 150×108 / row-b 115×160, radius 4.
- Image: `next/image fill` + `sizes` per row; CSS `.gal-frame img` `object-fit: cover`, `filter: grayscale(.85) contrast(1.08) brightness(.82)`, `transform: scale(1.03)`, transitions `filter .6s`, `transform .9s` cinematic; hover → `grayscale(0) contrast(1.02) brightness(.98)` + `scale(1.1)`. `::after` bottom gradient `transparent 55% → rgba(0,0,0,.55)`.
- Index (`.gal-index`): Cormorant `0.85rem` `0.06em` `rgba(255,255,255,.75)`, bottom-left, hidden (`opacity 0`, `translateY(6px)`) until frame hover. Auto-numbered: row-a `01–07`, row-b `08–13` (generated from row offsets, not CMS data). ≤480px `0.7rem` `bottom .5rem left .6rem`.
- Seamless loop: each row renders its image set twice.
- `.gal-more`: turquoise-bright uppercase `0.85rem` `0.06em`, gap `0.4rem→0.7rem` hover, `margin-top 2.5rem`, z-index 2. Unwrapped (no reveal).
- Decorative images → `alt=""` (matches reference).

## Acceptance criteria
- Gallery renders below Events matching the reference (dark band, header, reel tag, two scrolling rows, edge fades, more link).
- Rows loop seamlessly; hover pauses + colorizes; frames lift index badge.
- `npm run typecheck`, `npm run lint`, `npm run build` pass (report exact output).
- `.agents/ui-registry.md` updated via imprint.

## Checks to run (from `site/`)
- `npm run typecheck`, `npm run lint`, `npm run build`

## Manual test steps
1. `cd site && npm run dev` → scroll to Gallery; dark marquee with grayscale frames scrolling opposite directions.
2. Hover the marquee → animation pauses; hover a frame → colorizes, scales, shows index.
3. Resize → frame sizes change at 700px / 480px.
4. `#gallery` anchor from nav.
