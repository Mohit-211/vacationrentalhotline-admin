import { KeyOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Button, Card, Descriptions, Flex, Form, Input, Modal, Space, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PageHeader } from "@/components/PageHeader";
import { paths } from "@/routes/paths";
import { getErrorMessage } from "@/utils/errors";
import { showFieldErrors } from "@/utils/forms";
import { changeEmail, meQueryKey, renameMe } from "../api";
import { useAuth } from "../AuthContext";
import { PERMISSION_LABELS } from "../permissions";
import type { Me } from "../types";

export function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { me } = useAuth();
  const [nameForm] = Form.useForm<{ name: string }>();
  const [emailForm] = Form.useForm<{ newEmail: string }>();
  const [emailOpen, setEmailOpen] = useState(false);

  const renameMutation = useMutation({
    mutationFn: (values: { name: string }) => renameMe(values.name.trim()),
    onSuccess: (updated) => {
      queryClient.setQueryData<Me | null>(meQueryKey, (current) =>
        current ? { ...current, name: updated.name } : current,
      );
      message.success("Name saved");
    },
    onError: (error) => {
      if (!showFieldErrors(nameForm, error)) {
        message.error(getErrorMessage(error, "Could not save your name."));
      }
    },
  });

  const emailMutation = useMutation({
    mutationFn: (values: { newEmail: string }) => changeEmail(values.newEmail.trim()),
    onSuccess: (_, values) => {
      // Closing the dialog clears its form.
      setEmailOpen(false);
      // The API answers the same when the address is taken, so this can't promise a link was sent.
      message.success(
        `If no other account uses ${values.newEmail}, we've sent it a confirmation link. Your email changes once it is opened.`,
        8,
      );
    },
    onError: (error) => {
      if (!showFieldErrors(emailForm, error)) {
        message.error(getErrorMessage(error, "Could not change your email."));
      }
    },
  });

  if (!me) return null;

  return (
    <>
      <PageHeader
        title="My profile"
        subtitle="Your staff account"
        extra={
          <Button icon={<KeyOutlined />} onClick={() => navigate(paths.changePassword)}>
            Change password
          </Button>
        }
      />
      <Flex vertical gap="large">
        <Card title="Account" className="form-card">
          <Form<{ name: string }>
            form={nameForm}
            layout="vertical"
            requiredMark={false}
            initialValues={{ name: me.name }}
            onFinish={(values) => renameMutation.mutate(values)}
          >
            <Form.Item label="Name" htmlFor="profile-name">
              <Space.Compact block>
                <Form.Item
                  name="name"
                  noStyle
                  rules={[{ required: true, whitespace: true, message: "Enter your name" }]}
                >
                  <Input id="profile-name" autoComplete="name" />
                </Form.Item>
                <Button htmlType="submit" loading={renameMutation.isPending}>
                  Save
                </Button>
              </Space.Compact>
            </Form.Item>
          </Form>
          <Descriptions
            column={1}
            items={[
              {
                key: "email",
                label: "Email",
                children: (
                  <Flex align="center" gap="small" wrap>
                    {me.email}
                    <Button size="small" onClick={() => setEmailOpen(true)}>
                      Change
                    </Button>
                  </Flex>
                ),
              },
              { key: "role", label: "Role", children: me.roleLabel },
            ]}
          />
        </Card>
        <Card title="What your role allows" className="form-card">
          <ul className="note-list">
            {me.permissions.map((permission) => (
              <li key={permission}>{PERMISSION_LABELS[permission] ?? permission}</li>
            ))}
          </ul>
        </Card>
      </Flex>
      <Modal
        open={emailOpen}
        title="Change your email"
        okText="Send confirmation link"
        confirmLoading={emailMutation.isPending}
        onOk={() => emailForm.submit()}
        onCancel={() => setEmailOpen(false)}
        destroyOnHidden
      >
        <Typography.Paragraph type="secondary">
          We'll email a link to the new address. Your email changes once you open it.
        </Typography.Paragraph>
        <Form<{ newEmail: string }>
          form={emailForm}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => emailMutation.mutate(values)}
        >
          <Form.Item
            label="New email address"
            name="newEmail"
            rules={[
              { required: true, message: "Enter the new email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input type="email" autoComplete="email" autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
