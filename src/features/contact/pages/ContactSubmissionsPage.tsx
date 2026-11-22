import { useQuery } from "@tanstack/react-query";
import { Input, Table, Typography, type TableProps } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { displayValue, formatDateTime } from "@/utils/format";
import { matchesQuery } from "@/utils/search";
import { contactKeys, fetchContactSubmissions } from "../api";
import type { ContactSubmission } from "../types";

const columns: TableProps<ContactSubmission>["columns"] = [
  { title: "Name", dataIndex: "name", render: displayValue },
  {
    title: "Email",
    dataIndex: "email",
    render: (email?: string | null) =>
      email ? <a href={`mailto:${email}`}>{email}</a> : displayValue(email),
  },
  { title: "Phone", dataIndex: "contact_number", render: displayValue },
  { title: "Message", dataIndex: "requirements", ellipsis: true, render: displayValue },
  {
    title: "Received",
    dataIndex: "created_at",
    render: formatDateTime,
    defaultSortOrder: "descend",
    sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
  },
];

export function ContactSubmissionsPage() {
  const [search, setSearch] = useState("");
  const submissionsQuery = useQuery({
    queryKey: contactKeys.all,
    queryFn: fetchContactSubmissions,
  });

  const submissions = useMemo(
    () =>
      (submissionsQuery.data ?? []).filter((submission) =>
        matchesQuery(search, submission.name, submission.email, submission.contact_number),
      ),
    [submissionsQuery.data, search],
  );

  return (
    <>
      <PageHeader
        title="Contact form"
        subtitle="Messages sent through the contact form. Expand a row to read the full message."
        extra={
          <Input.Search
            allowClear
            placeholder="Search name, email or phone"
            aria-label="Search contact form messages"
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: 260 }}
          />
        }
      />
      {submissionsQuery.error ? (
        <QueryErrorResult
          error={submissionsQuery.error}
          onRetry={() => submissionsQuery.refetch()}
        />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={submissions}
          loading={submissionsQuery.isPending}
          expandable={{
            rowExpandable: (submission) => Boolean(submission.requirements),
            expandedRowRender: (submission) => (
              <Typography.Paragraph style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {submission.requirements}
              </Typography.Paragraph>
            ),
          }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `${total} messages`,
          }}
          scroll={{ x: "max-content" }}
        />
      )}
    </>
  );
}
