import { Button, Result } from "antd";
import { useNavigate } from "react-router";
import { paths } from "./paths";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="This page does not exist or has moved."
      extra={
        <Button type="primary" onClick={() => navigate(paths.dashboard)}>
          Go to dashboard
        </Button>
      }
    />
  );
}
