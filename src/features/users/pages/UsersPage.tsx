import {
  CheckCircleFilled,
  DownloadOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Card, Flex, Input, Table, Tooltip, Typography, type TableProps } from "antd";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { TruncatedText } from "@/components/TruncatedText";
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
    // Name (linking to the user's page) over email: one narrow column that also fits phones.
    {
      title: "User",
      key: "user",
      sorter: (a, b) => (a.user_profile?.name ?? "").localeCompare(b.user_profile?.name ?? ""),
      render: (_, user) => {
        const name = user.user_profile?.name;
        return (
          <Flex vertical>
            <Link to={paths.user(user.id)}>{name || user.email}</Link>
            <Flex align="center" gap="small">
              {name && <Typography.Text type="secondary">{user.email}</Typography.Text>}
              <VerifiedIcon verified={Boolean(user.is_verified)} />
            </Flex>
          </Flex>
        );
      },
    },
    {
      title: "Mobile",
      key: "mobile",
      responsive: ["lg"],
      render: (_, user) => displayValue(user.user_profile?.mobile),
    },
    {
      title: "Address",
      key: "address",
      responsive: ["lg"],
      render: (_, user) => <TruncatedText text={user.user_profile?.full_address} />,
    },
    {
      title: "Properties",
      dataIndex: "active_property_count",
      align: "right",
      responsive: ["md"],
      sorter: (a, b) => (a.active_property_count ?? 0) - (b.active_property_count ?? 0),
      render: (count?: number | null) => formatNumber(count ?? 0),
    },
    {
      title: "Actions",
      key: "actions",
      // The name in the User column opens the user's page, so delete is the only action here.
      render: (_, user) => (
        <DeleteButton
          itemName={user.user_profile?.name || user.email}
          loading={deleteMutation.isPending && deleteMutation.variables === user.id}
          onConfirm={() => deleteMutation.mutate(user.id)}
        />
      ),
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
              className="toolbar-search"
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
      <Card>
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
      </Card>
    </>
  );
}

/** Green check for a verified email; amber exclamation when the user has not verified it yet. */
function VerifiedIcon({ verified }: { verified: boolean }) {
  const label = verified ? "Email verified" : "Email not verified";
  return (
    <Tooltip title={label}>
      <Typography.Text type={verified ? "success" : "warning"} role="img" aria-label={label}>
        {verified ? <CheckCircleFilled /> : <ExclamationCircleFilled />}
      </Typography.Text>
    </Tooltip>
  );
}
