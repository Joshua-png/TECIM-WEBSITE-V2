# .agents — Skill Index

Implementation playbook for the TECIM project, organized as a skills library in the standard `SKILL.md` format (works with Claude Code, Cursor, Windsurf, Codex, Cline, opencode).

Read `AGENTS.md` first — it defines the *rules*. Each `SKILL.md` below is the *how-to*. Follow the matching skill for each task.

## Engineering process

| Skill | When to use |
|---|---|
| `.agents/skills/architect` | Starting any new feature — plan like a senior engineer before coding |
| `.agents/skills/remember` | End and start of every session — persist/restore context via `.agents/memory.md` |
| `.agents/skills/review` | After building a feature — verify it is correct, not just working |
| `.agents/skills/recover` | When something goes wrong — targeted fix vs hard reset vs rethink |
| `.agents/skills/imprint` | After building any UI component — capture design patterns in `.agents/ui-registry.md` |

## Implementation recipes

| Skill | When to use |
|---|---|
| `.agents/skills/section-template` | Adding a new section template to the library |
| `.agents/skills/crud-module` | Adding a content collection (events, gallery, sermons, announcements) |
| `.agents/skills/media-upload` | Cloudinary image/video uploads and the media library |
| `.agents/skills/add-page` | Adding a new CMS page |
| `.agents/skills/preview-publish-version` | Draft → preview → publish → rollback workflow |
| `.agents/skills/db-migration` | Creating or altering the PostgreSQL schema |
| `.agents/skills/auth` | Login, JWT, refresh tokens, forgot-password OTP |
| `.agents/skills/validation` | Zod validation of requests and section content |
| `.agents/skills/api-format` | Uniform response envelopes and method discipline |
| `.agents/skills/testing` | Tests, typecheck, lint, build verification |

## Shared artifacts

- `.agents/memory.md` — cross-session context (written by `.agents/skills/remember`).
- `.agents/ui-registry.md` — captured design tokens and component patterns (written by `.agents/skills/imprint`).
- `.agents/prompts/` — implementation prompts per feature (written by `.agents/skills/architect`).

## The Engineering Loop

```
architect  →  Build  →  review  →  Ship
                  ↓
imprint  (after every UI component)
remember  (end and start of every session)
recover   (when something breaks)
```

## Adding a new skill

Create `.agents/skills/<name>/SKILL.md` with frontmatter `name` (lowercase, hyphen-separated, matches folder) and a third-person `description` covering what it does and when to trigger it. Keep the body a concise recipe. Update this index.
