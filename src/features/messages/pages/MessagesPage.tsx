import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Flex, Grid, Table, Typography, type TableProps } from "antd";
import { DeleteButton } from "@/components/DeleteButton";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { SearchField } from "@/components/SearchField";
import { TruncatedText } from "@/components/TruncatedText";
import { useAuth } from "@/features/auth/AuthContext";
import { getErrorMessage } from "@/utils/errors";
import { formatDateTime, formatNumber, formatPhone } from "@/utils/format";
import { useListParams } from "@/utils/useListParams";
import { deleteMessage, fetchMessages, messageKeys } from "../api";
import type { Message } from "../types";

export function MessagesPage() {
  const { can } = useAuth();
  const queryClient = useQueryClient();
  const { message: toast } = App.useApp();
  // Below the md breakpoint the phone and date columns are hidden, so expanding a row shows them.
  const compact = Grid.useBreakpoint().md === false;
  const { search, page, pageSize, listParams, setSearch, setPage } = useListParams();
  const messagesQuery = useQuery({
    queryKey: messageKeys.list(listParams),
    queryFn: () => fetchMessages(listParams),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      toast.success("Message deleted");
      return queryClient.invalidateQueries({ queryKey: messageKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not delete the message.")),
  });

  const columns: TableProps<Message>["columns"] = [
    // Name over email: one narrow column that also fits phones.
    {
      title: "From",
      key: "from",
      render: (_, message) => (
        <Flex vertical className="cell-stack">
          {message.name}
          <a href={`mailto:${message.email}`}>{message.email}</a>
        </Flex>
      ),
    },
    { title: "Phone", dataIndex: "phone", responsive: ["md"], render: formatPhone },
    // A one-line preview; expanding the row shows the whole message.
    {
      title: "Message",
      dataIndex: "message",
      responsive: ["md"],
      render: (text: string) => <TruncatedText text={text} />,
    },
    { title: "Received", dataIndex: "createdAt", responsive: ["sm"], render: formatDateTime },
    ...(can("messages.manage")
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_: unknown, message: Message) => (
              <DeleteButton
                itemName={`the message from ${message.name}`}
                loading={deleteMutation.isPending && deleteMutation.variables === message.id}
                onConfirm={() => deleteMutation.mutate(message.id)}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHeader
        title="Contact forms"
        subtitle="Messages sent through the website's contact form, newest first. Expand a row to read the whole message."
        extra={
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search name, email, phone or text"
            label="Search contact forms"
          />
        }
      />
      <Card>
        {messagesQuery.error ? (
          <QueryErrorResult error={messagesQuery.error} onRetry={() => messagesQuery.refetch()} />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={messagesQuery.data?.data}
            loading={messagesQuery.isFetching}
            locale={{ emptyText: search ? "No messages match your search" : "No messages yet" }}
            expandable={{
              columnTitle: <span className="visually-hidden">Full message</span>,
              expandedRowRender: (message) => (
                <Flex vertical gap="small">
                  {/* A plain list: a full-width Descriptions here would stretch the table. */}
                  {compact && (
                    <dl className="detail-list">
                      <dt>Phone</dt>
                      <dd>{formatPhone(message.phone)}</dd>
                      <dt>Received</dt>
                      <dd>{formatDateTime(message.createdAt)}</dd>
                    </dl>
                  )}
                  <Typography.Paragraph className="text-prewrap">
                    {message.message}
                  </Typography.Paragraph>
                </Flex>
              ),
            }}
            pagination={{
              current: page,
              pageSize,
              total: messagesQuery.data?.meta.total,
              showSizeChanger: true,
              showTotal: (total) => `${formatNumber(total)} messages`,
              onChange: setPage,
            }}
            scroll={{ x: "max-content" }}
          />
        )}
      </Card>
    </>
  );
}
