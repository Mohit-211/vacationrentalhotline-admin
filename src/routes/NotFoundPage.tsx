import { Button, Result, Typography } from "antd";
import { useNavigate } from "react-router";
import { paths } from "./paths";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title={
        <Typography.Title level={1} className="result-title">
          Page not found
        </Typography.Title>
      }
      subTitle="This page does not exist or has moved."
      extra={
        <Button type="primary" onClick={() => navigate(paths.dashboard)}>
          Go to dashboard
        </Button>
      }
    />
  );
}
