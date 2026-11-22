import { apiClient } from "@/api/client";
import type { ApiData, ApiPage, Id, ListParams } from "@/api/types";
import type { Property, PropertyValues } from "@/features/properties/types";
import type {
  Customer,
  CustomerDetails,
  CustomerListItem,
  CustomerValues,
  NewCustomerValues,
} from "./types";

export const customerKeys = {
  all: ["customers"] as const,
  list: (params: ListParams) => ["customers", "list", params] as const,
  detail: (customerId: Id) => ["customers", "detail", customerId] as const,
};

/** Newest first. Searches name, email and phone. */
export async function fetchCustomers(params: ListParams): Promise<ApiPage<CustomerListItem>> {
  const { data } = await apiClient.get<ApiPage<CustomerListItem>>("/admin/customers", { params });
  return data;
}

export async function fetchCustomer(customerId: Id): Promise<CustomerDetails> {
  const { data } = await apiClient.get<ApiData<CustomerDetails>>(`/admin/customers/${customerId}`);
  return data.data;
}

/** Creates a verified account; the API generates its password and returns it this once. */
export async function createCustomer(
  values: NewCustomerValues,
): Promise<{ customer: Customer; password: string }> {
  const { data } = await apiClient.post<ApiData<{ customer: Customer; password: string }>>(
    "/admin/customers",
    { ...values, phone: values.phone?.trim() || undefined },
  );
  return data.data;
}

export async function updateCustomer(customerId: Id, values: CustomerValues): Promise<void> {
  await apiClient.patch(`/admin/customers/${customerId}`, values);
}

/** Generates a new password (returned this once) and signs the customer out everywhere. */
export async function resetCustomerPassword(
  customerId: Id,
  sendEmail: boolean,
): Promise<{ password: string }> {
  const { data } = await apiClient.post<ApiData<{ password: string }>>(
    `/admin/customers/${customerId}/password`,
    { sendEmail },
  );
  return data.data;
}

/** What deleting a customer does, for the confirmation. */
export const DELETE_CUSTOMER_WARNING =
  "Their live subscriptions are cancelled at once, with no refund, and their properties and notes are deleted. Payments stay on record.";

/** Cancels their live subscriptions (no refund) and deletes the account, properties and notes. */
export async function deleteCustomer(customerId: Id): Promise<void> {
  await apiClient.delete(`/admin/customers/${customerId}`);
}

export async function addProperties(
  customerId: Id,
  properties: PropertyValues[],
): Promise<Property[]> {
  const { data } = await apiClient.post<ApiData<Property[]>>(
    `/admin/customers/${customerId}/properties`,
    { properties },
  );
  return data.data;
}

/** Turns free cover on for up to `properties` properties, or changes that number. */
export async function setFreeCover(customerId: Id, properties: number): Promise<void> {
  await apiClient.put(`/admin/customers/${customerId}/free-cover`, { properties });
}

/** Turns free cover off; returns how many properties lost cover. */
export async function removeFreeCover(customerId: Id): Promise<{ uncovered: number }> {
  const { data } = await apiClient.delete<ApiData<{ uncovered: number }>>(
    `/admin/customers/${customerId}/free-cover`,
  );
  return data.data;
}
