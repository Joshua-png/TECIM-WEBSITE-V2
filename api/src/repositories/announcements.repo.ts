import { query } from "../config/db.js";
import type { ContentStatus } from "./page.repo.js";

export interface AnnouncementRow {
  id: string;
  title: string;
  body: string | null;
  link_url: string | null;
  link_label: string | null;
  active_from: string | null;
  active_until: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementInput {
  title: string;
  body: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  activeFrom: string | null;
  activeUntil: string | null;
  status: ContentStatus;
}

export async function create(input: AnnouncementInput): Promise<AnnouncementRow> {
  const { rows } = await query<AnnouncementRow>(
    `INSERT INTO announcements (title, body, link_url, link_label, active_from, active_until, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      input.title,
      input.body,
      input.linkUrl,
      input.linkLabel,
      input.activeFrom,
      input.activeUntil,
      input.status,
    ]
  );
  return rows[0];
}

export async function findAll(): Promise<AnnouncementRow[]> {
  const { rows } = await query<AnnouncementRow>(
    "SELECT * FROM announcements ORDER BY active_from DESC NULLS LAST, created_at DESC"
  );
  return rows;
}

export async function findPublished(): Promise<AnnouncementRow[]> {
  const { rows } = await query<AnnouncementRow>(
    `SELECT * FROM announcements
     WHERE status = 'published'
       AND (active_from IS NULL OR active_from <= now())
       AND (active_until IS NULL OR active_until >= now())
     ORDER BY active_from DESC NULLS LAST, created_at DESC`
  );
  return rows;
}

export async function findById(id: string): Promise<AnnouncementRow | null> {
  const { rows } = await query<AnnouncementRow>(
    "SELECT * FROM announcements WHERE id = $1",
    [id]
  );
  return rows[0] ?? null;
}

export async function update(
  id: string,
  patch: Partial<AnnouncementInput>
): Promise<AnnouncementRow | null> {
  const { rows } = await query<AnnouncementRow>(
    `UPDATE announcements
     SET title = COALESCE($2, title),
         body = CASE WHEN $3::boolean THEN $4 ELSE body END,
         link_url = CASE WHEN $5::boolean THEN $6 ELSE link_url END,
         link_label = CASE WHEN $7::boolean THEN $8 ELSE link_label END,
         active_from = CASE WHEN $9::boolean THEN $10 ELSE active_from END,
         active_until = CASE WHEN $11::boolean THEN $12 ELSE active_until END,
         status = COALESCE($13, status),
         updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      patch.title ?? null,
      patch.body !== undefined,
      patch.body ?? null,
      patch.linkUrl !== undefined,
      patch.linkUrl ?? null,
      patch.linkLabel !== undefined,
      patch.linkLabel ?? null,
      patch.activeFrom !== undefined,
      patch.activeFrom ?? null,
      patch.activeUntil !== undefined,
      patch.activeUntil ?? null,
      patch.status ?? null,
    ]
  );
  return rows[0] ?? null;
}

export async function remove(id: string): Promise<void> {
  await query("DELETE FROM announcements WHERE id = $1", [id]);
}
