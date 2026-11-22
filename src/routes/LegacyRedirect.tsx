import { generatePath, Navigate, useParams } from "react-router";

/** Redirects a URL from the previous version of the app to its new path, keeping route params. */
export function LegacyRedirect({ to }: { to: string }) {
  const params = useParams() as Record<string, string>;
  return <Navigate to={generatePath(to, params)} replace />;
}
