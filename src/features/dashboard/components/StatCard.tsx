import { ArrowRightOutlined } from "@ant-design/icons";
import { Card, Flex, Statistic, Typography } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { EMPTY_VALUE, formatNumber } from "@/utils/format";

interface StatCardProps {
  title: string;
  icon: ReactNode;
  /** Colour of the icon badge: the logo's blue (default) or its green. */
  tone?: "primary" | "success";
  value: number | undefined;
  loading: boolean;
  error: unknown;
  format?: (value: number) => string;
  link?: { to: string; label: string };
}

export function StatCard({
  title,
  icon,
  tone = "primary",
  value,
  loading,
  error,
  format = formatNumber,
  link,
}: StatCardProps) {
  const iconClass =
    tone === "success" ? "stat-card__icon stat-card__icon--success" : "stat-card__icon";

  return (
    <Card className="card-fill">
      <Flex justify="space-between" align="flex-start" gap="middle">
        <Statistic
          title={title}
          loading={loading}
          value={error || value === undefined ? EMPTY_VALUE : format(value)}
        />
        <span className={iconClass} aria-hidden>
          {icon}
        </span>
      </Flex>
      {Boolean(error) && (
        <Typography.Text type="danger">Could not load this number</Typography.Text>
      )}
      {link && (
        <Link to={link.to} className="stat-card__link">
          {link.label}
          <ArrowRightOutlined />
        </Link>
      )}
    </Card>
  );
}
