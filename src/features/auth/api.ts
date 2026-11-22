import { apiClient } from "@/api/client";
import type { ApiData } from "@/api/types";
import { getErrorStatus } from "@/utils/errors";
import type { Me, SignInValues } from "./types";

export const meQueryKey = ["me"] as const;

/**
 * Staff's own sign-in, separate from customers' on the website, with its own session cookie:
 * signing in or out here never touches a website login in the same browser.
 */
const STAFF_AUTH = "/admin/auth";

/** The signed-in staff member. Throws 401 when signed out. */
export async function fetchMe(): Promise<Me> {
  const { data } = await apiClient.get<ApiData<Me>>("/admin/me");
  return data.data;
}

/** Like fetchMe, but signed out (401) gives null, as does an account that isn't staff (403). */
export async function fetchMeOrNull(): Promise<Me | null> {
  try {
    return await fetchMe();
  } catch (error) {
    const status = getErrorStatus(error);
    if (status === 401 || status === 403) return null;
    throw error;
  }
}

/**
 * Starts a session (the API sets the cookie) and returns who signed in. Customer accounts are
 * refused with 403 CUSTOMER_ACCOUNT.
 */
export async function signIn(values: SignInValues): Promise<Me> {
  await apiClient.post(`${STAFF_AUTH}/sign-in/email`, {
    email: values.email,
    password: values.password,
  });
  return fetchMe();
}

/** Ends the session on the server too. */
export async function signOut(): Promise<void> {
  await apiClient.post(`${STAFF_AUTH}/sign-out`, {});
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
  await apiClient.get(`${STAFF_AUTH}/get-session`);
}

/** Changes the password and signs out every other session. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.post(`${STAFF_AUTH}/change-password`, {
    currentPassword,
    newPassword,
    revokeOtherSessions: true,
  });
}

/**
 * Sends a confirmation link to the new address. The link opens the website's confirmation page,
 * and the email changes once it is opened.
 */
export async function changeEmail(newEmail: string): Promise<void> {
  await apiClient.post(`${STAFF_AUTH}/change-email`, { newEmail });
}

/** Emails a reset link that opens this panel's reset page. */
export async function requestPasswordReset(email: string, redirectTo: string): Promise<void> {
  await apiClient.post(`${STAFF_AUTH}/request-password-reset`, { email, redirectTo });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await apiClient.post(`${STAFF_AUTH}/reset-password`, { token, newPassword });
}
