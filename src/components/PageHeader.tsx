import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Actions on the right, such as search fields and buttons. */
  extra?: ReactNode;
  /** Shows a back button that calls this handler. */
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, extra, onBack }: PageHeaderProps) {
  return (
    <Flex justify="space-between" align="flex-start" gap="middle" wrap style={{ marginBottom: 24 }}>
      <Flex align="flex-start" gap="small">
        {onBack && (
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} aria-label="Go back" />
        )}
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
        </div>
      </Flex>
      {extra && (
        <Flex gap="small" wrap align="center">
          {extra}
        </Flex>
      )}
    </Flex>
  );
}
