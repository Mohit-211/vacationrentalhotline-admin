import { apiClient } from "@/api/client";
import { toFormData } from "@/api/formData";
import type { ApiResponse, EntityId } from "@/api/types";
import type { Service, ServiceInput } from "./types";

export const serviceKeys = {
  all: ["services"] as const,
  detail: (serviceId: EntityId) => ["services", String(serviceId)] as const,
};

export async function fetchServices(): Promise<Service[]> {
  const { data } = await apiClient.get<ApiResponse<Service[] | null>>("service/getAllServices");
  return data.data ?? [];
}

export async function fetchService(serviceId: EntityId): Promise<Service> {
  const { data } = await apiClient.get<ApiResponse<Service>>(
    `service/findServiceById/${serviceId}`,
  );
  return data.data;
}

export async function createService(input: ServiceInput, images: File[]): Promise<void> {
  await apiClient.post("service/createService", toFormData({ ...input, images }));
}

export async function updateService(
  serviceId: EntityId,
  input: ServiceInput,
  images: { newFiles: File[]; removedIds: number[] },
): Promise<void> {
  await apiClient.put(
    `service/updateService/${serviceId}`,
    toFormData({ ...input, images: images.newFiles, removeImageIds: images.removedIds }),
  );
}

export async function deleteService(serviceId: number): Promise<string | undefined> {
  const { data } = await apiClient.delete<ApiResponse<unknown>>(
    `service/deleteService/${serviceId}`,
  );
  return data.message;
}
