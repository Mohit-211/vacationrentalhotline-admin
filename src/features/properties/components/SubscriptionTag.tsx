import { Tag } from "antd";
import { EMPTY_VALUE } from "@/utils/format";

/** Shows a property's subscription status ("ACTIVATE"/"DEACTIVATE" in the API) as a tag. */
export function SubscriptionTag({ status }: { status?: string | null }) {
  if (status === "ACTIVATE") return <Tag color="success">Active</Tag>;
  if (status === "DEACTIVATE") return <Tag>Inactive</Tag>;
  return <>{EMPTY_VALUE}</>;
}
