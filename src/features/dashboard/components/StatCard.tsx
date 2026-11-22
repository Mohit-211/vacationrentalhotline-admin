import { ArrowRightOutlined } from "@ant-design/icons";
import { Card, Flex, Statistic, Typography } from "antd";
import type { ReactNode } from "react";
import { Link } from "react-router";

interface StatCardProps {
  title: string;
  icon: ReactNode;
  /** Colour of the icon badge: the logo's blue (default) or its green. */
  tone?: "primary" | "success";
  /** The figure, already formatted. */
  value: string | undefined;
  /** A line under the figure, such as "+12 in the last 30 days". */
  caption?: ReactNode;
  loading: boolean;
  /** Shown only when the role can open the page. */
  link?: { to: string; label: string };
}

export function StatCard({
  title,
  icon,
  tone = "primary",
  value,
  caption,
  loading,
  link,
}: StatCardProps) {
  const iconClass =
    tone === "success" ? "stat-card__icon stat-card__icon--success" : "stat-card__icon";

  return (
    <Card className="card-fill">
      <Flex justify="space-between" align="flex-start" gap="middle">
        <Statistic title={title} loading={loading} value={value} />
        <span className={iconClass} aria-hidden>
          {icon}
        </span>
      </Flex>
      {caption && !loading && (
        <Typography.Text type="secondary" className="stat-card__caption">
          {caption}
        </Typography.Text>
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
