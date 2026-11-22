import { apiClient } from "@/api/client";
import { toFormData } from "@/api/formData";
import type { ApiResponse } from "@/api/types";
import type { ContentSection } from "./sections";
import type { ContentEntry, ContentSectionKey } from "./types";

export const contentKeys = {
  section: (sectionKey: ContentSectionKey) => ["content", sectionKey] as const,
};

/** Each section holds a single entry; the API returns it as the first item of a list. */
export async function fetchContentEntry(section: ContentSection): Promise<ContentEntry | null> {
  const { data } = await apiClient.get<ApiResponse<ContentEntry[] | null>>(section.listEndpoint);
  return data.data?.[0] ?? null;
}

export async function updateContentEntry(
  section: ContentSection,
  entryId: number,
  values: { heading: string; description: string },
): Promise<void> {
  await apiClient.put(section.updateEndpoint(entryId), toFormData(values));
}
