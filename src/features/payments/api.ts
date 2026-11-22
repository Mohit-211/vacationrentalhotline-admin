import { apiClient } from "@/api/client";
import type { ApiData, ApiPage, Id } from "@/api/types";
import type { Payment, PaymentListParams } from "./types";

export const paymentKeys = {
  all: ["payments"] as const,
  list: (params: PaymentListParams) => ["payments", "list", params] as const,
  detail: (paymentId: Id) => ["payments", "detail", paymentId] as const,
};

/** Newest first. Searches the payer's name and email and the invoice number. */
export async function fetchPayments(params: PaymentListParams): Promise<ApiPage<Payment>> {
  const { data } = await apiClient.get<ApiPage<Payment>>("/admin/payments", { params });
  return data;
}

export async function fetchPayment(paymentId: Id): Promise<Payment> {
  const { data } = await apiClient.get<ApiData<Payment>>(`/admin/payments/${paymentId}`);
  return data.data;
}
