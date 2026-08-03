---
name: remember
description: Use at the end and start of every session to persist and restore cross-session context via memory.md. TECIM agents have no memory between sessions — this fixes that.
---

# Remember

AI has no memory between sessions. Every new session starts blank. This skill persists what matters into `.agents/memory.md` and restores it next time.

## Save (end of session)

Update `.agents/memory.md` with:
- What was built this session (features, files touched).
- Decisions made (link to `.agents/specs/DECISIONS.md` if architectural).
- Current state: which pages/sections are draft vs published, pending versions.
- Next steps and open questions.

## Restore (start of session)

Read `.agents/memory.md` first, confirm the context with the user, then continue.

## Rules

- Keep it short — bullet points, not essays.
- Never store secrets, tokens, or credentials.
- Reference canonical docs (`AGENTS.md`, `.agents/specs/DECISIONS.md`) instead of duplicating them.
