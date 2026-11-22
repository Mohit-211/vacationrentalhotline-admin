import { Tag } from "antd";
import { PAYMENT_STATUSES } from "../status";
import type { PaymentStatus } from "../types";

export function PaymentStatusTag({ status }: { status: PaymentStatus }) {
  const tag = PAYMENT_STATUSES[status] ?? { label: status };
  return <Tag color={tag.color}>{tag.label}</Tag>;
}
