import type { Id } from "@/api/types";

/** Periods the dashboard can show, in days (the API allows 1-365). */
export const STAT_PERIODS = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 365, label: "12 months" },
] as const;

export type StatPeriod = (typeof STAT_PERIODS)[number]["value"];

export interface DailyStats {
  /** A US Eastern calendar day, "2026-11-22". */
  date: string;
  newCustomers: number;
  newProperties: number;
  revenueCents: number;
}

/** GET /admin/stats?days=N. "new" and "period" figures cover the last N days. */
export interface Stats {
  days: number;
  since: string;
  customers: { total: number; new: number };
  properties: {
    total: number;
    /** Covered now. */
    active: number;
    new: number;
    activeByCountry: { countryCode: string; active: number }[];
  };
  /** Money received, less refunds. */
  revenue: { totalCents: number; periodCents: number; periodPayments: number };
  messages: { total: number; new: number };
  /** The 5 customers with the most active properties. */
  topCustomers: { id: Id; name: string; email: string; activeProperties: number }[];
  /** One entry per day of the period, today included. */
  daily: DailyStats[];
}
