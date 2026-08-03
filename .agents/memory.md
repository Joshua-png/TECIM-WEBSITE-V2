# memory.md — Cross-session context

Written by the `remember` skill at the end of each session; read at the start of the next. Never store secrets.

## Latest session (not yet recorded)

## Project state

- Status: planning/docs (AGENTS.md + skills library). No application code yet.
- Repos/apps: `site/` (Next.js → Vercel), `admin/` (Next.js → Vercel), `api/` (Express → Railway) — not yet scaffolded.

## Decisions

See `.agents/specs/DECISIONS.md` (ADR-001 … ADR-014).

## Next steps

- Scaffold `api/` (Express + TS, layering), then `site/` and `admin/`.
- Seed single admin user; implement auth (login, JWT, OTP forgot-password).
