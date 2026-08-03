import { query } from "../config/db.js";
import type { ContentStatus } from "./page.repo.js";

export interface GalleryRow {
  id: string;
  media_id: string;
  caption: string | null;
  alt_text: string | null;
  display_order: number;
  is_featured: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface GalleryInput {
  mediaId: string;
  caption: string | null;
  altText: string | null;
  displayOrder: number | null;
  isFeatured: boolean | null;
  status: ContentStatus;
}

export async function create(input: GalleryInput): Promise<GalleryRow> {
  const { rows } = await query<GalleryRow>(
    `INSERT INTO gallery (media_id, caption, alt_text, display_order, is_featured, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      input.mediaId,
      input.caption,
      input.altText,
      input.displayOrder,
      input.isFeatured,
      input.status,
    ]
  );
  return rows[0];
}

export async function findAll(): Promise<GalleryRow[]> {
  const { rows } = await query<GalleryRow>(
    "SELECT * FROM gallery ORDER BY is_featured DESC, display_order ASC, created_at ASC"
  );
  return rows;
}

export async function findPublished(): Promise<GalleryRow[]> {
  const { rows } = await query<GalleryRow>(
    "SELECT * FROM gallery WHERE status = 'published' ORDER BY is_featured DESC, display_order ASC, created_at ASC"
  );
  return rows;
}

export async function findById(id: string): Promise<GalleryRow | null> {
  const { rows } = await query<GalleryRow>("SELECT * FROM gallery WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function update(id: string, patch: Partial<GalleryInput>): Promise<GalleryRow | null> {
  const { rows } = await query<GalleryRow>(
    `UPDATE gallery
     SET media_id = COALESCE($2, media_id),
         caption = CASE WHEN $3::boolean THEN $4 ELSE caption END,
         alt_text = CASE WHEN $5::boolean THEN $6 ELSE alt_text END,
         display_order = COALESCE($7, display_order),
         is_featured = COALESCE($8, is_featured),
         status = COALESCE($9, status),
         updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      patch.mediaId ?? null,
      patch.caption !== undefined,
      patch.caption ?? null,
      patch.altText !== undefined,
      patch.altText ?? null,
      patch.displayOrder ?? null,
      patch.isFeatured ?? null,
      patch.status ?? null,
    ]
  );
  return rows[0] ?? null;
}

export async function nextDisplayOrder(): Promise<number> {
  const { rows } = await query<{ max: number | null }>(
    "SELECT COALESCE(MAX(display_order), -1) + 1 AS max FROM gallery"
  );
  return rows[0].max ?? 0;
}

export async function remove(id: string): Promise<void> {
  await query("DELETE FROM gallery WHERE id = $1", [id]);
}
