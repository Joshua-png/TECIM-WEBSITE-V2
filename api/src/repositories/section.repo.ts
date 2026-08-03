import { query } from "../config/db.js";
import type { ContentStatus } from "./page.repo.js";

export interface SectionRow {
  id: string;
  page_id: string;
  template: string;
  layout: string;
  display_order: number;
  label: string | null;
  content: Record<string, unknown>;
  status: ContentStatus;
  published_version_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SectionInput {
  template: string;
  layout: string;
  label: string | null;
  content: Record<string, unknown>;
  displayOrder: number;
}

export async function create(pageId: string, input: SectionInput): Promise<SectionRow> {
  const { rows } = await query<SectionRow>(
    `INSERT INTO sections (page_id, template, layout, display_order, label, content)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      pageId,
      input.template,
      input.layout,
      input.displayOrder,
      input.label,
      JSON.stringify(input.content),
    ]
  );
  return rows[0];
}

export async function findByPage(pageId: string): Promise<SectionRow[]> {
  const { rows } = await query<SectionRow>(
    "SELECT * FROM sections WHERE page_id = $1 ORDER BY display_order ASC, created_at ASC",
    [pageId]
  );
  return rows;
}

export async function findById(id: string): Promise<SectionRow | null> {
  const { rows } = await query<SectionRow>("SELECT * FROM sections WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function update(
  id: string,
  data: { content?: Record<string, unknown>; layout?: string; label?: string | null }
): Promise<SectionRow> {
  const { rows } = await query<SectionRow>(
    `UPDATE sections
     SET content = COALESCE($2, content),
         layout = COALESCE($3, layout),
         label = CASE WHEN $4::boolean THEN $5 ELSE label END,
         updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      data.content !== undefined ? JSON.stringify(data.content) : null,
      data.layout ?? null,
      data.label !== undefined,
      data.label ?? null,
    ]
  );
  return rows[0];
}

export async function setDisplayOrder(id: string, order: number): Promise<void> {
  await query("UPDATE sections SET display_order = $2, updated_at = now() WHERE id = $1", [
    id,
    order,
  ]);
}

export async function nextDisplayOrder(pageId: string): Promise<number> {
  const { rows } = await query<{ max: number | null }>(
    "SELECT COALESCE(MAX(display_order), -1) + 1 AS max FROM sections WHERE page_id = $1",
    [pageId]
  );
  return rows[0].max ?? 0;
}

export async function setPublishedByPage(
  pageId: string,
  versionId: string
): Promise<void> {
  await query(
    `UPDATE sections
     SET status = 'published', published_version_id = $2, updated_at = now()
     WHERE page_id = $1`,
    [pageId, versionId]
  );
}

export async function deleteById(id: string): Promise<void> {
  await query("DELETE FROM sections WHERE id = $1", [id]);
}

export async function deleteByPage(pageId: string): Promise<void> {
  await query("DELETE FROM sections WHERE page_id = $1", [pageId]);
}
