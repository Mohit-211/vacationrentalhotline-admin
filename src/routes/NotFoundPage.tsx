import { Button, Result, Typography } from "antd";
import { useNavigate } from "react-router";
import { useLandingPath } from "@/features/auth/useLandingPath";

export function NotFoundPage() {
  const navigate = useNavigate();
  const landingPath = useLandingPath();
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
        <Button type="primary" onClick={() => navigate(landingPath)}>
          Go to the start page
        </Button>
      }
    />
  );
}
