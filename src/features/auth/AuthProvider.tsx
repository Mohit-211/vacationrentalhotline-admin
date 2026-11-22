import { useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { useEffect, useMemo, useSyncExternalStore, type PropsWithChildren } from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import { endSession, getToken, onSessionEnd, startSession, subscribeToToken } from "./session";

const signOut = () => endSession("signed-out");

export function AuthProvider({ children }: PropsWithChildren) {
  const token = useSyncExternalStore(subscribeToToken, getToken);
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  useEffect(
    () =>
      onSessionEnd((reason) => {
        // Drop cached data so the next admin to sign in never sees it.
        queryClient.clear();
        if (reason === "expired") {
          message.warning("Your session has expired. Please sign in again.");
        } else if (reason === "deleted") {
          message.error("Your admin account no longer exists. Ask another admin for access.");
        }
      }),
    [message, queryClient],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: token !== null, signIn: startSession, signOut }),
    [token],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
