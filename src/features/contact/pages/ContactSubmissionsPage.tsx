import { useQuery } from "@tanstack/react-query";
import { Card, Flex, Grid, Input, Table, Typography, type TableProps } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { TruncatedText } from "@/components/TruncatedText";
import { displayValue, formatDateTime } from "@/utils/format";
import { matchesQuery } from "@/utils/search";
import { contactKeys, fetchContactSubmissions } from "../api";
import type { ContactSubmission } from "../types";

const columns: TableProps<ContactSubmission>["columns"] = [
  // Name over email: one narrow column that also fits phones.
  {
    title: "From",
    key: "from",
    render: (_, submission) => (
      <Flex vertical>
        {displayValue(submission.name)}
        {submission.email && <a href={`mailto:${submission.email}`}>{submission.email}</a>}
      </Flex>
    ),
  },
  { title: "Phone", dataIndex: "contact_number", responsive: ["md"], render: displayValue },
  // A one-line preview; expanding the row shows the whole message.
  {
    title: "Message",
    dataIndex: "requirements",
    responsive: ["md"],
    render: (message?: string | null) => <TruncatedText text={message} />,
  },
  {
    title: "Received",
    dataIndex: "created_at",
    responsive: ["sm"],
    render: formatDateTime,
    defaultSortOrder: "descend",
    sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
  },
];

export function ContactSubmissionsPage() {
  // Below the md breakpoint the phone and date columns are hidden, so expanding a row shows them.
  const compact = Grid.useBreakpoint().md === false;
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
        title="Contact forms"
        subtitle="Messages sent through the website's contact form. Expand a row to read the full message."
        extra={
          <Input.Search
            allowClear
            placeholder="Search name, email or phone"
            aria-label="Search contact forms"
            onChange={(event) => setSearch(event.target.value)}
            className="toolbar-search"
          />
        }
      />
      <Card>
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
              columnTitle: <span className="visually-hidden">Full message</span>,
              rowExpandable: (submission) => compact || Boolean(submission.requirements),
              expandedRowRender: (submission) => (
                <Flex vertical gap="small">
                  {/* A plain list: a full-width Descriptions here would stretch the table. */}
                  {compact && (
                    <dl className="detail-list">
                      <dt>Phone</dt>
                      <dd>{displayValue(submission.contact_number)}</dd>
                      <dt>Received</dt>
                      <dd>{formatDateTime(submission.created_at)}</dd>
                    </dl>
                  )}
                  {submission.requirements && (
                    <Typography.Paragraph className="text-prewrap">
                      {submission.requirements}
                    </Typography.Paragraph>
                  )}
                </Flex>
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
      </Card>
    </>
  );
}
