import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Card,
  Flex,
  Grid,
  Segmented,
  Table,
  Tooltip,
  Typography,
  type TableProps,
} from "antd";
import { Link } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { TruncatedText } from "@/components/TruncatedText";
import { useAuth } from "@/features/auth/AuthContext";
import { paths } from "@/routes/paths";
import { EMPTY_VALUE, formatDateTime, formatLabel, formatNumber } from "@/utils/format";
import { useListParams } from "@/utils/useListParams";
import { formatIpAddress } from "@/utils/ipAddress";
import { describeUserAgent } from "@/utils/userAgent";
import { fetchSignIns, signInKeys } from "../api";
import type { SignIn, SignInAudience } from "../types";

const FILTERS = ["audience", "userId"] as const;

export function SignInsPage() {
  const { can } = useAuth();
  // On phones the sign-in time moves under the person, so the table fits the screen.
  const isPhone = Grid.useBreakpoint().sm === false;
  const { page, pageSize, filters, setFilters, setPage } = useListParams(FILTERS);
  const audience: SignInAudience = filters.audience === "customers" ? "customers" : "staff";
  const params = { page, pageSize, audience, userId: filters.userId };
  const signInsQuery = useQuery({
    queryKey: signInKeys.list(params),
    queryFn: () => fetchSignIns(params),
    placeholderData: keepPreviousData,
  });
  const person = filters.userId ? signInsQuery.data?.data[0]?.user : undefined;

  const columns: TableProps<SignIn>["columns"] = [
    {
      title: audience === "staff" ? "Staff member" : "Customer",
      key: "user",
      render: (_, signIn) => (
        <Flex vertical className="cell-stack">
          {audience === "customers" && can("customers.view") ? (
            <Link to={paths.customer(signIn.user.id)}>{signIn.user.name}</Link>
          ) : (
            signIn.user.name
          )}
          <Typography.Text type="secondary">{signIn.user.email}</Typography.Text>
          {isPhone && <Typography.Text>{formatDateTime(signIn.signedInAt)}</Typography.Text>}
        </Flex>
      ),
    },
    ...(audience === "staff"
      ? [
          {
            title: "Role",
            key: "role",
            responsive: ["md" as const],
            render: (_: unknown, signIn: SignIn) => formatLabel(signIn.user.role),
          },
        ]
      : []),
    { title: "Signed in", dataIndex: "signedInAt", responsive: ["sm"], render: formatDateTime },
    {
      title: "Signed out",
      dataIndex: "signedOutAt",
      responsive: ["sm"],
      render: (value: string | null) => (value ? formatDateTime(value) : EMPTY_VALUE),
    },
    {
      title: "Device",
      dataIndex: "userAgent",
      responsive: ["lg"],
      render: (userAgent: string | null) =>
        userAgent ? (
          <Tooltip title={userAgent}>
            <span>{describeUserAgent(userAgent) ?? "Unknown"}</span>
          </Tooltip>
        ) : (
          EMPTY_VALUE
        ),
    },
    {
      title: "IP address",
      dataIndex: "ipAddress",
      responsive: ["lg"],
      render: (ip: string | null) => <TruncatedText text={formatIpAddress(ip)} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Sign-in history"
        subtitle="Newest first, kept for a year. An empty Signed out means the session is still open or ran out without signing out."
        extra={
          <Segmented<SignInAudience>
            aria-label="Whose sign-ins"
            value={audience}
            // A person filter belongs to one audience, so switching clears it.
            onChange={(value) =>
              setFilters({ audience: value === "staff" ? undefined : value, userId: undefined })
            }
            options={[
              { value: "staff", label: "Staff" },
              { value: "customers", label: "Customers" },
            ]}
          />
        }
      />
      {filters.userId && (
        <Alert
          type="info"
          showIcon
          className="page-alert"
          title={person ? `Showing sign-ins of ${person.name}.` : "Showing one person's sign-ins."}
          action={
            <Link to={audience === "staff" ? paths.signIns : `${paths.signIns}?audience=customers`}>
              Show everyone
            </Link>
          }
        />
      )}
      <Card>
        {signInsQuery.error ? (
          <QueryErrorResult error={signInsQuery.error} onRetry={() => signInsQuery.refetch()} />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={signInsQuery.data?.data}
            loading={signInsQuery.isFetching}
            locale={{ emptyText: "No sign-ins yet" }}
            pagination={{
              current: page,
              pageSize,
              total: signInsQuery.data?.meta.total,
              showSizeChanger: true,
              showTotal: (total) => `${formatNumber(total)} sign-ins`,
              onChange: setPage,
            }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </>
  );
}
