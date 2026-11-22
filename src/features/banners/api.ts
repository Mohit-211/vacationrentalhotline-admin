import { apiClient } from "@/api/client";
import { toFormData } from "@/api/formData";
import type { ApiResponse, EntityId } from "@/api/types";
import type { Banner } from "./types";

export const bannerKeys = {
  all: ["banners"] as const,
  detail: (bannerId: EntityId) => ["banners", String(bannerId)] as const,
};

export async function fetchBanners(): Promise<Banner[]> {
  const { data } = await apiClient.get<ApiResponse<{ banners?: Banner[] | null } | null>>(
    "content/getAllBannerImgaeByAdmin",
  );
  return data.data?.banners ?? [];
}

export async function fetchBanner(bannerId: EntityId): Promise<Banner | null> {
  const { data } = await apiClient.get<ApiResponse<{ banners?: Banner[] | null } | null>>(
    `content/findBannerImgaeById/${bannerId}`,
  );
  return data.data?.banners?.[0] ?? null;
}

export async function createBanners(images: File[]): Promise<void> {
  await apiClient.post("content/createBanner", toFormData({ images }));
}

/** Uploads a new image for a banner and asks the API to delete the image it replaces. */
export async function replaceBannerImage(
  bannerId: EntityId,
  image: File,
  replacedImageId: number,
): Promise<void> {
  await apiClient.put(
    `content/updateBannerImgaeById/${bannerId}`,
    toFormData({ images: image, removeImageIds: replacedImageId }),
  );
}

export async function deleteBanner(bannerId: number): Promise<string | undefined> {
  const { data } = await apiClient.delete<ApiResponse<unknown>>(
    `content/deleteBannerImgaeById/${bannerId}`,
  );
  return data.message;
}
