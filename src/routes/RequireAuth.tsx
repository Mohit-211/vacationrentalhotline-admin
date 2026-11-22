import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { paths } from "./paths";

/** Sends signed-out visitors to the login page, which returns them here after signing in. */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
