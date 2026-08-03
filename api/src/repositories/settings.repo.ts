import { query } from "../config/db.js";

export interface SettingRow {
  key: string;
  value: Record<string, unknown>;
  group: string | null;
  updated_at: string;
}

export async function findAll(): Promise<SettingRow[]> {
  const { rows } = await query<SettingRow>(
    "SELECT * FROM settings ORDER BY key ASC"
  );
  return rows;
}

export async function findByGroups(groups: string[]): Promise<SettingRow[]> {
  const { rows } = await query<SettingRow>(
    "SELECT * FROM settings WHERE \"group\" = ANY($1) ORDER BY key ASC",
    [groups]
  );
  return rows;
}

export async function findByKey(key: string): Promise<SettingRow | null> {
  const { rows } = await query<SettingRow>(
    "SELECT * FROM settings WHERE key = $1",
    [key]
  );
  return rows[0] ?? null;
}

export async function upsert(
  key: string,
  value: Record<string, unknown>,
  group: string | null
): Promise<SettingRow> {
  const { rows } = await query<SettingRow>(
    `INSERT INTO settings (key, value, "group", updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value, "group" = EXCLUDED.group, updated_at = now()
     RETURNING *`,
    [key, JSON.stringify(value), group]
  );
  return rows[0];
}
