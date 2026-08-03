import { query } from "../config/db.js";
import type { ContentStatus } from "./page.repo.js";

export interface SermonRow {
  id: string;
  title: string;
  speaker: string | null;
  description: string | null;
  media_url: string | null;
  image_media_id: string | null;
  date_preached: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface SermonInput {
  title: string;
  speaker: string | null;
  description: string | null;
  mediaUrl: string | null;
  imageMediaId: string | null;
  datePreached: string | null;
  status: ContentStatus;
}

export async function create(input: SermonInput): Promise<SermonRow> {
  const { rows } = await query<SermonRow>(
    `INSERT INTO sermons (title, speaker, description, media_url, image_media_id, date_preached, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      input.title,
      input.speaker,
      input.description,
      input.mediaUrl,
      input.imageMediaId,
      input.datePreached,
      input.status,
    ]
  );
  return rows[0];
}

export async function findAll(): Promise<SermonRow[]> {
  const { rows } = await query<SermonRow>(
    "SELECT * FROM sermons ORDER BY date_preached DESC NULLS LAST, created_at DESC"
  );
  return rows;
}

export async function findPublished(): Promise<SermonRow[]> {
  const { rows } = await query<SermonRow>(
    "SELECT * FROM sermons WHERE status = 'published' ORDER BY date_preached DESC NULLS LAST, created_at DESC"
  );
  return rows;
}

export async function findById(id: string): Promise<SermonRow | null> {
  const { rows } = await query<SermonRow>("SELECT * FROM sermons WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function update(id: string, patch: Partial<SermonInput>): Promise<SermonRow | null> {
  const { rows } = await query<SermonRow>(
    `UPDATE sermons
     SET title = COALESCE($2, title),
         speaker = CASE WHEN $3::boolean THEN $4 ELSE speaker END,
         description = CASE WHEN $5::boolean THEN $6 ELSE description END,
         media_url = CASE WHEN $7::boolean THEN $8 ELSE media_url END,
         image_media_id = CASE WHEN $9::boolean THEN $10 ELSE image_media_id END,
         date_preached = CASE WHEN $11::boolean THEN $12 ELSE date_preached END,
         status = COALESCE($13, status),
         updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      patch.title ?? null,
      patch.speaker !== undefined,
      patch.speaker ?? null,
      patch.description !== undefined,
      patch.description ?? null,
      patch.mediaUrl !== undefined,
      patch.mediaUrl ?? null,
      patch.imageMediaId !== undefined,
      patch.imageMediaId ?? null,
      patch.datePreached !== undefined,
      patch.datePreached ?? null,
      patch.status ?? null,
    ]
  );
  return rows[0] ?? null;
}

export async function remove(id: string): Promise<void> {
  await query("DELETE FROM sermons WHERE id = $1", [id]);
}
