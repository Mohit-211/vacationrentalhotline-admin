import { ArrowRightOutlined } from "@ant-design/icons";
import { Card, Statistic, Typography } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { EMPTY_VALUE, formatNumber } from "@/utils/format";

interface StatCardProps {
  title: string;
  icon: ReactNode;
  value: number | undefined;
  loading: boolean;
  error: unknown;
  format?: (value: number) => string;
  link?: { to: string; label: string };
}

export function StatCard({
  title,
  icon,
  value,
  loading,
  error,
  format = formatNumber,
  link,
}: StatCardProps) {
  return (
    <Card style={{ height: "100%" }}>
      <Statistic
        title={title}
        prefix={icon}
        loading={loading}
        value={error || value === undefined ? EMPTY_VALUE : format(value)}
      />
      {Boolean(error) && (
        <Typography.Text type="danger">Could not load this number</Typography.Text>
      )}
      {link && (
        <div style={{ marginTop: 12 }}>
          <Link to={link.to}>
            {link.label} <ArrowRightOutlined />
          </Link>
        </div>
      )}
    </Card>
  );
}
