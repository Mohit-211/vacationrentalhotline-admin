import { Button, Result, Typography } from "antd";
import { isRouteErrorResponse, useRouteError } from "react-router";

/** Shown when a page crashes or its code fails to load (for example right after a deploy). */
export function RouteErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <Result
      status="error"
      title={
        <Typography.Title level={1} className="result-title">
          Something went wrong
        </Typography.Title>
      }
      subTitle={
        isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : "An unexpected error occurred. Reloading the page usually fixes it."
      }
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      }
    />
  );
}
