import dayjs from "dayjs";
import { DATE_FORMAT } from "@/config/locale";
import type { DailyStats } from "./types";

export type TrendMetric = "revenueCents" | "newCustomers" | "newProperties";

export interface TrendPoint {
  label: string;
  value: number;
}

/**
 * Daily figures grouped so the chart stays readable: by day up to a month, by week up to
 * a quarter, by month beyond. The API counts days in UTC.
 */
export function toTrend(daily: DailyStats[], days: number, metric: TrendMetric): TrendPoint[] {
  const unit = days <= 31 ? "day" : days <= 120 ? "week" : "month";
  const buckets = new Map<string, TrendPoint>();
  for (const entry of daily) {
    const date = dayjs(entry.date);
    const start = unit === "day" ? date : date.startOf(unit);
    const key = start.format("YYYY-MM-DD");
    const label =
      unit === "day"
        ? start.format(DATE_FORMAT)
        : unit === "week"
          ? `Week of ${start.format(DATE_FORMAT)}`
          : start.format("MM/YYYY");
    const bucket = buckets.get(key) ?? { label, value: 0 };
    bucket.value += entry[metric];
    buckets.set(key, bucket);
  }
  return [...buckets.values()];
}
