import { query } from "../config/db.js";
import type { ContentStatus } from "./page.repo.js";

export interface EventRow {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  start_at: string;
  end_at: string | null;
  location: string | null;
  image_media_id: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface EventInput {
  title: string;
  slug: string | null;
  description: string | null;
  startAt: string;
  endAt: string | null;
  location: string | null;
  imageMediaId: string | null;
  status: ContentStatus;
}

export async function create(data: EventInput): Promise<EventRow> {
  const { rows } = await query<EventRow>(
    `INSERT INTO events (title, slug, description, start_at, end_at, location, image_media_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      data.title,
      data.slug,
      data.description,
      data.startAt,
      data.endAt,
      data.location,
      data.imageMediaId,
      data.status,
    ]
  );
  return rows[0];
}

export async function findAll(): Promise<EventRow[]> {
  const { rows } = await query<EventRow>(
    "SELECT * FROM events ORDER BY start_at ASC, created_at ASC"
  );
  return rows;
}

export async function findPublished(): Promise<EventRow[]> {
  const { rows } = await query<EventRow>(
    `SELECT * FROM events
     WHERE status = 'published' AND start_at >= NOW()
     ORDER BY start_at ASC, created_at ASC`
  );
  return rows;
}

export async function findById(id: string): Promise<EventRow | null> {
  const { rows } = await query<EventRow>("SELECT * FROM events WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function findBySlug(slug: string): Promise<EventRow | null> {
  const { rows } = await query<EventRow>("SELECT * FROM events WHERE slug = $1", [slug]);
  return rows[0] ?? null;
}

export async function update(id: string, patch: Partial<EventInput>): Promise<EventRow | null> {
  const { rows } = await query<EventRow>(
    `UPDATE events
     SET title = COALESCE($2, title),
         slug = CASE WHEN $3::boolean THEN $4 ELSE slug END,
         description = CASE WHEN $5::boolean THEN $6 ELSE description END,
         start_at = COALESCE($7, start_at),
         end_at = CASE WHEN $8::boolean THEN $9 ELSE end_at END,
         location = CASE WHEN $10::boolean THEN $11 ELSE location END,
         image_media_id = CASE WHEN $12::boolean THEN $13 ELSE image_media_id END,
         status = COALESCE($14, status),
         updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      patch.title ?? null,
      patch.slug !== undefined,
      patch.slug ?? null,
      patch.description !== undefined,
      patch.description ?? null,
      patch.startAt ?? null,
      patch.endAt !== undefined,
      patch.endAt ?? null,
      patch.location !== undefined,
      patch.location ?? null,
      patch.imageMediaId !== undefined,
      patch.imageMediaId ?? null,
      patch.status ?? null,
    ]
  );
  return rows[0] ?? null;
}

export async function remove(id: string): Promise<void> {
  await query("DELETE FROM events WHERE id = $1", [id]);
}
