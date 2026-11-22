import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Card,
  Flex,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  type TableProps,
} from "antd";
import { useNavigate } from "react-router";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { formatNumber } from "@/utils/format";
import { deleteRole, fetchRoles, roleKeys } from "../api";
import { roleSummary } from "../summary";
import type { Role } from "../types";

export function RolesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const rolesQuery = useQuery({ queryKey: roleKeys.all, queryFn: fetchRoles });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      message.success("Role deleted");
      return queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not delete the role.")),
  });

  const columns: TableProps<Role>["columns"] = [
    // The role, and under it what it allows: one column that also fits phones.
    {
      title: "Role",
      key: "role",
      render: (_, role) => (
        <Flex vertical align="flex-start">
          <Flex align="center" gap="small" wrap>
            {role.label}
            {role.system && <Tag>Built in</Tag>}
          </Flex>
          <Typography.Text type="secondary" className="cell-wrap">
            {roleSummary(role)}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: "Staff",
      dataIndex: "members",
      align: "right",
      responsive: ["sm"],
      render: (members: number) => formatNumber(members),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, role) => (
        <Space>
          {role.editable && (
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                aria-label={`Edit ${role.label}`}
                onClick={() => navigate(paths.editRole(role.name))}
              />
            </Tooltip>
          )}
          {!role.system && (
            <DeleteButton
              itemName={`the ${role.label} role`}
              loading={deleteMutation.isPending && deleteMutation.variables === role.name}
              disabled={role.members > 0}
              disabledReason="Give its staff another role first"
              onConfirm={() => deleteMutation.mutate(role.name)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Roles"
        subtitle="What each kind of staff account can do. Admin can always do everything."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(paths.newRole)}>
            Add role
          </Button>
        }
      />
      <Card>
        {rolesQuery.error ? (
          <QueryErrorResult error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />
        ) : (
          <Table
            rowKey="name"
            columns={columns}
            dataSource={rolesQuery.data}
            loading={rolesQuery.isPending}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </>
  );
}
