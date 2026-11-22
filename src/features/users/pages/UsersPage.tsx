import {
  CheckCircleFilled,
  CloseCircleFilled,
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Input, Space, Table, Tooltip, theme, type TableProps } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { paths } from "@/routes/paths";
import { downloadCsv } from "@/utils/csv";
import { getErrorMessage } from "@/utils/errors";
import { displayValue, formatNumber } from "@/utils/format";
import { matchesQuery } from "@/utils/search";
import { deleteUser, fetchUsers, userKeys } from "../api";
import type { User } from "../types";

export function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [search, setSearch] = useState("");
  const usersQuery = useQuery({ queryKey: userKeys.all, queryFn: fetchUsers });

  const users = useMemo(
    () =>
      (usersQuery.data ?? []).filter((user) =>
        matchesQuery(search, user.user_profile?.name, user.email),
      ),
    [usersQuery.data, search],
  );

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (serverMessage) => {
      message.success(serverMessage || "User deleted");
      return queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not delete the user.")),
  });

  const columns: TableProps<User>["columns"] = [
    {
      title: "Name",
      key: "name",
      render: (_, user) => displayValue(user.user_profile?.name),
      sorter: (a, b) => (a.user_profile?.name ?? "").localeCompare(b.user_profile?.name ?? ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email: string, user) => (
        <Space size={6}>
          {email}
          <VerifiedIcon verified={Boolean(user.is_verified)} />
        </Space>
      ),
    },
    {
      title: "Mobile",
      key: "mobile",
      render: (_, user) => displayValue(user.user_profile?.mobile),
    },
    {
      title: "Address",
      key: "address",
      ellipsis: true,
      render: (_, user) => displayValue(user.user_profile?.full_address),
    },
    {
      title: "Properties",
      dataIndex: "active_property_count",
      align: "right",
      sorter: (a, b) => (a.active_property_count ?? 0) - (b.active_property_count ?? 0),
      render: (count?: number | null) => formatNumber(count ?? 0),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_, user) => {
        const name = user.user_profile?.name || user.email;
        return (
          <Space>
            <Tooltip title="View details">
              <Button
                icon={<EyeOutlined />}
                aria-label={`View ${name}`}
                onClick={() => navigate(paths.user(user.id))}
              />
            </Tooltip>
            <DeleteButton
              itemName={name}
              loading={deleteMutation.isPending && deleteMutation.variables === user.id}
              onConfirm={() => deleteMutation.mutate(user.id)}
            />
          </Space>
        );
      },
    },
  ];

  const exportUsers = () =>
    downloadCsv(
      "users.csv",
      ["ID", "Name", "Email", "Email verified", "Mobile", "Address", "Properties"],
      users.map((user) => [
        user.id,
        user.user_profile?.name,
        user.email,
        user.is_verified ? "Yes" : "No",
        user.user_profile?.mobile,
        user.user_profile?.full_address,
        user.active_property_count ?? 0,
      ]),
    );

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="People who use the app, and their properties"
        extra={
          <>
            <Input.Search
              allowClear
              placeholder="Search name or email"
              aria-label="Search users"
              onChange={(event) => setSearch(event.target.value)}
              style={{ width: 240 }}
            />
            <Button icon={<DownloadOutlined />} onClick={exportUsers} disabled={!users.length}>
              Export CSV
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(paths.newUser)}>
              Add user
            </Button>
          </>
        }
      />
      {usersQuery.error ? (
        <QueryErrorResult error={usersQuery.error} onRetry={() => usersQuery.refetch()} />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={usersQuery.isPending}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `${total} users`,
          }}
          scroll={{ x: "max-content" }}
        />
      )}
    </>
  );
}

function VerifiedIcon({ verified }: { verified: boolean }) {
  const { token } = theme.useToken();
  const label = verified ? "Email verified" : "Email not verified";
  return (
    <Tooltip title={label}>
      {verified ? (
        <CheckCircleFilled style={{ color: token.colorSuccess }} aria-label={label} />
      ) : (
        <CloseCircleFilled style={{ color: token.colorError }} aria-label={label} />
      )}
    </Tooltip>
  );
}
