import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Card, Space, Table, Tag, Tooltip, type TableProps } from "antd";
import { useNavigate } from "react-router";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { useProfile } from "@/features/auth/useProfile";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { EMPTY_VALUE, formatLabel } from "@/utils/format";
import { adminKeys, deleteAdmin, fetchAdmins } from "../api";
import type { Admin } from "../types";

/** "processing" is Ant Design's info colour, which the theme sets to the logo blue. */
function RoleTag({ name }: { name: string }) {
  const label = formatLabel(name);
  return <Tag color={label === "Admin" ? "processing" : undefined}>{label}</Tag>;
}

export function AdminsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { data: profile } = useProfile();
  const adminsQuery = useQuery({ queryKey: adminKeys.all, queryFn: fetchAdmins });

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: (serverMessage) => {
      message.success(serverMessage || "Admin deleted");
      return queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not delete the admin.")),
  });

  const columns: TableProps<Admin>["columns"] = [
    { title: "Name", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Email", dataIndex: "email", responsive: ["sm"] },
    {
      title: "Role",
      key: "role",
      render: (_, admin) =>
        admin.admin_role?.name ? <RoleTag name={admin.admin_role.name} /> : EMPTY_VALUE,
    },
    {
      title: "Actions",
      key: "actions",
      width: 96,
      render: (_, admin) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label={`Edit ${admin.name}`}
              onClick={() => navigate(paths.editAdmin(admin.id))}
            />
          </Tooltip>
          <DeleteButton
            itemName={admin.name}
            loading={deleteMutation.isPending && deleteMutation.variables === admin.id}
            disabled={admin.id === profile?.id}
            disabledReason="You cannot delete your own account"
            onConfirm={() => deleteMutation.mutate(admin.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Access management"
        subtitle="Admins who can sign in to this panel, and their roles"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(paths.newAdmin)}>
            Add admin
          </Button>
        }
      />
      <Card>
        {adminsQuery.error ? (
          <QueryErrorResult error={adminsQuery.error} onRetry={() => adminsQuery.refetch()} />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={adminsQuery.data}
            loading={adminsQuery.isPending}
            pagination={{ pageSize: 20, hideOnSinglePage: true }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </>
  );
}
