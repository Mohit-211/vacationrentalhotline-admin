import { Button, Result } from "antd";
import { getErrorMessage, isForbiddenError, isNotFoundError } from "@/utils/errors";

interface QueryErrorResultProps {
  error: unknown;
  onRetry?: () => void;
  /** What a 404 means here, such as "This customer doesn't exist or was deleted." */
  notFoundText?: string;
}

/** Full-width message for data that failed to load: no access, not found, or a retryable error. */
export function QueryErrorResult({ error, onRetry, notFoundText }: QueryErrorResultProps) {
  if (isForbiddenError(error)) {
    return (
      <Result
        status="403"
        title="No access"
        subTitle="Your role doesn't allow this. Ask an admin if you need it."
      />
    );
  }
  if (isNotFoundError(error)) {
    return (
      <Result
        status="404"
        title="Not found"
        subTitle={notFoundText ?? "This record doesn't exist or was deleted."}
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
