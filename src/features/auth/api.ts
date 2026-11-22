import { apiClient } from "@/api/client";
import { toFormData } from "@/api/formData";
import type { ApiResponse } from "@/api/types";
import type { Admin } from "@/features/admins/types";

export const profileQueryKey = ["profile"] as const;

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Returns the session token for valid credentials. */
export async function login(credentials: LoginCredentials): Promise<string> {
  const { data } = await apiClient.post<ApiResponse<{ token?: string } | null>>(
    "admin/auth/login",
    credentials,
  );
  const token = data.data?.token;
  if (!token) {
    throw new Error("The server did not return a session token.");
  }
  return token;
}

export async function fetchProfile(): Promise<Admin> {
  const { data } = await apiClient.get<ApiResponse<Admin>>("admin/auth/getProfile");
  return data.data;
}

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function changePassword(values: ChangePasswordValues): Promise<string | undefined> {
  const { data } = await apiClient.post<ApiResponse<unknown>>(
    "admin/auth/change-password",
    toFormData({
      old_password: values.currentPassword,
      new_password: values.newPassword,
      confirm_password: values.confirmPassword,
    }),
  );
  return data.message;
}
