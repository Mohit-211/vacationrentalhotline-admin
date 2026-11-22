import { apiClient } from "@/api/client";
import type { ApiData } from "@/api/types";
import type { Role, RoleValues } from "./types";

export const roleKeys = { all: ["roles"] as const };

/** Every staff role, by label. There is no endpoint for a single role. */
export async function fetchRoles(): Promise<Role[]> {
  const { data } = await apiClient.get<ApiData<Role[]>>("/admin/roles");
  return data.data;
}

export async function createRole(values: RoleValues): Promise<Role> {
  const { data } = await apiClient.post<ApiData<Role>>("/admin/roles", values);
  return data.data;
}

/** Sends both fields: the API can't handle a change with nothing in it. */
export async function updateRole(
  name: string,
  values: Pick<RoleValues, "label" | "permissions">,
): Promise<Role> {
  const { data } = await apiClient.patch<ApiData<Role>>(`/admin/roles/${name}`, {
    label: values.label,
    permissions: values.permissions,
  });
  return data.data;
}

/** Refused while anyone has the role, and for built-in roles. */
export async function deleteRole(name: string): Promise<void> {
  await apiClient.delete(`/admin/roles/${name}`);
}
