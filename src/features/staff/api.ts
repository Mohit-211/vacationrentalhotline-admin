import { apiClient } from "@/api/client";
import type { ApiData, Id } from "@/api/types";
import type { NewStaffValues, StaffMember, StaffValues } from "./types";

export const staffKeys = { all: ["staff"] as const };

/** Every staff account, by name. There is no endpoint for a single one. */
export async function fetchStaff(): Promise<StaffMember[]> {
  const { data } = await apiClient.get<ApiData<StaffMember[]>>("/admin/staff");
  return data.data;
}

/** The API generates the password and returns it this once. */
export async function createStaff(
  values: NewStaffValues,
): Promise<{ staff: StaffMember; password: string }> {
  const { data } = await apiClient.post<ApiData<{ staff: StaffMember; password: string }>>(
    "/admin/staff",
    values,
  );
  return data.data;
}

/** A role change signs the person out, so it applies at once. */
export async function updateStaff(staffId: Id, values: StaffValues): Promise<StaffMember> {
  const { data } = await apiClient.patch<ApiData<StaffMember>>(`/admin/staff/${staffId}`, values);
  return data.data;
}

/** Generates a new password (returned this once) and signs them out everywhere. */
export async function resetStaffPassword(
  staffId: Id,
  sendEmail: boolean,
): Promise<{ password: string }> {
  const { data } = await apiClient.post<ApiData<{ password: string }>>(
    `/admin/staff/${staffId}/password`,
    { sendEmail },
  );
  return data.data;
}

export async function deleteStaff(staffId: Id): Promise<void> {
  await apiClient.delete(`/admin/staff/${staffId}`);
}
