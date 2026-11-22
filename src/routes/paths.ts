import type { EntityId } from "@/api/types";

/** Every URL in the app. Use these instead of string literals when linking or navigating. */
export const paths = {
  login: "/login",
  dashboard: "/",
  profile: "/profile",
  changePassword: "/change-password",
  users: "/users",
  newUser: "/users/new",
  user: (userId: EntityId) => `/users/${userId}`,
  admins: "/admins",
  newAdmin: "/admins/new",
  editAdmin: (adminId: EntityId) => `/admins/${adminId}/edit`,
  contact: "/contact",
  payments: "/payments",
  properties: "/properties",
  property: (propertyId: EntityId) => `/properties/${propertyId}`,
} as const;
