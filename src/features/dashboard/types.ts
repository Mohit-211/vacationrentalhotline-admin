export const REGISTRATION_PERIODS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
] as const;

export type RegistrationPeriod = (typeof REGISTRATION_PERIODS)[number]["value"];

export const REVENUE_PERIODS = [
  { value: "last 10 days", label: "Last 10 days" },
  { value: "last 1 month", label: "Last month" },
  { value: "last 3 months", label: "Last 3 months" },
  { value: "last 6 months", label: "Last 6 months" },
  { value: "last year", label: "Last year" },
] as const;

export type RevenuePeriod = (typeof REVENUE_PERIODS)[number]["value"];

export interface TopPropertyOwner {
  /** Generated client-side; the API sends no id for these rows. */
  key: string;
  profile_name?: string | null;
  total_properties?: number | null;
}

export interface CountryPropertyCount {
  country: string;
  property_count: number;
}

export interface RevenueBucket {
  /** Label of the time bucket, such as a date or month. */
  type: string;
  totalAmount: number;
  totalCount: number;
}
