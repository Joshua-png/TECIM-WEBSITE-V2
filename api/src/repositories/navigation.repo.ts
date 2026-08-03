import { query, transaction } from "../config/db.js";

export interface NavItemRow {
  id: string;
  label: string;
  url: string | null;
  page_id: string | null;
  target: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavItemInput {
  label: string;
  url: string | null;
  pageId: string | null;
  target: string;
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
}

export async function listActive(): Promise<NavItemRow[]> {
  const { rows } = await query<NavItemRow>(
    `SELECT * FROM navigation
     WHERE is_active = true
     ORDER BY display_order ASC, created_at ASC`
  );
  return rows;
}

export async function replaceAll(items: NavItemInput[]): Promise<void> {
  await transaction(async (client) => {
    await client.query("DELETE FROM navigation");
    for (const item of items) {
      await client.query(
        `INSERT INTO navigation (label, url, page_id, target, parent_id, display_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          item.label,
          item.url,
          item.pageId,
          item.target,
          item.parentId,
          item.displayOrder,
          item.isActive,
        ]
      );
    }
  });
}
