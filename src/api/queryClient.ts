import { QueryClient } from "@tanstack/react-query";
import { getToken } from "@/features/auth/session";
import { getErrorStatus } from "@/utils/errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Retry once on network errors and 5xx answers; a 4xx will not change on retry.
      retry: (failureCount, error) => {
        const status = getErrorStatus(error);
        return failureCount < 1 && getToken() !== null && (status === undefined || status >= 500);
      },
    },
  },
});
