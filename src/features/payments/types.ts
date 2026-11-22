export interface Payment {
  id: number;
  user_name?: string | null;
  email?: string | null;
  collectiveAmount?: number | string | null;
  receipt_url?: string | null;
  payment_mode?: string | null;
  payment_status?: string | null;
  created_at?: string | null;
}
