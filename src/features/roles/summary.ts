import { PERMISSION_SHORT_LABELS } from "@/features/auth/permissions";
import type { Role } from "./types";

/** "Dashboard, View customers, Manage customers": what a role allows, in one line. */
export function roleSummary(role: Role): string {
  if (!role.editable) return "Everything, always";
  if (!role.permissions.length) return "Nothing yet";
  return role.permissions
    .map((permission) => PERMISSION_SHORT_LABELS[permission] ?? permission)
    .join(", ");
}
