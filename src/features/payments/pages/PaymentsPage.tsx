import { ExportOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Input, Table, Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { EMPTY_VALUE, displayValue, formatCurrency, formatDateTime } from "@/utils/format";
import { matchesQuery } from "@/utils/search";
import { fetchPayments, paymentKeys } from "../api";
import type { Payment } from "../types";

const STATUS_COLORS: Record<string, string> = {
  succeeded: "success",
  success: "success",
  paid: "success",
  completed: "success",
  pending: "processing",
  processing: "processing",
  failed: "error",
  canceled: "error",
  cancelled: "error",
  refunded: "warning",
};

function PaymentStatusTag({ status }: { status?: string | null }) {
  if (!status) return <>{EMPTY_VALUE}</>;
  return <Tag color={STATUS_COLORS[status.toLowerCase()]}>{status}</Tag>;
}

const columns: TableProps<Payment>["columns"] = [
  { title: "User", dataIndex: "user_name", render: displayValue },
  {
    title: "Amount",
    dataIndex: "collectiveAmount",
    align: "right",
    render: formatCurrency,
    sorter: (a, b) => Number(a.collectiveAmount ?? 0) - Number(b.collectiveAmount ?? 0),
  },
  { title: "Method", dataIndex: "payment_mode", render: displayValue },
  {
    title: "Status",
    dataIndex: "payment_status",
    render: (status?: string | null) => <PaymentStatusTag status={status} />,
  },
  {
    title: "Paid on",
    dataIndex: "created_at",
    render: formatDateTime,
    defaultSortOrder: "descend",
    sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
  },
  {
    title: "Receipt",
    dataIndex: "receipt_url",
    render: (url?: string | null) =>
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
  const [search, setSearch] = useState("");
  const paymentsQuery = useQuery({ queryKey: paymentKeys.all, queryFn: fetchPayments });

  const payments = useMemo(
    () =>
      (paymentsQuery.data ?? []).filter((payment) =>
        matchesQuery(search, payment.user_name, payment.email),
      ),
    [paymentsQuery.data, search],
  );

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Subscription payments made by users"
        extra={
          <Input.Search
            allowClear
            placeholder="Search user"
            aria-label="Search payments"
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: 240 }}
          />
        }
      />
      {paymentsQuery.error ? (
        <QueryErrorResult error={paymentsQuery.error} onRetry={() => paymentsQuery.refetch()} />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={payments}
          loading={paymentsQuery.isPending}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `${total} payments`,
          }}
          scroll={{ x: "max-content" }}
        />
      )}
    </>
  );
}
