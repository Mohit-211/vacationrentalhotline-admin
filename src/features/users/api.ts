import { apiClient } from "@/api/client";
import { toFormData } from "@/api/formData";
import type { ApiResponse, EntityId } from "@/api/types";
import type { NewUserValues, User, UserEditValues } from "./types";

/** App users are created with the API's "user" role. */
const APP_USER_ROLE_ID = 6;

export const userKeys = {
  all: ["users"] as const,
  detail: (userId: EntityId) => ["users", String(userId)] as const,
};

export async function fetchUsers(): Promise<User[]> {
  const { data } =
    await apiClient.get<ApiResponse<{ data?: User[] } | null>>("admin/user/getAllUsers");
  return data.data?.data ?? [];
}

export async function fetchUser(userId: EntityId): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>("admin/user/getUserById", {
    params: { id: userId },
  });
  return data.data;
}

export async function createUser(values: NewUserValues): Promise<void> {
  await apiClient.post(
    "admin/user/createUser",
    toFormData({ email: values.email, name: values.name, role_id: APP_USER_ROLE_ID }),
  );
}

export async function updateUser(userId: EntityId, values: UserEditValues): Promise<void> {
  await apiClient.put(
    "admin/user/updateUser",
    toFormData({
      user_id: userId,
      name: values.name,
      email: values.email,
      subscription_status: values.subscriptionStatus ?? "",
    }),
  );
}

export async function deleteUser(userId: number): Promise<string | undefined> {
  const { data } = await apiClient.delete<ApiResponse<unknown>>("admin/user/deleteUser", {
    data: toFormData({ user_id: userId }),
  });
  return data.message;
}
