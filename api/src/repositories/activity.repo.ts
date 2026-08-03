import { query } from "../config/db.js";

export interface ActivityLogRow {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip: string | null;
  created_at: string;
}

export async function create(data: {
  userId: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  ip?: string | null;
}): Promise<ActivityLogRow> {
  const { rows } = await query<ActivityLogRow>(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.userId,
      data.action,
      data.entityType ?? null,
      data.entityId ?? null,
      data.details !== undefined ? JSON.stringify(data.details) : null,
      data.ip ?? null,
    ]
  );
  return rows[0];
}

export async function list(data: {
  limit: number;
  offset: number;
}): Promise<{ rows: ActivityLogRow[]; total: number }> {
  const { rows } = await query<ActivityLogRow>(
    `SELECT * FROM activity_logs
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [data.limit, data.offset]
  );
  const { rows: countRows } = await query<{ total: string }>(
    "SELECT COUNT(*) AS total FROM activity_logs"
  );
  return { rows, total: Number(countRows[0].total) };
}
