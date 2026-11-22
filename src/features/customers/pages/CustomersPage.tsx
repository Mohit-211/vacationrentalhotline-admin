import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Card, Flex, Table, Tag, Typography, type TableProps } from "antd";
import { Link, useNavigate } from "react-router";
import { fetchAllPages } from "@/api/pagination";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { SearchField } from "@/components/SearchField";
import { TruncatedText } from "@/components/TruncatedText";
import { useAuth } from "@/features/auth/AuthContext";
import { formatPlace, useCountries, type Country } from "@/features/locations/api";
import { paths } from "@/routes/paths";
import { downloadCsv } from "@/utils/csv";
import { getErrorMessage } from "@/utils/errors";
import { formatDate, formatNumber, formatPhone } from "@/utils/format";
import { useListParams } from "@/utils/useListParams";
import { customerKeys, DELETE_CUSTOMER_WARNING, deleteCustomer, fetchCustomers } from "../api";
import { VerifiedIcon } from "../components/VerifiedIcon";
import type { CustomerListItem } from "../types";

export function CustomersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { can } = useAuth();
  const { data: countries } = useCountries();
  const { search, page, pageSize, listParams, setSearch, setPage } = useListParams();
  const customersQuery = useQuery({
    queryKey: customerKeys.list(listParams),
    queryFn: () => fetchCustomers(listParams),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      message.success("Customer deleted");
      return queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not delete the customer.")),
  });

  const exportMutation = useMutation({
    mutationFn: () => fetchAllPages(fetchCustomers, { search: listParams.search }),
    onSuccess: (customers) => exportCustomers(customers, countries),
    onError: (error) => message.error(getErrorMessage(error, "Could not export the customers.")),
  });

  const columns: TableProps<CustomerListItem>["columns"] = [
    // Name (opening the customer) over email: one narrow column that also fits phones.
    {
      title: "Customer",
      key: "customer",
      render: (_, customer) => (
        <Flex vertical className="cell-stack">
          <Link to={paths.customer(customer.id)}>{customer.name}</Link>
          <Flex align="center" gap="small">
            <Typography.Text type="secondary">{customer.email}</Typography.Text>
            <VerifiedIcon verified={customer.emailVerified} />
          </Flex>
        </Flex>
      ),
    },
    { title: "Phone", dataIndex: "phone", responsive: ["lg"], render: formatPhone },
    {
      title: "Location",
      key: "location",
      responsive: ["lg"],
      render: (_, customer) => <TruncatedText text={formatPlace(customer, countries) || null} />,
    },
    {
      title: "Properties",
      key: "properties",
      responsive: ["md"],
      render: (_, customer) => (
        <Flex vertical align="flex-start">
          {`${formatNumber(customer.properties.active)} active of ${formatNumber(customer.properties.total)}`}
          {customer.freeCover && <Tag color="processing">Free cover</Tag>}
        </Flex>
      ),
    },
    { title: "Joined", dataIndex: "createdAt", responsive: ["sm"], render: formatDate },
    ...(can("customers.manage")
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_: unknown, customer: CustomerListItem) => (
              <DeleteButton
                itemName={customer.name}
                description={DELETE_CUSTOMER_WARNING}
                loading={deleteMutation.isPending && deleteMutation.variables === customer.id}
                onConfirm={() => deleteMutation.mutate(customer.id)}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="People with an account on the site, newest first"
        extra={
          <>
            <SearchField
              value={search}
              onSearch={setSearch}
              placeholder="Search name, email or phone"
              label="Search customers"
            />
            <Button
              icon={<DownloadOutlined />}
              loading={exportMutation.isPending}
              disabled={!customersQuery.data?.meta.total}
              onClick={() => exportMutation.mutate()}
            >
              Export CSV
            </Button>
            {can("customers.manage") && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate(paths.newCustomer)}
              >
                Add customer
              </Button>
            )}
          </>
        }
      />
      <Card>
        {customersQuery.error ? (
          <QueryErrorResult error={customersQuery.error} onRetry={() => customersQuery.refetch()} />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={customersQuery.data?.data}
            loading={customersQuery.isFetching}
            locale={{ emptyText: search ? "No customers match your search" : "No customers yet" }}
            pagination={{
              current: page,
              pageSize,
              total: customersQuery.data?.meta.total,
              showSizeChanger: true,
              showTotal: (total) => `${formatNumber(total)} customers`,
              onChange: setPage,
            }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </>
  );
}

function exportCustomers(customers: CustomerListItem[], countries: Country[] | undefined): void {
  downloadCsv(
    "customers.csv",
    [
      "Name",
      "Email",
      "Email verified",
      "Phone",
      "Street address",
      "City, state, country",
      "Postal code",
      "Active properties",
      "Properties",
      "Free cover (properties)",
      "Joined",
    ],
    customers.map((customer) => [
      customer.name,
      customer.email,
      customer.emailVerified ? "Yes" : "No",
      customer.phone,
      customer.streetAddress,
      formatPlace(customer, countries),
      customer.postalCode,
      customer.properties.active,
      customer.properties.total,
      customer.freeCover?.properties,
      formatDate(customer.createdAt),
    ]),
  );
}
