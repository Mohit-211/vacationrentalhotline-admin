/** What a staff role can be allowed to do. The API checks every call; the panel hides what a role can't use. */
export const PERMISSIONS = [
  "dashboard.view",
  "customers.view",
  "customers.manage",
  "billing.manage",
  "messages.view",
  "messages.manage",
  "activity.view",
  "staff.manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** What each permission allows, in plain words for people. */
export const PERMISSION_LABELS: Record<Permission, string> = {
  "dashboard.view": "See the dashboard",
  "customers.view": "Look up customers, their properties, notes and payments",
  "customers.manage": "Create, edit and delete customers, their properties and notes",
  "billing.manage": "Cancel renewals, end cover and give free cover",
  "messages.view": "Read contact forms",
  "messages.manage": "Delete contact forms",
  "activity.view": "See the sign-in history",
  "staff.manage": "Manage staff accounts and roles",
};

/** Short names for permissions, for tags and summaries. */
export const PERMISSION_SHORT_LABELS: Record<Permission, string> = {
  "dashboard.view": "Dashboard",
  "customers.view": "View customers",
  "customers.manage": "Manage customers",
  "billing.manage": "Billing",
  "messages.view": "Read contact forms",
  "messages.manage": "Delete contact forms",
  "activity.view": "Sign-in history",
  "staff.manage": "Staff and roles",
};
