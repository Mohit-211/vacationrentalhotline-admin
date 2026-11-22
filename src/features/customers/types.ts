import type { Id } from "@/api/types";
import type { Payment } from "@/features/payments/types";
import type { Property } from "@/features/properties/types";

/** Staff can cover a customer's properties at no charge, up to `properties` of them. */
export interface FreeCover {
  properties: number;
}

/** A site account. Country and region are ISO codes; the phone is E.164. */
export interface Customer {
  id: Id;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string | null;
  streetAddress: string | null;
  city: string | null;
  regionCode: string | null;
  countryCode: string | null;
  postalCode: string | null;
  /** Null unless free cover is on. */
  freeCover: FreeCover | null;
  createdAt: string;
}

/** A row of the customer list. */
export interface CustomerListItem extends Customer {
  properties: { total: number; active: number };
}

/** A customer with their properties and payments. */
export interface CustomerDetails extends Customer {
  properties: Property[];
  payments: Payment[];
}

export interface NewCustomerValues {
  name: string;
  email: string;
  phone?: string;
  /** Email the generated password to them (it is shown on screen either way). */
  sendEmail: boolean;
}

export interface CustomerValues {
  name: string;
  email: string;
  phone?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  regionCode?: string | null;
  countryCode?: string | null;
  postalCode?: string | null;
}
