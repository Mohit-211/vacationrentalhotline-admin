import { formatDate } from "@/utils/format";
import type { Property } from "./types";

export type CoverFields = Pick<
  Property,
  "status" | "complimentary" | "autoRenews" | "subscriptionEndsAt"
>;

/** What happens next with the cover: "Renews 07/20/2027", "Ends 02/20/2027", "Ended 10/23/2026". */
export function coverSummary(property: CoverFields): string {
  if (property.complimentary) return "Covered by free cover";
  if (!property.subscriptionEndsAt) return "Never paid";
  const date = formatDate(property.subscriptionEndsAt);
  if (property.status === "active") return property.autoRenews ? `Renews ${date}` : `Ends ${date}`;
  return `Ended ${date}`;
}
