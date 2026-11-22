import {
  DeleteOutlined,
  EditOutlined,
  HistoryOutlined,
  KeyOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Card,
  Dropdown,
  Flex,
  Grid,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  type MenuProps,
  type TableProps,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { PasswordDialog } from "@/components/PasswordDialog";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { ResetPasswordModal } from "@/components/ResetPasswordModal";
import { useAuth } from "@/features/auth/AuthContext";
import { fetchRoles, roleKeys } from "@/features/roles/api";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { formatDate, formatLabel } from "@/utils/format";
import { deleteStaff, fetchStaff, resetStaffPassword, staffKeys } from "../api";
import type { StaffMember } from "../types";

export function StaffPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const { me, can } = useAuth();
  // On phones the role moves under the name, so the table fits the screen.
  const isPhone = Grid.useBreakpoint().sm === false;
  const staffQuery = useQuery({ queryKey: staffKeys.all, queryFn: fetchStaff });
  const rolesQuery = useQuery({ queryKey: roleKeys.all, queryFn: fetchRoles });
  const roleLabel = (name: string) =>
    rolesQuery.data?.find((role) => role.name === name)?.label ?? formatLabel(name);
  const [resetFor, setResetFor] = useState<StaffMember | null>(null);
  const [newPassword, setNewPassword] = useState<{
    value: string;
    name: string;
    emailed: boolean;
  } | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: async () => {
      message.success("Staff member removed");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: staffKeys.all }),
        queryClient.invalidateQueries({ queryKey: roleKeys.all }),
      ]);
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not remove them.")),
  });

  const resetMutation = useMutation({
    mutationFn: ({ member, sendEmail }: { member: StaffMember; sendEmail: boolean }) =>
      resetStaffPassword(member.id, sendEmail),
    onSuccess: (result, { member, sendEmail }) => {
      setResetFor(null);
      setNewPassword({ value: result.password, name: member.name, emailed: sendEmail });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not reset the password.")),
  });

  const columns: TableProps<StaffMember>["columns"] = [
    {
      title: "Staff member",
      key: "member",
      render: (_, member) => (
        <Flex vertical align="flex-start" className="cell-stack">
          <Flex align="center" gap="small">
            {member.name}
            {member.id === me?.id && <Tag>You</Tag>}
          </Flex>
          <Typography.Text type="secondary">{member.email}</Typography.Text>
          {isPhone && <RoleTag role={member.role} label={roleLabel(member.role)} />}
        </Flex>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      responsive: ["sm"],
      render: (role: string) => <RoleTag role={role} label={roleLabel(role)} />,
    },
    { title: "Added", dataIndex: "createdAt", responsive: ["sm"], render: formatDate },
    {
      title: "Actions",
      key: "actions",
      render: (_, member) => {
        const isSelf = member.id === me?.id;
        const more: MenuProps["items"] = [
          // Resetting your own password here would sign you out; Change password is for that.
          { key: "reset", icon: <KeyOutlined />, label: "Reset password", disabled: isSelf },
          ...(can("activity.view")
            ? [{ key: "sign-ins", icon: <HistoryOutlined />, label: "Sign-in history" }]
            : []),
          { type: "divider" as const },
          {
            key: "remove",
            icon: <DeleteOutlined />,
            label: isSelf ? "You can't remove yourself" : "Remove",
            danger: true,
            disabled: isSelf,
          },
        ];
        const onMore: MenuProps["onClick"] = ({ key }) => {
          if (key === "reset") setResetFor(member);
          if (key === "sign-ins") navigate(`${paths.signIns}?audience=staff&userId=${member.id}`);
          if (key === "remove") {
            modal.confirm({
              title: `Remove ${member.name}?`,
              content: "They can no longer sign in to the panel.",
              okText: "Remove",
              okButtonProps: { danger: true },
              onOk: () => deleteMutation.mutateAsync(member.id),
            });
          }
        };
        return (
          <Space size="small">
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                aria-label={`Edit ${member.name}`}
                onClick={() => navigate(paths.editStaff(member.id))}
              />
            </Tooltip>
            <Dropdown
              menu={{ items: more, onClick: onMore }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button type="text" icon={<MoreOutlined />} aria-label={`More for ${member.name}`} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Staff"
        subtitle="People who can sign in to this panel, and their roles"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(paths.newStaff)}>
            Add staff member
          </Button>
        }
      />
      <Card>
        {staffQuery.error ? (
          <QueryErrorResult error={staffQuery.error} onRetry={() => staffQuery.refetch()} />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={staffQuery.data}
            loading={staffQuery.isPending}
            pagination={{ pageSize: 25, hideOnSinglePage: true }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
      <ResetPasswordModal
        open={resetFor !== null}
        accountName={resetFor?.name ?? ""}
        loading={resetMutation.isPending}
        onConfirm={(sendEmail) => resetFor && resetMutation.mutate({ member: resetFor, sendEmail })}
        onCancel={() => setResetFor(null)}
      />
      <PasswordDialog
        password={newPassword?.value ?? null}
        accountName={newPassword?.name ?? ""}
        emailed={newPassword?.emailed ?? false}
        onClose={() => setNewPassword(null)}
      />
    </>
  );
}

function RoleTag({ role, label }: { role: string; label: string }) {
  return <Tag color={role === "admin" ? "processing" : undefined}>{label}</Tag>;
}
