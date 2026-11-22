import axios from "axios";

export function getErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

/** Best message to show for a failed request: the API's own message, else `fallback`. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) {
      return message.replace(/^Error:\s*/, "");
    }
    if (!error.response) {
      return "Could not reach the server. Check your connection and try again.";
    }
  }
  return fallback;
}

/** The API answers 401 when an admin's role does not allow the requested data. */
export function isForbiddenError(error: unknown): boolean {
  return getErrorStatus(error) === 401;
}
