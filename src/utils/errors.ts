import axios from "axios";

/**
 * What the API says went wrong. The admin API answers `{ error: { code, message, fields? } }`;
 * the sign-in endpoints (Better Auth) answer `{ code, message }`.
 */
export interface ApiErrorDetails {
  code?: string;
  message?: string;
  /** Messages per field, such as `{ email: ["Enter a valid email"] }`. */
  fields?: Record<string, string[]>;
}

interface ErrorBody {
  error?: ApiErrorDetails;
  code?: unknown;
  message?: unknown;
}

function getDetails(error: unknown): ApiErrorDetails | undefined {
  if (!axios.isAxiosError<ErrorBody>(error) || !error.response?.data) return undefined;
  const body = error.response.data;
  if (body.error && typeof body.error === "object") return body.error;
  return {
    code: typeof body.code === "string" ? body.code : undefined,
    message: typeof body.message === "string" ? body.message : undefined,
  };
}

export function getErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

/** The API's error code, such as "EMAIL_TAKEN" or "PROPERTY_COVERED". */
export function getErrorCode(error: unknown): string | undefined {
  return getDetails(error)?.code;
}

/** Messages for individual form fields, from a 400 "VALIDATION_FAILED" answer. */
export function getFieldErrors(error: unknown): Record<string, string[]> {
  return getDetails(error)?.fields ?? {};
}

/** Best message to show for a failed request: the API's own message, else `fallback`. */
export function getErrorMessage(error: unknown, fallback: string): string {
  const message = getDetails(error)?.message;
  if (message?.trim()) return message;
  if (axios.isAxiosError(error) && !error.response) {
    return "Could not reach the server. Check your connection and try again.";
  }
  return fallback;
}

/**
 * 403: signed in, but the role doesn't allow this. (A 403 "INVALID_ORIGIN" is different: the site
 * doesn't accept this panel's address, a setup problem whose message is shown as it is.)
 */
export function isForbiddenError(error: unknown): boolean {
  return getErrorStatus(error) === 403 && getErrorCode(error) !== "INVALID_ORIGIN";
}

/** 404: the record doesn't exist, or no longer does. */
export function isNotFoundError(error: unknown): boolean {
  return getErrorStatus(error) === 404;
}
