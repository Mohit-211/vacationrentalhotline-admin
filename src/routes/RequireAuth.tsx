import { Navigate, Outlet, useLocation } from "react-router";
import { PageLoader } from "@/components/PageLoader";
import { useAuth } from "@/features/auth/AuthContext";
import { paths } from "./paths";

/** Sends signed-out visitors to the sign-in page, which returns them here afterwards. */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <PageLoader />;
  if (status === "signed-out") {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
