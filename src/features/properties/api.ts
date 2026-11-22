import { apiClient } from "@/api/client";
import type { ApiData, ApiPage, Id } from "@/api/types";
import type { PropertyRow } from "./components/PropertiesTable";
import type { PropertyDetails, PropertyListParams, PropertyNote, PropertyValues } from "./types";

export const propertyKeys = {
  all: ["properties"] as const,
  list: (params: PropertyListParams) => ["properties", "list", params] as const,
  detail: (propertyId: Id) => ["properties", "detail", propertyId] as const,
};

/** Newest first. Searches owner, emails, phones, address and customer. */
export async function fetchProperties(params: PropertyListParams): Promise<ApiPage<PropertyRow>> {
  const { data } = await apiClient.get<ApiPage<PropertyRow>>("/admin/properties", { params });
  return data;
}

export async function fetchProperty(propertyId: Id): Promise<PropertyDetails> {
  const { data } = await apiClient.get<ApiData<PropertyDetails>>(`/admin/properties/${propertyId}`);
  return data.data;
}

export async function updateProperty(propertyId: Id, values: PropertyValues): Promise<void> {
  await apiClient.patch(`/admin/properties/${propertyId}`, values);
}

/** Refused (409 PROPERTY_COVERED) while the property is covered. */
export async function deleteProperty(propertyId: Id): Promise<void> {
  await apiClient.delete(`/admin/properties/${propertyId}`);
}

/** Stops renewal; cover lasts until subscriptionEndsAt, with no refund. */
export async function cancelRenewal(propertyId: Id): Promise<void> {
  await apiClient.post(`/admin/properties/${propertyId}/cancel-renewal`, {});
}

/** Ends cover now and stops renewal; nothing is refunded. */
export async function endCover(propertyId: Id): Promise<void> {
  await apiClient.post(`/admin/properties/${propertyId}/end-cover`);
}

export async function addNote(propertyId: Id, body: string): Promise<PropertyNote> {
  const { data } = await apiClient.post<ApiData<PropertyNote>>(
    `/admin/properties/${propertyId}/notes`,
    { body },
  );
  return data.data;
}

export async function updateNote(propertyId: Id, noteId: Id, body: string): Promise<void> {
  await apiClient.patch(`/admin/properties/${propertyId}/notes/${noteId}`, { body });
}

export async function deleteNote(propertyId: Id, noteId: Id): Promise<void> {
  await apiClient.delete(`/admin/properties/${propertyId}/notes/${noteId}`);
}
