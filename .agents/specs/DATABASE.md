# DATABASE.md — Schema

PostgreSQL via Supabase. Migrations via `node-pg-migrate` in `api/migrations/` (additive, reversible up/down). JSONB only for validated `content`/`value` blobs. `snake_case` columns; camelCase in JSON API keys.

Conventions: every table has `id uuid PK default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at timestamptz default now()`. Index FKs, `slug`, `status`, `display_order`.

## users
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| email | text unique not null | login identifier |
| password_hash | text not null | bcrypt cost 12 |
| name | text | display name |
| role | text default 'admin' | single admin |
| last_login_at | timestamptz | |
| created_at / updated_at | timestamptz | |

## password_resets
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| requested_at | timestamptz | |
| resolved_at | timestamptz | null until reset |
| ip | text | audit |
| created_at | timestamptz | |

OTP itself lives in Redis (5-min TTL); this table is an audit trail.

## pages
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| slug | text unique not null | site URL slug |
| title | text not null | |
| status | text default 'draft' | draft / published |
| published_version_id | uuid | FK → versions (null while draft) |
| published_at | timestamptz | |
| created_at / updated_at | timestamptz | |

Index: `slug`, `status`.

## sections
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| page_id | uuid FK → pages | |
| template | text not null | section template slug |
| layout | text default 'default' | preset variant only |
| display_order | int not null default 0 | drag-and-drop order |
| label | text | admin-facing name |
| content | jsonb not null default '{}' | validated against template schema |
| status | text default 'draft' | draft / published |
| published_version_id | uuid | FK → versions |
| created_at / updated_at | timestamptz | |

Index: `(page_id, display_order)`, `status`, `template`.

## section_templates
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| slug | text unique not null | e.g. `hero`, `about_image_left` |
| name | text not null | human label |
| description | text | shown in template picker |
| schema | jsonb not null | editable-field schema (drives admin form + validation) |
| component_name | text not null | React component that renders it |
| is_active | boolean default true | |
| created_at / updated_at | timestamptz | |

## media
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| public_id | text unique not null | Cloudinary public id |
| secure_url | text not null | Cloudinary URL |
| width | int | |
| height | int | |
| format | text | webp/jpg/... |
| resource_type | text | image / video |
| size_bytes | bigint | |
| folder | text | e.g. `tecim/site` |
| alt_text | text | accessibility |
| created_at / updated_at | timestamptz | |

## events
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| title | text not null | |
| slug | text unique | |
| description | text | |
| start_at | timestamptz not null | |
| end_at | timestamptz | |
| location | text | |
| image_media_id | uuid FK → media | nullable |
| status | text default 'draft' | draft / published |
| created_at / updated_at | timestamptz | |

## gallery
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| media_id | uuid FK → media not null | |
| caption | text | |
| alt_text | text | |
| display_order | int default 0 | |
| is_featured | boolean default false | |
| status | text default 'draft' | draft / published (added in migration 002) |
| created_at / updated_at | timestamptz | |

Index: `display_order`, `status`. |

## sermons
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| title | text not null | |
| speaker | text | |
| description | text | |
| media_url | text | video/audio link |
| image_media_id | uuid FK → media | thumbnail |
| date_preached | date | |
| status | text default 'draft' | |
| created_at / updated_at | timestamptz | |

## settings
| column | type | notes |
|---|---|---|
| key | text PK | e.g. `site_name`, `contact_phone`, `announcements` |
| value | jsonb not null | validated blob |
| group | text | site / contact / social / service-times / announcements |
| updated_at | timestamptz | |

## navigation
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| label | text not null | |
| url | text | external or page path |
| page_id | uuid FK → pages | nullable alternative to url |
| target | text default '_self' | _self / _blank |
| parent_id | uuid FK → navigation | nullable, dropdowns |
| display_order | int default 0 | |
| is_active | boolean default true | |
| created_at / updated_at | timestamptz | |

## seo
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| scope | text not null | global / page |
| page_id | uuid FK → pages | nullable |
| meta_title | text | |
| meta_description | text | |
| og_image_media_id | uuid FK → media | nullable |
| canonical_url | text | |
| updated_at | timestamptz | |

## versions
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| page_id | uuid FK → pages not null | |
| number | int not null | per-page incrementing |
| snapshot | jsonb not null | full page + sections (immutable) |
| created_by | uuid FK → users | |
| created_at | timestamptz | |

Index: `(page_id, number desc)`. Never mutate a published version row.

## drafts
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| entity_type | text not null | page / section |
| entity_id | uuid not null | |
| content | jsonb | unsaved working copy |
| version | int | |
| created_by | uuid FK → users | |
| created_at / updated_at | timestamptz | |

## activity_logs
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users | |
| action | text not null | login / create / update / publish / rollback / delete |
| entity_type | text | page / section / media / settings / ... |
| entity_id | uuid | |
| details | jsonb | before/after payload (optional) |
| ip | text | |
| created_at | timestamptz | |

## announcements
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| title | text not null | |
| body | text | |
| link_url | text | optional CTA link |
| link_label | text | |
| active_from | timestamptz | null = always active |
| active_until | timestamptz | null = always active |
| status | text default 'draft' | draft / published |
| created_at / updated_at | timestamptz | |

Index: `status`. Public list filters `status = 'published'` AND within the active window (added in migration 002).

## Future tables (add via migration when needed)
- `blog_posts` — future blog (title, slug, body, cover, status).
- `testimonials` — if surfaced as a template-backed collection.
