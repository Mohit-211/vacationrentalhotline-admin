import { Button, Result } from "antd";
import { getErrorMessage, isForbiddenError } from "@/utils/errors";

interface QueryErrorResultProps {
  error: unknown;
  onRetry?: () => void;
}

/** Full-width message for data that failed to load: "no access" or a retryable error. */
export function QueryErrorResult({ error, onRetry }: QueryErrorResultProps) {
  if (isForbiddenError(error)) {
    return (
      <Result
        status="403"
        title="No access"
        subTitle="Your role does not have access to this page. Ask an admin if you need it."
      />
    );
  }
  return (
    <Result
      status="error"
      title="Could not load this page"
      subTitle={getErrorMessage(error, "Something went wrong while loading the data.")}
      extra={
        onRetry && (
          <Button type="primary" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}
