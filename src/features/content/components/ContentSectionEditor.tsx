import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Card, Empty, Form, Input } from "antd";
import { useNavigate } from "react-router";
import { FormActions } from "@/components/FormActions";
import { PageHeader } from "@/components/PageHeader";
import { QueryErrorResult } from "@/components/QueryErrorResult";
import { RichTextEditor } from "@/components/RichTextEditor";
import { getErrorMessage } from "@/utils/errors";
import { contentKeys, fetchContentEntry, updateContentEntry } from "../api";
import { CONTENT_SECTIONS } from "../sections";
import type { ContentEntry, ContentFormValues, ContentSectionKey } from "../types";

export function ContentSectionEditor({ sectionKey }: { sectionKey: ContentSectionKey }) {
  const section = CONTENT_SECTIONS[sectionKey];
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const goBack = () => navigate(section.viewPath);

  const entryQuery = useQuery({
    queryKey: contentKeys.section(sectionKey),
    queryFn: () => fetchContentEntry(section),
  });
  const entry = entryQuery.data;

  const saveMutation = useMutation({
    mutationFn: ({ values, current }: { values: ContentFormValues; current: ContentEntry }) =>
      updateContentEntry(section, current.id, {
        heading: values.heading ?? current.heading ?? "",
        description: values.description,
      }),
    onSuccess: async () => {
      message.success("Changes saved");
      await queryClient.invalidateQueries({ queryKey: contentKeys.section(sectionKey) });
      goBack();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not save the changes.")),
  });

  return (
    <>
      <PageHeader title={`Edit ${section.title.toLowerCase()}`} onBack={goBack} />
      {entryQuery.error ? (
        <QueryErrorResult error={entryQuery.error} onRetry={() => entryQuery.refetch()} />
      ) : (
        <Card loading={entryQuery.isPending}>
          {entry ? (
            <Form<ContentFormValues>
              layout="vertical"
              requiredMark={false}
              style={{ maxWidth: 960 }}
              initialValues={{ heading: entry.heading ?? "", description: entry.description ?? "" }}
              onFinish={(values) => saveMutation.mutate({ values, current: entry })}
            >
              {section.headingEditable && (
                <Form.Item label="Heading" name="heading">
                  <Input />
                </Form.Item>
              )}
              <Form.Item
                label="Content"
                name="description"
                rules={[{ required: true, message: "Write the content" }]}
              >
                <RichTextEditor aria-label={section.title} />
              </Form.Item>
              <FormActions submitting={saveMutation.isPending} onCancel={goBack} />
            </Form>
          ) : (
            <Empty description="There is nothing to edit yet" />
          )}
        </Card>
      )}
    </>
  );
}
