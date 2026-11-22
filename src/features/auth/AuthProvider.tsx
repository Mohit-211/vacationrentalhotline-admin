import { useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { useCallback, useEffect, useMemo, type PropsWithChildren } from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import {
  fetchMeOrNull,
  meQueryKey,
  refreshSession,
  signIn as signInRequest,
  signOut as signOutRequest,
} from "./api";
import { onSessionEnded } from "./session";
import type { Me, SignInValues } from "./types";

const SESSION_REFRESH_INTERVAL = 6 * 60 * 60 * 1000;

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  // Asked once on load and after signing in, as the API asks; any 401 later ends the session.
  const meQuery = useQuery({
    queryKey: meQueryKey,
    queryFn: fetchMeOrNull,
    staleTime: Infinity,
    // Signed out and customer accounts come back as null; only network and server errors throw.
    retry: 2,
  });

  /** Forgets the session in this tab, and every cached record so the next person sees none. */
  const endLocalSession = useCallback(() => {
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== meQueryKey[0] });
    queryClient.setQueryData<Me | null>(meQueryKey, null);
  }, [queryClient]);

  useEffect(
    () =>
      onSessionEnded(() => {
        if (!queryClient.getQueryData<Me | null>(meQueryKey)) return;
        endLocalSession();
        message.warning("Your session has ended. Please sign in again.");
      }),
    [endLocalSession, message, queryClient],
  );

  const signIn = useCallback(
    async (values: SignInValues) => {
      const me = await signInRequest(values);
      queryClient.setQueryData<Me | null>(meQueryKey, me);
      return me;
    },
    [queryClient],
  );

  const signOut = useCallback(async () => {
    try {
      await signOutRequest();
    } finally {
      endLocalSession();
    }
  }, [endLocalSession]);

  // The admin API never renews the session cookie; the auth server does. Ask it on load and
  // when the panel is used again after a while, so active admins stay signed in.
  const signedIn = Boolean(meQuery.data);
  useEffect(() => {
    if (!signedIn) return;
    let lastRefresh = 0;
    const refresh = () => {
      if (Date.now() - lastRefresh < SESSION_REFRESH_INTERVAL) return;
      lastRefresh = Date.now();
      refreshSession().catch(() => undefined);
    };
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [signedIn]);

  const value = useMemo<AuthContextValue>(() => {
    const me = meQuery.data ?? null;
    const permissions = new Set(me?.permissions ?? []);
    return {
      status: meQuery.isPending ? "loading" : me ? "signed-in" : "signed-out",
      me,
      can: (permission) => permissions.has(permission),
      signIn,
      signOut,
    };
  }, [meQuery.data, meQuery.isPending, signIn, signOut]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
