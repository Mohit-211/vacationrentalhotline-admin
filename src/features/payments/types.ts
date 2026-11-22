import type { Id } from "@/api/types";

export type PaymentStatus = "paid" | "failed" | "partially_refunded" | "refunded";

/** A property a payment covered, for one yearly period. */
export interface PaymentItem {
  /** Null once the property has been deleted; the label stays. */
  propertyId: Id | null;
  propertyLabel: string;
  amountCents: number;
  periodStart: string;
  periodEnd: string;
}

/** One Stripe invoice: a first payment ("subscription_create") or a yearly renewal ("subscription_cycle"). */
export interface Payment {
  id: Id;
  /** Null when the customer's account no longer exists. */
  customerId: Id | null;
  payerName: string;
  payerEmail: string;
  status: PaymentStatus;
  billingReason: string | null;
  amountCents: number;
  refundedCents: number;
  /** Lower-case ISO code, such as "usd". */
  currency: string;
  receiptUrl: string | null;
  /** Null for a payment that failed. */
  paidAt: string | null;
  createdAt: string;
  stripeInvoiceId: string;
  items: PaymentItem[];
}

export interface PaymentListParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: PaymentStatus;
  customerId?: Id;
}
