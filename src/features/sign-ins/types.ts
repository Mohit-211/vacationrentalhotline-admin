import type { Id } from "@/api/types";

export type SignInAudience = "staff" | "customers";

/** One sign-in. History is kept for a year. */
export interface SignIn {
  id: Id;
  user: { id: Id; name: string; email: string; role: string };
  /** May be empty or null. */
  ipAddress: string | null;
  userAgent: string | null;
  signedInAt: string;
  /** Null while the session is open, and for sessions that ran out without signing out. */
  signedOutAt: string | null;
}

export interface SignInListParams {
  page: number;
  pageSize: number;
  audience: SignInAudience;
  userId?: Id;
}
