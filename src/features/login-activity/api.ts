import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/api/types";
import type { LoginActivityRow, LoginSession } from "./types";

export const loginActivityKeys = { all: ["login-activity"] as const };

/** App roles that can sign in; the API only returns ids. */
const ROLE_LABELS: Record<number, string> = { 6: "User", 7: "Driver" };

/** The API groups sessions per user, as an object keyed by user id or as an array of arrays. */
type GroupedSessions = Record<string, LoginSession[]> | LoginSession[][];

export async function fetchLoginActivity(): Promise<LoginActivityRow[]> {
  const { data } = await apiClient.get<ApiResponse<GroupedSessions | null>>(
    "admin/user/login/timings",
  );
  return Object.values(data.data ?? {}).flatMap((sessions) => {
    const first = sessions.find((session) => session.login_user);
    if (!first) return [];
    return [
      {
        userId: first.user_id,
        name: first.login_user?.user_profile?.name ?? null,
        email: first.login_user?.email ?? null,
        role: first.role_id ? (ROLE_LABELS[first.role_id] ?? null) : null,
        sessions,
      },
    ];
  });
}

export async function clearLoginActivity(): Promise<void> {
  await apiClient.delete("admin/user/login/timings/clear");
}
