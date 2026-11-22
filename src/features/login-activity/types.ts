export interface LoginSession {
  id: number;
  user_id: number;
  role_id?: number | null;
  ip_address?: string | null;
  login_time_utc?: string | null;
  logout_time_utc?: string | null;
  login_user?: {
    email?: string | null;
    user_profile?: { name?: string | null } | null;
  } | null;
}

/** One app user and their sign-in history. */
export interface LoginActivityRow {
  userId: number;
  name: string | null;
  email: string | null;
  role: string | null;
  sessions: LoginSession[];
}
