/** A successful response: `{ data }`. */
export interface ApiData<T> {
  data: T;
}

/** Paging details that come with every list. */
export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
}

/** A page of a list: `{ data: [...], meta: { page, pageSize, total } }`. */
export interface ApiPage<T> {
  data: T[];
  meta: PageMeta;
}

/** Which page of a list to fetch, and what to search for. Lists are searched and paged by the API. */
export interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
}

/** Ids are UUID strings. */
export type Id = string;
