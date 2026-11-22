import { apiClient } from "@/api/client";
import { toFormData } from "@/api/formData";
import type { ApiResponse } from "@/api/types";
import type {
  CountryPropertyCount,
  RegistrationPeriod,
  RevenueBucket,
  RevenuePeriod,
  TopPropertyOwner,
} from "./types";

export const dashboardKeys = {
  userCount: ["dashboard", "user-count"] as const,
  contactFormCount: ["dashboard", "contact-form-count"] as const,
  propertyCount: ["dashboard", "property-count"] as const,
  totalRevenue: ["dashboard", "total-revenue"] as const,
  topOwners: ["dashboard", "top-owners"] as const,
  countries: ["dashboard", "countries"] as const,
  newUsers: (period: RegistrationPeriod) => ["dashboard", "new-users", period] as const,
  newProperties: (period: RegistrationPeriod) => ["dashboard", "new-properties", period] as const,
  revenueHistory: (period: RevenuePeriod) => ["dashboard", "revenue-history", period] as const,
};

async function fetchNumber(path: string): Promise<number> {
  const { data } = await apiClient.get<ApiResponse<number | string | null>>(path);
  return Number(data.data) || 0;
}

export const fetchUserCount = () => fetchNumber("admin/dashboard/getUserCount");
export const fetchContactFormCount = () => fetchNumber("admin/dashboard/getContactUsFormCount");
export const fetchPropertyCount = () => fetchNumber("admin/dashboard/getTotalPropertyCount");
export const fetchTotalRevenue = () => fetchNumber("admin/dashboard/getTotalRevenueGenerated");

export async function fetchTopPropertyOwners(): Promise<TopPropertyOwner[]> {
  const { data } = await apiClient.get<ApiResponse<Omit<TopPropertyOwner, "key">[] | null>>(
    "admin/dashboard/getTopPropertyOwners",
  );
  return (data.data ?? []).map((owner, index) => ({
    ...owner,
    key: `${index}-${owner.profile_name}`,
  }));
}

export async function fetchPropertyCountsByCountry(): Promise<CountryPropertyCount[]> {
  const { data } = await apiClient.get<ApiResponse<CountryPropertyCount[] | null>>(
    "admin/dashboard/getPropertyCountsByCountry",
  );
  return data.data ?? [];
}

async function fetchPeriodCount(path: string, period: RegistrationPeriod): Promise<number> {
  const { data } = await apiClient.post<ApiResponse<number | string | null>>(
    path,
    toFormData({ period }),
  );
  return Number(data.data) || 0;
}

export const fetchNewUserCount = (period: RegistrationPeriod) =>
  fetchPeriodCount("admin/dashboard/getNewUsersRegistered", period);

export const fetchNewPropertyCount = (period: RegistrationPeriod) =>
  fetchPeriodCount("admin/dashboard/getNewPropertiesRegistered", period);

export async function fetchRevenueHistory(period: RevenuePeriod): Promise<RevenueBucket[]> {
  const { data } = await apiClient.post<ApiResponse<{ data?: RevenueBucket[] | null } | null>>(
    "admin/dashboard/totalRevenueGenerated",
    toFormData({ period }),
  );
  return (data.data?.data ?? []).map((bucket) => ({
    type: String(bucket.type),
    totalAmount: Number(bucket.totalAmount) || 0,
    totalCount: Number(bucket.totalCount) || 0,
  }));
}
