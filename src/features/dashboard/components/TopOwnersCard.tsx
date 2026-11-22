import { Card, Table, Typography, type TableProps } from "antd";
import { displayValue, formatNumber } from "@/utils/format";
import type { TopPropertyOwner } from "../types";

interface TopOwnersCardProps {
  owners: TopPropertyOwner[] | undefined;
  loading: boolean;
  error: unknown;
}

const columns: TableProps<TopPropertyOwner>["columns"] = [
  { title: "Owner", dataIndex: "profile_name", render: displayValue },
  {
    title: "Properties",
    dataIndex: "total_properties",
    align: "right",
    render: (count?: number | null) => formatNumber(count ?? 0),
  },
];

export function TopOwnersCard({ owners, loading, error }: TopOwnersCardProps) {
  return (
    <Card title="Top property owners" style={{ height: "100%" }}>
      {error ? (
        <Typography.Text type="danger">Could not load property owners</Typography.Text>
      ) : (
        <Table
          size="small"
          rowKey="key"
          columns={columns}
          dataSource={owners}
          loading={loading}
          pagination={false}
          scroll={{ y: 260 }}
        />
      )}
    </Card>
  );
}
