import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { ListParams } from "@/api/types";

export const DEFAULT_PAGE_SIZE = 25;

/**
 * Page, page size, search and filters of a list, kept in the URL so that going back from a
 * record returns to the same page and search. Changing the search or a filter starts at page 1.
 */
export function useListParams<Filter extends string = never>(filterNames: readonly Filter[] = []) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE;
    const search = searchParams.get("search") ?? "";
    const filters = Object.fromEntries(
      filterNames.map((name) => [name, searchParams.get(name) ?? undefined]),
    ) as Partial<Record<Filter, string>>;
    return { page, pageSize, search, filters };
    // filterNames is a fixed list per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const update = useCallback(
    (changes: Record<string, string | number | undefined>, resetPage: boolean) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(changes)) {
            if (value === undefined || value === "") next.delete(key);
            else next.set(key, String(value));
          }
          if (resetPage) next.delete("page");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSearch = useCallback(
    (search: string) => update({ search: search.trim() }, true),
    [update],
  );
  const setFilter = useCallback(
    (name: Filter, value: string | undefined) => update({ [name]: value }, true),
    [update],
  );
  /** Changes several filters in one step (separate calls would undo each other). */
  const setFilters = useCallback(
    (changes: Partial<Record<Filter, string | undefined>>) => update(changes, true),
    [update],
  );
  const setPage = useCallback(
    (page: number, pageSize: number) =>
      update(
        {
          page: page > 1 ? page : undefined,
          pageSize: pageSize !== DEFAULT_PAGE_SIZE ? pageSize : undefined,
        },
        false,
      ),
    [update],
  );

  const listParams: ListParams = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
  };

  return { ...params, listParams, setSearch, setFilter, setFilters, setPage };
}
