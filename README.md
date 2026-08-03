# TECIM — Cinematic Website + Visual Page Builder CMS

A cinematic, section-based landing website for TECIM, managed by a custom **Visual Page Builder CMS** with draft → preview → publish, immutable version history, and rollback.

## Read Order
1. **`AGENTS.md`** — architecture, constraints, and decision-making rules (the "rules"). Stays at the repo root because every agent tool auto-discovers it.
2. **`.agents/index.md`** — index to the skills library (the "how-to").
3. **`.agents/`** — all AI-facing knowledge in one place:
   - `skills/` — one `SKILL.md` per recipe: `architect`, `remember`, `review`, `recover`, `imprint`, plus implementation skills (section template, CRUD module, media upload, pages, preview/publish/versioning, migrations, auth, validation, API format, testing).
   - `specs/` — `ARCHITECTURE.md`, `DATABASE.md`, `API_SPEC.md`, `CMS_SPEC.md`, `SECTION_LIBRARY.md`, `SECURITY.md`, `DEPLOYMENT.md`, `DECISIONS.md`.
   - `memory.md` — cross-session context · `ui-registry.md` — design tokens · `prompts/` — implementation plans.

## Repos / Apps
- `site/` — public website (Next.js 15) → Vercel
- `admin/` — admin portal (Next.js 15, custom dashboard) → Vercel
- `api/` — backend (Node.js + Express + TypeScript) → Railway

## Stack Summary
Next.js 15 · TailwindCSS · Framer Motion · GSAP · Lucide React · Node.js + Express + TS · Supabase PostgreSQL · Upstash Redis · Cloudinary · SendGrid · Zod · Vercel · Railway · Cloudflare DNS

## Skills Structure

Modeled on the JSM agent-skill format (`skills/<name>/SKILL.md`) — works with Claude Code, Cursor, Windsurf, Codex, Cline, and opencode. Each skill has `name` + `description` frontmatter and a concise recipe body.

For opencode to auto-load these project skills, register the path in `opencode.json` and restart:

```json
{ "skills": { "paths": [".agents/skills"] } }
```

## The Engineering Loop

```
architect  →  Build  →  review  →  Ship
                  ↓
imprint  (after every UI component)
remember  (end and start of every session)
recover   (when something breaks)
```

## Why AGENTS.md and a centralized .agents/ Folder

`AGENTS.md` defines **architecture, constraints, and decision rules** so every session stays consistent. The centralized **`.agents/`** folder holds all the supporting knowledge — skills (repeatable how-to recipes), specs (schema/API/CMS/security/deployment), memory (cross-session state), prompts (implementation plans), and the design-token registry. Agents start at `AGENTS.md` and everything they need lives one folder down.

## Core Rule
**Content is data; design is code.** The admin edits text, images, section composition, preset layouts, navigation, SEO, and settings. HTML, CSS, spacing, animation, and responsive behavior live in code and are never exposed to the CMS.
