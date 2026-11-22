import type { Id } from "@/api/types";

/** A message sent through the site's contact form. */
export interface Message {
  id: Id;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
}
