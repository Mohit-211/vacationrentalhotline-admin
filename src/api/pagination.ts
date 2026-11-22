import type { ApiPage, ListParams } from "./types";

/** The API's largest page. */
const MAX_PAGE_SIZE = 100;

/**
 * Every row of a list, page by page, for exports. `params` keeps the current search and
 * filters; paging is handled here.
 */
export async function fetchAllPages<T, P extends Omit<ListParams, "page" | "pageSize">>(
  fetchPage: (params: P & ListParams) => Promise<ApiPage<T>>,
  params: P,
): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 1; ; page += 1) {
    const result = await fetchPage({ ...params, page, pageSize: MAX_PAGE_SIZE });
    rows.push(...result.data);
    if (result.data.length === 0 || rows.length >= result.meta.total) return rows;
  }
}
