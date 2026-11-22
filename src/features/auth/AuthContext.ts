import { createContext, useContext } from "react";
import type { Permission } from "./permissions";
import type { Me, SignInValues } from "./types";

export interface AuthContextValue {
  /** "loading" until the first check of the session cookie has answered. */
  status: "loading" | "signed-in" | "signed-out";
  me: Me | null;
  can: (permission: Permission) => boolean;
  signIn: (values: SignInValues) => Promise<Me>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return value;
}
