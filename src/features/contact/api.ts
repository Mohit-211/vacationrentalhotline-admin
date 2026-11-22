import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/api/types";
import type { ContactSubmission } from "./types";

export const contactKeys = { all: ["contact-submissions"] as const };

export async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
  const { data } = await apiClient.get<ApiResponse<ContactSubmission[] | null>>(
    "contactUs/getAllContactUs",
  );
  return data.data ?? [];
}
