import { Tag } from "antd";
import type { CoverFields } from "../cover";

/** Active (green), free cover (blue) or inactive (grey). */
export function CoverTag({ property }: { property: CoverFields }) {
  if (property.status === "active" && property.complimentary) {
    return <Tag color="processing">Free cover</Tag>;
  }
  if (property.status === "active") return <Tag color="success">Active</Tag>;
  return <Tag>Inactive</Tag>;
}
