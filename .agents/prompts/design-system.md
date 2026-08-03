# Prompt: Design System Foundation (`site/`)

## Goal
Scaffold the `site/` Next.js app and implement the design system extracted from `site/reference/tecim-home.html` so all future section components inherit one consistent cinematic system. No section components yet.

## Source of truth
`site/reference/tecim-home.html` — full `:root` tokens, type scale, motion curves, patterns.

## Files likely to change
- `site/` — scaffolded Next.js 15 (App Router, TS strict, Tailwind)
- `site/app/layout.tsx` — fonts (Cormorant Garamond + Inter via `next/font`), theme-color
- `site/app/globals.css` — CSS variables + base element styles + utility classes (`.reveal`, section shell, `.section-label`, buttons)
- `site/tailwind.config.ts` — theme extension mapping to the CSS vars
- `.agents/ui-registry.md` — captured tokens (imprint)
- `.agents/prompts/design-system.md` — this file

## Decisions / Assumptions
- Design tokens are **code**, never CMS-editable.
- Fonts via `next/font/google` (self-hosted, no external requests). Weights: Cormorant Garamond 400–700 + italic 400; Inter 300–600.
- Tokens: `bg #faf8f5`, `bg-alt #f0ebe3`, `dark #0f1115`, `dark-soft #1a1d24`, `text #141210`, `text-muted #5c574f`, `text-on-dark #f5f2ed`, `turquoise #0f766e`, `turquoise-bright #14b8a6`, `burgundy #9f1239`, `gold #b45309`, `gold-bright #d97706`, `border rgba(20,18,16,0.08)`, `radius 12px`, html bg `#0a0a0c`.
- Type: `.display` `clamp(3rem,8.5vw,6.75rem)`, `h2` `clamp(2rem,4.5vw,3.2rem)`, `h3` 1.35rem/600; headings Cormorant 500, `-0.03em`, lh 1.05. Body Inter lh 1.6.
- Motion: reveal (translateY 32px, 0.85s `cubic-bezier(0.22,1,0.36,1)`), hero rise, ken-burns, marquee.
- Base layout: fixed nav shell + footer shell stubbed (markup from reference, data to come from CMS later).

## Acceptance criteria
- `site/` runs `npm run dev`; home page renders an empty section shell using the system.
- `npm run typecheck`, `npm run lint`, `npm run build` all pass (report exact output).
- No design decisions left to ad-hoc class strings — all tokens live in the theme/CSS vars.
- `.agents/ui-registry.md` baseline populated.

## Checks to run (from `site/`)
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Manual test steps
1. `cd site && npm run dev`, open `http://localhost:3000`.
2. Verify base bg `#faf8f5`, Cormorant headings, Inter body.
3. Verify dark `html` background before hydration paints (`#0a0a0c`).
