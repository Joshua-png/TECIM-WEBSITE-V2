import { query } from "../config/db.js";

export interface VersionRow {
  id: string;
  page_id: string;
  number: number;
  snapshot: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
}

export async function create(data: {
  pageId: string;
  snapshot: unknown;
  createdBy: string | null;
}): Promise<VersionRow> {
  const { rows } = await query<VersionRow>(
    `INSERT INTO versions (page_id, number, snapshot, created_by)
     VALUES (
       $1,
       (SELECT COALESCE(MAX(number), 0) + 1 FROM versions WHERE page_id = $1),
       $2,
       $3
     )
     RETURNING *`,
    [data.pageId, JSON.stringify(data.snapshot), data.createdBy]
  );
  return rows[0];
}

export async function listByPage(pageId: string): Promise<VersionRow[]> {
  const { rows } = await query<VersionRow>(
    "SELECT * FROM versions WHERE page_id = $1 ORDER BY number DESC",
    [pageId]
  );
  return rows;
}

export async function findById(id: string): Promise<VersionRow | null> {
  const { rows } = await query<VersionRow>("SELECT * FROM versions WHERE id = $1", [id]);
  return rows[0] ?? null;
}
