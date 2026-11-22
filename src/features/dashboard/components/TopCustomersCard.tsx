import { Card, Flex, Table, Typography, type TableProps } from "antd";
import { Link } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { paths } from "@/routes/paths";
import { formatNumber } from "@/utils/format";
import type { Stats } from "../types";

type TopCustomer = Stats["topCustomers"][number];

interface TopCustomersCardProps {
  customers: TopCustomer[] | undefined;
  loading: boolean;
}

export function TopCustomersCard({ customers, loading }: TopCustomersCardProps) {
  const { can } = useAuth();
  const columns: TableProps<TopCustomer>["columns"] = [
    {
      title: "Customer",
      key: "customer",
      render: (_, customer) => (
        <Flex vertical className="cell-stack">
          {can("customers.view") ? (
            <Link to={paths.customer(customer.id)}>{customer.name}</Link>
          ) : (
            customer.name
          )}
          <Typography.Text type="secondary">{customer.email}</Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Active properties",
      dataIndex: "activeProperties",
      align: "right",
      render: (count: number) => formatNumber(count),
    },
  ];

  return (
    <Card title="Top customers" className="card-fill">
      <Table
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={customers}
        loading={loading}
        locale={{ emptyText: "No customers with active properties yet" }}
        pagination={false}
      />
    </Card>
  );
}
