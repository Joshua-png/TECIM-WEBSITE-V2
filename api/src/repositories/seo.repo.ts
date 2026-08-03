import { query } from "../config/db.js";

export interface SeoRow {
  id: string;
  scope: "global" | "page";
  page_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_media_id: string | null;
  canonical_url: string | null;
  updated_at: string;
}

export interface SeoFields {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageMediaId?: string | null;
  canonicalUrl?: string | null;
}

export async function getGlobal(): Promise<SeoRow | null> {
  const { rows } = await query<SeoRow>(
    "SELECT * FROM seo WHERE scope = 'global' LIMIT 1"
  );
  return rows[0] ?? null;
}

export async function getByPageId(pageId: string): Promise<SeoRow | null> {
  const { rows } = await query<SeoRow>(
    "SELECT * FROM seo WHERE scope = 'page' AND page_id = $1",
    [pageId]
  );
  return rows[0] ?? null;
}

export async function upsertGlobal(fields: SeoFields): Promise<SeoRow> {
  const existing = await getGlobal();
  if (existing) {
    return updateById(existing.id, fields);
  }
  return insert("global", null, fields);
}

export async function upsertForPage(pageId: string, fields: SeoFields): Promise<SeoRow> {
  const existing = await getByPageId(pageId);
  if (existing) {
    return updateById(existing.id, fields);
  }
  return insert("page", pageId, fields);
}

async function insert(
  scope: string,
  pageId: string | null,
  fields: SeoFields
): Promise<SeoRow> {
  const { rows } = await query<SeoRow>(
    `INSERT INTO seo (scope, page_id, meta_title, meta_description, og_image_media_id, canonical_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      scope,
      pageId,
      fields.metaTitle ?? null,
      fields.metaDescription ?? null,
      fields.ogImageMediaId ?? null,
      fields.canonicalUrl ?? null,
    ]
  );
  return rows[0];
}

async function updateById(id: string, fields: SeoFields): Promise<SeoRow> {
  const { rows } = await query<SeoRow>(
    `UPDATE seo
     SET meta_title = COALESCE($2, meta_title),
         meta_description = COALESCE($3, meta_description),
         og_image_media_id = COALESCE($4, og_image_media_id),
         canonical_url = COALESCE($5, canonical_url),
         updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      fields.metaTitle ?? null,
      fields.metaDescription ?? null,
      fields.ogImageMediaId ?? null,
      fields.canonicalUrl ?? null,
    ]
  );
  return rows[0];
}
