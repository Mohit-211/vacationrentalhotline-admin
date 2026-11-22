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

/** Refused (409 PROPERTY_COVERED) while paid cover runs, when `canDelete` is false. */
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

/**
 * Moves the property's paid cover, with its paid-through date and renewal, to another of the
 * customer's properties that isn't covered. Nothing is charged or refunded. The API then deletes
 * this property and its notes, and answers with the newly covered property.
 */
export async function moveCover(propertyId: Id, toPropertyId: Id): Promise<PropertyDetails> {
  const { data } = await apiClient.post<ApiData<PropertyDetails>>(
    `/admin/properties/${propertyId}/move-cover`,
    { toPropertyId },
  );
  return data.data;
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
