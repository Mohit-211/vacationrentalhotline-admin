import { apiClient } from "@/api/client";
import type { ApiResponse, EntityId } from "@/api/types";
import type { Property } from "./types";

export const propertyKeys = {
  all: ["properties"] as const,
  byUser: (userId: EntityId) => ["properties", "by-user", String(userId)] as const,
  detail: (propertyId: EntityId) => ["properties", String(propertyId)] as const,
};

export async function fetchProperties(): Promise<Property[]> {
  const { data } = await apiClient.get<ApiResponse<Property[] | null>>("property/getAllProperty");
  return data.data ?? [];
}

export async function fetchPropertiesByUser(userId: EntityId): Promise<Property[]> {
  const { data } = await apiClient.post<ApiResponse<Property[] | null>>(
    "property/findPropertyByUserId",
    { user_id: userId },
  );
  return data.data ?? [];
}

export async function fetchProperty(propertyId: EntityId): Promise<Property> {
  const { data } = await apiClient.get<ApiResponse<Property>>(
    `property/findPropertyById/${propertyId}`,
  );
  return data.data;
}
