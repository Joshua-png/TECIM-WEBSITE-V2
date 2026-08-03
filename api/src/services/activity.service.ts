import * as activityRepo from "../repositories/activity.repo.js";
import { parsePagination } from "../utils/pagination.js";

export interface ActivityList {
  rows: activityRepo.ActivityLogRow[];
  meta: { page: number; perPage: number; total: number };
}

export async function list(
  pageRaw: unknown,
  perPageRaw: unknown
): Promise<ActivityList> {
  const { page, perPage, offset } = parsePagination(pageRaw, perPageRaw);
  const { rows, total } = await activityRepo.list({ limit: perPage, offset });
  return { rows, meta: { page, perPage, total } };
}
