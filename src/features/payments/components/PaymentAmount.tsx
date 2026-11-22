import { Flex, Typography } from "antd";
import { formatCents } from "@/utils/format";
import type { Payment } from "../types";

/** The amount, with any refund under it. */
export function PaymentAmount({ payment }: { payment: Payment }) {
  return (
    <Flex vertical align="flex-end">
      {formatCents(payment.amountCents, payment.currency)}
      {payment.refundedCents > 0 && (
        <Typography.Text type="secondary">
          {formatCents(payment.refundedCents, payment.currency)} refunded
        </Typography.Text>
      )}
    </Flex>
  );
}
