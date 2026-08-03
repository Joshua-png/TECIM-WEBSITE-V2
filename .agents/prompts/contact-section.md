# Prompt: Contact Section Template (`site/`)

## Goal
Build the Contact section as the eighth (final) section component: "Stay in Touch" dark band with a cinematic map card (Google Maps iframe with grayscale filter, corner brackets, pulsing pin, location tabs) plus an info column (address + directions, hours, contact). Content matches `site/reference/tecim-home.html` exactly; CMS-driven later.

## Source of truth
- `site/reference/tecim-home.html` lines 539–546 (contact shell), 951–1105 (contact CSS), 1605–1667 (markup), 1790–1803 (tab JS), 1156–1158 (mobile).
- Existing design system in `site/app/globals.css` + `.agents/ui-registry.md`.

## Files likely to change
- `site/components/sections/Contact.tsx` — section (**client**: tab state swaps iframe `src` + tag)
- `site/components/sections/contact/content.ts` — typed content
- `site/app/globals.css` — `.contact`, `.map-*`, `.c-block`, `.hours`, `.directions-btn` styles
- `site/lib/sections.ts` — register `contact`
- `site/app/page.tsx` — render `<Contact />` after `<Gallery />`
- `.agents/specs/SECTION_LIBRARY.md` — real `contact` schema
- `.agents/prompts/contact-section.md` — this file

## Decisions / Assumptions
- Section: `section contact` — `--dark` bg, `--text-on-dark`, `min-height 100vh`, flex column `justify-content center`, `padding 5rem 2.5rem` (vertical only), `position relative`, `overflow hidden`. Grain overlay `.contact-grain` (`opacity .045`). `.contact .section-inner { position: relative; z-index: 1 }`. Mobile ≤640px: `min-height: auto; padding-top/bottom 4rem`.
- Header: `.contact .section-label` gold-bright; `h2` `#fff`; `.contact-sub` `rgba(245,242,237,.55)` `max-width 480`.
- Grid (`.stay-grid`): `1.35fr 1fr`, gap `3rem`, `margin-top 3rem`, `align-items start`; ≤900px → 1 column gap `2.5rem`.
- Map card (`.map-card`): radius `--radius`, overflow hidden, `1px rgba(245,242,237,.12)`, bg `#05070a`, shadow `0 30px 70px rgba(0,0,0,.45)`.
- Frame (`.map-frame-wrap`): `aspect-ratio 4/3.1`, relative. `iframe`: `filter grayscale(1) contrast(1.15) brightness(.75) sepia(.08)` → on `.map-card:hover` `grayscale(.25) contrast(1.05) brightness(.92) sepia(.02)`, `transition filter 1s` cinematic; `loading lazy`, `referrerPolicy no-referrer-when-downgrade`, title. `::after` vertical gradient `rgba(5,7,10,.55) → transparent 22% → transparent 78% → rgba(5,7,10,.65)`; `.map-vignette` `inset 0 0 120px rgba(0,0,0,.65)` `mix-blend multiply`.
- Corner brackets (`.map-corner`): 22×22, `2px` gold-bright `rgba(217,119,6,.85)` borders, 14px inset, tl/tr/bl/br, z-index 3.
- Pin: `.map-pin` center, `translate(-50%,-100%)`; `.map-pin-dot` 12px gold-bright, `mapPulse 2.2s ease-out infinite` (spreading box-shadow); `.map-pin-stem` 1×16 `rgba(217,119,6,.6)`.
- Tag (`.map-tag`): bottom-left glass pill, `0.7rem` uppercase `0.12em`, `rgba(5,7,10,.55)` + `blur(6px)` + `1px rgba(255,255,255,.15)`.
- Tabs (`.map-tabs`): flex gap `0.6rem`, padding `1.1rem 1.1rem 1.3rem`, `border-top rgba(245,242,237,.08)`; `.map-tab` flex 1, `0.8rem`, radius 8, transparent/`rgba(255,255,255,.1)` border, `rgba(255,255,255,.55)`; hover white + border `.3`; active → gold-bright bg/border + `#0a0a0a` text. Mobile ≤640px: gap `0.4rem`, padding `0.9rem`, tab `0.72rem`/`0.6rem 0.3rem`.
- Tab behavior: click swaps active class, iframe `src` (`https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`), and tag text.
- Info column (`.info-stack`): flex column gap `2rem`. `.c-block h4` Inter `0.7rem` `0.14em` uppercase `rgba(255,255,255,.4)`; `li` `rgba(255,255,255,.8)` `1rem`; `a` same → hover turquoise-bright. `.hours li` flex space-between gap `1.5rem` `max-width 260`. `.address-note` `opacity .5` `font-size .85rem`.
- Directions (`.directions-btn`): pill `rgba(255,255,255,.06)` bg + `.18` border, `0.8rem` uppercase; hover gold-bright bg/border + `#0a0a0a` + `translateY(-2px)`. Mobile: `width 100%` centered.
- Phone `tel:` hrefs strip spaces.

## Acceptance criteria
- Contact renders below Gallery matching the reference (dark band, map card + tabs + info column).
- Tabs swap map iframe src, tag text, and active styling.
- Hover on map card eases the grayscale filter off.
- `npm run typecheck`, `npm run lint`, `npm run build` pass (report exact output).
- `.agents/ui-registry.md` updated via imprint.

## Checks to run (from `site/`)
- `npm run typecheck`, `npm run lint`, `npm run build`

## Manual test steps
1. `cd site && npm run dev` → scroll to Contact; cinematic map card + info column.
2. Click Madina / Prampram tabs → iframe re-embeds, tag updates, active pill gold.
3. Hover the map card → filter desaturates.
4. `#contact` anchor from nav + Services CTA/rows.
5. Resize <900px → single column; <640px → tab/tag/directions sizing.
