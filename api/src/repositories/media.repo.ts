import { query } from "../config/db.js";

export interface MediaRow {
  id: string;
  public_id: string;
  secure_url: string;
  width: number | null;
  height: number | null;
  format: string | null;
  resource_type: string;
  size_bytes: string | null;
  folder: string | null;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaInput {
  publicId: string;
  secureUrl: string;
  width: number | null;
  height: number | null;
  format: string | null;
  resourceType: string;
  sizeBytes: number | null;
  folder: string;
  altText?: string | null;
}

export async function create(input: MediaInput): Promise<MediaRow> {
  const { rows } = await query<MediaRow>(
    `INSERT INTO media
       (public_id, secure_url, width, height, format, resource_type, size_bytes, folder, alt_text)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      input.publicId,
      input.secureUrl,
      input.width,
      input.height,
      input.format,
      input.resourceType,
      input.sizeBytes,
      input.folder,
      input.altText ?? null,
    ]
  );
  return rows[0];
}

export async function findById(id: string): Promise<MediaRow | null> {
  const { rows } = await query<MediaRow>("SELECT * FROM media WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function findByIds(ids: string[]): Promise<MediaRow[]> {
  if (ids.length === 0) return [];
  const { rows } = await query<MediaRow>(
    `SELECT * FROM media WHERE id = ANY($1::uuid[])`,
    [ids]
  );
  return rows;
}

export async function list(data: {
  limit: number;
  offset: number;
}): Promise<{ rows: MediaRow[]; total: number }> {
  const { rows } = await query<MediaRow>(
    `SELECT * FROM media
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [data.limit, data.offset]
  );
  const { rows: countRows } = await query<{ total: string }>(
    "SELECT COUNT(*) AS total FROM media"
  );
  return { rows, total: Number(countRows[0].total) };
}

export async function remove(id: string): Promise<void> {
  await query("DELETE FROM media WHERE id = $1", [id]);
}
