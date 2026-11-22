import type { Permission } from "@/features/auth/permissions";

/** A staff role: a named set of permissions. Roles are identified by `name`. */
export interface Role {
  /** Such as "admin" or "support": 2-20 lower-case letters, digits or hyphens. */
  name: string;
  /** Such as "Admin". */
  label: string;
  permissions: Permission[];
  /** Built in (admin, employee): can't be deleted. */
  system: boolean;
  /** False for admin, which always has every permission. */
  editable: boolean;
  /** Staff members with this role. */
  members: number;
}

export interface RoleValues {
  name: string;
  label: string;
  permissions: Permission[];
}
