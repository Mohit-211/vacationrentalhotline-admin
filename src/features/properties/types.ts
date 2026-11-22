import type { Id } from "@/api/types";

export type PropertyStatus = "active" | "inactive";

/** A rental property. Phones are E.164 ("+15125550111"); country and region are ISO codes. */
export interface Property {
  id: Id;
  ownerName: string;
  ownerEmail: string;
  ownerAltEmail: string | null;
  ownerPhone: string;
  ownerAltPhone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  regionCode: string;
  countryCode: string;
  postalCode: string;
  fullAddress: string;
  /** "active" while covered. */
  status: PropertyStatus;
  /** End of the paid period. */
  subscriptionEndsAt: string | null;
  /** True while cover will renew on subscriptionEndsAt. */
  autoRenews: boolean;
  /** True while the customer's free cover covers it. */
  complimentary: boolean;
  createdAt: string;
  updatedAt: string;
}

/** The fields staff fill in to add or edit a property. */
export interface PropertyValues {
  ownerName: string;
  ownerEmail: string;
  ownerAltEmail?: string | null;
  ownerPhone: string;
  ownerAltPhone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  countryCode: string;
  regionCode: string;
  postalCode: string;
}

export interface PropertyListParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: PropertyStatus;
  customerId?: Id;
}

export interface PropertyNote {
  id: Id;
  body: string;
  /** Who wrote it: staff in the panel, or the customer on the site. */
  author?: { id: Id; name: string; staff: boolean } | null;
  createdAt: string;
  updatedAt: string;
}

/** A period a payment covered for this property. */
export interface PropertyPayment {
  paymentId: Id;
  status: "paid" | "failed" | "partially_refunded" | "refunded";
  amountCents: number;
  periodStart: string;
  periodEnd: string;
  paidAt: string | null;
  receiptUrl: string | null;
}

export interface PropertySubscription {
  id: Id;
  /** Stripe's status, such as "active" or "past_due". */
  status: string;
  stripeSubscriptionId: string;
  /** Yearly price for this property. */
  unitAmountCents: number;
  renews: boolean;
  canceledAt: string | null;
}

/** A property with its customer, notes, subscription and payments. */
export interface PropertyDetails extends Property {
  customer: { id: Id; name: string; email: string };
  notes: PropertyNote[];
  subscription: PropertySubscription | null;
  payments: PropertyPayment[];
}
