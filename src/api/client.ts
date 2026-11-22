import axios from "axios";
import { env } from "@/config/env";
import { reportSessionEnded } from "@/features/auth/session";

/**
 * HTTP client for the site's API. The session is a cookie, so every request sends credentials;
 * the API allows this panel's origin. Bodies are JSON. Paths start with "/", e.g. "/admin/me".
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

// 401 means the session is missing or over, on every endpoint except signing in, where it means
// a wrong email or password. 403 means the role lacks a permission and is handled by the page.
apiClient.interceptors.response.use(undefined, (error: unknown) => {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    !error.config?.url?.startsWith("/admin/auth/sign-in")
  ) {
    reportSessionEnded();
  }
  return Promise.reject(error);
});
