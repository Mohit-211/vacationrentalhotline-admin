import { ExportOutlined } from "@ant-design/icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Alert, Card, Flex, Select, Table, Typography, type TableProps } from "antd";
import { Link } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { SearchField } from "@/components/SearchField";
import { paths } from "@/routes/paths";
import { EMPTY_VALUE, formatCents, formatDate, formatNumber } from "@/utils/format";
import { useListParams } from "@/utils/useListParams";
import { fetchPayments, paymentKeys } from "../api";
import { PaymentAmount } from "../components/PaymentAmount";
import { PaymentStatusTag } from "../components/PaymentStatusTag";
import { PAYMENT_STATUS_OPTIONS, paymentTypeLabel } from "../status";
import type { Payment, PaymentStatus } from "../types";

const FILTERS = ["status", "customerId"] as const;

const columns: TableProps<Payment>["columns"] = [
  {
    title: "Payment",
    key: "compact",
    responsive: ["xs"],
    render: (_, payment) => (
      <Flex vertical align="flex-start" className="cell-stack">
        <Flex align="center" gap="small">
          <Link to={paths.payment(payment.id)}>
            {formatCents(payment.amountCents, payment.currency)}
          </Link>
          <PaymentStatusTag status={payment.status} />
        </Flex>
        {payment.payerName}
        <Typography.Text type="secondary">
          {formatDate(payment.paidAt ?? payment.createdAt)}
        </Typography.Text>
      </Flex>
    ),
  },
  {
    title: "Date",
    key: "date",
    responsive: ["sm"],
    render: (_, payment) => (
      <Link to={paths.payment(payment.id)}>{formatDate(payment.paidAt ?? payment.createdAt)}</Link>
    ),
  },
  {
    title: "Payer",
    key: "payer",
    responsive: ["sm"],
    render: (_, payment) => (
      <Flex vertical className="cell-stack">
        {payment.customerId ? (
          <Link to={paths.customer(payment.customerId)}>{payment.payerName}</Link>
        ) : (
          payment.payerName
        )}
        <Typography.Text type="secondary">{payment.payerEmail}</Typography.Text>
      </Flex>
    ),
  },
  {
    title: "Amount",
    key: "amount",
    align: "right",
    responsive: ["sm"],
    render: (_, payment) => <PaymentAmount payment={payment} />,
  },
  {
    title: "Status",
    dataIndex: "status",
    responsive: ["sm"],
    render: (status: PaymentStatus) => <PaymentStatusTag status={status} />,
  },
  {
    title: "Type",
    dataIndex: "billingReason",
    responsive: ["md"],
    render: paymentTypeLabel,
  },
  {
    title: "Receipt",
    dataIndex: "receiptUrl",
    responsive: ["md"],
    render: (url: string | null) =>
      url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          View <ExportOutlined />
        </a>
      ) : (
        EMPTY_VALUE
      ),
  },
];

export function PaymentsPage() {
  const { search, page, pageSize, filters, listParams, setSearch, setFilter, setPage } =
    useListParams(FILTERS);
  const params = {
    ...listParams,
    status: filters.status as PaymentStatus | undefined,
    customerId: filters.customerId,
  };
  const paymentsQuery = useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => fetchPayments(params),
    placeholderData: keepPreviousData,
  });
  const filtered = Boolean(search || filters.status);

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Yearly cover payments, newest first. Refunds are made in Stripe and show up here."
        extra={
          <>
            <Select<PaymentStatus | "">
              aria-label="Payment status"
              value={(filters.status as PaymentStatus | undefined) ?? ""}
              onChange={(value) => setFilter("status", value || undefined)}
              options={[{ value: "", label: "All statuses" }, ...PAYMENT_STATUS_OPTIONS]}
              className="toolbar-select"
            />
            <SearchField
              value={search}
              onSearch={setSearch}
              placeholder="Search payer, email or invoice"
              label="Search payments"
            />
          </>
        }
      />
      {filters.customerId && (
        <Alert
          type="info"
          showIcon
          className="page-alert"
          title="Showing one customer's payments."
          action={<Link to={paths.payments}>Show all payments</Link>}
        />
      )}
      <Card>
        {paymentsQuery.error ? (
          <QueryErrorResult error={paymentsQuery.error} onRetry={() => paymentsQuery.refetch()} />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={paymentsQuery.data?.data}
            loading={paymentsQuery.isFetching}
            locale={{ emptyText: filtered ? "No payments match" : "No payments yet" }}
            pagination={{
              current: page,
              pageSize,
              total: paymentsQuery.data?.meta.total,
              showSizeChanger: true,
              showTotal: (total) => `${formatNumber(total)} payments`,
              onChange: setPage,
            }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </>
  );
}
