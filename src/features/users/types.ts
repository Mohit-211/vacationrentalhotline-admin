export interface UserProfile {
  name?: string | null;
  mobile?: string | null;
  full_address?: string | null;
}

export const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: "SUBSCRIBED", label: "Subscribed" },
  { value: "UNSUBSCRIBED", label: "Unsubscribed" },
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS_OPTIONS)[number]["value"];

export interface User {
  id: number;
  email: string;
  is_verified?: boolean | number | null;
  active_property_count?: number | null;
  subscription_status?: SubscriptionStatus | null;
  user_profile?: UserProfile | null;
}

export interface NewUserValues {
  name: string;
  email: string;
}

export interface UserEditValues {
  name: string;
  email: string;
  subscriptionStatus?: SubscriptionStatus;
}
