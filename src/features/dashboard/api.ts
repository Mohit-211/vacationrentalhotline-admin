import { apiClient } from "@/api/client";
import type { ApiData } from "@/api/types";
import type { Stats } from "./types";

export const statsQueryKey = (days: number) => ["stats", days] as const;

export async function fetchStats(days: number): Promise<Stats> {
  const { data } = await apiClient.get<ApiData<Stats>>("/admin/stats", { params: { days } });
  return data.data;
}
