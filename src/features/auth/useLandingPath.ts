import { NAV_ITEMS } from "@/routes/navigation";
import { paths } from "@/routes/paths";
import { useAuth } from "./AuthContext";

/** Where to go after signing in: the first menu page the role can open, else the profile. */
export function useLandingPath(): string {
  const { can } = useAuth();
  return NAV_ITEMS.find((item) => can(item.permission))?.path ?? paths.profile;
}
