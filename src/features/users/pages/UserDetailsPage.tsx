import { CheckCircleFilled, DownloadOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Descriptions, Flex, Space, Tag } from "antd";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { fetchPropertiesByUser, propertyKeys } from "@/features/properties/api";
import { PropertiesTable } from "@/features/properties/components/PropertiesTable";
import { exportPropertiesCsv } from "@/features/properties/export";
import { paths } from "@/routes/paths";
import { displayValue } from "@/utils/format";
import { fetchUser, userKeys } from "../api";

export function UserDetailsPage() {
  const { userId = "" } = useParams();
  const navigate = useNavigate();
  const userQuery = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
  });
  const propertiesQuery = useQuery({
    queryKey: propertyKeys.byUser(userId),
    queryFn: () => fetchPropertiesByUser(userId),
  });
  const user = userQuery.data;
  const properties = propertiesQuery.data ?? [];

  if (userQuery.error) {
    return (
      <>
        <PageHeader title="User" onBack={() => navigate(paths.users)} />
        <QueryErrorResult error={userQuery.error} onRetry={() => userQuery.refetch()} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={user?.user_profile?.name || user?.email || "User"}
        subtitle="Account details and properties"
        onBack={() => navigate(paths.users)}
      />
      <Flex vertical gap="large">
        <Card title="Details" loading={userQuery.isPending}>
          <Descriptions
            column={{ xs: 1, md: 2 }}
            items={[
              { key: "name", label: "Name", children: displayValue(user?.user_profile?.name) },
              {
                key: "email",
                label: "Email",
                children: (
                  <Space size={6}>
                    {displayValue(user?.email)}
                    {Boolean(user?.is_verified) && (
                      <Tag icon={<CheckCircleFilled />} color="success">
                        Verified
                      </Tag>
                    )}
                  </Space>
                ),
              },
              {
                key: "mobile",
                label: "Mobile",
                children: displayValue(user?.user_profile?.mobile),
              },
              {
                key: "address",
                label: "Address",
                children: displayValue(user?.user_profile?.full_address),
              },
            ]}
          />
        </Card>
        <Card
          title="Properties"
          extra={
            <Button
              icon={<DownloadOutlined />}
              disabled={!properties.length}
              onClick={() => exportPropertiesCsv(properties, `properties-user-${userId}.csv`)}
            >
              Export CSV
            </Button>
          }
        >
          {propertiesQuery.error ? (
            <QueryErrorResult
              error={propertiesQuery.error}
              onRetry={() => propertiesQuery.refetch()}
            />
          ) : (
            <PropertiesTable properties={properties} loading={propertiesQuery.isPending} />
          )}
        </Card>
      </Flex>
    </>
  );
}
