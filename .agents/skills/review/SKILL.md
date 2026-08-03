---
name: review
description: Use after building any TECIM feature to verify it is correct — not just that it works. Three layers: plan alignment, system integrity, production readiness.
---

# Review

Working and correct are not the same thing. Verify what was built in three layers and report issues clearly so the developer decides what to fix.

## Layer 1 — Plan alignment

- Does the work match the accepted prompt in `.agents/prompts/`?
- No scope creep; all acceptance criteria met?
- Manual test steps from the prompt actually work?

## Layer 2 — System integrity

- Layering respected: route → controller → service → repository (no SQL in controllers, no `req`/`res` in services).
- Drafts never reach the public site; published versions immutable; rollback creates a new version.
- No secrets exposed; server-only modules stay server-side.
- No CMS-editable design fields introduced (spacing/animation/layout are code).

## Layer 3 — Production readiness

- `npm run typecheck` and `npm run lint` pass (add `build` if the change could affect it) — report exact output.
- Zod validation on all inputs; uniform API envelopes; rate limits on auth.
- Audit-log-worthy actions logged; revalidation triggered on publish.

## Output

Report findings as **blocker / should-fix / nit**. The developer decides what to fix — do not silently change decisions.
