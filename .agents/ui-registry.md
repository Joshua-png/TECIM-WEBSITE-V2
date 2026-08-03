# ui-registry.md — TECIM Design Tokens

Captured by the `imprint` skill after every UI component. Design tokens are **code**, never CMS-editable — the admin edits text and images only.

Source of truth: `site/reference/tecim-home.html`. Implemented in `site/app/globals.css` (`:root` + Tailwind v4 `@theme inline`). Next.js site uses `next/font` (self-hosted, no external font requests).

## Color palette

| Token | Value | Tailwind utility |
|---|---|---|
| `--bg` | `#faf8f5` | `bg-bg`, `text-bg` |
| `--bg-alt` | `#f0ebe3` | `bg-bg-alt` |
| `--dark` | `#0f1115` | `bg-dark` |
| `--dark-soft` | `#1a1d24` | `bg-dark-soft` |
| `--text` | `#141210` | `text-text` |
| `--text-muted` | `#5c574f` | `text-muted` |
| `--text-on-dark` | `#f5f2ed` | `text-on-dark` |
| `--turquoise` | `#0f766e` | `text-turquoise` etc. |
| `--turquoise-bright` | `#14b8a6` | `text-turquoise-bright` |
| `--burgundy` | `#9f1239` | `text-burgundy` |
| `--gold` | `#b45309` | `text-gold` |
| `--gold-bright` | `#d97706` | `text-gold-bright` |
| `--border` | `rgba(20,18,16,0.08)` | `border-haze` |
| `--radius` | `12px` | `rounded-lg` (overridden) |

Additional fixed colors used in CSS: html/body frame `#0a0a0c`, `#fbbf24` (amber, hero label + verses), `#e11d48` (rose, "swords" active pill), `#06201d` (dark teal, mobile CTA text), footer bg `#0a0c10`, map card bg `#05070a`.

## Typography

- **Display / headings** — Cormorant Garamond (`next/font`, weights 400–700 + italic 400), weight 500, `letter-spacing -0.03em`, `line-height 1.05`. Applied to `h1,h2,h3,.display`.
  - `.display` → `clamp(3rem, 8.5vw, 6.75rem)`
  - `h2` → `clamp(2rem, 4.5vw, 3.2rem)`
  - `h3` → `1.35rem`, weight 600
- **Body** — Inter (`next/font`, weights 300–600), `line-height 1.6`, base `1.05rem`.
- **Micro-labels** — `.section-label`: `0.7rem`, uppercase, `letter-spacing 0.2em`, weight 600, `--gold`, margin-bottom `0.6rem`. Used as section eyebrow.

## Spacing & breakpoints

- Section padding: `5.5rem 2.5rem` desktop → `4rem 1.25rem` ≤640px.
- `.section-inner`: `max-width 1200px`, centered.
- Hero/contact/vision use full-viewport min-heights with `justify-content` vertical alignment (see reference).
- Nav hidden below `920px` (hamburger + full-screen mobile menu). Values grid 3→1 col ≤850px. Footer grid 4→2→1 col (≤850px / ≤500px).

## Motion

- **Easing (cinematic default)**: `cubic-bezier(0.22, 1, 0.36, 1)` — use everywhere for scroll/enter transitions.
- **Reveal-on-scroll** (`.reveal`): start `opacity 0, translateY(32px)` → `.visible` `opacity 1, translateY(0)` over `0.85s`. Reduced-motion: disable.
- **Nav**: full-width → floating pill on scroll (`>50px`): `rgba(250,248,245,0.85)` + `blur(18px)` + `border-radius 999px`, `0.4s` springy ease.
- **Hero**: `heroRise` (opacity 0→1, translateY 26px, staggered delays), Ken Burns bg zoom `16s` alternate, grain overlay `opacity 0.05 mix-blend-overlay`, cinematic vignette + duotone grade `linear-gradient(135deg, #0d3b3a 0%, #0f1115 45%, #4a2a10 100%)` at `opacity 0.55 mix-blend color`.
- **Marquee** (gallery): two rows scroll opposite directions, `52s`/`60s` linear, pause on hover, `prefers-reduced-motion` disables.
- **Hover**: cards lift `translateY(-4..-8px)`, arrows shift `translateX(6px)`, images scale 1.1; all ~`0.3–0.4s` with the default ease.
- **Map pulse**: `mapPulse` ring expansion `2.2s ease-out infinite` on the gold pin.

## Patterns

- **Buttons** (`.btn` base + variants): pill `999px`, `0.8rem` uppercase `0.04em`, `padding 0.85rem 1.6rem`, hover `translateY(-2px)`. Variants: `btn--dark`, `btn--ghost-light`, `btn--gold`. Nav CTA reuses ghost pill.
- **Section shells**: `.section` + `.section-inner`; eyebrow via `.section-label`.
- **Nav**: fixed, transparent over hero → glass pill on scroll; serif logo `TECIM.` (gold dot), uppercase links with turquoise underline on active.
- **Footer**: `#0a0c10`, 4-col grid, uppercase Inter column headings (`0.7rem`, `0.12em`), hover turquoise-bright links.
- **Not yet built** (see `site/reference/tecim-home.html` for exact values when implementing): values divided columns, vision/mission carousel + dots, services "What's Happening" rows, events cards, gallery marquee frames (grayscale→color on hover), contact map card (corner brackets, pin, tabs).

## About section (built — `site/components/sections/About.tsx`)

- **Shell**: `section.about` — `100vh`/`100dvh`, vertically centered (`justify-content: center`), `--bg-alt` background, `overflow: hidden`; inner scrolls (`max-height: 100%`, hidden scrollbar). Mobile: `height: auto; min-height: 100dvh; padding-top: 6.5rem`.
- **Grid**: `1.05fr 1fr` gap `4rem` (`1fr` gap `2.5rem` ≤900px).
- **Visual** (`.about-visual`): `aspect-ratio 4/3.4`, `max-height 60vh` (46vh ≤640px), radius `--radius`, `overflow: hidden`, shadow `0 30px 60px rgba(0,0,0,.12)`.
- **Badge** (`.about-badge`): absolute bottom-left `1.5rem`, glass `rgba(15,17,21,.85)` + `blur(12px)`, radius 10, serif title `0.9rem/600` + Inter subtitle `0.7rem` at `rgba(255,255,255,.6)`.
- **Check-list** (`.check-list`): `✓` in 22px circle `rgba(15,118,110,.12)` bg, turquoise glyph, muted text `0.98rem`, `gap .75rem`, rows `padding .4rem 0`.
- **Copy**: `h2` margin-bottom `1rem`; `p` margin-bottom `0.85rem`; strong partner names colored `--text` weight 600 (`.about-content strong`).

## Hero section (built — `site/components/sections/Hero.tsx`)

- **Shell**: `section.hero` — full-viewport (`min-height: 100vh`), content bottom-anchored (`justify-content: flex-end`), `overflow: hidden`, frame bars 9px black top/bottom.
- **Background stack** (z-order): crossfading `Image` fills (Ken Burns `scale(1.04)→(1.16) translate(-1%,-1.5%)`, `16s ease-in-out alternate`; crossfade `opacity 1.4s` cinematic ease) → `.hero-overlay` (bottom-weighted gradient `rgba(8,8,10,.97)→.45`) → `.hero-grade` (duotone `135deg #0d3b3a → #0f1115 → #4a2a10`, `mix-blend color`, `opacity .55`) → `.hero-vignette` (radial `transparent 40% → rgba(0,0,0,.55) 100%`) → `.hero-grain` (SVG turbulence, `opacity .05`, `mix-blend overlay`).
- **Per-identity bg filter**: light `grayscale(.7) contrast(1.2) brightness(.9)`; trumpets `grayscale(1) contrast(1.15) brightness(.85)`; swords `grayscale(.15) contrast(1.05)`.
- **Entrance stagger** (`heroRise`: `opacity 0→1, translateY(26px)`, `cubic-bezier(.22,1,.36,1)`): label `.15s`, h1 `.3s`, sub `.5s`, pills `.68s`, filmstrip `.85s`.
- **Hero label**: `0.72rem` uppercase `letter-spacing .2em` `#fbbf24`, gold line `::before` (28px × 1px, `--gold-bright`).
- **Identity pills** (`.id-pill`): glass pill (`rgba(255,255,255,.06)` + `blur(8px)`), `0.78rem` uppercase `0.06em`; active fill per preset — light `--turquoise-bright`/ink text, trumpets `--gold-bright`/ink, swords `#e11d48`/white; glow shadow `0 6px 24px` tinted.
- **Film cards** (`.film-card`): `150×180px` (mobile `130×160px`), radius 10, `flex: 0 0`, horizontal scroll strip (no scrollbar); hover/active lift `translateY(-8px) scale(1.03)` + img `scale(1.1)`. Caption gradient `to top rgba(0,0,0,.95)→.15`; serif title `0.9rem/600`; hover reveals `.insight` (body + italic serif verse `#fbbf24`); insight hidden ≤900px.
- **Finish line** (`.finish-line`): glass pill revealed after each strip; `strong` accent — light `--turquoise-bright`, trumpets `#fbbf24`, swords `#fb7185`.
- **Auto-rotate**: identities cycle every 9s until user interacts (pill click or card click).
- **Insight drawer**: backdrop `rgba(5,5,7,.6)` + `blur(6px)`; panel `rgba(10,10,13,.98)` + `blur(20px)`. ≤900px: bottom sheet (radius `20 20 0 0`, `max-height 78vh`, drag handle, `translateY(100%)→0`); ≥901px: right panel `440px` (centered content, `translateX(100%)→0`); both `.45s` cinematic ease. Content: `.si-step` uppercase `0.14em`, serif `.si-title` `1.7rem`, `.si-body` `rgba(255,255,255,.92)`, `.si-verse` italic serif `#fbbf24` with `2px #fbbf24` left rule.

## Hard rule

Design tokens are **code**, never CMS-editable. Admin edits text and images only. If a visual decision is not here, add it — not to a template schema.
