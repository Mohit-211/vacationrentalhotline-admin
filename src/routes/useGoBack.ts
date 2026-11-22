import { useNavigate, useLocation } from "react-router";

/**
 * Returns a handler that goes back to the previous page in the panel. When the page was opened
 * directly (a bookmark, a new tab), there is no such page, so it goes to `fallback` instead of
 * leaving the panel.
 */
export function useGoBack(fallback: string) {
  const navigate = useNavigate();
  const location = useLocation();
  return () => (location.key === "default" ? navigate(fallback) : navigate(-1));
}
