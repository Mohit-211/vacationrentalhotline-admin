import { useQuery } from "@tanstack/react-query";
import { fetchProfile, profileQueryKey } from "./api";

/**
 * The signed-in admin. Refetched when the window regains focus, so an expired session or a
 * deleted account is noticed without polling.
 */
export function useProfile() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: fetchProfile,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}
