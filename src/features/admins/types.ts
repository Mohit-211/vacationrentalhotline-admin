export interface AdminRole {
  id?: number;
  name: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role_id?: number | string | null;
  admin_role?: AdminRole | null;
}

/** Roles an admin can be given. Ids match the API's role table. */
export const ADMIN_ROLE_OPTIONS = [
  { id: 1, label: "Admin", description: "Full access to every page." },
  { id: 6, label: "Employee", description: "Can view, edit and delete users only." },
] as const;

export type AdminRoleId = (typeof ADMIN_ROLE_OPTIONS)[number]["id"];

export interface AdminFormValues {
  name: string;
  email: string;
  roleId: AdminRoleId;
}
