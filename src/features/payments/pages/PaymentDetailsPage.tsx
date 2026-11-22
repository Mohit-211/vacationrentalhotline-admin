import { ExportOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Flex, Table, Typography, type TableProps } from "antd";
import { Link, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { useGoBack } from "@/routes/useGoBack";
import { EMPTY_VALUE, formatCents, formatDate, formatDateTime } from "@/utils/format";
import { fetchPayment, paymentKeys } from "../api";
import { PaymentStatusTag } from "../components/PaymentStatusTag";
import { paymentTypeLabel } from "../status";
import type { Payment, PaymentItem } from "../types";

export function PaymentDetailsPage() {
  const { paymentId = "" } = useParams();
  const goBack = useGoBack(paths.payments);
  const paymentQuery = useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => fetchPayment(paymentId),
  });
  const payment = paymentQuery.data;

  return (
    <>
      <PageHeader
        title={
          payment ? `Payment of ${formatCents(payment.amountCents, payment.currency)}` : "Payment"
        }
        subtitle={
          payment
            ? `${payment.payerName}, ${formatDate(payment.paidAt ?? payment.createdAt)}`
            : undefined
        }
        onBack={goBack}
      />
      {paymentQuery.error ? (
        <Card>
          <QueryErrorResult
            error={paymentQuery.error}
            onRetry={() => paymentQuery.refetch()}
            notFoundText="This payment doesn't exist."
          />
        </Card>
      ) : (
        <Flex vertical gap="large">
          <Card title="Details" loading={paymentQuery.isPending}>
            {payment && <PaymentDescriptions payment={payment} />}
          </Card>
          <Card title="What it paid for" loading={paymentQuery.isPending}>
            {payment && <PaymentItemsTable payment={payment} />}
          </Card>
        </Flex>
      )}
    </>
  );
}

function PaymentDescriptions({ payment }: { payment: Payment }) {
  return (
    <>
      <Descriptions
        column={{ xs: 1, md: 2 }}
        items={[
          {
            key: "status",
            label: "Status",
            children: <PaymentStatusTag status={payment.status} />,
          },
          {
            key: "amount",
            label: "Amount",
            children: formatCents(payment.amountCents, payment.currency),
          },
          ...(payment.refundedCents > 0
            ? [
                {
                  key: "refunded",
                  label: "Refunded",
                  children: formatCents(payment.refundedCents, payment.currency),
                },
              ]
            : []),
          { key: "type", label: "Type", children: paymentTypeLabel(payment.billingReason) },
          {
            key: "payer",
            label: "Payer",
            children: (
              <Flex vertical>
                {payment.customerId ? (
                  <Link to={paths.customer(payment.customerId)}>{payment.payerName}</Link>
                ) : (
                  `${payment.payerName} (account deleted)`
                )}
                <Typography.Text type="secondary">{payment.payerEmail}</Typography.Text>
              </Flex>
            ),
          },
          {
            key: "paid",
            label: "Paid",
            children: payment.paidAt ? formatDateTime(payment.paidAt) : "Not paid",
          },
          { key: "created", label: "Created", children: formatDateTime(payment.createdAt) },
          {
            key: "invoice",
            label: "Stripe invoice",
            children: <Typography.Text code>{payment.stripeInvoiceId}</Typography.Text>,
          },
          {
            key: "receipt",
            label: "Receipt",
            children: payment.receiptUrl ? (
              <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                View receipt <ExportOutlined />
              </a>
            ) : (
              EMPTY_VALUE
            ),
          },
        ]}
      />
      <Typography.Paragraph type="secondary" className="card-note">
        Refunds are made by hand in Stripe: open the payment there and choose Refund. It shows here
        once Stripe reports it. A refund doesn't end cover; end it on the property if it should
        stop.
      </Typography.Paragraph>
    </>
  );
}

function PaymentItemsTable({ payment }: { payment: Payment }) {
  const columns: TableProps<PaymentItem>["columns"] = [
    {
      title: "Property and period",
      key: "property",
      render: (_, item) => (
        <Flex vertical>
          {item.propertyId ? (
            <Link to={paths.property(item.propertyId)}>{item.propertyLabel}</Link>
          ) : (
            `${item.propertyLabel} (deleted)`
          )}
          <Typography.Text type="secondary">
            {formatDate(item.periodStart)} – {formatDate(item.periodEnd)}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amountCents",
      align: "right",
      render: (cents: number) => formatCents(cents, payment.currency),
    },
  ];
  return (
    <Table
      size="small"
      rowKey={(item) => `${item.propertyId ?? item.propertyLabel}-${item.periodStart}`}
      columns={columns}
      dataSource={payment.items}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
}
