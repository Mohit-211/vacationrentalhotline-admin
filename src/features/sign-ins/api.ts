import { apiClient } from "@/api/client";
import type { ApiPage } from "@/api/types";
import type { SignIn, SignInListParams } from "./types";

export const signInKeys = {
  list: (params: SignInListParams) => ["sign-ins", params] as const,
};

/** Newest first. There is no search; `userId` narrows it to one person. */
export async function fetchSignIns(params: SignInListParams): Promise<ApiPage<SignIn>> {
  const { data } = await apiClient.get<ApiPage<SignIn>>("/admin/sign-ins", { params });
  return data;
}
