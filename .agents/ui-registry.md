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
- **All home-page sections + footer are built** (hero, about, values, vision, services, events, gallery, contact, footer).

## Values section (built — `site/components/sections/Values.tsx`)

- **Shell**: default `--bg`, standard section padding, `.section-inner`.
- **Grid** (`.values-grid`): `repeat(3, 1fr)`, `margin-top 3rem`, `border-top` hairline. ≤850px: single column.
- **Cards** (`.value-card`): vertical dividers via `border-left` hairline (first card none), padding `2.5rem 2.25rem 2.5rem 0` with `padding-left 2.25rem`. ≤850px: `border-top` dividers, padding `2.25rem 0`.
- **Number marker** (`.value-num`): auto-generated `01`, `02`, … from index — presentation, not CMS data. Inter `0.72rem`, uppercase `0.16em`, turquoise, `margin-bottom 1.1rem`.
- **Copy**: `h3` serif `1.5rem` (`margin-bottom .85rem`), body `0.98rem`/`1.65` muted.

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

## Vision section (built — `site/components/sections/Vision.tsx`)

- **Shell**: `section.vision-band` — `--dark` background, `--text-on-dark`, `overflow: hidden`, teal radial glow `::before` (`rgba(20,184,166,.08)`, top-right, `50%×160%`, pointer-events none). Mobile: 4rem vertical padding.
- **Carousel** (`.vm-carousel`): `max-width 620px`, `margin-top 2.5rem`.
- **Viewport/track**: glass card (`rgba(255,255,255,.04)` + `1px rgba(255,255,255,.08)` border, radius `--radius`, overflow hidden); track `width 200%`, `translateX(-index*50%)`, `0.9s cubic-bezier(.65,0,.35,1)`.
- **Slides** (`.vm-slide`): `flex 0 0 50%`, padding `2.25rem 2rem` (mobile `1.75rem 1.5rem`); 3px top accent bar preset — `.v` turquoise-bright, `.m` gold-bright.
- **Slide heading**: Inter `0.7rem` uppercase `0.16em` `rgba(255,255,255,.4)` weight 600, `margin-bottom 1.1rem` (overrides global serif h3).
- **List items**: `0.6rem` row padding, `rgba(255,255,255,.9)` `1.02rem`, hairline `rgba(255,255,255,.06)` bottom borders. Paragraph: `rgba(255,255,255,.8)` `1.02rem`.
- **Dots** (`.vm-dot`): 8px circle `rgba(255,255,255,.22)`; active → `width 24px`, turquoise-bright, `.35s` ease. Auto-advance 5s (skipped under `prefers-reduced-motion`).
- **Carousel interactivity**: slide accent colors and auto-advance are code behavior, not CMS data.

## Services section (built — `site/components/sections/Services.tsx`)

- **Header** (`.wh-head`): flex `space-between` end-aligned, wrap, gap `1.5rem`, `margin-bottom 3rem`. `.wh-sub` `max-width 460px` `margin-top .85rem`.
- **CTA** (`.wh-cta`): dark pill (`--dark`, white, radius 999, uppercase `0.8rem` `0.04em`, gap `0.5rem`, `white-space nowrap`); hover → `--turquoise` bg + `translateY(-2px)`.
- **List** (`.wh-list`): `border-top` hairline. Rows (`.wh-row`): grid `130px 130px 1fr 28px` gap `1.75rem`, padding `1.85rem .5rem`, `border-bottom` hairline; hover → `--bg-alt` + `padding-left 1rem` (0.3s ease).
- **Row content**: `.wh-day` Cormorant `1.7rem/600`; `.wh-time` `0.8rem` muted; `.wh-tag` gold outline pill (`0.68rem` uppercase `0.08em`, radius 999); `.wh-copy h3` serif `1.3rem`; arrow `1.3rem` muted `justify-self end` → hover `translateX(6px)` + turquoise.
- **≤720px**: grid `1fr auto` areas `date arrow / tag tag / copy copy`; date row-direction baseline gap `0.5rem`.

## Events section (built — `site/components/sections/Events.tsx`)

- **Shell**: `section events` — `--bg-alt` background, standard section padding.
- **Grid** (`.evt-grid`): `repeat(2, 1fr)` gap `1.5rem` `margin-top 2.5rem`; ≤750px → 1 column.
- **Card** (`.evt-card`): grid `180px 1fr`, `#fff` bg, radius `--radius`, `overflow hidden`, `1px var(--border)`; hover → `translateY(-4px)` + `0 16px 36px rgba(0,0,0,.08)` (0.35s); ≤550px → 1 column (image stacks above body).
- **Image** (`.evt-img`): `min-height 160px`, `overflow hidden`, `next/image` fill cover.
- **Body** (`.evt-body`): padding `1.6rem`, flex column, `justify-content center`.
- **Copy**: `.evt-date` `0.75rem` weight 600 `0.06em` uppercase gold `margin-bottom .4rem`; `h3` serif `1.2rem`; `.evt-loc` `0.9rem` muted.

## Gallery section (built — `site/components/sections/Gallery.tsx`)

- **Shell**: `section gallery` — `--dark` bg, `padding: 5.5rem 0` (no horizontal), `position: relative`, `overflow: hidden`. `.gallery .section-inner` `padding: 0 2.5rem`, `z-index: 2`. Mobile ≤640px: `padding: 4rem 0`, inner `padding: 0 1.25rem`.
- **Grain** (`.gallery-grain`): absolute inset 0 z-index 1, SVG turbulence noise, `opacity .05`, `mix-blend overlay`, pointer-events none.
- **Header copy**: `.gallery .section-label` gold-bright; `h2` text-on-dark; `.gal-sub` `rgba(245,242,237,.6)` `max-width 460`; `.gal-reel-tag` uppercase `0.72rem` `0.2em` `rgba(245,242,237,.45)` with 22×1px line `::before`.
- **Marquee** (`.gal-marquee`): `margin-top 3rem`, relative, z-index 2; `.gal-edge` left/right 8vw vertical dark fades z-index 3 (12vw ≤700, 14vw ≤480).
- **Rows**: `.gal-row` flex `width max-content` gap `1rem` `will-change transform`; row-a → `galScrollLeft 52s` (0→-50%), row-b → `galScrollRight 60s` (-50%→0), `+margin-top 1rem`; pause on `.gal-marquee:hover`; `animation: none` under reduced motion. ≤480px: gap/row-gap `0.6rem`, durations 32s/38s. Seamless loop = set rendered twice.
- **Frames** (`.gal-frame`): `flex: 0 0 auto`, `300×210` (`.row-b` `240×320`), radius 6, overflow hidden, `1px rgba(245,242,237,.08)`, `position: relative` (fill parent). ≤700px `210×150` / row-b `160×220`; ≤480px `150×108` / row-b `115×160`, radius 4.
- **Frame image**: `next/image fill`; `.gal-frame img` `object-fit cover`, `filter: grayscale(.85) contrast(1.08) brightness(.82)`, `transform: scale(1.03)`; transitions `filter .6s ease`, `transform .9s` cinematic; hover → `grayscale(0) contrast(1.02) brightness(.98)` + `scale(1.1)`. `::after` bottom gradient `transparent 55% → rgba(0,0,0,.55)`.
- **Index** (`.gal-index`): Cormorant `0.85rem` `0.06em` `rgba(255,255,255,.75)`, absolute bottom-left, hidden (`opacity 0`, `translateY(6px)`) until frame hover. Auto-numbered per row (01–07 / 08–13). ≤480px `0.7rem` `bottom .5rem left .6rem`.
- **More link** (`.gal-more`): turquoise-bright uppercase `0.85rem` `0.06em`, gap `0.4rem→0.7rem` hover, `margin-top 2.5rem`, z-index 2.

## Contact section (built — `site/components/sections/Contact.tsx`)

- **Shell**: `section contact` — `--dark` bg, `--text-on-dark`, `min-height 100vh`, flex column centered, `padding 5rem` vertical, `position relative`, `overflow hidden`. `.contact-grain` (`opacity .045`). `.contact .section-inner` relative z-index 1. Mobile ≤640px: `min-height auto`, 4rem vertical.
- **Header copy**: `.contact .section-label` gold-bright; `h2` `#fff`; `.contact-sub` `rgba(245,242,237,.55)` `max-width 480`.
- **Grid** (`.stay-grid`): `1.35fr 1fr`, gap `3rem`, `margin-top 3rem`, `align-items start`; ≤900px → 1 column gap `2.5rem`.
- **Map card** (`.map-card`): radius `--radius`, overflow hidden, `1px rgba(245,242,237,.12)`, bg `#05070a`, shadow `0 30px 70px rgba(0,0,0,.45)`. Frame `aspect-ratio 4/3.1`.
- **Iframe treatment**: `filter grayscale(1) contrast(1.15) brightness(.75) sepia(.08)` → `.map-card:hover` `grayscale(.25) contrast(1.05) brightness(.92) sepia(.02)`, `transition filter 1s` cinematic; `::after` vertical gradient `rgba(5,7,10,.55)→transparent 22%→transparent 78%→rgba(5,7,10,.65)`; `.map-vignette` `inset 0 0 120px rgba(0,0,0,.65)` `mix-blend multiply`.
- **Corner brackets** (`.map-corner`): 22×22, 2px gold-bright `rgba(217,119,6,.85)`, 14px inset, tl/tr/bl/br, z-index 3.
- **Pin**: `.map-pin` center `translate(-50%,-100%)`; `.map-pin-dot` 12px gold-bright + `mapPulse 2.2s ease-out infinite` (spreading box-shadow); `.map-pin-stem` 1×16 `rgba(217,119,6,.6)`.
- **Tag** (`.map-tag`): bottom-left glass pill (`rgba(5,7,10,.55)` + `blur(6px)` + `1px rgba(255,255,255,.15)`), `0.7rem` uppercase `0.12em`.
- **Tabs** (`.map-tabs`): flex gap `0.6rem`, padding `1.1rem 1.1rem 1.3rem`, `border-top rgba(245,242,237,.08)`; `.map-tab` flex 1, `0.8rem`, radius 8, transparent + `rgba(255,255,255,.1)` border, `rgba(255,255,255,.55)`; hover white + border `.3`; active gold-bright bg/border + `#0a0a0a`. Tab click swaps iframe src + tag text. ≤640px: gap `0.4rem`, padding `0.9rem`, tab `0.72rem`/`0.6rem 0.3rem`.
- **Info column** (`.info-stack`): flex column gap `2rem`. `.c-block h4` Inter `0.7rem` `0.14em` uppercase `rgba(255,255,255,.4)`; `li` `rgba(255,255,255,.8)` `1rem`; `a` hover turquoise-bright; `.address-note` `opacity .5` `font-size .85rem`; `.hours li` flex space-between gap `1.5rem` `max-width 260`.
- **Directions** (`.directions-btn`): pill `rgba(255,255,255,.06)` bg + `.18` border, `0.8rem` uppercase; hover gold-bright bg/border + `#0a0a0a` + `translateY(-2px)`. ≤640px: `width 100%` centered.

## Footer (built — `site/components/layouts/Footer.tsx`)

- **Shell**: `footer` — bg `#0a0c10`, `padding 3.5rem 2.5rem 2rem`, `rgba(255,255,255,.55)`.
- **Grid** (`.footer-grid`): `max-width 1200`, `1.8fr 1fr 1fr 1fr`, gap `2.5rem`; ≤850px → 2 columns; ≤500px → 1 column; ≤640px gap `2rem`.
- **Brand**: `.logo` (TECIM.) `#fff` inline-block `margin-bottom .85rem`; blurb `0.9rem` `max-width 300` `rgba(255,255,255,.45)`.
- **Columns** (`.f-col`): `h4` Inter `0.7rem` `0.12em` uppercase `rgba(255,255,255,.35)`; links `rgba(255,255,255,.6)` `0.9rem` → hover turquoise-bright.
- **Bottom bar** (`.footer-bottom`): `max-width 1200`, `margin-top 2.5rem`, `padding-top 1.5rem`, `border-top rgba(255,255,255,.06)`, flex space-between wrap, `0.8rem` `rgba(255,255,255,.3)`; ≤640px column. Copyright hardcoded `© 2026`.

## Hard rule

Design tokens are **code**, never CMS-editable. Admin edits text and images only. If a visual decision is not here, add it — not to a template schema.
