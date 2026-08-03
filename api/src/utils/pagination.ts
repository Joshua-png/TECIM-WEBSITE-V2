const MAX_PER_PAGE = 100;

export interface Pagination {
  page: number;
  perPage: number;
  offset: number;
}

export function parsePagination(
  pageRaw?: unknown,
  perPageRaw?: unknown
): Pagination {
  const page = Math.max(1, Number(pageRaw) || 1);
  const perPage = Math.min(
    MAX_PER_PAGE,
    Math.max(1, Number(perPageRaw) || 20)
  );
  return { page, perPage, offset: (page - 1) * perPage };
}
