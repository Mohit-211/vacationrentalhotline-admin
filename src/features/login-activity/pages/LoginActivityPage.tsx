import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Popconfirm, Table, type TableProps } from "antd";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { getErrorMessage } from "@/utils/errors";
import { EMPTY_VALUE, displayValue, formatDateTime } from "@/utils/format";
import { clearLoginActivity, fetchLoginActivity, loginActivityKeys } from "../api";
import type { LoginActivityRow, LoginSession } from "../types";

const userColumns: TableProps<LoginActivityRow>["columns"] = [
  { title: "Name", dataIndex: "name", render: displayValue },
  { title: "Email", dataIndex: "email", render: displayValue },
  { title: "Role", dataIndex: "role", render: displayValue },
  { title: "User ID", dataIndex: "userId" },
  { title: "Sign-ins", key: "count", align: "right", render: (_, row) => row.sessions.length },
];

const sessionColumns: TableProps<LoginSession>["columns"] = [
  {
    title: "IP address",
    dataIndex: "ip_address",
    // IPv4 addresses arrive in IPv6-mapped form ("::ffff:1.2.3.4").
    render: (ip?: string | null) => (ip ? ip.replace(/^::ffff:/, "") : EMPTY_VALUE),
  },
  { title: "Signed in", dataIndex: "login_time_utc", render: formatDateTime },
  { title: "Signed out", dataIndex: "logout_time_utc", render: formatDateTime },
];

export function LoginActivityPage() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const activityQuery = useQuery({ queryKey: loginActivityKeys.all, queryFn: fetchLoginActivity });

  const clearMutation = useMutation({
    mutationFn: clearLoginActivity,
    onSuccess: () => {
      message.success("Login records cleared");
      return queryClient.invalidateQueries({ queryKey: loginActivityKeys.all });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not clear the login records.")),
  });

  return (
    <>
      <PageHeader
        title="Login activity"
        subtitle="When app users signed in and out"
        extra={
          <Popconfirm
            title="Clear all login records?"
            description="Every user's sign-in history will be deleted. This cannot be undone."
            okText="Clear records"
            okButtonProps={{ danger: true }}
            onConfirm={() => clearMutation.mutate()}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={clearMutation.isPending}
              disabled={!activityQuery.data?.length}
            >
              Clear records
            </Button>
          </Popconfirm>
        }
      />
      {activityQuery.error ? (
        <QueryErrorResult error={activityQuery.error} onRetry={() => activityQuery.refetch()} />
      ) : (
        <Table
          rowKey="userId"
          columns={userColumns}
          dataSource={activityQuery.data}
          loading={activityQuery.isPending}
          expandable={{
            expandedRowRender: (row) => (
              <Table
                rowKey="id"
                size="small"
                columns={sessionColumns}
                dataSource={row.sessions}
                pagination={{ pageSize: 10, hideOnSinglePage: true }}
              />
            ),
          }}
          pagination={{ pageSize: 20, hideOnSinglePage: true }}
          scroll={{ x: "max-content" }}
        />
      )}
    </>
  );
}
