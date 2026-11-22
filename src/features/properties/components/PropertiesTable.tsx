import { EyeOutlined } from "@ant-design/icons";
import { Button, Table, Tooltip, type TableProps } from "antd";
import { useNavigate } from "react-router";
import { paths } from "@/routes/paths";
import { displayValue, formatDate } from "@/utils/format";
import type { Property } from "../types";
import { SubscriptionTag } from "./SubscriptionTag";

interface PropertiesTableProps {
  properties: Property[] | undefined;
  loading?: boolean;
}

export function PropertiesTable({ properties, loading }: PropertiesTableProps) {
  const navigate = useNavigate();

  const columns: TableProps<Property>["columns"] = [
    {
      title: "Owner",
      dataIndex: "property_owner_name",
      render: displayValue,
      sorter: (a, b) => (a.property_owner_name ?? "").localeCompare(b.property_owner_name ?? ""),
    },
    { title: "Address", dataIndex: "full_address", ellipsis: true, render: displayValue },
    {
      title: "Subscription",
      dataIndex: "subscription_status",
      render: (status?: string | null) => <SubscriptionTag status={status} />,
    },
    { title: "Starts", dataIndex: "subscription_start_date", render: formatDate },
    { title: "Ends", dataIndex: "subscription_end_date", render: formatDate },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, property) => (
        <Tooltip title="View details">
          <Button
            icon={<EyeOutlined />}
            aria-label={`View property of ${property.property_owner_name ?? "unknown owner"}`}
            onClick={() => navigate(paths.property(property.id))}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={properties}
      loading={loading}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: "max-content" }}
    />
  );
}
