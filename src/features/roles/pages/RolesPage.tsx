import { useQuery } from "@tanstack/react-query";
import { Table, type TableProps } from "antd";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { displayValue } from "@/utils/format";
import { fetchRoles, roleKeys } from "../api";
import type { Role } from "../types";

const columns: TableProps<Role>["columns"] = [
  { title: "ID", dataIndex: "id", width: 100 },
  { title: "Role name", dataIndex: "name" },
  { title: "Abbreviation", dataIndex: "abbreviation", render: displayValue },
];

/** Read-only list; adding and editing roles stays switched off, as in the previous app. */
export function RolesPage() {
  const rolesQuery = useQuery({ queryKey: roleKeys.all, queryFn: fetchRoles });

  return (
    <>
      <PageHeader title="Roles" subtitle="Roles that can be given to admins and app users" />
      {rolesQuery.error ? (
        <QueryErrorResult error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={rolesQuery.data}
          loading={rolesQuery.isPending}
          pagination={{ pageSize: 50, hideOnSinglePage: true }}
        />
      )}
    </>
  );
}
