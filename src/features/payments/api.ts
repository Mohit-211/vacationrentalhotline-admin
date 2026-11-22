import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/api/types";
import type { Payment } from "./types";

export const paymentKeys = { all: ["payments"] as const };

export async function fetchPayments(): Promise<Payment[]> {
  const { data } =
    await apiClient.get<ApiResponse<{ processedData?: Payment[] | null } | null>>(
      "plans/getAllPayments",
    );
  return data.data?.processedData ?? [];
}
