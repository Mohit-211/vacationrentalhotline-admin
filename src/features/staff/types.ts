import type { Id } from "@/api/types";

/** A staff account: anyone whose role isn't "customer". */
export interface StaffMember {
  id: Id;
  name: string;
  email: string;
  /** Role name, such as "admin"; the label comes from the roles list. */
  role: string;
  createdAt: string;
}

export interface StaffValues {
  name: string;
  email: string;
  role: string;
}

export interface NewStaffValues extends StaffValues {
  /** Email the generated password to them (it is shown on screen either way). */
  sendEmail: boolean;
}
