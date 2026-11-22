import { Card, Result, Typography } from "antd";
import { Outlet } from "react-router";
import { useAuth } from "@/features/auth/AuthContext";
import type { Permission } from "@/features/auth/permissions";

/** Shows the pages below it only to roles with `permission`; the API checks every call as well. */
export function RequirePermission({ permission }: { permission: Permission }) {
  const { can } = useAuth();
  if (can(permission)) return <Outlet />;
  return (
    <Card>
      <Result
        status="403"
        title={
          <Typography.Title level={1} className="result-title">
            No access
          </Typography.Title>
        }
        subTitle="Your role doesn't include this page. Ask an admin if you need it."
      />
    </Card>
  );
}
