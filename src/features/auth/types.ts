import type { Id } from "@/api/types";
import type { Permission } from "./permissions";

/** The signed-in staff member (GET /admin/me). */
export interface Me {
  id: Id;
  name: string;
  email: string;
  /** Role name, such as "admin" or "employee". */
  role: string;
  /** Role name for people, such as "Admin". */
  roleLabel: string;
  permissions: Permission[];
}

export interface SignInValues {
  email: string;
  password: string;
}

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordValues {
  newPassword: string;
  confirmPassword: string;
}
