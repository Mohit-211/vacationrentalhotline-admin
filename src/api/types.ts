/** Every endpoint wraps its payload in `{ data }`, sometimes with a human-readable `message`. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Route params arrive as strings, table rows carry numbers; the API accepts both. */
export type EntityId = string | number;
