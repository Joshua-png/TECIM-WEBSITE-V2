import { query } from "../config/db.js";

export type ContentStatus = "draft" | "published";

export interface PageRow {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  published_version_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function create(data: { slug: string; title: string }): Promise<PageRow> {
  const { rows } = await query<PageRow>(
    "INSERT INTO pages (slug, title) VALUES ($1, $2) RETURNING *",
    [data.slug, data.title]
  );
  return rows[0];
}

export async function findAll(): Promise<PageRow[]> {
  const { rows } = await query<PageRow>("SELECT * FROM pages ORDER BY created_at DESC");
  return rows;
}

export async function findAllPublished(): Promise<PageRow[]> {
  const { rows } = await query<PageRow>(
    "SELECT * FROM pages WHERE status = 'published' ORDER BY updated_at DESC"
  );
  return rows;
}

export async function findById(id: string): Promise<PageRow | null> {
  const { rows } = await query<PageRow>("SELECT * FROM pages WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function findBySlug(slug: string): Promise<PageRow | null> {
  const { rows } = await query<PageRow>("SELECT * FROM pages WHERE slug = $1", [slug]);
  return rows[0] ?? null;
}

export async function updateMeta(
  id: string,
  data: { slug?: string; title?: string }
): Promise<PageRow> {
  const { rows } = await query<PageRow>(
    `UPDATE pages
     SET slug = COALESCE($2, slug), title = COALESCE($3, title), updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [id, data.slug ?? null, data.title ?? null]
  );
  return rows[0];
}

export async function setPublished(id: string, versionId: string): Promise<PageRow> {
  const { rows } = await query<PageRow>(
    `UPDATE pages
     SET status = 'published', published_version_id = $2, published_at = now(), updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [id, versionId]
  );
  return rows[0];
}

export async function remove(id: string): Promise<void> {
  await query("DELETE FROM pages WHERE id = $1", [id]);
}
