import { apiClient } from "@/api/client";
import type { ApiData } from "@/api/types";
import { getErrorStatus } from "@/utils/errors";
import type { Me, SignInValues } from "./types";

export const meQueryKey = ["me"] as const;

/** The signed-in staff member. Throws 401 when signed out, 403 for a customer account. */
export async function fetchMe(): Promise<Me> {
  const { data } = await apiClient.get<ApiData<Me>>("/admin/me");
  return data.data;
}

/** Like fetchMe, but signed out (401) and customer accounts (403) give null. */
export async function fetchMeOrNull(): Promise<Me | null> {
  try {
    return await fetchMe();
  } catch (error) {
    const status = getErrorStatus(error);
    if (status === 401 || status === 403) return null;
    throw error;
  }
}

/** Thrown when the credentials are right but the account is a customer's, not staff. */
export class NotStaffError extends Error {
  constructor() {
    super("This account can't use the admin panel. Sign in with a staff account.");
  }
}

/** Starts a session (the API sets the cookie) and returns who signed in. */
export async function signIn(values: SignInValues): Promise<Me> {
  await apiClient.post("/auth/sign-in/email", { email: values.email, password: values.password });
  try {
    return await fetchMe();
  } catch (error) {
    if (getErrorStatus(error) === 403) {
      // A customer's sign-in: end that session again rather than leave it half-used.
      await signOut().catch(() => undefined);
      throw new NotStaffError();
    }
    throw error;
  }
}

/** Ends the session on the server too. */
export async function signOut(): Promise<void> {
  await apiClient.post("/auth/sign-out", {});
}

/** Answers with the new name only. */
export async function renameMe(name: string): Promise<{ id: string; name: string }> {
  const { data } = await apiClient.patch<ApiData<{ id: string; name: string }>>("/admin/me", {
    name,
  });
  return data.data;
}

/**
 * Asks the auth server about the session. Unlike the admin API, this call renews the session
 * cookie (once it is a day old), so regular use keeps the admin signed in past the first 7 days.
 */
export async function refreshSession(): Promise<void> {
  await apiClient.get("/auth/get-session");
}

/** Changes the password and signs out every other session. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.post("/auth/change-password", {
    currentPassword,
    newPassword,
    revokeOtherSessions: true,
  });
}

/** Sends a confirmation link to the new address; the email changes once it is opened. */
export async function changeEmail(newEmail: string): Promise<void> {
  await apiClient.post("/auth/change-email", { newEmail });
}

/** Emails a reset link that opens this panel's reset page. */
export async function requestPasswordReset(email: string, redirectTo: string): Promise<void> {
  await apiClient.post("/auth/request-password-reset", { email, redirectTo });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await apiClient.post("/auth/reset-password", { token, newPassword });
}
