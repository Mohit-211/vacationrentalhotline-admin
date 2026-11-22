import { Flex, Table, Typography, type TablePaginationConfig, type TableProps } from "antd";
import { Link } from "react-router";
import { paths } from "@/routes/paths";
import { formatPhone } from "@/utils/format";
import type { Property } from "../types";
import { coverSummary } from "../cover";
import { CoverTag } from "./CoverStatus";

/** A property with, in lists, the customer it belongs to. */
export type PropertyRow = Property & { customer?: { id: string; name: string; email: string } };

interface PropertiesTableProps {
  properties: PropertyRow[] | undefined;
  loading?: boolean;
  /** Show whose property each row is (the all-properties list). */
  showCustomer?: boolean;
  pagination?: false | TablePaginationConfig;
  emptyText: string;
}

export function PropertiesTable({
  properties,
  loading,
  showCustomer = false,
  pagination = false,
  emptyText,
}: PropertiesTableProps) {
  const columns: TableProps<PropertyRow>["columns"] = [
    // The address opens the property; the owner is under it.
    {
      title: "Property",
      key: "property",
      render: (_, property) => (
        <Flex vertical className="cell-stack">
          <Link to={paths.property(property.id)}>
            {[property.addressLine1, property.addressLine2].filter(Boolean).join(", ")}
          </Link>
          <Typography.Text type="secondary">
            {property.city}, {property.regionCode} {property.postalCode}
          </Typography.Text>
        </Flex>
      ),
    },
    ...(showCustomer
      ? [
          {
            title: "Customer",
            key: "customer",
            responsive: ["md" as const],
            render: (_: unknown, property: PropertyRow) =>
              property.customer ? (
                <Flex vertical className="cell-stack">
                  <Link to={paths.customer(property.customer.id)}>{property.customer.name}</Link>
                  <Typography.Text type="secondary">{property.customer.email}</Typography.Text>
                </Flex>
              ) : null,
          },
        ]
      : []),
    {
      title: "Cover",
      key: "cover",
      render: (_, property) => (
        <Flex vertical align="flex-start" gap="small">
          <CoverTag property={property} />
          <Typography.Text type="secondary">{coverSummary(property)}</Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Owner",
      key: "owner",
      responsive: ["lg"],
      render: (_, property) => (
        <Flex vertical>
          {property.ownerName}
          <Typography.Text type="secondary">{formatPhone(property.ownerPhone)}</Typography.Text>
        </Flex>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={properties}
      loading={loading}
      locale={{ emptyText }}
      pagination={pagination}
      scroll={{ x: "max-content" }}
    />
  );
}
