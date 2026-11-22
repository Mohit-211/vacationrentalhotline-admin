import { KeyOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions } from "antd";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { displayValue } from "@/utils/format";
import { useProfile } from "../useProfile";

export function ProfilePage() {
  const navigate = useNavigate();
  const profileQuery = useProfile();
  const profile = profileQuery.data;

  return (
    <>
      <PageHeader
        title="My profile"
        subtitle="Your admin account"
        extra={
          <Button icon={<KeyOutlined />} onClick={() => navigate(paths.changePassword)}>
            Change password
          </Button>
        }
      />
      {profileQuery.error ? (
        <QueryErrorResult error={profileQuery.error} onRetry={() => profileQuery.refetch()} />
      ) : (
        <Card loading={profileQuery.isPending}>
          <Descriptions
            column={1}
            items={[
              { key: "name", label: "Name", children: displayValue(profile?.name) },
              { key: "email", label: "Email", children: displayValue(profile?.email) },
              { key: "role", label: "Role", children: displayValue(profile?.admin_role?.name) },
            ]}
          />
        </Card>
      )}
    </>
  );
}
