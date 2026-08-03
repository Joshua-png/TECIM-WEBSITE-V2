# Prompt: Hero Section Template (`site/`)

## Goal
Build the cinematic identity hero as the first section component in `site/`: filmstrip of process cards, identity pills (Light / Trumpets / Swords), auto-rotating backgrounds with Ken Burns, and the step-insight drawer (bottom sheet mobile / side panel desktop). Content matches `site/reference/tecim-home.html` exactly; it will be CMS-driven later.

## Source of truth
- `site/reference/tecim-home.html` lines 167–510 (hero CSS), 1195–1389 (hero markup), 1390–1401 (drawer markup), 1744–1768 & 1806–1851 (hero JS).
- Design tokens already implemented in `site/app/globals.css` + `.agents/ui-registry.md`.

## Files likely to change
- `site/components/sections/Hero.tsx` — main section (client)
- `site/components/sections/hero/content.ts` — typed, hard-coded hero content (CMS data later)
- `site/components/sections/hero/InsightDrawer.tsx` — drawer (client)
- `site/lib/sections.ts` — template registry (slug → component), scaffold
- `site/app/globals.css` — hero + filmstrip + drawer + finish-line styles (design system)
- `site/next.config.ts` — `images.remotePatterns` (unsplash + tecim-website.netlify.app)
- `site/app/page.tsx` — render `<Hero />`, drop the placeholder shell
- `.agents/specs/SECTION_LIBRARY.md` — update `hero` schema to the real filmstrip hero
- `.agents/prompts/hero-section.md` — this file

## Decisions / Assumptions
- Hero is a client component (`"use client"`) — pills, auto-rotate interval (9s, stops on user interaction), drawer state.
- Identity accents are presets in code (`light` → turquoise-bright, `trumpets` → gold-bright, `swords` → rose `#e11d48`) — never CMS-editable colors.
- Backgrounds + card images use `next/image` with `fill`; `images.remotePatterns` for `images.unsplash.com` and `tecim-website.netlify.app` (Cloudinary pattern added later).
- Drawer: `<button>` film cards, `role="dialog"`, Escape + backdrop close, body scroll lock, `aria-modal`.
- Reduced motion: Ken Burns disabled via CSS; auto-rotate skipped via `matchMedia`.
- `.finish-line` colors: light → `--turquoise-bright`, trumpets → `#fbbf24`, swords → `#fb7185`.

## Acceptance criteria
- Home page hero renders 1:1 with the reference (bg, overlay, grade, vignette, grain, label, display title, sub, pills, filmstrip, finish line).
- Pills switch identity; backgrounds crossfade with Ken Burns; auto-rotate every 9s until interaction.
- Card click opens the drawer with step/body/verse; Escape/backdrop/✕ closes.
- `npm run typecheck`, `npm run lint`, `npm run build` pass (report exact output).
- `.agents/ui-registry.md` updated via imprint.

## Checks to run (from `site/`)
- `npm run typecheck`, `npm run lint`, `npm run build`

## Manual test steps
1. `cd site && npm run dev` → http://localhost:3000
2. Verify hero entrance stagger, identity pills switch filmstrip + bg, auto-rotate pauses after click.
3. Click a film card → drawer slides in (bottom sheet <900px, side panel ≥901px); Escape/✕/backdrop close.
4. Resize to <640px: film cards shrink to 130px, drawer full-width bottom sheet.
