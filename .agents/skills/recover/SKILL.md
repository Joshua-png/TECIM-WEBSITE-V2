---
name: recover
description: Use when something goes wrong in the TECIM project. Diagnose the failure type before deciding how to respond — targeted fix, hard reset, or rethink.
---

# Recover

Not every problem is a bug. Not every bug needs debugging. Diagnose which type of failure you are dealing with before responding.

## Diagnose first

- **Targeted fix** — isolated problem: find the root cause and fix it precisely.
- **Hard reset** — polluted session: stop patching and start fresh (cleared context, re-read `AGENTS.md` + `.agents/memory.md`, rebuild).
- **Rethink** — wrong foundation: no amount of debugging helps; the architecture or a decision is wrong.

## Questions to ask

| Symptom | Likely response |
|---|---|
| One function/route misbehaves, rest is fine | Targeted fix |
| Contradictory changes, stale state, broken session | Hard reset |
| ADR violated, wrong storage, layering broken, design moved into CMS | Rethink → new ADR in `.agents/specs/DECISIONS.md` |
| Draft shown on public site, version mutated, secret leaked | Immediate security fix (priority over all else) |

## After recovery

- Record the root cause and prevention in `.agents/memory.md`.
- If the fix changes an architectural decision, append an ADR to `.agents/specs/DECISIONS.md`.
