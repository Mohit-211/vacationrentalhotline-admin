import type { Id } from "@/api/types";

/** Every URL in the app. Use these instead of string literals when linking or navigating. */
export const paths = {
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/",
  profile: "/profile",
  changePassword: "/change-password",
  customers: "/customers",
  newCustomer: "/customers/new",
  customer: (customerId: Id) => `/customers/${customerId}`,
  editCustomer: (customerId: Id) => `/customers/${customerId}/edit`,
  newCustomerProperty: (customerId: Id) => `/customers/${customerId}/properties/new`,
  properties: "/properties",
  property: (propertyId: Id) => `/properties/${propertyId}`,
  editProperty: (propertyId: Id) => `/properties/${propertyId}/edit`,
  payments: "/payments",
  payment: (paymentId: Id) => `/payments/${paymentId}`,
  messages: "/messages",
  signIns: "/sign-ins",
  staff: "/staff",
  newStaff: "/staff/new",
  editStaff: (staffId: Id) => `/staff/${staffId}/edit`,
  roles: "/roles",
  newRole: "/roles/new",
  editRole: (roleName: string) => `/roles/${roleName}/edit`,
} as const;
