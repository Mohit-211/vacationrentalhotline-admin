import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import { useLandingPath } from "@/features/auth/useLandingPath";

/** "/" is the dashboard for roles that can see it; everyone else starts on their first page. */
export function HomeRoute() {
  const { can } = useAuth();
  const landingPath = useLandingPath();
  return can("dashboard.view") ? <Outlet /> : <Navigate to={landingPath} replace />;
}
