import { apiClient } from "@/api/client";
import { toFormData } from "@/api/formData";
import type { ApiResponse, EntityId } from "@/api/types";
import type { Role, RoleFormValues } from "./types";

export const roleKeys = {
  all: ["roles"] as const,
  detail: (roleId: EntityId) => ["roles", String(roleId)] as const,
};

export async function fetchRoles(): Promise<Role[]> {
  const { data } = await apiClient.get<ApiResponse<Role[] | null>>("role");
  return data.data ?? [];
}

export async function fetchRole(roleId: EntityId): Promise<Role> {
  const { data } = await apiClient.get<ApiResponse<Role>>("role/getRolebyId", {
    params: { id: roleId },
  });
  return data.data;
}

export async function createRole(values: RoleFormValues): Promise<void> {
  await apiClient.post("role/create", toFormData({ ...values }));
}

export async function updateRole(roleId: EntityId, values: RoleFormValues): Promise<void> {
  await apiClient.put("role/editRole", toFormData({ role_id: roleId, ...values }));
}
