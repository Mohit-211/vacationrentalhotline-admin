import { apiClient } from "@/api/client";
import { toFormData } from "@/api/formData";
import type { ApiResponse, EntityId } from "@/api/types";
import type { Admin, AdminFormValues } from "./types";

export const adminKeys = {
  all: ["admins"] as const,
  detail: (adminId: EntityId) => ["admins", String(adminId)] as const,
};

export async function fetchAdmins(): Promise<Admin[]> {
  const { data } = await apiClient.get<ApiResponse<Admin[] | null>>("admin/auth/getAllAdmins");
  return data.data ?? [];
}

export async function fetchAdmin(adminId: EntityId): Promise<Admin> {
  const { data } = await apiClient.get<ApiResponse<Admin>>("admin/auth/findAdminById", {
    params: { id: adminId },
  });
  return data.data;
}

export async function createAdmin(values: AdminFormValues): Promise<void> {
  await apiClient.post(
    "admin/auth/register",
    toFormData({ name: values.name, email: values.email, role_id: values.roleId }),
  );
}

export async function updateAdmin(adminId: EntityId, values: AdminFormValues): Promise<void> {
  await apiClient.put(
    "admin/auth/updateAdmin",
    toFormData({
      admin_id: adminId,
      name: values.name,
      email: values.email,
      role_id: values.roleId,
    }),
  );
}

export async function deleteAdmin(adminId: number): Promise<string | undefined> {
  const { data } = await apiClient.delete<ApiResponse<unknown>>("admin/auth/deleteAdmin", {
    data: toFormData({ admin_id: adminId }),
  });
  return data.message;
}
