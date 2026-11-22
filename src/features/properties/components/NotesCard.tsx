import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Button, Card, Empty, Flex, Form, Input, Popconfirm, Tag, Typography } from "antd";
import { useState } from "react";
import type { Id } from "@/api/types";
import { getErrorMessage } from "@/utils/errors";
import { formatDateTime } from "@/utils/format";
import { addNote, deleteNote, propertyKeys, updateNote } from "../api";
import type { PropertyNote } from "../types";

const NOTE_MAX_LENGTH = 5000;

interface NotesCardProps {
  propertyId: Id;
  notes: PropertyNote[];
  canManage: boolean;
}

/** Notes on a property, oldest first; staff write them here and customers on the site. */
export function NotesCard({ propertyId, notes, canManage }: NotesCardProps) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const [form] = Form.useForm<{ body: string }>();
  // The note lists the API returns carry no authors, so reload the property after each change.
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: propertyKeys.detail(propertyId) });

  const addMutation = useMutation({
    mutationFn: (body: string) => addNote(propertyId, body.trim()),
    onSuccess: async () => {
      form.resetFields();
      await refresh();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not add the note.")),
  });

  return (
    <Card title={`Notes (${notes.length})`}>
      <Flex vertical gap="middle">
        {notes.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notes yet" />
        ) : (
          <ul className="note-list">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                propertyId={propertyId}
                note={note}
                canManage={canManage}
                onChanged={refresh}
              />
            ))}
          </ul>
        )}
        {canManage && (
          <Form<{ body: string }>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={(values) => addMutation.mutate(values.body)}
          >
            <Form.Item
              label="Add a note"
              name="body"
              rules={[{ required: true, whitespace: true, message: "Write the note first" }]}
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 8 }}
                maxLength={NOTE_MAX_LENGTH}
                showCount
              />
            </Form.Item>
            <Button htmlType="submit" loading={addMutation.isPending}>
              Add note
            </Button>
          </Form>
        )}
      </Flex>
    </Card>
  );
}

interface NoteItemProps {
  propertyId: Id;
  note: PropertyNote;
  canManage: boolean;
  onChanged: () => Promise<unknown>;
}

function NoteItem({ propertyId, note, canManage, onChanged }: NoteItemProps) {
  const { message } = App.useApp();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.body);

  const updateMutation = useMutation({
    mutationFn: () => updateNote(propertyId, note.id, text.trim()),
    onSuccess: async () => {
      setEditing(false);
      await onChanged();
    },
    onError: (error) => message.error(getErrorMessage(error, "Could not save the note.")),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(propertyId, note.id),
    onSuccess: onChanged,
    onError: (error) => message.error(getErrorMessage(error, "Could not delete the note.")),
  });

  const author = note.author;
  return (
    <li>
      {editing ? (
        <Flex vertical gap="small">
          <Input.TextArea
            aria-label="Note"
            value={text}
            onChange={(event) => setText(event.target.value)}
            autoSize={{ minRows: 2, maxRows: 8 }}
            maxLength={NOTE_MAX_LENGTH}
            autoFocus
          />
          <Flex gap="small">
            <Button
              type="primary"
              size="small"
              loading={updateMutation.isPending}
              disabled={!text.trim()}
              onClick={() => updateMutation.mutate()}
            >
              Save
            </Button>
            <Button
              size="small"
              onClick={() => {
                setText(note.body);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Typography.Paragraph className="text-prewrap">{note.body}</Typography.Paragraph>
      )}
      <Flex align="center" gap="small" wrap className="note-meta">
        <Typography.Text type="secondary">
          {author ? author.name : "Deleted account"}
        </Typography.Text>
        {author && <Tag>{author.staff ? "Staff" : "Customer"}</Tag>}
        <Typography.Text type="secondary">
          {formatDateTime(note.createdAt)}
          {note.updatedAt !== note.createdAt && " (edited)"}
        </Typography.Text>
        {canManage && !editing && (
          <>
            <Button type="link" size="small" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Popconfirm
              title="Delete this note?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => deleteMutation.mutate()}
            >
              <Button type="link" size="small" danger loading={deleteMutation.isPending}>
                Delete
              </Button>
            </Popconfirm>
          </>
        )}
      </Flex>
    </li>
  );
}
