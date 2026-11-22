/** Case-insensitive "contains" match of `query` against any of `values`. Empty queries match. */
export function matchesQuery(
  query: string,
  ...values: Array<string | number | null | undefined>
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return values.some(
    (value) =>
      value !== null && value !== undefined && String(value).toLowerCase().includes(needle),
  );
}
