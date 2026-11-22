import {
  EditOutlined,
  ExportOutlined,
  HistoryOutlined,
  KeyOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Card, Descriptions, Flex, Table, Tag, type TableProps } from "antd";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { PasswordDialog } from "@/components/PasswordDialog";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { ResetPasswordModal } from "@/components/ResetPasswordModal";
import { useAuth } from "@/features/auth/AuthContext";
import { formatPlace, useCountries } from "@/features/locations/api";
import { PaymentAmount } from "@/features/payments/components/PaymentAmount";
import { PaymentStatusTag } from "@/features/payments/components/PaymentStatusTag";
import type { Payment } from "@/features/payments/types";
import { PropertiesTable } from "@/features/properties/components/PropertiesTable";
import { paths } from "@/routes/paths";
import { useGoBack } from "@/routes/useGoBack";
import { getErrorMessage } from "@/utils/errors";
import { EMPTY_VALUE, formatDate, formatNumber, formatPhone } from "@/utils/format";
import {
  customerKeys,
  DELETE_CUSTOMER_WARNING,
  deleteCustomer,
  fetchCustomer,
  resetCustomerPassword,
} from "../api";
import { FreeCoverCard } from "../components/FreeCoverCard";
import type { CustomerDetails } from "../types";

export function CustomerDetailsPage() {
  const { customerId = "" } = useParams();
  const navigate = useNavigate();
  const goBack = useGoBack(paths.customers);
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { can } = useAuth();
  const customerQuery = useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: () => fetchCustomer(customerId),
  });
  const customer = customerQuery.data;
  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState<{ value: string; emailed: boolean } | null>(null);

  const resetMutation = useMutation({
    mutationFn: (sendEmail: boolean) => resetCustomerPassword(customerId, sendEmail),
    onSuccess: (result, sendEmail) => {
      setResetOpen(false);
      setNewPassword({ value: result.password, emailed: sendEmail });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not reset the password.")),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCustomer(customerId),
    onSuccess: async () => {
      message.success("Customer deleted");
      navigate(paths.customers, { replace: true });
      queryClient.removeQueries({ queryKey: customerKeys.detail(customerId) });
      await queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not delete the customer.")),
  });

  if (customerQuery.error) {
    return (
      <>
        <PageHeader title="Customer" onBack={goBack} />
        <Card>
          <QueryErrorResult
            error={customerQuery.error}
            onRetry={() => customerQuery.refetch()}
            notFoundText="This customer doesn't exist or was deleted."
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={customer?.name ?? "Customer"}
        subtitle={customer ? `Customer since ${formatDate(customer.createdAt)}` : undefined}
        onBack={goBack}
        extra={
          customer && (
            <>
              {can("activity.view") && (
                <Button
                  icon={<HistoryOutlined />}
                  onClick={() =>
                    navigate(`${paths.signIns}?audience=customers&userId=${customer.id}`)
                  }
                >
                  Sign-in history
                </Button>
              )}
              {can("customers.manage") && (
                <>
                  <Button icon={<KeyOutlined />} onClick={() => setResetOpen(true)}>
                    Reset password
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => navigate(paths.editCustomer(customer.id))}
                  >
                    Edit
                  </Button>
                  <DeleteButton
                    label="Delete"
                    itemName={customer.name}
                    description={DELETE_CUSTOMER_WARNING}
                    loading={deleteMutation.isPending}
                    onConfirm={() => deleteMutation.mutate()}
                  />
                </>
              )}
            </>
          )
        }
      />
      <Flex vertical gap="large">
        <Card title="Details" loading={customerQuery.isPending}>
          {customer && <CustomerDescriptions customer={customer} />}
        </Card>
        {customer && <FreeCoverCard customer={customer} />}
        <Card
          title={
            customer ? `Properties (${formatNumber(customer.properties.length)})` : "Properties"
          }
          extra={
            customer &&
            can("customers.manage") && (
              <Button
                icon={<PlusOutlined />}
                onClick={() => navigate(paths.newCustomerProperty(customer.id))}
              >
                Add property
              </Button>
            )
          }
        >
          <PropertiesTable
            properties={customer?.properties}
            loading={customerQuery.isPending}
            emptyText="No properties yet"
          />
        </Card>
        <Card
          title="Payments"
          extra={
            customer &&
            customer.payments.length > 0 && (
              <Link to={`${paths.payments}?customerId=${customer.id}`}>View in payments</Link>
            )
          }
        >
          <CustomerPaymentsTable payments={customer?.payments} loading={customerQuery.isPending} />
        </Card>
      </Flex>
      <ResetPasswordModal
        open={resetOpen}
        accountName={customer?.name ?? ""}
        loading={resetMutation.isPending}
        onConfirm={(sendEmail) => resetMutation.mutate(sendEmail)}
        onCancel={() => setResetOpen(false)}
      />
      <PasswordDialog
        password={newPassword?.value ?? null}
        accountName={customer?.name ?? ""}
        emailed={newPassword?.emailed ?? false}
        onClose={() => setNewPassword(null)}
      />
    </>
  );
}

function CustomerDescriptions({ customer }: { customer: CustomerDetails }) {
  const { data: countries } = useCountries();
  const place = formatPlace(customer, countries);
  const address = [customer.streetAddress, place, customer.postalCode].filter(Boolean).join(", ");
  return (
    <Descriptions
      column={{ xs: 1, md: 2 }}
      items={[
        {
          key: "email",
          label: "Email",
          children: (
            <Flex align="center" gap="small" wrap>
              <a href={`mailto:${customer.email}`}>{customer.email}</a>
              {customer.emailVerified ? (
                <Tag color="success">Verified</Tag>
              ) : (
                <Tag color="warning">Not verified</Tag>
              )}
            </Flex>
          ),
        },
        { key: "phone", label: "Phone", children: formatPhone(customer.phone) },
        { key: "address", label: "Address", children: address || EMPTY_VALUE },
        { key: "since", label: "Customer since", children: formatDate(customer.createdAt) },
      ]}
    />
  );
}

function CustomerPaymentsTable({
  payments,
  loading,
}: {
  payments: Payment[] | undefined;
  loading: boolean;
}) {
  const columns: TableProps<Payment>["columns"] = [
    {
      title: "Date",
      key: "date",
      render: (_, payment) => (
        <Link to={paths.payment(payment.id)}>
          {formatDate(payment.paidAt ?? payment.createdAt)}
        </Link>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      align: "right",
      render: (_, payment) => <PaymentAmount payment={payment} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: Payment["status"]) => <PaymentStatusTag status={status} />,
    },
    {
      title: "Receipt",
      dataIndex: "receiptUrl",
      responsive: ["sm"],
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
  return (
    <Table
      size="small"
      rowKey="id"
      columns={columns}
      dataSource={payments}
      loading={loading}
      locale={{ emptyText: "No payments yet" }}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: "max-content" }}
    />
  );
}
