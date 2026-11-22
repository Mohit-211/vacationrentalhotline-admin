import type { PaymentStatus } from "./types";

/** Label and tag colour of each payment status. */
export const PAYMENT_STATUSES: Record<PaymentStatus, { label: string; color?: string }> = {
  paid: { label: "Paid", color: "success" },
  failed: { label: "Failed", color: "error" },
  partially_refunded: { label: "Partly refunded", color: "warning" },
  refunded: { label: "Refunded" },
};

export const PAYMENT_STATUS_OPTIONS = (Object.keys(PAYMENT_STATUSES) as PaymentStatus[]).map(
  (status) => ({ value: status, label: PAYMENT_STATUSES[status].label }),
);

/** "First payment" or "Renewal", from Stripe's billing reason. */
export function paymentTypeLabel(billingReason: string | null): string {
  if (billingReason === "subscription_create") return "First payment";
  if (billingReason === "subscription_cycle") return "Renewal";
  return "Other";
}
