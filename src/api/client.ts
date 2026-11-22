import axios from "axios";
import { env } from "@/config/env";
import { endSession, getToken, type SessionEndReason } from "@/features/auth/session";

/** HTTP client for the admin API. Sends the admin token on every request. */
export const apiClient = axios.create({ baseURL: env.apiBaseUrl });

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("x-access-token", token);
  }
  return config;
});

apiClient.interceptors.response.use(undefined, (error: unknown) => {
  const reason = getSessionEndReason(error);
  if (reason) {
    endSession(reason);
  }
  return Promise.reject(error);
});

/** The API reports an expired token as HTTP 500 ("jwt expired") and a deleted admin as 403. */
function getSessionEndReason(error: unknown): SessionEndReason | null {
  if (!axios.isAxiosError<{ message?: unknown }>(error) || !error.response) {
    return null;
  }
  const { status, data } = error.response;
  const message = typeof data?.message === "string" ? data.message : "";
  if (status === 500 && /jwt/i.test(message)) return "expired";
  if (status === 403 && message === "Admin not found.") return "deleted";
  return null;
}
