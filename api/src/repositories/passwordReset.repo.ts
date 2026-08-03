import { query } from "../config/db.js";

export async function recordRequest(userId: string, ip: string | null): Promise<void> {
  await query("INSERT INTO password_resets (user_id, ip) VALUES ($1, $2)", [
    userId,
    ip,
  ]);
}

export async function markResolved(userId: string): Promise<void> {
  await query(
    `UPDATE password_resets
     SET resolved_at = now()
     WHERE user_id = $1 AND resolved_at IS NULL`,
    [userId]
  );
}
