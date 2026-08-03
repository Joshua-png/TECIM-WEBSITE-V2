---
name: imprint
description: Use after building any UI component on the TECIM site or admin to capture the visual patterns that matter for consistency into ui-registry.md. Critical for the cinematic design system.
---

# Imprint

The TECIM site is cinematic — every component must match what came before. Capture the visual decisions of each built component into `.agents/ui-registry.md` so the next one is consistent.

## What to capture

- **Color**: palette values, gradients, glass effects, background overlays.
- **Typography**: type scale, font sizes, weights, line heights.
- **Spacing**: padding/margin tokens, section gutters, breakpoint behavior.
- **Motion**: animation timing, easing curves, scroll effects, transitions, film-strip/loading animations.
- **Patterns**: button styles, cards, section shells, hero treatment.

## Commands

- `/imprint` — capture from the most recently built component
- `/imprint [file]` — capture from a specific file
- `/imprint audit` — scan the whole codebase, find conflicts, establish a baseline

## Hard rule

Design tokens are **code**, never CMS-editable. The admin edits text and images only. If a visual decision is not in `.agents/ui-registry.md`, add it there — not to a template schema.
