---
name: architect
description: Use when starting any new feature or task on the TECIM project — plan like a senior engineer before writing code. Front-load "plan", "design", "how should I build", "prompt".
---

# Architect

Think through what you are about to build like a senior engineer before writing any code. This is a thinking session — collaborative, not adversarial. It surfaces decisions, aligns on approach, and produces an implementation plan you confirm before anything starts.

## Steps

1. Read `AGENTS.md` and the relevant spec (`.agents/specs/CMS_SPEC.md`, `.agents/specs/API_SPEC.md`, `.agents/specs/DATABASE.md`, `.agents/specs/SECTION_LIBRARY.md`).
2. Open `.agents/index.md` (the index) and read the matching skill under `.agents/skills/`.
3. Inspect the relevant existing code — never guess.
4. If the task has meaningful ambiguity, ask **one focused question** before starting.
5. Draft a short prompt in `.agents/prompts/<feature>.md`: goal, files likely to change, decisions/assumptions, acceptance criteria, checks to run, and exact manual test steps.
6. Ask for approval before implementing.

## Guardrails

- Backend first: migration → Zod schema → repository → service → controller → route → middleware.
- Frontend: build/register the React component, then the admin form (fields derived from the template schema).
- Wire preview + publish + versioning for anything that changes content.
- Run the checks in `AGENTS.md` §14 and share exact test steps.
- **Content is data; design is code.** Never introduce CMS-editable design fields (spacing, animation, layout beyond preset variants).
