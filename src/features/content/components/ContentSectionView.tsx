import { EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Empty, Typography } from "antd";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { SafeHtml } from "@/components/SafeHtml";
import { formatDateTime } from "@/utils/format";
import { contentKeys, fetchContentEntry } from "../api";
import { CONTENT_SECTIONS } from "../sections";
import type { ContentSectionKey } from "../types";

export function ContentSectionView({ sectionKey }: { sectionKey: ContentSectionKey }) {
  const section = CONTENT_SECTIONS[sectionKey];
  const navigate = useNavigate();
  const entryQuery = useQuery({
    queryKey: contentKeys.section(sectionKey),
    queryFn: () => fetchContentEntry(section),
  });
  const entry = entryQuery.data;

  return (
    <>
      <PageHeader
        title={section.title}
        subtitle={
          entry?.updated_at ? `Last updated ${formatDateTime(entry.updated_at)}` : section.subtitle
        }
        extra={
          entry && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(section.editPath)}
            >
              Edit
            </Button>
          )
        }
      />
      {entryQuery.error ? (
        <QueryErrorResult error={entryQuery.error} onRetry={() => entryQuery.refetch()} />
      ) : (
        <Card loading={entryQuery.isPending}>
          {entry ? (
            <>
              {entry.heading && <Typography.Title level={4}>{entry.heading}</Typography.Title>}
              <SafeHtml html={entry.description} />
            </>
          ) : (
            <Empty description="Nothing has been published here yet" />
          )}
        </Card>
      )}
    </>
  );
}
